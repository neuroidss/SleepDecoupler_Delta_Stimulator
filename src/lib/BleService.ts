export const BUF_SIZE = 256;
const UV_SCALE = (1.2 / 4.0 / 8388607.0) * 1e6;

function fft(re: Float32Array, im: Float32Array) { 
    const n = re.length;
    for (let i = 0, j = 0; i < n; i++) {
        if (j > i) {
            let tr = re[i], ti = im[i];
            re[i] = re[j]; im[i] = im[j];
            re[j] = tr; im[j] = ti;
        }
        let m = n >> 1; 
        while (m >= 1 && j >= m) { j -= m; m >>= 1; }
        j += m;
    }
    for (let s = 2; s <= n; s <<= 1) {
        let m = s >> 1, t = -2 * Math.PI / s, wr = Math.cos(t), wi = Math.sin(t);
        for (let i = 0; i < n; i += s) {
            let ar = 1, ai = 0;
            for (let j = 0; j < m; j++) {
                let u = i + j, v = u + m;
                let tr = ar * re[v] - ai * im[v], ti = ar * im[v] + ai * re[v];
                re[v] = re[u] - tr; im[v] = im[u] - ti; 
                re[u] += tr; im[u] += ti;
                let nar = ar * wr - ai * wi;
                ai = ar * wi + ai * wr;
                ar = nar;
            }
        }
    }
}

function applyNotchFilters(re: Float32Array, im: Float32Array) {
    for(let k of [51, 102]) { 
        for(let i=-1; i<=1; i++) { 
            if(re[k+i]!==undefined) {
                re[k+i]=0;
                im[k+i]=0; 
            }
        } 
    }
}

export class BleService {
    private static instance: BleService | null = null;
    public isConnected = false;
    public numChannels = 16;
    
    private eegBuffer: Float32Array[] = [];
    private reArr: Float32Array[] = [];
    private imArr: Float32Array[] = [];
    private centered: Float32Array[] = [];
    private normRe: Float32Array[] = [];
    private normIm: Float32Array[] = [];
    
    public ciPlv1Hz = 0;
    public rigidity = 1.0;
    public thetaNoise = 0;
    
    public delta_vx = 0;
    public delta_vy = 0;
    public delta_tq = 0;
    public delta_radial = 0;

    public get electrodes() {
        if (this.numChannels === 8) {
            return [
                { x: 3.09, y: 9.51 },
                { x: 8.1, y: 5.89 },
                { x: 8.09, y: -5.88 },
                { x: 3.1, y: -9.51 },
                { x: -3.09, y: -9.5 },
                { x: -8.08, y: -5.87 },
                { x: -8.09, y: 5.89 },
                { x: -3.1, y: 9.51 }
            ];
        } else {
            return [
                { x: 10.14, y: -2.72 },
                { x: 7.43, y: -7.43 },
                { x: 2.75, y: -4.77 },
                { x: 2.72, y: -10.15 },
                { x: -2.72, y: -10.14 },
                { x: -2.75, y: -4.77 },
                { x: -7.42, y: -7.42 },
                { x: -10.14, y: -2.73 },
                { x: -10.14, y: 2.72 },
                { x: -7.43, y: 7.43 },
                { x: -2.75, y: 4.76 },
                { x: -2.72, y: 10.14 },
                { x: 2.72, y: 10.15 },
                { x: 2.75, y: 4.77 },
                { x: 7.43, y: 7.42 },
                { x: 10.14, y: 2.71 }
            ];
        }
    }
    
    public get referenceElectrode() {
        if (this.numChannels === 8) {
            return { x: 10, y: 0 };
        } else {
            return { x: 5.5, y: 0 };
        }
    }
    
    public get groundElectrode() {
        if (this.numChannels === 8) {
            return { x: -10, y: 0 };
        } else {
            return { x: -5.49, y: 0 };
        }
    }

    private lastEegProcess = 0;
    
    private constructor() {
        for(let i=0; i<this.numChannels; i++) {
            this.eegBuffer.push(new Float32Array(BUF_SIZE));
            this.reArr.push(new Float32Array(BUF_SIZE));
            this.imArr.push(new Float32Array(BUF_SIZE));
            this.centered.push(new Float32Array(BUF_SIZE));
            this.normRe.push(new Float32Array(BUF_SIZE));
            this.normIm.push(new Float32Array(BUF_SIZE));
        }
    }
    
    public static getInstance() {
        if (!BleService.instance) BleService.instance = new BleService();
        return BleService.instance;
    }
    
    private get_band_ciPLV(idxA: number, idxB: number, k_start: number, k_end: number) {
        let sumIm = 0;
        let count = Math.max(1, k_end - k_start + 1);
        for (let k = k_start; k <= k_end; k++) {
            let pA_re = this.normRe[idxA][k] || 0, pA_im = this.normIm[idxA][k] || 0;
            let pB_re = this.normRe[idxB][k] || 0, pB_im = this.normIm[idxB][k] || 0;
            sumIm += pA_im * pB_re - pA_re * pB_im;
        }
        return sumIm / count;
    }

    public process() {
        const time = performance.now();
        if (time - this.lastEegProcess > 33) {
            this.lastEegProcess = time;
            
            for(let t=0; t<BUF_SIZE; t++) {
                let avg = 0; 
                for(let c=0; c<this.numChannels; c++) avg += this.eegBuffer[c][t]; 
                avg /= this.numChannels;
                for(let c=0; c<this.numChannels; c++) this.centered[c][t] = this.eegBuffer[c][t] - avg;
            }
            
            for(let c=0; c<this.numChannels; c++) {
                for(let t=0; t<BUF_SIZE; t++) { 
                    this.reArr[c][t] = this.centered[c][t]; 
                    this.imArr[c][t] = 0; 
                }
                fft(this.reArr[c], this.imArr[c]); 
                applyNotchFilters(this.reArr[c], this.imArr[c]);
                
                for (let k = 0; k < BUF_SIZE / 2; k++) {
                    let mag = Math.sqrt(this.reArr[c][k] ** 2 + this.imArr[c][k] ** 2) || 1e-6;
                    this.normRe[c][k] = this.reArr[c][k] / mag;
                    this.normIm[c][k] = this.imArr[c][k] / mag;
                }
            }
            
            let pairIdx = 0;
            let normPastSq = 0;
            let normFutureSq = 0;
            let dotProduct = 0;
            let sum1Hz = 0;
            let sumTheta = 0;
            
            let d_vx = 0, d_vy = 0, d_tq = 0, d_rad = 0;
            
            for(let i=0; i<this.numChannels; i++) {
                for(let j=i+1; j<this.numChannels; j++) {
                    let val1Hz = this.get_band_ciPLV(i, j, 1, 1);
                    let valTheta = this.get_band_ciPLV(i, j, 4, 7);
                    let valPast = this.get_band_ciPLV(i, j, 31, 51);
                    let valFuture = this.get_band_ciPLV(i, j, 61, 102);
                    
                    sum1Hz += Math.abs(val1Hz);
                    sumTheta += Math.abs(valTheta);
                    
                    normPastSq += valPast * valPast;
                    normFutureSq += valFuture * valFuture;
                    dotProduct += valPast * valFuture;
                    
                    if (this.electrodes[i] && this.electrodes[j]) {
                        // Base topological gradient vectors
                        let dx = this.electrodes[j].x - this.electrodes[i].x;
                        let dy = this.electrodes[j].y - this.electrodes[i].y;
                        
                        // Reference De-Biasing Matrix (spatial correction)
                        // EEG signals are physical dipoles relative to the AINREF pin.
                        // Off-center references inject spatial bias fields into PLV calculations.
                        const ref = this.referenceElectrode;
                        let dist_i_ref = Math.sqrt(Math.pow(this.electrodes[i].x - ref.x, 2) + Math.pow(this.electrodes[i].y - ref.y, 2));
                        let dist_j_ref = Math.sqrt(Math.pow(this.electrodes[j].x - ref.x, 2) + Math.pow(this.electrodes[j].y - ref.y, 2));
                        
                        // Compensation factor: weights gradients higher if they are further from the reference,
                        // countering the volume conduction "pull" of the reference itself.
                        let refDebiasWeight = 1.0 + (dist_i_ref + dist_j_ref) / (this.numChannels === 8 ? 20.0 : 40.0);
                        
                        d_vx += val1Hz * dx * refDebiasWeight;
                        d_vy += val1Hz * dy * refDebiasWeight;
                        d_tq += (val1Hz * (this.electrodes[i].x * dy - this.electrodes[i].y * dx)) / 100 * refDebiasWeight;
                        
                        let r_i = Math.sqrt(this.electrodes[i].x**2 + this.electrodes[i].y**2);
                        let r_j = Math.sqrt(this.electrodes[j].x**2 + this.electrodes[j].y**2);
                        d_rad += val1Hz * (r_j - r_i) * refDebiasWeight;
                    }
                    
                    pairIdx++;
                }
            }
            
            this.ciPlv1Hz = sum1Hz / Math.max(1, pairIdx);
            this.thetaNoise = sumTheta / Math.max(1, pairIdx);
            
            this.delta_vx = d_vx / Math.max(1, pairIdx);
            this.delta_vy = d_vy / Math.max(1, pairIdx);
            this.delta_tq = d_tq / Math.max(1, pairIdx);
            this.delta_radial = d_rad / Math.max(1, pairIdx);
            
            if (normPastSq > 0.001 && normFutureSq > 0.001) {
                this.rigidity = Math.max(0, dotProduct / (Math.sqrt(normPastSq) * Math.sqrt(normFutureSq)));
            } else {
                this.rigidity = 0;
            }
        }
    }

    public async connect() {
        try {
            const device = await (navigator as any).bluetooth.requestDevice({ 
                filters: [{ services:["4fafc201-1fb5-459e-8fcc-c5c9c331914b"] }] 
            });
            const server = await device.gatt?.connect();
            if (!server) throw new Error("GATT Server not found");
            
            const service = await server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
            const dataChar = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8");
            
            await dataChar.startNotifications();
            dataChar.addEventListener('characteristicvaluechanged', (e: any) => {
                const b = new Uint8Array(e.target.value.buffer);
                if(b[0] === 0xA0) {
                    const activeChannels = Math.min(this.numChannels, Math.floor((b.length - 2) / 3));
                    for(let i=0; i<activeChannels; i++) {
                        if (4+i*3 >= b.length) break;
                        let v = (b[2+i*3]<<16) | (b[3+i*3]<<8) | b[4+i*3];
                        if(v & 0x800000) v -= 0x1000000;
                        this.eegBuffer[i].set(this.eegBuffer[i].subarray(1)); 
                        this.eegBuffer[i][BUF_SIZE-1] = v * UV_SCALE;
                    }
                    this.process();
                }
            });
            
            this.isConnected = true;
            return true;
        } catch(e) {
            console.error("BLE Connect failed:", e);
            throw e;
        }
    }
}
