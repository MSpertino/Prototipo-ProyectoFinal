export function renderAiCard() {
  return `<section class="ai-card"><div class="ai-card-top"><div class="ai-badge">✦</div><div><p class="eyebrow">Asistente inteligente</p><h2>IA JP Zampa</h2></div><span class="ai-status">En línea</span></div><p>Consultá sobre tu recorrido, demoras, desvíos o procedimientos antes de salir.</p><div class="ai-quick-actions"><button data-action="ai-open">¿Qué hago si me demoro?</button><button data-action="ai-open">Consultar desvíos</button></div></section>`;
}

export function renderAdminAiCard() {
  return `<section class="ai-card admin-ai-card"><div class="ai-card-top"><div class="ai-badge">✦</div><div><p class="eyebrow">Análisis operativo</p><h2>IA JP Zampa para Administración</h2></div><span class="ai-status">En línea</span></div><p>Detectá demoras, priorizá alertas y consultá recomendaciones para organizar la operación.</p><div class="ai-quick-actions"><button data-action="ai-open">Analizar alertas</button><button data-action="ai-open">¿Qué recorrido priorizar?</button><button data-action="ai-open">Revisar flota</button></div></section>`;
}

export function renderAiModal(messages = [], role = 'driver') {
  const greeting = role === 'admin' ? 'Hola Juan Pablo. Soy el asistente de JP Zampa. Puedo ayudarte a analizar alertas, viajes y flota.' : 'Hola Juan Pablo. Soy el asistente de JP Zampa. ¿En qué puedo ayudarte con tu jornada?';
  const conversation = messages.length ? messages.map(message => `<div class="ai-message ${message.from}">${message.text}</div>`).join('') : `<div class="ai-message ai">${greeting}</div>`;
  return `<div class="modal-backdrop"><div class="modal ai-modal"><button class="modal-close" data-action="close-modal">×</button><div class="ai-modal-heading"><div class="ai-badge">✦</div><div><h2>Asistente IA JP Zampa</h2><p>Respuesta orientativa para la operación.</p></div></div><div class="ai-chat">${conversation}</div><form data-ai-form class="ai-form"><input placeholder="Escribí tu consulta..." autocomplete="off"><button class="primary">Enviar</button></form></div></div>`;
}
