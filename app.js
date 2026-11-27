import { renderAdminView } from './roles/administrador/index.js';
import { renderDriverView } from './roles/chofer/index.js';
import { renderAiModal } from './modulos/ia/index.js';
import { addViaje, addComprobante, cancelarViaje, finalizarViaje, findViaje } from './data/store.js';

const app = document.querySelector('#app');
const toastElement = document.querySelector('#toast');

const state = {
  authenticated: false,
  role: null,
  page: 'dashboard',
  modal: null,
  tripStarted: false,
  checks: [true, false, false],
  toastTimer: null,
  aiMessages: [],
  receiptLoaded: false,
  profileMenuOpen: false,
  selectedTripId: null,
  alertFilter: 'all',
};

function renderRoleSelection() {
  app.innerHTML = `
    <main class="login-page role-select-page">
      <div class="login-title">Log In</div>
      <div class="role-select">
        <div class="role-select-copy">
          <span class="login-kicker">TRANSPORTE JP ZAMPA</span>
          <h1>¿Cómo querés iniciar sesión?</h1>
          <p>Seleccioná el perfil que vas a utilizar para ingresar al sistema.</p>
        </div>
        <div class="role-options">
          <button class="role-option" data-role="admin"><span class="role-icon">⌘</span><span><b>Administrador</b><small>Gestioná recorridos, vehículos y choferes</small></span><strong>›</strong></button>
          <button class="role-option" data-role="driver"><span class="role-icon driver">♙</span><span><b>Chofer</b><small>Consultá tu jornada y recorrido asignado</small></span><strong>›</strong></button>
        </div>
      </div>
    </main>`;
}

function renderLogin() {
  const driver = state.role === 'driver';
  app.innerHTML = `
    <main class="login-page">
      <div class="login-title">Log In</div>
      <div class="login-stage single-login-stage"><section class="login-card ${driver ? 'driver-login-card' : ''}">
        <div class="login-card-head">JP ZAMPA</div><div class="login-card-body">
          <button class="back-login" data-action="back-to-roles">‹ Cambiar tipo de acceso</button>
          <h1>${driver ? 'Acceso Choferes' : 'Iniciar Sesión'}</h1>
          <p class="login-subtitle">${driver ? 'Ingrese sus credenciales asignadas' : 'Sistema de Gestión Logística y Administrativa'}</p>
          <form data-login-form><label>${driver ? 'LEGAJO' : 'EMAIL'}</label><input ${driver ? 'value="1042"' : 'type="email" value="juan.zampa@jpzampa.com"'} required><label>CONTRASEÑA</label><input type="password" value="jpzampa2026" required><button class="login-button">Iniciar Sesión</button></form>
          <button class="forgot">¿Olvidaste tu contraseña? Contactá al administrador</button>${driver ? '' : '<p class="login-note">Acceso restringido a personal autorizado</p>'}
        </div></section></div>
    </main>`;
}

function renderShell(content) {
  const admin = state.role === 'admin';
  document.body.classList.toggle('driver-mode', !admin);
  document.body.classList.toggle('admin-mode', admin);
  app.innerHTML = `<div class="app-shell"><aside class="sidebar">
    <div class="brand"><div class="brand-mark">JP</div><div><strong>Transporte JP</strong><span>Zampa · gestión operativa</span></div></div>
    <div class="role-chip"><span>Vista actual</span><b>${admin ? 'Administrador' : 'Chofer'}</b></div>${admin ? renderAdminNavigation() : ''}
    <div class="sidebar-bottom"><div class="user"><div class="avatar">${admin ? 'MR' : 'JG'}</div><div><b>${admin ? 'María Rodríguez' : 'Juan García'}</b><small>${admin ? 'Administradora' : 'Chofer'}</small></div><button class="logout" data-action="logout">↪</button></div></div>
  </aside><main class="main"><header class="topbar"><div class="crumb">Inicio <span> / </span> <b>${admin ? 'Resumen' : driverPageLabel()}</b></div><div class="top-actions"><button class="icon-btn" data-action="notifications">♢<i class="dot"></i></button>${admin ? '<div class="avatar">MR</div>' : '<button class="top-logout" data-action="logout">Cerrar sesión</button>'}</div></header><section class="content">${content}</section></main></div>`;
}

function renderAdminNavigation() {
  {
  const items = [['dashboard', 'Dashboard (KPIs / IEV)'], ['routes', 'Gesti\u00f3n de viajes'], ['alerts', 'Alertas'], ['fleet', 'Mantenimiento de Flota']];
  return `<div class="nav-label">MenÃº principal</div><nav class="nav">${items.map(([id, label]) => `<button class="${state.page === id ? 'active' : ''}" data-page="${id}">${label}</button>`).join('')}</nav>`;
  }
  const items = [['dashboard', '▦', 'Resumen'], ['routes', '⌁', 'Recorridos'], ['fleet', '▣', 'Vehículos'], ['drivers', '♙', 'Choferes']];
  return `<div class="nav-label">Menú principal</div><nav class="nav">${items.map(([id, icon, label]) => `<button class="${state.page === id ? 'active' : ''}" data-page="${id}"><span>${icon}</span>${label}</button>`).join('')}</nav>`;
}

function driverPageLabel() {
  return { 'driver-home': 'Mi jornada', 'driver-route': 'Mi recorrido', 'driver-check': 'Checklist' }[state.page] || 'Mi jornada';
}

function render() {
  if (!state.authenticated) {
    document.body.classList.remove('driver-mode');
    state.role ? renderLogin() : renderRoleSelection();
    return;
  }
  const content = state.role === 'admin' ? renderAdminView(state.page, state) : renderDriverView(state.page, state);
  renderShell(content);
  if (state.role === 'admin') {
    const crumb = document.querySelector('.crumb');
    const topActions = document.querySelector('.top-actions');
    if (crumb) crumb.innerHTML = '<b>Panel Gerencial</b><button class="period-filter">🏆 Últimos 30 días ▾</button>';
    if (topActions) topActions.innerHTML = '<div class="admin-profile"><div class="admin-profile-avatar">♙</div><div><b>Juan Pablo Zampa</b><small>Admin</small></div></div>';
  }
  if (state.role === 'driver') {
    const logout = document.createElement('button');
    logout.className = 'mobile-logout';
    logout.dataset.action = 'logout';
    logout.textContent = 'Cerrar sesión';
    document.querySelector('.content').append(logout);
  }
  if (state.modal) app.insertAdjacentHTML('beforeend', renderModal());
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toastElement.classList.remove('show'), 2600);
}

function toggleProfileMenu() {
  const topActions = document.querySelector('.top-actions');
  if (!topActions || state.role !== 'admin') return;
  state.profileMenuOpen = !state.profileMenuOpen;
  const menu = topActions.querySelector('.profile-menu');
  if (state.profileMenuOpen && !menu) topActions.insertAdjacentHTML('beforeend', '<div class="profile-menu"><div class="profile-menu-user"><b>Juan Pablo Zampa</b><small>Admin</small></div><button data-action="logout">Cerrar sesión</button></div>');
  if (!state.profileMenuOpen && menu) menu.remove();
}

function updateTripEstimate(form) {
  const estimate = form.querySelector('.trip-estimate');
  if (!estimate) return;
  const complete = [...form.querySelectorAll('[required]')].every(input => input.value.trim());
  estimate.classList.toggle('is-hidden', !complete);
}

function renderModal() {
  if (state.modal === 'ai') return renderAiModal(state.aiMessages, state.role);
  if (state.modal === 'notifications') return `<div class="modal-backdrop"><div class="modal notification-modal"><button class="modal-close" data-action="close-modal">×</button><div class="notification-heading"><p class="eyebrow">Centro de avisos</p><h2>Mis Notificaciones</h2><p>Información importante para tu jornada.</p></div><div class="notification-list"><article class="notification-card notification-danger"><div><b>Comprobante rechazado</b><p>El comprobante de combustible no pudo procesarse por datos incompletos. Revisalo manualmente.</p></div><span>Urgente</span></article><article class="notification-card notification-warning"><div><b>Viaje pendiente de inicio</b><p>Tenés el viaje V-1043 asignado y aún espera tu confirmación de inicio.</p></div><span>Preventiva</span></article><article class="notification-card notification-info"><div><b>Asignación de viaje</b><p>Nuevo viaje asignado: #103 · Buenos Aires.</p></div><span>Informativa</span></article></div></div></div>`;
  if (state.modal === 'receipt') return `<div class="modal-backdrop"><form class="modal receipt-modal" data-receipt-form><button type="button" class="modal-close" data-action="close-modal">×</button><div class="receipt-heading"><p class="eyebrow">Comprobante de gastos</p><h2>Cargar comprobante</h2><p>Asociá el ticket al viaje en curso.</p></div><button type="button" class="receipt-photo" data-action="simulate-photo">▣ Tomar foto del ticket</button><div class="ocr-box"><b>✦ Validación inteligente (OCR)</b><small>Datos extraídos automáticamente de la imagen</small><div class="form-grid"><div class="field"><label>TIPO DE COMPROBANTE</label><input value="Factura E (Combustible)"></div><div class="field"><label>PROVEEDOR / CUIT</label><input value="YPF Autopista (CUIT 30-54688997-9)"></div><div class="field"><label>FECHA DE EMISIÓN</label><input type="date" value="2026-11-27"></div><div class="field"><label>MONTO TOTAL ($)</label><input name="monto" type="number" value="45800" required></div><div class="field full"><label>ASOCIAR A VIAJE</label><input value="Viaje #1042 · En curso (Puerto San Martín)" disabled></div></div></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Volver</button><button type="submit" class="primary">Confirmar comprobante</button></div></form></div>`;
  if (state.modal === 'new-trip') return `<div class="modal-backdrop"><form class="modal trip-form-modal" data-trip-form><button type="button" class="modal-close" data-action="close-modal">×</button><div class="trip-modal-heading"><div><p class="eyebrow">Gestión de viajes</p><h2>Nuevo viaje</h2><p>Completá los datos operativos para planificar el viaje.</p></div></div><div class="trip-form-section"><h3>Datos operativos del viaje</h3><div class="form-grid"><div class="field"><label>ORIGEN</label><input name="origen" placeholder="Rosario, Santa Fe" required></div><div class="field"><label>DESTINO</label><input name="destino" placeholder="Puerto San Martín" required></div><div class="field"><label>CAMIÓN ASIGNADO</label><input name="camion" placeholder="AB123CD (Scania R450)" required></div><div class="field"><label>CHOFER</label><input name="chofer" placeholder="Juan García" required></div><div class="field"><label>CLIENTE / ACOPIADOR</label><input name="cliente" placeholder="ACA Timbúes" required></div><div class="field"><label>TARIFA ACORDADA ($)</label><input name="tarifa" type="number" placeholder="850000" required></div><div class="field"><label>DISTANCIA ESTIMADA (KM)</label><input name="distancia" type="number" placeholder="65" required></div><div class="field"><label>FECHA DE SALIDA</label><input name="fecha" type="date" required></div></div></div><div class="trip-estimate is-hidden"><b>✦ Estimación inteligente del viaje</b><p>Rentabilidad proyectada: <strong>+$210.000</strong> <small>(Tarifa - costo estimado de combustible y viáticos)</small></p><p>Rendimiento esperado: <strong>Óptimo</strong> <small>(Basado en consumo histórico de la unidad)</small></p><small>Nota: el Índice de Eficiencia de Viaje (IEV) oficial se calculará automáticamente en estado finalizado.</small></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancelar</button><button type="submit" class="primary">Guardar viaje</button></div></form></div>`;
  if (state.modal === 'cancel-trip') return `<div class="modal-backdrop"><div class="modal confirm-modal"><button class="modal-close" data-action="close-modal">×</button><div class="confirm-icon">!</div><h2>¿Cancelar viaje?</h2><p>El viaje ${state.selectedTripId} se marcará como cancelado. Esta acción se puede revisar luego desde el listado operativo.</p><div class="modal-actions"><button class="secondary" data-action="close-modal">Volver</button><button class="danger" data-action="confirm-cancel-trip">Sí, cancelar viaje</button></div></div></div>`;
  if (state.modal === 'finalize-trip') { const viaje = findViaje(state.selectedTripId); return `<div class="modal-backdrop"><form class="modal finalize-modal" data-finalize-form><button type="button" class="modal-close" data-action="close-modal">×</button><div class="trip-modal-heading"><p class="eyebrow">Gestión de viajes / Finalizar viaje</p><h2>Finalizar viaje (${viaje?.id || state.selectedTripId})</h2><p>Ingresá los valores reales para calcular el IEV y la liquidación.</p></div><div class="trip-form-section"><h3>Datos de cierre y rendición</h3><div class="form-grid"><div class="field"><label>CONSUMO REAL DE COMBUSTIBLE (LTS)</label><input name="combustible" type="number" step="0.1" value="185.5" required></div><div class="field"><label>DISTANCIA REAL RECORRIDA (KM)</label><input name="distanciaReal" type="number" step="0.1" value="162" required></div><div class="field"><label>FECHA Y HORA DE FINALIZACIÓN</label><input name="finalizadoEn" type="datetime-local" required></div><div class="field"><label>RUTA ASOCIADA / CHOFER</label><input value="${viaje?.ruta || ''} · ${viaje?.chofer || 'Sin asignar'}" disabled></div></div></div><div class="trip-estimate visible"><b>✦ Estimación automática al finalizar</b><p>El sistema calculará el IEV comparando consumo y distancia real contra lo estimado.</p><p>La liquidación pendiente se generará para el chofer sobre el neto de la tarifa.</p></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancelar</button><button type="submit" class="primary">Confirmar cierre</button></div></form></div>`; }
  return `<div class="modal-backdrop"><div class="modal"><button class="modal-close" data-action="close-modal">×</button><h2>Reportar un incidente</h2><p>La información será enviada al administrador.</p><div class="form-grid"><div class="field"><label>Tipo</label><select><option>Demora en ruta</option><option>Falla mecánica</option><option>Accidente</option></select></div><div class="field"><label>Viaje</label><input placeholder="V-1042"></div><div class="field full"><label>Comentario</label><textarea placeholder="Escribí una breve descripción..."></textarea></div></div><div class="modal-actions"><button class="secondary" data-action="close-modal">Cancelar</button><button class="primary" data-action="save-modal">Guardar información</button></div></div></div>`;
}

function handleAction(action, event) {
  if (action === 'back-to-roles') { state.role = null; render(); return; }
  if (action === 'logout') { state.authenticated = false; state.role = null; state.page = 'dashboard'; render(); showToast('Sesión cerrada'); return; }
  if (action === 'notifications') state.modal = 'notifications';
  if (action === 'new-trip' || action === 'incident') state.modal = action;
  if (action === 'cancel-trip' || action === 'finalize-trip') { state.selectedTripId = event?.target?.dataset?.tripId || state.selectedTripId; state.modal = action; }
  if (action === 'confirm-cancel-trip') { cancelarViaje(state.selectedTripId); state.modal = null; showToast('Viaje cancelado'); }
  if (action === 'ai-open') state.modal = 'ai';
  if (action === 'upload-receipt') state.modal = 'receipt';
  if (action === 'simulate-photo') showToast('Ticket capturado. Revisá los datos extraídos.');
  if (action === 'start-trip') { state.tripStarted = true; showToast('Recorrido iniciado. ¡Buen viaje, Juan!'); }
  if (action === 'finish-trip') { state.tripStarted = false; showToast('Recorrido finalizado y enviado a administración'); }
  if (action === 'save-modal') { state.modal = null; showToast('Información guardada correctamente'); }
  if (action === 'close-modal') state.modal = null;
  render();
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.admin-profile')) { toggleProfileMenu(); return; }
  const alertFilter = event.target.closest('[data-alert-filter]');
  if (alertFilter) { state.alertFilter = alertFilter.dataset.alertFilter; render(); return; }
  const roleButton = event.target.closest('[data-role]');
  const pageButton = event.target.closest('[data-page]');
  const actionButton = event.target.closest('[data-action]');
  if (roleButton) { state.role = roleButton.dataset.role; render(); return; }
  if (pageButton) { state.page = pageButton.dataset.page; render(); return; }
  if (actionButton) handleAction(actionButton.dataset.action, event);
});

document.addEventListener('submit', (event) => {
  if (event.target.matches('[data-receipt-form]')) {
    event.preventDefault();
    const formData = new FormData(event.target);
    addComprobante({ viajeId: 'V-1042', importe: Number(formData.get('monto')), ocr: true });
    state.receiptLoaded = true;
    state.modal = null;
    render();
    showToast('Comprobante confirmado y asociado al viaje');
    return;
  }
  if (event.target.matches('[data-finalize-form]')) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const combustible = Number(formData.get('combustible'));
    const distanciaReal = Number(formData.get('distanciaReal'));
    finalizarViaje(state.selectedTripId, { combustible, distanciaReal, finalizadoEn: formData.get('finalizadoEn'), iev: Math.max(0, Math.min(100, Math.round(100 - Math.abs(combustible - 180) - Math.abs(distanciaReal - 160) / 2))) });
    state.modal = null;
    render();
    showToast('Viaje finalizado y cierre confirmado');
    return;
  }
  if (event.target.matches('[data-trip-form]')) {
    event.preventDefault();
    const formData = new FormData(event.target);
    addViaje({ ruta: `${formData.get('origen')} → ${formData.get('destino')}`, camion: formData.get('camion'), fecha: formData.get('fecha'), chofer: formData.get('chofer'), cliente: formData.get('cliente'), tarifa: Number(formData.get('tarifa')), distancia: Number(formData.get('distancia')) });
    state.modal = null;
    render();
    showToast('Viaje guardado correctamente');
    return;
  }
  if (event.target.matches('[data-login-form]')) {
    event.preventDefault(); state.authenticated = true; state.page = state.role === 'admin' ? 'dashboard' : 'driver-home'; render(); showToast(`Sesión iniciada como ${state.role === 'admin' ? 'Administrador' : 'Chofer'}`);
  }
  if (event.target.matches('[data-ai-form]')) {
    event.preventDefault(); const input = event.target.querySelector('input');
    if (input.value.trim()) { state.aiMessages.push({ from: 'user', text: input.value.trim() }); state.aiMessages.push({ from: 'ai', text: 'Analicé la situación. Te recomiendo continuar por el acceso norte y avisar a administración si la demora supera los 15 minutos.' }); state.modal = 'ai'; render(); }
  }
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-check]')) {
    state.checks[Number(event.target.dataset.check)] = event.target.checked;
    render();
  }
});

document.addEventListener('input', (event) => {
  const form = event.target.closest('[data-trip-form]');
  if (form) updateTripEstimate(form);
});

render();
