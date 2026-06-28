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
    
    private smooth1Hz = 0;
    private smoothTheta = 0;
    private smoothRigidity = 1.0;
    
    public holdProgress = 0; // 0 to 1 for the 3-minute hold
    
    // Config thresholds
    private readonly THETA_THRESHOLD = 0.5; // Baseline high theta noise
    private readonly RIGIDITY_COLLAPSE = 0.4; // Collapsed rigidity
    private readonly CIPL_1HZ_TARGET = 0.85; // Target entrainment
    private readonly RIGIDITY_RESTORED = 0.8; // Target restoration
    
    private readonly SCAN_TIME = 30; // 30s baseline
    private readonly HOLD_TIME = 180; // 3 mins required hold
    private readonly VALIDATE_TIME = 60; // 60s post-stimulus dark check
    private readonly MAX_SESSION_TIME = 900; // 15 mins max stimulation

    public update(dt: number) {
        const ble = BleService.getInstance();
        if (!ble.isConnected) {
            this.state = 'IDLE';
            this.isStimulationActive = false;
            return;
        }
        
        // Smoothing incoming metrics
        this.smooth1Hz = this.smooth1Hz * 0.95 + ble.ciPlv1Hz * 0.05;
        this.smoothTheta = this.smoothTheta * 0.95 + ble.thetaNoise * 0.05;
        this.smoothRigidity = this.smoothRigidity * 0.95 + ble.rigidity * 0.05;
        
        if (this.state === 'IDLE') {
            this.state = 'SCANNING';
            this.timeInState = 0;
        }
        
        this.timeInState += dt;
        
        switch(this.state) {
            case 'SCANNING':
                if (this.timeInState >= this.SCAN_TIME) {
                    this.base1Hz = this.smooth1Hz;
                    this.baseTheta = this.smoothTheta;
                    this.baseRigidity = this.smoothRigidity;
                    
                    // Trigger condition: high theta noise AND collapsed rigidity
                    // Added a fail-safe so users with clean brains can still test it after 60s
                    if ((this.smoothTheta > this.THETA_THRESHOLD && this.smoothRigidity < this.RIGIDITY_COLLAPSE) || this.timeInState > 60) {
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
                
                // Complete if hold is fulfilled, or hit the 15 min max duration
                if (this.holdProgress >= 1.0 || this.timeInState > this.MAX_SESSION_TIME) {
                    this.state = 'VALIDATING';
                    this.timeInState = 0;
                    this.isStimulationActive = false;
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
