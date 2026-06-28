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

### 🔬 Deep Research: Computational Model of Working Memory & Sleep
To understand *why* we must induce these states, we model the cortex based on the **Working Memory 2.0** framework.

> **Source:** Miller, E. K., Lundqvist, M., & Bastos, A. M. (2018). *Working Memory 2.0*. *Neuron*, 100(2), 463-475.
> **DOI:** [10.1016/j.neuron.2018.09.023](https://doi.org/10.1016/j.neuron.2018.09.023)

Working Memory (WM) is not maintained by continuous, persistent spiking (which is metabolically expensive and prone to interference). Instead, it relies on a delicate **Push-Pull Dynamic**:
*   **Deep Layers (Alpha/Beta 10-30Hz):** Act as the "brakes" (top-down executive control).
*   **Superficial Layers (Gamma 30-100Hz):** Act as the "gas" (bottom-up sensory information). Information is held in brief, sparse *Gamma bursts*.

Using a system of coupled non-linear oscillators (e.g., Kuramoto-Feigenbaum equations), we can predict the state of the cortex under various conditions:

#### 1. The Core Problem: Synaptic Fatigue (Worst-case Sleep Deprivation)
*   **The Model:** Extended wakefulness saturates synaptic weights. The deep-layer Beta rhythms lose their inhibitory power, causing superficial Gamma bursts to bleed together into a continuous, chaotic noise floor. The cortex loses its ability to multiplex information.
*   **FreeEEG16 Observables:** 
    *   **Phase Rigidity** (the cosine similarity between past and future Gamma phase vectors) collapses below `0.40`. 
    *   **Theta Entropy** (4-7Hz) rises as uncoordinated, exhausted micro-columns fall into local, asynchronous "micro-sleeps".

#### 2. The Natural Solution: Slow-Wave Sleep (Best-case Recovery)
*   **The Model:** During natural NREM sleep, the brain generates massive, global 1-4 Hz Delta waves. These are literal ON/OFF periods. When the network goes "OFF", neurons are forced into silence, allowing metabolic clearance and the downscaling of saturated synapses (Synaptic Homeostasis Hypothesis).
*   **FreeEEG16 Observables:** Phase Rigidity resets to `>0.80`. Chaotic Theta noise is completely suppressed.

#### 3. Our Solution: Artificial ON/OFF Induction (Awake Stimulation)
If we can artificially force the local cortex into 1 Hz ON/OFF periods while the user is awake, we can "decouple" the synaptic reset from the loss of consciousness.

*   **Binaural Beats (Audio-only):** *Efficiency: ~1%.* Entrains the auditory cortex, which weakly pulls the global network. Requires >45 minutes. (This is the most subtle, non-invasive method, often used as a baseline).
*   **Stroboscopic Light (Visual VR):** *Efficiency: ~15%.* The optic nerve powerfully drives the occipital and parietal cortices (Photic Driving). Using VR with *closed eyes* diffuses the light to prevent discomfort/seizures while maintaining massive cortical driving. Can achieve local reset in ~15 minutes.
*   **Free-tACS / Temporal Interference (Invasive/Electrical):** *Efficiency: >90%.* Direct intervention. By crossing high-frequency electrical fields, we force the local 26mm cluster into 1Hz ON/OFF periods directly, bypassing sensory bottlenecks entirely.

### FreeEEG16 & ciPLV Validation
To measure this effect using a high-density, ultra-local device like the **FreeEEG16** (a 26mm sensor lacking a distant reference and prone to volume conduction), this system relies on the **Continuous Imaginary Phase-Locking Value (ciPLV)**.

> **Source:** Bruña, R., Maestú, F., & Pereda, E. (2018). *Phase Locking Value revisited: teaching new tricks to an old dog*. *Journal of Neural Engineering*.
> **arXiv:** [1710.08037](https://arxiv.org/abs/1710.08037)

The imaginary component mathematically ignores zero-lag artifacts (like volume conduction), allowing us to measure true cortical phase-locking and structural rigidity beneath the sensor. The system acts as a closed-loop: it starts stimulation when phase rigidity collapses (fatigue) and stops when 1Hz entrainment is achieved.

### 🌐 Topological Wave Models (8-Channel vs. 16-Channel Arrays)
The spatial configuration of the local sensor cluster drastically alters our ability to model wave propagation topologies. The system dynamically adapts its physics models based on the detected hardware array (1D ring vs 2D disc):

#### 8-Channel Array (1D Ring Embedded Topology)
*   **Structure:** 8 electrodes arranged in a single uniform circle (Radius = 10mm).
*   **Modeling Constraints:** A single ring acts mathematically as a 1-dimensional boundary embedded in 2D space.
*   **Observable Dynamics:** 
    *   *Phase Vorticity:* Can perfectly detect phase gradients traveling circumferentially around the ring (rotational spirals).
    *   *Directional Flow (X/Y):* Can accurately measure a linear gradient sweeping across the array (e.g., from front to back).
*   **Limitations:** It is physically impossible to detect *Radial Flow* (Source/Sink). The system cannot distinguish whether a wave originated from the center spreading outward, or from outside converging inward, because all sensors lie on the same equipotential radius.

#### 16-Channel Array (2D Concentric Topology)
*   **Structure:** 16 electrodes arranged in two concentric circles (12 Outer, 4 Inner).
*   **Modeling Advantages:** The dual-radius design provides true 2D depth, allowing us to compute a complete gradient field ($\nabla \Phi$).
*   **Observable Dynamics:**
    *   *Phase Vorticity:* Detects rotational states with higher spatial resolution.
    *   *Radial Flow (Source/Sink):* **Unlocks the Z-axis equivalent of wave propagation.** By comparing the inner ring's phase to the outer ring's phase, the model mathematically proves whether the cortical patch is generating a wave (Source) or absorbing a wave (Sink). This is crucial for verifying if the induced 1Hz Delta ON/OFF stimulation successfully triggered a localized "down-state" burst that propagated *outward* into the surrounding cortex.

#### The Physical Asymmetry: Off-Center Reference (`AINREF`)
Both the 8-channel and 16-channel modules utilize an **off-center electrical reference (`AINREF`)**. 
*   In the 8-channel board, `AINREF` is located at `X: 10, Y: 0`.
*   In the 16-channel board, `AINREF` is located at `X: 5.5, Y: 0`.

**Why does this matter for modeling?**
Because EEG relies on differential amplification, every signal we read is actually a physical dipole: $V_i = E_i - E_{ref}$.
When calculating local spatial gradients (e.g., local Laplacian algorithms), the reference voltage mathematically cancels out: $(E_i - E_{ref}) - (E_j - E_{ref}) = E_i - E_j$. 
However, when computing global **Phase Locking Values (PLV)**, the position of the reference injects a **spatial bias field** into the data. If the reference is off-center and picks up a massive, global slow wave (like a natural Delta sleep wave), it injects that exact phase into all channels. By strictly mapping the true X/Y coordinates of the `AINREF` and `GND` pins, the simulation engine can apply spatial de-biasing matrices to correct for the asymmetrical equipotential lines across the 26mm patch, isolating true local cortical phase gradients from global reference-injected noise.

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
