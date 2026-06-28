import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play, Pause, Headphones, Volume2, Activity, Smartphone, Info } from 'lucide-react';
import { AudioEngine } from './lib/audio';

// Instantiating the AudioEngine outside the component prevents recreation on every render
const engine = new AudioEngine();

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(200);
  const [volume, setVolume] = useState(0.5);
  const [showInfo, setShowInfo] = useState(true);
  
  const hapticInterval = useRef<number | null>(null);

  // Clean up haptic intervals and audio on unmount
  useEffect(() => {
    return () => {
      engine.stop();
      if (hapticInterval.current) {
        window.clearInterval(hapticInterval.current);
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (!isPlaying) {
      await engine.init();
      engine.start(frequency, volume);
      
      // Start 1Hz haptic feedback
      if (navigator.vibrate) {
        // Initial vibration
        navigator.vibrate(100);
        hapticInterval.current = window.setInterval(() => {
          navigator.vibrate(100);
        }, 1000);
      }
      setIsPlaying(true);
    } else {
      engine.stop();
      if (hapticInterval.current) {
        window.clearInterval(hapticInterval.current);
        hapticInterval.current = null;
      }
      setIsPlaying(false);
    }
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreq = Number(e.target.value);
    setFrequency(newFreq);
    if (isPlaying) {
      engine.setFrequency(newFreq);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (isPlaying) {
      engine.setVolume(newVol);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 1Hz Visual Strobe Background - Active only during playback */}
      <div
        className={`pointer-events-none absolute inset-0 bg-white ${isPlaying ? 'animate-strobe' : 'opacity-0'}`}
      />

      {/* Ambient center glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] pointer-events-none">
        <div
          className={`absolute inset-0 bg-indigo-600 rounded-full blur-[80px] sm:blur-[120px] transition-all duration-500 ease-in-out ${
            isPlaying ? 'animate-orb-pulse' : 'scale-100 opacity-10'
          }`}
        />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md px-6 py-8 h-screen sm:h-auto sm:rounded-3xl sm:border border-white/10 sm:bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-10 w-full">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-medium tracking-tight text-white">SleepDecoupler</h1>
          </div>
          <p className="text-sm text-slate-400">Delta Stimulator (1 Hz)</p>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full"
              >
                <div className="mt-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col space-y-3 text-xs text-indigo-200 text-left">
                  <div className="flex items-start space-x-2">
                    <Headphones className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                    <p>Use headphones. Binaural beats only work with stereo separation.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Smartphone className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                    <p>Hold your phone to synchronize with haptic feedback (if supported by your device).</p>
                  </div>
                  <button 
                    onClick={() => setShowInfo(false)}
                    className="self-end mt-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Playback Control */}
        <div className="flex-1 flex items-center justify-center min-h-[160px] mb-8">
          <button
            onClick={togglePlayback}
            className={`group relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/10 transition-all duration-500 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-500/30 ${
              isPlaying 
                ? 'bg-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.5)]' 
                : 'bg-slate-800 hover:bg-slate-700 hover:scale-105 shadow-xl'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white fill-white transition-transform group-hover:scale-90" />
            ) : (
              <Play className="w-10 h-10 text-white fill-white ml-1.5 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Sliders Area */}
        <div className="w-full space-y-8 bg-slate-950/40 p-6 rounded-3xl border border-white/5">
          
          {/* Frequency Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="frequency" className="text-slate-400 font-medium flex items-center space-x-2">
                <span>Carrier Frequency (Hz)</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs bg-slate-800 text-slate-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                    Find a frequency that resonates comfortably in your head. The difference between the left and right channels will always be exactly 1 Hz.
                  </div>
                </div>
              </label>
              <span className="text-indigo-300 font-mono bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-500/20 text-xs">
                {frequency} Hz
              </span>
            </div>
            <input
              id="frequency"
              type="range"
              min="100"
              max="500"
              step="1"
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>100</span>
              <span>300</span>
              <span>500</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="volume" className="text-slate-400 font-medium flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <span>Volume</span>
              </label>
              <span className="text-slate-400 font-mono text-xs">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Philosophy & Science */}
        <div className="w-full mt-6 bg-slate-950/40 p-6 rounded-3xl border border-white/5 space-y-5 text-left">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Project Philosophy</h2>
            <p className="text-sm text-slate-300 leading-relaxed italic font-serif">
              "Sleep is a curable biological limitation. Decouple your brain restoration from unconsciousness."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>SleepDecoupler</strong> is inspired by the concept that the restorative benefits of sleep can be decoupled from the loss of consciousness.
            </p>
          </div>
          
          <div className="h-px w-full bg-white/5" />
          
          <div className="space-y-2">
            <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Scientific Base</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on the findings: <em>"Fulfilling sleep homeostatic functions during wakefulness via cortical ON/OFF periods induction."</em>
            </p>
            <a 
              href="https://doi.org/10.1038/s41593-026-02318-9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-indigo-500 hover:text-indigo-400 transition-colors font-mono inline-block pt-1"
            >
              DOI: 10.1038/s41593-026-02318-9
            </a>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 text-center px-4 mb-4 sm:mb-0">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Designed to demonstrate Audio-Visual Entrainment (AVE). 
            <br /> Close your eyes and relax. Not a medical device.
          </p>
        </div>

      </div>
    </div>
  );
}
