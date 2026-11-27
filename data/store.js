export const store = {
  viajes: [
    { id: 'V-1042', ruta: 'Rosario → Timbúes', camion: 'AB123CD', rentabilidad: 210000, iev: 94, estado: 'finalizado' },
    { id: 'V-1041', ruta: 'Pergamino → San Lorenzo', camion: 'EF456GH', rentabilidad: null, iev: null, estado: 'en curso', chofer: 'Lucía Fernández' },
    { id: 'V-1040', ruta: 'Casilda → P. Gral. San Martín', camion: 'IJ789KL', rentabilidad: -18400, iev: 32, estado: 'finalizado' },
  ],
  camiones: [
    { patente: 'AB123CD', modelo: 'Scania R450', kilometraje: 184200, proximoService: 185000, estado: 'En ruta' },
    { patente: 'EF456GH', modelo: 'Mercedes-Benz Actros', kilometraje: 96200, proximoService: 98000, estado: 'Disponible' },
    { patente: 'IJ789KL', modelo: 'Volvo FH 540', kilometraje: 241500, proximoService: 242000, estado: 'Mantenimiento' },
  ],
  choferes: [
    { nombre: 'Juan García', legajo: '1042', camion: 'AB123CD' },
    { nombre: 'Lucía Fernández', legajo: '1088', camion: 'EF456GH' },
  ],
  cheques: [
    { numero: '#4521', vencimiento: 'en 2 días', estado: 'Pendiente' },
    { numero: '#4518', vencimiento: 'en 5 días', estado: 'Pendiente' },
  ],
  comprobantes: [],
};

export function addViaje(viaje) {
  store.viajes.unshift({ id: `V-${1043 + store.viajes.length}`, estado: 'programado', iev: null, rentabilidad: null, ...viaje });
}

export function addComprobante(comprobante) {
  store.comprobantes.push({ id: `C-${store.comprobantes.length + 1}`, fecha: new Date().toISOString(), ...comprobante });
}

export function findViaje(id) {
  return store.viajes.find(viaje => viaje.id === id);
}

export function cancelarViaje(id) {
  const viaje = findViaje(id);
  if (viaje) viaje.estado = 'cancelado';
}

export function finalizarViaje(id, datos) {
  const viaje = findViaje(id);
  if (!viaje) return;
  Object.assign(viaje, datos, { estado: 'finalizado', iev: datos.iev ?? 88, rentabilidad: datos.rentabilidad ?? 165500 });
}

export function serviceProximo(camion) {
  return camion.proximoService - camion.kilometraje <= 1000;
}

export function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}
