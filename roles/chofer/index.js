import { renderAiCard } from '../../modulos/ia/index.js';

export function renderDriverView(page, state) {
  const currentPage = page || 'driver-home';
  const content = currentPage === 'driver-route' ? renderRoutePage(state) : currentPage === 'driver-check' ? renderChecklistPage(state) : renderHomePage(state);
  return `<div class="driver-screen">${content}${renderBottomNavigation(currentPage)}</div>`;
}

function renderHomePage(state) {
  return `<div class="hero"><div><p class="eyebrow">Jueves 27 de noviembre, 2026 · Turno mañana</p><h1>Hola, Juan</h1><p>Tenés una jornada programada y todo listo para salir.</p></div><button class="primary" data-action="incident">⚠ Reportar incidente</button></div>${renderRouteCard(state)}${renderAiCard()}${renderNoticePanel()}`;
}

function renderRoutePage(state) {
  return `<div class="mobile-page-heading"><p class="eyebrow">Operación</p><h1>Mi recorrido</h1><p>Consultá el recorrido asignado y actualizá su estado.</p></div>${renderRouteCard(state)}<div class="panel route-detail-panel"><div class="panel-head"><div><h2 class="panel-title">Paradas del recorrido</h2><p class="panel-sub">RP-1042 · 3 puntos registrados</p></div></div><div class="timeline"><div class="timeline-item active"><i></i><div><b>Puerto</b><small>Salida · 06:30 hs</small></div></div><div class="timeline-item"><i></i><div><b>Acceso norte</b><small>Control de carga · 07:20 hs</small></div></div><div class="timeline-item"><i></i><div><b>Planta Norte</b><small>Arribo estimado · 08:15 hs</small></div></div></div></div>`;
}

function renderChecklistPage(state) {
  const completed = state.checks.filter(Boolean).length;
  return `<div class="mobile-page-heading"><p class="eyebrow">Antes de salir</p><h1>Checklist</h1><p>Completá los controles de seguridad del vehículo.</p></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Checklist de salida</h2><p class="panel-sub">${completed} de 3 controles completados</p></div><span class="status ${completed === 3 ? 'green' : 'amber'}">${completed}/3</span></div>${checkItem(0, state.checks[0], 'Documentación del vehículo', 'Cédula, seguro y habilitación')}${checkItem(1, state.checks[1], 'Estado general', 'Neumáticos, luces y niveles')}${checkItem(2, state.checks[2], 'Carga verificada', 'Precintos y documentación de carga')}</div><div class="checklist-help"><b>¿Encontraste un problema?</b><span>Reportalo antes de iniciar el recorrido.</span><button class="secondary" data-action="incident">Reportar incidente</button></div>`;
}

function checkItem(id, checked, title, detail) {
  return `<label class="check"><input type="checkbox" data-check="${id}" ${checked ? 'checked' : ''}><span><b>${title}</b><small>${detail}</small></span></label>`;
}

function renderRouteCard(state) {
  return `<div class="route-card"><p class="eyebrow">Próximo recorrido · RP-1042</p><h2>Puerto → Planta Norte</h2><div class="route-meta"><span>Salida<b>06:30 hs</b></span><span>Arribo estimado<b>08:15 hs</b></span><span>Vehículo<b>JP-034</b></span></div><div class="route-progress"><i style="width:${state.tripStarted ? '52%' : '0%'}"></i></div><div class="route-footer"><span>${state.tripStarted ? 'En recorrido' : 'Aún no iniciado'}</span><span>${state.tripStarted ? '52% completado' : '— km recorridos'}</span></div><button class="primary route-action" data-action="${state.tripStarted ? 'finish-trip' : 'start-trip'}">${state.tripStarted ? 'Finalizar recorrido' : 'Iniciar recorrido'}</button></div>`;
}

function renderNoticePanel() {
  return `<div class="panel compact-panel"><div class="panel-head"><div><h2 class="panel-title">Avisos importantes</h2><p class="panel-sub">Información para tu jornada</p></div></div><div class="vehicle-row"><div class="metric-icon amber-icon">!</div><div class="vehicle-info"><b>Desvío en acceso norte</b><small>Utilizar ingreso alternativo hasta las 10 hs.</small></div></div><div class="vehicle-row"><div class="metric-icon teal-icon">✓</div><div class="vehicle-info"><b>Documentación vigente</b><small>Última verificación: hoy, 05:55 hs.</small></div></div></div>`;
}

function renderBottomNavigation(page) {
  const items = [['driver-home', '⌂', 'Inicio'], ['driver-route', '⌁', 'Recorrido'], ['driver-check', '✓', 'Checklist']];
  return `<nav class="driver-bottom-nav">${items.map(([id, icon, label]) => `<button class="${page === id ? 'active' : ''}" data-page="${id}"><span>${icon}</span><small>${label}</small></button>`).join('')}</nav>`;
}
