import { renderAdminAiCard } from '../../modulos/ia/index.js';

const routes = [
  ['RP-1042', 'Puerto · Planta Norte', 'Juan García', '06:30 — 08:15', 'En curso', 'green'],
  ['RP-1043', 'Planta Norte · Depósito Sur', 'Lucía Fernández', '08:00 — 09:40', 'Programado', 'blue'],
  ['RP-1044', 'Planta Este · Puerto', 'Carla Molina', '09:30 — 11:00', 'Demorado', 'amber'],
];

export function renderAdminView(page) {
  if (page === 'routes') return renderTable('Recorridos', 'Administrá los recorridos programados y su estado operativo.', routes, 'Nuevo recorrido');
  if (page === 'fleet') return renderTable('Vehículos', 'Consultá la disponibilidad y el estado de mantenimiento.', [['JP-034', 'Camión semirremolque', 'En recorrido', 'Activo', 'green'], ['JP-018', 'Camión semirremolque', 'Disponible', 'Libre', 'blue'], ['JP-021', 'Camión semirremolque', 'Mantenimiento', 'Taller', 'amber']], 'Agregar vehículo');
  if (page === 'drivers') return renderTable('Choferes', 'Administrá los usuarios habilitados para operar.', [['Juan García', 'Legajo 1042', 'Turno mañana', 'Activo', 'green'], ['Lucía Fernández', 'Legajo 1088', 'Turno mañana', 'Activo', 'green'], ['Carla Molina', 'Legajo 1110', 'Turno tarde', 'Licencia', 'red']], 'Agregar chofer');
  return renderDashboard();
}

function renderDashboard() {
  return `<div class="hero"><div><p class="eyebrow">Jueves 27 de noviembre, 2026</p><h1>Buen día, María</h1><p>Este es el estado general de la operación de hoy.</p></div><button class="primary" data-action="new-trip">+ Nuevo recorrido</button></div>
    <div class="cards"><div class="card"><div class="metric-top"><span>Recorridos de hoy</span><span class="metric-icon blue-icon">⌁</span></div><div class="metric-value">12</div><span class="trend">↑ 8,3% <em>vs. ayer</em></span></div><div class="card"><div class="metric-top"><span>En curso ahora</span><span class="metric-icon teal-icon">◉</span></div><div class="metric-value">04</div><span class="trend">Todos en horario</span></div><div class="card"><div class="metric-top"><span>Vehículos activos</span><span class="metric-icon amber-icon">▣</span></div><div class="metric-value">18 <small>/ 20</small></div><span class="metric-foot amber-text">2 en mantenimiento</span></div><div class="card"><div class="metric-top"><span>Alertas pendientes</span><span class="metric-icon red-icon">!</span></div><div class="metric-value">03</div><span class="metric-foot red-text">Requieren atención</span></div></div>${renderAdminAiCard()}
    <div class="grid-2"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Recorridos de hoy</h2><p class="panel-sub">Actividad operativa en tiempo real</p></div><button class="link" data-page="routes">Ver todos</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Recorrido</th><th>Chofer</th><th>Horario</th><th>Estado</th></tr></thead><tbody>${routes.map(route => `<tr><td><b>${route[0]}</b><br><span class="muted-text">${route[1]}</span></td><td>${route[2]}</td><td>${route[3]}</td><td><span class="status ${route[5]}">${route[4]}</span></td></tr>`).join('')}</tbody></table></div></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Estado de la flota</h2><p class="panel-sub">Disponibilidad de vehículos</p></div><button class="link" data-page="fleet">Ver flota</button></div>${fleetRows()}</div></div>`;
}

function fleetRows() {
  return [['🚛', 'Camión JP-034', 'En recorrido · RP-1042', 'Activo', 'green'], ['🚛', 'Camión JP-018', 'Disponible', 'Libre', 'blue'], ['🔧', 'Camión JP-021', 'Service programado', 'Taller', 'amber']].map(row => `<div class="vehicle-row"><div class="vehicle-icon">${row[0]}</div><div class="vehicle-info"><b>${row[1]}</b><small>${row[2]}</small><div class="progress"><i></i></div></div><span class="status ${row[4]}">${row[3]}</span></div>`).join('');
}

function renderTable(title, subtitle, rows, buttonLabel) {
  return `<div class="hero"><div><p class="eyebrow">Gestión operativa</p><h1>${title}</h1><p>${subtitle}</p></div><button class="primary" data-action="new-item">+ ${buttonLabel}</button></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">${title} registrados</h2><p class="panel-sub">Información actualizada en tiempo real</p></div><button class="secondary">Filtrar</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Identificación</th><th>Detalle</th><th>Horario / estado</th><th>Estado</th></tr></thead><tbody>${rows.map(row => `<tr><td><b>${row[0]}</b></td><td>${row[1]}</td><td>${row[2]}</td><td><span class="status ${row[4] || row[5]}">${row[3]}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}
