import { BleService } from './BleService';

export type SessionState = 'IDLE' | 'SCANNING' | 'STIMULATING' | 'VALIDATING' | 'REPORT';

export class SleepDecouplerProtocol {
    public state: SessionState = 'IDLE';
    public timeInState = 0;
    
    public base1Hz = 0;
    public baseTheta = 0;
    public baseRigidity = 0;
    
    public peak1Hz = 0;
    public postTheta = 0;
    public postRigidity = 0;
    
    // Control flags for UI
    public isStimulationActive = false;
    public robustMode = true; // Noise tolerance / artifact rejection
    
    private smooth1Hz = 0;
    private smoothTheta = 0;
    private smoothRigidity = 1.0;
    
    public holdProgress = 0; // 0 to 1 for the required hold
    
    // Config thresholds - EXPOSED FOR UI GRAPHING
    public readonly THETA_THRESHOLD = 0.4; // Lowered: Baseline high theta noise threshold
    public readonly RIGIDITY_COLLAPSE = 0.5; // Raised: Collapsed rigidity threshold
    public readonly CIPL_1HZ_TARGET = 0.85; // Target entrainment
    public readonly RIGIDITY_RESTORED = 0.8; // Target restoration
    
    // Timings - SPED UP FOR FASTER REAL-TIME FEEDBACK
    public readonly SCAN_TIME = 10; // 10s baseline (was 30s)
    public readonly HOLD_TIME = 60; // 1 min required hold to prove entrainment (was 3m)
    public readonly VALIDATE_TIME = 15; // 15s post-stimulus dark check (was 60s)
    public readonly MAX_SESSION_TIME = 300; // 5 mins max stimulation (was 15m)

    public update(dt: number) {
        const ble = BleService.getInstance();
        if (!ble.isConnected) {
            this.state = 'IDLE';
            this.isStimulationActive = false;
            return;
        }
        
        // Smoothing incoming metrics with noise tolerance option
        const alpha = this.robustMode ? 0.01 : 0.05;
        this.smooth1Hz = this.smooth1Hz * (1 - alpha) + ble.ciPlv1Hz * alpha;
        this.smoothTheta = this.smoothTheta * (1 - alpha) + ble.thetaNoise * alpha;
        this.smoothRigidity = this.smoothRigidity * (1 - alpha) + ble.rigidity * alpha;
        
        if (this.state === 'IDLE') {
            this.state = 'SCANNING';
            this.timeInState = 0;
            this.isStimulationActive = false; // explicitly mute during scan
        }
        
        this.timeInState += dt;
        
        switch(this.state) {
            case 'SCANNING':
                if (this.timeInState >= this.SCAN_TIME) {
                    this.base1Hz = this.smooth1Hz;
                    this.baseTheta = this.smoothTheta;
                    this.baseRigidity = this.smoothRigidity;
                    
                    // Trigger condition: high theta noise AND collapsed rigidity
                    // Fallback to 15s (if brain is healthy, test anyway for demo purposes)
                    if ((this.smoothTheta > this.THETA_THRESHOLD && this.smoothRigidity < this.RIGIDITY_COLLAPSE) || this.timeInState > 15) {
                        this.state = 'STIMULATING';
                        this.timeInState = 0;
                        this.isStimulationActive = true;
                    }
                }
                break;
                
            case 'STIMULATING':
                // Track peak 1Hz
                if (this.smooth1Hz > this.peak1Hz) this.peak1Hz = this.smooth1Hz;
                
                // If we reach target, start accumulating hold progress
                if (this.smooth1Hz >= this.CIPL_1HZ_TARGET && this.smoothRigidity >= this.RIGIDITY_RESTORED) {
                    this.holdProgress += dt / this.HOLD_TIME;
                } else {
                    // Gradual penalty for dropping out of zone
                    this.holdProgress = Math.max(0, this.holdProgress - (dt / this.HOLD_TIME) * 0.2);
                }
                
                // Complete if hold is fulfilled, or hit the max duration
                if (this.holdProgress >= 1.0 || this.timeInState > this.MAX_SESSION_TIME) {
                    this.state = 'VALIDATING';
                    this.timeInState = 0;
                    this.isStimulationActive = false; // MUTE for post-check
                    this.holdProgress = 0;
                }
                break;
                
            case 'VALIDATING':
                if (this.timeInState >= this.VALIDATE_TIME) {
                    this.postTheta = this.smoothTheta;
                    this.postRigidity = this.smoothRigidity;
                    
                    this.state = 'REPORT';
                    this.timeInState = 0;
                }
                break;
                
            case 'REPORT':
                // End state
                break;
        }
    }
    
    public getReport() {
        // Phase Synchronization Gain
        const syncGain = this.base1Hz > 0.0001 ? ((this.peak1Hz - this.base1Hz) / this.base1Hz) * 100 : 0;
        // Synaptic Noise Reduction
        const noiseReduction = this.baseTheta > 0.0001 ? ((this.baseTheta - this.postTheta) / this.baseTheta) * 100 : 0;
        // Working Memory Capacity Index
        const wmIndex = this.baseRigidity > 0.0001 ? (this.postRigidity / this.baseRigidity) : 1.0;
        
        return {
            syncGain: Math.max(0, syncGain).toFixed(1),
            noiseReduction: Math.max(0, noiseReduction).toFixed(1),
            wmIndex: Math.max(0.1, wmIndex).toFixed(2)
        };
    }
}
