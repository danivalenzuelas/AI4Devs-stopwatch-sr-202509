# 🎯 PROMPT PARA DESARROLLO DE CRONÓMETRO Y CUENTA REGRESIVA

CONTEXTO DEL PROYECTO
Necesitas desarrollar una aplicación web de cronómetro y cuenta regresiva en JavaScript vanilla puro (sin frameworks), tomando como referencia funcional la aplicación <https://www.online-stopwatch.com/>. La aplicación debe ser responsive, accesible y con un diseño limpio tipo dashboard.

## 📋 ESPECIFICACIONES FUNCIONALES CORE

### 1. DUAL MODE: Cronómetro (Stopwatch) + Cuenta Regresiva (Timer)

MODO CRONÓMETRO (Stopwatch):

Cuenta ascendente desde 00:00:00.000
Formato de display: HH:MM:SS (horas:minutos:segundos)
Sub-display con milisegundos: .mmm (debe ser visible pero de menor tamaño)
Precisión: actualización visual cada 10ms (100 FPS)
Sin límite de tiempo máximo

MODO CUENTA REGRESIVA (Timer):

El usuario debe poder configurar tiempo inicial (HH:MM:SS)
Cuenta descendente desde el tiempo configurado hasta 00:00:00
Al llegar a cero: emitir alerta sonora + notificación visual (flash o parpadeo)
Opción de auto-repetición (loop mode)

### 2. CONTROLES Y BOTONES

Botones principales (como en la imagen de referencia):

**a) Botón START (Verde - #00FF00 o similar):**

Inicia el cronómetro desde 00:00:00 o reanuda desde pausa
Estado: deshabilitado mientras está corriendo
Transición visual al activarse
Efecto hover con elevación (box-shadow)

**b) Botón PAUSE (Amarillo/Naranja - aparece al estar corriendo):**

Pausa el cronómetro/timer manteniendo el tiempo actual
Cambia a "RESUME" cuando está pausado
Misma posición que START (toggle de estado)

**c) Botón CLEAR/RESET (Rojo - #FF0000 o similar):**

Reinicia completamente a 00:00:00.000
Borra todas las vueltas registradas (laps)
Pide confirmación si hay tiempo registrado (modal o confirm())
Efecto hover con elevación

**d) Botón LAP/SPLIT (Azul - opcional pero recomendado):**

Registra tiempo parcial sin detener el cronómetro
Crea una tabla de vueltas con:

Número de vuelta
Tiempo de vuelta individual
Tiempo acumulado total
Timestamp de registro

### 3. DISPLAY Y UI

Display principal:
┌─────────────────────────────────┐
│ 00 : 08 : 00 │
│ .000 │
└─────────────────────────────────┘
Especificaciones del display:

Fondo claro (como en la imagen: #E6E9FF o similar)
Borde redondeado (border-radius: 30px mínimo)
Tipografía: Monospace grande (sugerencia: 'Orbitron', 'Roboto Mono', 'Courier New')
Tamaño de fuente principal: mínimo 80px (responsive)
Color de texto: Negro sólido (#000000)
Separadores (":") visibles y centrados
Milisegundos en tamaño reducido (30% del tamaño principal)
Padding interno generoso (40-60px)
Box-shadow sutil para profundidad

Botones:

Dimensiones: Mínimo 200px ancho x 80px alto
Border-radius: 20-25px
Font-size: 36-40px
Font-weight: bold
Transiciones CSS smooth (0.3s ease)
Estados hover con efecto de elevación:

css transform: translateY(-3px);
box-shadow: 0 6px 20px rgba(0,0,0,0.15);

### 4. FUNCIONALIDADES ADICIONALES (IMPORTANTE)

**a) Atajos de teclado:**

SPACE o ENTER: Start/Pause toggle
R o ESC: Reset/Clear (con confirmación)
L: Registrar Lap
F: Fullscreen toggle
T: Cambiar entre modo Stopwatch/Timer

**b) Almacenamiento local (LocalStorage):**

```bash
- Último tiempo registrado
- Historial de vueltas (últimas 50)
- Configuración de timer
- Modo activo (stopwatch/timer)
- Preferencias de usuario (sonido on/off, tema)
```

**c) Tabla de Laps/Vueltas:**

```bash
┌─────┬──────────┬────────────┬───────────────┐
│ #   │ Vuelta   │ Acumulado  │ Timestamp     │
├─────┼──────────┼────────────┼───────────────┤
│ 1   │ 00:02:15 │ 00:02:15   │ 14:32:18      │
│ 2   │ 00:01:50 │ 00:04:05   │ 14:34:08      │
│ 3   │ 00:03:12 │ 00:07:17   │ 14:37:20      │
└─────┴──────────┴────────────┴───────────────┘
```

Scroll automático a la última vuelta
Highlight de mejor/peor vuelta (verde/rojo)
Botón "Export CSV" para descargar datos
Botón "Clear Laps" individual

**d) Exportación CSV:**

javascript// Formato del CSV:

```bash
Vuelta,Tiempo Vuelta,Tiempo Acumulado,Timestamp
1,00:02:15,00:02:15,14:32:18
2,00:01:50,00:04:05,14:34:08
```

**e) Modo Pantalla Completa:**

- Botón dedicado (icono expand)
- API: `document.documentElement.requestFullscreen()`
- Display aumenta al 150% en fullscreen
- Salida con ESC o botón dedicado

**f) Notificaciones:**

- Al completar cuenta regresiva: sonido + alerta visual
- Usar Web Audio API para sonido personalizado o `<audio>` tag
- Opción de activar/desactivar sonido (toggle en settings)

### 5. CONFIGURACIÓN DE TIMER (COUNTDOWN)

**Input de configuración:**

```bash
┌──────────────────────────────────┐
│  Set Timer                       │
│  Hours:   [___]  (0-99)          │
│  Minutes: [___]  (0-59)          │
│  Seconds: [___]  (0-59)          │
│                                  │
│  [Start Timer]  [Cancel]         │
└──────────────────────────────────┘
```

Validaciones:

Solo números positivos
Minutos y segundos <= 59
Tiempo total > 0
Mostrar tiempo total calculado: "Total: 01:30:00"

🏗️ ESTRUCTURA TÉCNICA RECOMENDADA
Arquitectura JavaScript:
javascript// CLASE PRINCIPAL
class TimerController {
constructor() {
this.mode = 'stopwatch'; // 'stopwatch' | 'countdown'
this.timeElapsed = 0; // en milisegundos
this.isRunning = false;
this.isPaused = false;
this.intervalId = null;
this.laps = [];
this.startTime = null;
this.pausedTime = 0;
}

// Métodos principales
start() { }
pause() { }
reset() { }
lap() { }
switchMode() { }

// Actualización de display
updateDisplay() { }
formatTime(ms) { }

// Persistencia
saveToLocalStorage() { }
loadFromLocalStorage() { }

// Eventos
setupEventListeners() { }
handleKeyboard(event) { }
}
Ciclo de actualización:
javascript// Usar requestAnimationFrame para máxima precisión
tick() {
if (!this.isRunning) return;

const now = performance.now();
this.timeElapsed = now - this.startTime - this.pausedTime;

this.updateDisplay();
requestAnimationFrame(() => this.tick());
}

HTML Semántico Recomendado:

```html
<main class="timer-container">
  <!-- Tab switcher -->
  <nav class="mode-tabs">
    <button class="tab active" data-mode="stopwatch">Cronómetro</button>
    <button class="tab" data-mode="countdown">Temporizador</button>
  </nav>

  <!-- Display -->
  <div class="display-wrapper">
    <div class="time-display">
      <span class="hours">00</span>
      <span class="separator">:</span>
      <span class="minutes">00</span>
      <span class="separator">:</span>
      <span class="seconds">00</span>
      <span class="milliseconds">.000</span>
    </div>
  </div>

  <!-- Controls -->
  <div class="controls">
    <button id="startBtn" class="btn btn-start">Start</button>
    <button id="lapBtn" class="btn btn-lap" disabled>Lap</button>
    <button id="resetBtn" class="btn btn-reset">Clear</button>
  </div>

  <!-- Secondary controls -->
  <div class="secondary-controls">
    <button id="fullscreenBtn" class="icon-btn">⛶</button>
    <button id="soundBtn" class="icon-btn">🔊</button>
    <button id="settingsBtn" class="icon-btn">⚙️</button>
  </div>

  <!-- Laps table -->
  <section class="laps-section" hidden>
    <div class="laps-header">
      <h3>Vueltas Registradas</h3>
      <button id="exportBtn">📥 Export CSV</button>
      <button id="clearLapsBtn">🗑️ Clear</button>
    </div>
    <table class="laps-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Vuelta</th>
          <th>Acumulado</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody id="lapsBody">
        <!-- Populated dynamically -->
      </tbody>
    </table>
  </section>
</main>
```

🎨 CSS CRÍTICO

```css
/* Variables CSS */
:root {
  --color-bg-display: #e6e9ff;
  --color-btn-start: #00dd00;
  --color-btn-pause: #ffa500;
  --color-btn-reset: #ff3030;
  --color-btn-lap: #3080ff;
  --font-main: "Orbitron", "Roboto Mono", monospace;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Layout responsivo */
@media (max-width: 768px) {
  .time-display {
    font-size: 48px;
  }
  .btn {
    width: 100%;
    margin: 10px 0;
  }
}

@media (min-width: 769px) {
  .controls {
    display: flex;
    gap: 20px;
  }
}

/* Estados de botones */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:active {
  transform: scale(0.95);
}
```

### ⚡ OPTIMIZACIONES Y BUENAS PRÁCTICAS

**Performance:**

Usar requestAnimationFrame() en lugar de setInterval() para animaciones suaves
Debounce en resize events
Lazy loading de la tabla de laps (virtual scrolling si >100 entradas)

**Accesibilidad:**

ARIA labels en todos los botones
Roles semánticos (role="timer", role="button")
Focus management con teclado
Contraste WCAG AAA en texto sobre fondo

**UX:**

Feedback visual inmediato (<100ms) en cada acción
Confirmación antes de destruir datos (reset con laps)
Loading states si hay operaciones asíncronas
Toast notifications para acciones exitosas

**Seguridad:**

Validar inputs del usuario (timer config)
Sanitizar antes de guardar en localStorage
Escapar HTML en tabla de laps

**Cross-browser:**

Polyfills para performance.now() si es necesario
Fallbacks para Fullscreen API
Testear en Chrome, Firefox, Safari, Edge

### 📦 ENTREGABLES ESPERADOS

**Código limpio y comentado:**

JSDoc para funciones principales
Comentarios explicativos en lógica compleja
Nombres de variables descriptivos

**Funcionalidad completa:**

✅ Cronómetro con precisión de milisegundos
✅ Cuenta regresiva configurable
✅ Sistema de vueltas/laps
✅ Persistencia en localStorage
✅ Exportación CSV
✅ Fullscreen mode
✅ Atajos de teclado

**Responsive design:**

Mobile-first approach
Breakpoints: 320px, 768px, 1024px, 1440px
Touch-friendly (botones >44px mínimo)

**Testing básico:**

Verificar precisión del tiempo (comparar con reloj real)
Test de múltiples laps (>50)
Verificar localStorage limits
Compatibilidad cross-browser

### 🎯 CRITERIOS DE ACEPTACIÓN

El cronómetro tiene precisión ±100ms en períodos de 1 hora
Los botones responden en <100ms (percepción instantánea)
La aplicación funciona sin conexión (offline-first)
El código es vanilla JS puro (sin jQuery, React, etc.)
El diseño se parece visualmente a la referencia proporcionada
Funciona en dispositivos móviles y desktop
El localStorage no excede 5MB
Todos los botones tienen hover y active states

### 🔧 RECURSOS Y REFERENCIAS

Iconos: Usar Unicode/Emoji o Font Awesome CDN
Fuentes: Google Fonts (Orbitron, Roboto Mono)
Sonidos: Usar Web Audio API o free sounds de freesound.org
Inspiración visual: <https://www.online-stopwatch.com/>

### 💡 MEJORAS OPCIONALES (BONUS)

Temas oscuro/claro (dark mode toggle)
Múltiples cronómetros simultáneos (tabs)
Gráfico de progreso circular para countdown
Integración con Pomodoro technique
PWA con service worker (funciona offline)
Sincronización entre pestañas (Broadcast Channel API)
Animaciones con CSS custom properties
Shortcuts personalizables por usuario

¿Preguntas? Cualquier duda sobre implementación específica, consulta la documentación de MDN Web Docs o verifica el comportamiento de referencia en online-stopwatch.com
