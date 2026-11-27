import { renderAdminView } from './roles/administrador/index.js';
import { renderDriverView } from './roles/chofer/index.js';
import { renderAiModal } from './modulos/ia/index.js';

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
  </aside><main class="main"><header class="topbar"><div class="crumb">Inicio <span> / </span> <b>${admin ? 'Resumen' : driverPageLabel()}</b></div><div class="top-actions"><button class="icon-btn" data-action="notifications">♢<i class="dot"></i></button>${admin ? '<div class="avatar">MR</div>' : ''}</div></header><section class="content">${content}</section></main></div>`;
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
  const content = state.role === 'admin' ? renderAdminView(state.page) : renderDriverView(state.page, state);
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

function renderModal() {
  if (state.modal === 'ai') return renderAiModal(state.aiMessages, state.role);
  if (state.modal === 'notifications') return `<div class="modal-backdrop"><div class="modal"><button class="modal-close" data-action="close-modal">×</button><h2>Notificaciones</h2><p>Tenés 3 avisos pendientes de revisar.</p><div class="vehicle-row"><div class="metric-icon red-icon">!</div><div class="vehicle-info"><b>Vehículo JP-021 requiere atención</b><small>Service programado para mañana</small></div></div><div class="vehicle-row"><div class="metric-icon amber-icon">!</div><div class="vehicle-info"><b>Recorrido RP-1044 demorado</b><small>Actualización hace 7 minutos</small></div></div></div></div>`;
  return `<div class="modal-backdrop"><div class="modal"><button class="modal-close" data-action="close-modal">×</button><h2>${state.modal === 'incident' ? 'Reportar un incidente' : 'Nuevo recorrido'}</h2><p>${state.modal === 'incident' ? 'La información será enviada al administrador.' : 'Completá los datos para asignar un nuevo recorrido.'}</p><div class="form-grid"><div class="field"><label>Tipo</label><select><option>Demora en ruta</option><option>Falla mecánica</option><option>Accidente</option></select></div><div class="field"><label>Recorrido</label><input placeholder="RP-1042"></div><div class="field full"><label>Comentario</label><textarea placeholder="Escribí una breve descripción..."></textarea></div></div><div class="modal-actions"><button class="secondary" data-action="close-modal">Cancelar</button><button class="primary" data-action="save-modal">Guardar información</button></div></div></div>`;
}

function handleAction(action) {
  if (action === 'back-to-roles') { state.role = null; render(); return; }
  if (action === 'logout') { state.authenticated = false; state.role = null; state.page = 'dashboard'; render(); showToast('Sesión cerrada'); return; }
  if (action === 'notifications') state.modal = 'notifications';
  if (action === 'new-trip' || action === 'incident') state.modal = action;
  if (action === 'ai-open') state.modal = 'ai';
  if (action === 'start-trip') { state.tripStarted = true; showToast('Recorrido iniciado. ¡Buen viaje, Juan!'); }
  if (action === 'finish-trip') { state.tripStarted = false; showToast('Recorrido finalizado y enviado a administración'); }
  if (action === 'save-modal') { state.modal = null; showToast('Información guardada correctamente'); }
  if (action === 'close-modal') state.modal = null;
  render();
}

document.addEventListener('click', (event) => {
  const roleButton = event.target.closest('[data-role]');
  const pageButton = event.target.closest('[data-page]');
  const actionButton = event.target.closest('[data-action]');
  if (roleButton) { state.role = roleButton.dataset.role; render(); return; }
  if (pageButton) { state.page = pageButton.dataset.page; render(); return; }
  if (actionButton) handleAction(actionButton.dataset.action);
});

document.addEventListener('submit', (event) => {
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

render();
