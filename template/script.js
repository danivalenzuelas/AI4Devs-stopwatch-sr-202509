/**
 * Clase principal para controlar el cronómetro y temporizador
 */
class TimerController {
  constructor() {
    this.mode = "stopwatch";
    this.timeElapsed = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.laps = [];
    this.soundEnabled = true;
    this.countdownTarget = 0;
    this.audioContext = null;

    this.setupEventListeners();
    this.loadFromLocalStorage();
    this.updateDisplay();
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    // Botones principales
    document
      .getElementById("startBtn")
      .addEventListener("click", () => this.toggleStart());
    document
      .getElementById("lapBtn")
      .addEventListener("click", () => this.lap());
    document
      .getElementById("resetBtn")
      .addEventListener("click", () => this.reset());

    // Tabs de modo
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) =>
        this.switchMode(e.target.dataset.mode)
      );
    });

    // Controles secundarios
    document
      .getElementById("fullscreenBtn")
      .addEventListener("click", () => this.toggleFullscreen());
    document
      .getElementById("soundBtn")
      .addEventListener("click", () => this.toggleSound());

    // Atajos de teclado
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  /**
   * Maneja los atajos de teclado
   */
  handleKeyboard(event) {
    if (event.target.tagName === "INPUT") return;

    switch (event.key.toLowerCase()) {
      case " ":
      case "enter":
        event.preventDefault();
        this.toggleStart();
        break;
      case "r":
      case "escape":
        this.reset();
        break;
      case "l":
        if (this.isRunning) this.lap();
        break;
      case "f":
        this.toggleFullscreen();
        break;
      case "t":
        this.switchMode(this.mode === "stopwatch" ? "countdown" : "stopwatch");
        break;
    }
  }

  /**
   * Alterna entre iniciar y pausar
   */
  toggleStart() {
    if (!this.isRunning) {
      this.start();
    } else {
      this.pause();
    }
  }

  /**
   * Inicia el cronómetro/temporizador
   */
  start() {
    const startBtn = document.getElementById("startBtn");

    if (
      this.mode === "countdown" &&
      this.timeElapsed === 0 &&
      this.countdownTarget === 0
    ) {
      this.showNotification("⚠️ Configure el temporizador primero");
      return;
    }

    if (!this.isPaused) {
      if (this.mode === "countdown") {
        this.timeElapsed = this.countdownTarget;
      } else {
        this.timeElapsed = 0;
      }
      this.laps = [];
      this.updateLapsDisplay();
    }

    this.isRunning = true;
    this.isPaused = false;
    this.startTime =
      performance.now() - (this.mode === "countdown" ? 0 : this.pausedTime);
    this.pausedTime = 0;

    startBtn.textContent = "PAUSE";
    startBtn.className = "btn btn-pause";

    // Habilitar LAP solo en modo cronómetro
    document.getElementById("lapBtn").disabled = this.mode === "countdown";

    this.tick();
    this.saveToLocalStorage();
  }

  /**
   * Pausa el cronómetro/temporizador
   */
  pause() {
    this.isRunning = false;
    this.isPaused = true;
    this.pausedTime = this.timeElapsed;

    const startBtn = document.getElementById("startBtn");
    startBtn.textContent = "RESUME";
    startBtn.className = "btn btn-start";

    this.saveToLocalStorage();
  }

  /**
   * Reinicia el cronómetro/temporizador
   */
  reset() {
    const hasData = this.timeElapsed > 0 || this.laps.length > 0;

    if (hasData && this.isRunning) {
      const userConfirmed = confirm(
        "¿Está seguro de que desea reiniciar? Se perderán todos los datos."
      );
      if (!userConfirmed) {
        return;
      }
    }

    this.isRunning = false;
    this.isPaused = false;
    this.timeElapsed = 0;
    this.startTime = null;
    this.pausedTime = 0;
    this.laps = [];

    const startBtn = document.getElementById("startBtn");
    startBtn.textContent = "START";
    startBtn.className = "btn btn-start";
    document.getElementById("lapBtn").disabled = true;

    this.updateDisplay();
    this.updateLapsDisplay();
    this.saveToLocalStorage();
  }

  /**
   * Registra una vuelta
   */
  lap() {
    if (!this.isRunning || this.mode === "countdown") return;

    const lapTime = this.timeElapsed;
    const previousLapTime =
      this.laps.length > 0 ? this.laps[this.laps.length - 1].accumulated : 0;
    const lapDuration = lapTime - previousLapTime;

    this.laps.push({
      number: this.laps.length + 1,
      duration: lapDuration,
      accumulated: lapTime,
      timestamp: new Date().toLocaleTimeString(),
    });

    this.updateLapsDisplay();
    this.saveToLocalStorage();

    // Scroll automático a la última vuelta
    setTimeout(() => {
      const lapsBody = document.getElementById("lapsBody");
      const lastRow = lapsBody.querySelector("tr:last-child");
      if (lastRow) {
        lastRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  }

  /**
   * Cambia entre modo cronómetro y temporizador
   */
  switchMode(mode) {
    if (this.isRunning) {
      this.showNotification(
        "⚠️ Detenga el temporizador antes de cambiar de modo"
      );
      return;
    }

    this.reset();
    this.mode = mode;

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    const timerConfig = document.getElementById("timerConfig");
    timerConfig.classList.toggle("hidden", mode !== "countdown");

    this.saveToLocalStorage();
  }

  /**
   * Configura el temporizador
   */
  setTimer() {
    const hours = parseInt(document.getElementById("hoursInput").value) || 0;
    const minutes =
      parseInt(document.getElementById("minutesInput").value) || 0;
    const seconds =
      parseInt(document.getElementById("secondsInput").value) || 0;

    if (minutes > 59 || seconds > 59) {
      this.showNotification("⚠️ Minutos y segundos deben ser menores a 60");
      return;
    }

    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

    if (totalMs === 0) {
      this.showNotification("⚠️ El tiempo debe ser mayor a 0");
      return;
    }

    this.countdownTarget = totalMs;
    this.timeElapsed = totalMs;
    this.updateDisplay();
    this.showNotification(
      `✅ Temporizador configurado: ${this.formatTime(totalMs)}`
    );
    this.saveToLocalStorage();
  }

  /**
   * Ciclo principal de actualización
   */
  tick() {
    if (!this.isRunning) return;

    const now = performance.now();

    if (this.mode === "stopwatch") {
      this.timeElapsed = now - this.startTime;
    } else {
      const elapsed = now - this.startTime;
      this.timeElapsed = Math.max(0, this.countdownTarget - elapsed);

      if (this.timeElapsed === 0) {
        this.onCountdownComplete();
        return;
      }
    }

    this.updateDisplay();
    requestAnimationFrame(() => this.tick());
  }

  /**
   * Se ejecuta al completar la cuenta regresiva
   */
  onCountdownComplete() {
    this.isRunning = false;
    this.timeElapsed = 0;
    this.updateDisplay();

    const startBtn = document.getElementById("startBtn");
    startBtn.textContent = "START";
    startBtn.className = "btn btn-start";
    document.getElementById("lapBtn").disabled = true;

    // Efecto visual
    const displayWrapper = document.getElementById("displayWrapper");
    displayWrapper.classList.add("flash");
    setTimeout(() => displayWrapper.classList.remove("flash"), 1500);

    // Sonido usando Web Audio API
    if (this.soundEnabled) {
      this.playAlarmSound();
    }

    this.showNotification("⏰ ¡Tiempo completado!");
  }

  /**
   * Reproduce el sonido de alarma usando Web Audio API
   */
  playAlarmSound() {
    try {
      // Crear contexto de audio si no existe
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const context = this.audioContext;
      const duration = 0.3;
      const frequency1 = 800;
      const frequency2 = 1000;

      // Reproducir 3 beeps
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(context.destination);

          oscillator.frequency.value = i % 2 === 0 ? frequency1 : frequency2;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.3, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + duration
          );

          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + duration);
        }, i * 400);
      }
    } catch (e) {
      console.error("Error al reproducir sonido:", e);
    }
  }

  /**
   * Actualiza el display del tiempo
   */
  updateDisplay() {
    const time = this.formatTimeComponents(this.timeElapsed);

    document.getElementById("hours").textContent = time.hours;
    document.getElementById("minutes").textContent = time.minutes;
    document.getElementById("seconds").textContent = time.seconds;
    document.getElementById("milliseconds").textContent =
      "." + time.milliseconds;
  }

  /**
   * Formatea el tiempo en componentes
   */
  formatTimeComponents(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(ms % 1000);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      milliseconds: milliseconds.toString().padStart(3, "0"),
    };
  }

  /**
   * Formatea el tiempo como string
   */
  formatTime(ms) {
    const time = this.formatTimeComponents(ms);
    return `${time.hours}:${time.minutes}:${time.seconds}`;
  }

  /**
   * Actualiza la visualización de vueltas
   */
  updateLapsDisplay() {
    const lapsSection = document.getElementById("lapsSection");
    const lapsBody = document.getElementById("lapsBody");
    const lapCount = document.getElementById("lapCount");

    if (this.laps.length === 0) {
      lapsSection.classList.add("hidden");
      return;
    }

    lapsSection.classList.remove("hidden");
    lapCount.textContent = this.laps.length;

    // Encontrar mejor y peor vuelta
    let bestLapIndex = -1;
    let worstLapIndex = -1;
    let bestTime = Infinity;
    let worstTime = 0;

    this.laps.forEach((lap, index) => {
      if (lap.duration < bestTime) {
        bestTime = lap.duration;
        bestLapIndex = index;
      }
      if (lap.duration > worstTime) {
        worstTime = lap.duration;
        worstLapIndex = index;
      }
    });

    lapsBody.innerHTML = this.laps
      .map((lap, index) => {
        let rowClass = "";
        if (this.laps.length > 1) {
          if (index === bestLapIndex) rowClass = "lap-best";
          if (index === worstLapIndex) rowClass = "lap-worst";
        }

        return `
                        <tr class="${rowClass}">
                            <td>${lap.number}</td>
                            <td>${this.formatTime(lap.duration)}</td>
                            <td>${this.formatTime(lap.accumulated)}</td>
                            <td>${lap.timestamp}</td>
                        </tr>
                    `;
      })
      .join("");
  }

  /**
   * Alterna pantalla completa
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        this.showNotification("⚠️ No se pudo activar pantalla completa");
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Alterna el sonido
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const soundBtn = document.getElementById("soundBtn");
    soundBtn.textContent = this.soundEnabled ? "🔊" : "🔇";
    this.saveToLocalStorage();
    this.showNotification(
      this.soundEnabled ? "🔊 Sonido activado" : "🔇 Sonido desactivado"
    );
  }

  /**
   * Muestra una notificación temporal
   */
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Guarda el estado en localStorage
   */
  saveToLocalStorage() {
    try {
      const state = {
        mode: this.mode,
        timeElapsed: this.timeElapsed,
        laps: this.laps.slice(-50),
        soundEnabled: this.soundEnabled,
        countdownTarget: this.countdownTarget,
      };
      localStorage.setItem("timerState", JSON.stringify(state));
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  }

  /**
   * Carga el estado desde localStorage
   */
  loadFromLocalStorage() {
    try {
      const state = JSON.parse(localStorage.getItem("timerState"));
      if (state) {
        this.mode = state.mode || "stopwatch";
        this.laps = state.laps || [];
        this.soundEnabled = state.soundEnabled !== false;
        this.countdownTarget = state.countdownTarget || 0;

        if (this.mode === "countdown") {
          this.timeElapsed = this.countdownTarget;
        }

        document.querySelectorAll(".tab").forEach((tab) => {
          tab.classList.toggle("active", tab.dataset.mode === this.mode);
        });

        const timerConfig = document.getElementById("timerConfig");
        timerConfig.classList.toggle("hidden", this.mode !== "countdown");

        document.getElementById("soundBtn").textContent = this.soundEnabled
          ? "🔊"
          : "🔇";

        this.updateLapsDisplay();
      }
    } catch (e) {
      console.error("Error cargando desde localStorage:", e);
    }
  }
}

// Inicializar la aplicación
const timerController = new TimerController();
