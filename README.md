# SleepDecoupler: Delta Stimulator

*"Sleep is a curable biological limitation. Decouple your brain restoration from unconsciousness."*

SleepDecoupler is an open-source, browser-based demonstration of **Audio-Visual Entrainment (AVE)** [DOI: 10.3389/fpsyt.2015.00070] designed to mimic the restorative slow-wave electrical rhythms of deep sleep (1 Hz Delta waves) while you are awake. 

This application serves as a **free accessible preview** and conceptual introduction to the much more powerful hardware-based **Temporal Interference Transcranial Alternating Current Stimulation (TI-tACS)** technology [DOI: 10.1016/j.cell.2017.05.024].


**Live Demo:** 
- [https://neuroidss.github.io/SleepDecoupler_Delta_Stimulator/](https://neuroidss.github.io/SleepDecoupler_Delta_Stimulator/)

---

## 🧠 The Scientific Baseline & Working Memory

In 2026, researchers demonstrated that the restorative functions of sleep are not strictly tied to the loss of consciousness, but rather to specific electrical patterns in the brain—specifically, alternating ON/OFF periods of deep non-REM sleep.

> *"Fulfilling sleep homeostatic functions during wakefulness via cortical ON/OFF periods induction."*
> **Source:** Driessen, K., Squarcio, F., Tononi, G., & Cirelli, C. (2026). *Nature Neuroscience*. 
> **DOI:** [10.1038/s41593-026-02318-9](https://doi.org/10.1038/s41593-026-02318-9)

### Why target Working Memory?
Sleep deprivation severely degrades **Working Memory (WM)**. According to the **Working Memory 2.0** model [DOI: 10.1016/j.neuron.2018.09.023], WM is maintained not by persistent spiking, but by sparse, coordinated bursts of Gamma (30-100Hz) regulated by deeper Alpha/Beta (10-30Hz) rhythms. Without sleep, this delicate "push-pull" dynamic breaks down into chaotic noise, and phase-amplitude coupling with Theta rhythms collapses.

By artificially inducing these 1 Hz Delta ON/OFF periods, scientists were able to rapidly "reset" the synapses, completely reversing the cognitive damage of sleep deprivation without the subjects ever falling asleep. 

### FreeEEG16 & ciPLV Validation
To measure this effect using a high-density, ultra-local device like the **FreeEEG16** (a 26mm sensor lacking a distant reference and prone to volume conduction), this system relies on the **Continuous Imaginary Phase-Locking Value (ciPLV)** [arXiv:1710.08037]. The imaginary component mathematically ignores zero-lag artifacts (like volume conduction), allowing us to measure true cortical phase-locking and structural rigidity beneath the sensor. The system acts as a closed-loop: it starts stimulation when phase rigidity collapses (fatigue) and stops when 1Hz entrainment is achieved.

## 📱 The Web App & Cardboard VR Mode

This web application attempts to trigger a similar (though much weaker) effect using the sensory inputs available on a standard smartphone:
1. **Binaural Beats (Audio):** Plays a specific frequency in the left ear and a frequency +1 Hz in the right ear, creating an auditory illusion of a 1 Hz beat [DOI: 10.1016/j.clinph.2019.06.002].
2. **Stroboscopic Light (Visual):** Pulses the screen at exactly 1 Hz to trigger photic driving in the visual cortex [DOI: 10.1016/j.neuroimage.2015.11.055].
3. **Haptic Feedback (Tactile):** Vibrates the device at 1 Hz for somatosensory synchronization.
4. **VR Mode (Cardboard):** A split-screen mode for cheap plastic/cardboard VR headsets. Users close their eyes, allowing the 1Hz flashes to penetrate the eyelids and drive the visual cortex, drastically increasing entrainment efficiency compared to open-eye environments. (Haptics are disabled in this mode to prevent annoying plastic rattling).

**Why AVE?** AVE is a safe, non-invasive way to encourage the brain into a relaxed, Delta-dominant state. However, it relies on sensory processing pathways, making it easily filtered out by an awake, active prefrontal cortex [DOI: 10.3389/fnhum.2015.00069].

## ⚡ The Real Deal: TI-tACS Hardware

**If you want the true "Sleep Decoupling" effect while working, you need hardware.**

The web app is a toy compared to **Transcranial Temporal Interference Stimulation (TI-tACS)** [DOI: 10.1016/j.cell.2017.05.024]. 

While the app relies on sensory illusion, a TI-tACS device physically delivers electrical currents deep into the brain. It uses two high-frequency carrier waves (e.g., 2000 Hz and 2001 Hz) that easily pass through the skull without causing skin pain [DOI: 10.1038/s41598-019-48208-4]. Where these two currents intersect deep in the brain (like the hippocampus), they create an amplitude modulation envelope of 1 Hz [DOI: 10.1016/j.cell.2017.05.024].

### App (AVE) vs. Hardware (TI-tACS)

| Feature | Web App (AVE) | Hardware Device (TI-tACS) |
| :--- | :--- | :--- |
| **Mechanism** | Sensory Illusion (Ears/Eyes) [DOI: 10.3389/fpsyt.2015.00070] | Direct Electrical Field [DOI: 10.1016/j.cell.2017.05.024] |
| **Targeting** | Diffuse (Whole Brain) | Pinpoint Accuracy (Deep Structures) [DOI: 10.1016/j.neuroimage.2018.10.053] |
| **Efficiency** | Very Low | **100x - 1000x Higher** [DOI: 10.3389/fnhum.2021.642055] |
| **Awake Use** | Brain often filters it out | Forces neuronal synchronization [DOI: 10.1038/s41593-026-02318-9] |

To truly replicate the *Nature Neuroscience* findings in humans, you need a multi-channel TI-tACS setup capable of deep brain neuromodulation. The hardware physically shifts the membrane potentials of neurons, forcing them to fire and rest in the 1 Hz Delta pattern, allowing localized "sleep" while the rest of the brain remains conscious and functional [DOI: 10.1016/j.cell.2017.05.024].

**Thinking of building or buying a TI-tACS device?** Use this app to test your personal carrier frequency resonance and get a tiny glimpse of the Delta state. When you're ready for true cognitive restoration on the go, upgrade to the hardware.

## 🛠️ Usage (Web App)
1. Open the application on your smartphone.
2. Put on **stereo headphones** (required for binaural beats).
3. Hold the phone in your hand (for haptic feedback).
4. Set your preferred carrier frequency (find one that resonates comfortably in your head).
5. Press Play, close your eyes, and relax.

## ⚠️ Disclaimer
*This project is for educational and experimental purposes only. It is not a medical device. Always consult with a healthcare professional before using neurostimulation devices or participating in biohacking experiments.*
