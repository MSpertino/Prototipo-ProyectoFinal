const trips = [
  ['Rosario → Timbúes', 'AB123CD', '+$210.000', '94', 'positive'],
  ['Pergamino → San Lorenzo', 'EF456GH', '+$165.500', '87', 'positive'],
  ['Casilda → P. Gral. San Martín', 'IJ789KL', '-$18.400', '32', 'negative'],
];

export function renderAdminView(page) {
  if (page === 'alerts') return renderTable('Alertas', 'RevisÃ¡ las alertas crÃ­ticas del sistema y su seguimiento.', 'Nueva alerta');
  if (page === 'routes') return renderTable('Recorridos', 'Administrá los recorridos programados y su estado operativo.', 'Nuevo recorrido');
  if (page === 'fleet') return renderTable('Vehículos', 'Consultá la disponibilidad y el estado de mantenimiento.', 'Agregar vehículo');
  if (page === 'drivers') return renderTable('Choferes', 'Administrá los usuarios habilitados para operar.', 'Agregar chofer');
  return renderDashboard();
}

function renderDashboard() {
  return `<div class="hero"><div><p class="eyebrow">Jueves 27 de noviembre, 2026</p><h1>Buen día, María</h1><p>Este es el estado general de la operación de hoy.</p></div><button class="primary" data-action="new-trip">+ Nuevo recorrido</button></div>
    <div class="cards">
      ${metricCard('Rentabilidad Promedio', '$184.200', 'blue-icon', '↑ 8,3% vs. mes anterior', 'trend')}
      ${metricCard('IEV Promedio', '94 / 100', 'teal-icon', 'Rendimiento óptimo', 'trend selected-metric')}
      ${metricCard('Cheques a vencer (7d)', '4', 'amber-icon', 'Requieren seguimiento', 'metric-foot amber-text')}
      ${metricCard('Viajes en Curso', '3', 'red-icon', 'Operación activa', 'metric-foot red-text')}
    </div>
    <div class="grid-2 admin-overview-grid">
      <div class="panel"><div class="panel-head"><div><h2 class="panel-title">Rentabilidad Promedio por Unidad ($)</h2><p class="panel-sub">Comparativa de las últimas operaciones</p></div></div><div class="admin-mini-chart"><div class="mini-bar"><b>$210k</b><i class="high"></i><small>AB123CD</small></div><div class="mini-bar"><b>$165k</b><i class="medium"></i><small>EF456GH</small></div><div class="mini-bar negative"><b>-$18k</b><i></i><small>IJ789KL</small></div></div></div>
      <div class="panel"><div class="panel-head"><div><h2 class="panel-title">Alertas Críticas del Sistema</h2><p class="panel-sub">Requieren atención del administrador</p></div><span class="status red">2</span></div><div class="admin-alert red-alert"><b>Cheque #4521 vence en 2 días</b><small>Requiere gestión financiera urgente.</small></div><div class="admin-alert yellow-alert"><b>Camión AB123CD próximo a service</b><small>A 800 km del límite establecido.</small></div></div>
    </div>
    <div class="admin-trips-panel"><div class="panel-head"><div><h2 class="panel-title">Últimos Viajes Finalizados</h2><p class="panel-sub">Rentabilidad e IEV por unidad</p></div><button class="link" data-page="routes">Ver todos</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Ruta</th><th>Camión</th><th>Rentabilidad</th><th>IEV</th></tr></thead><tbody>${trips.map(trip => `<tr><td>${trip[0]}</td><td>${trip[1]}</td><td><b class="${trip[4]}">${trip[2]}</b></td><td>${trip[3]}</td></tr>`).join('')}</tbody></table></div></div><button class="admin-ai-fab" data-action="ai-open" aria-label="Abrir asistente IA">✦</button>`;
}

function metricCard(label, value, iconClass, detail, detailClass) {
  return `<div class="card"><div class="metric-top"><span>${label}</span><span class="metric-icon ${iconClass}">◉</span></div><div class="metric-value">${value}</div><span class="${detailClass}">${detail}</span></div>`;
}

function renderTable(title, subtitle, buttonLabel) {
  return `<div class="hero"><div><p class="eyebrow">Gestión operativa</p><h1>${title}</h1><p>${subtitle}</p></div><button class="primary" data-action="new-trip">+ ${buttonLabel}</button></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">${title}</h2><p class="panel-sub">Información actualizada en tiempo real</p></div><button class="secondary">Filtrar</button></div><div class="empty">El módulo está listo para continuar con la carga de datos.</div></div>`;
}
