export type BookingType = 'pasien' | 'bayi-anak-lansia' | 'personal-care' | 'jastip-anjem' | 'lainnya';
export type BookingCategory = 'jauh' | 'h1' | 'dadakan';
export type JastipMode = '' | 'jastip' | 'anjem';
export type Destination = { name: string; address: string; note: string };
export type CartItem = { key: string; serviceId: number; name: string; options: string; note: string; price: number | null; quantity: number };

export type BookingData = {
  bookingType: BookingType; category: BookingCategory; ordererName: string; phone: string; relation: string; area: string; email: string;
  personName: string; age: string; gender: string; condition: string; complaint: string; diagnosis: string; specialNeeds: string; mobility: string; healthStatus: string; healthDetail: string; healthNote: string;
  locationType: string; locationName: string; building: string; room: string; roomNumber: string; floor: string; address: string; rtRw: string; village: string; district: string; city: string; landmark: string;
  careType: string; careNeeds: string; indoorOutdoor: 'indoor' | 'outdoor'; indoorLocation: string; activity: string; oneLocation: string; pickup: string; pickupAddress: string; firstDestination: string; firstDestinationAddress: string; transport: string; pickupHelp: string; destinations: Destination[]; crewPreference: string;
  startDate: string; endDate: string; startTime: string; endTime: string; scheduleStatus: string; extra: string;
  hygieneSubservice: string; hygieneClientType: string; hygieneLocation: string; hygieneAddress: string;
  jastipMode: JastipMode; jastipItems: string; jastipType: string; jastipQuantity: string; jastipDestination: string; jastipScheduleType: string; jastipEta: string; vehicle: string;
  otherDescription: string;
};

export const ADMIN_URL = 'https://wa.me/6289672874600';
export const areas = [
  { name: 'Solo / Surakarta', link: 'https://chat.whatsapp.com/DQviHP2VuQRAfeyLWgHfbH?s=cl&p=a&mlu=4' },
  { name: 'Sukoharjo', link: 'https://chat.whatsapp.com/KpY6497rBmZJBBKmzoRj9q?s=cl&p=a&mlu=4' },
  { name: 'Karanganyar', link: 'https://chat.whatsapp.com/LuvUIfzqqatARnFyYwcEFm?s=sh&p=a&mlu=4' },
  { name: 'Boyolali', link: 'https://chat.whatsapp.com/CC9HhDSZcPwCvV2KEDgI6P?s=cl&p=a&mlu=4' },
  { name: 'Sragen', link: 'https://chat.whatsapp.com/KVdFO8IeKwQ7N86m25Z6d1?s=cl&p=a&mlu=4' },
  { name: 'Klaten', link: 'https://chat.whatsapp.com/Iog3TRNdecdHIxmjh8LnKd?s=cl&p=a&mlu=4' },
  { name: 'Yogyakarta', link: 'https://chat.whatsapp.com/JNbrP7sQwRpHTTBK1ixvZX?s=cl&p=a&mlu=4' },
];

export const bookingTypeLabels: Record<BookingType, string> = {
  'pasien': 'Pendampingan Pasien',
  'bayi-anak-lansia': 'Pendampingan Bayi/Anak/Lansia',
  'personal-care': 'Personal Care & Hygiene',
  'jastip-anjem': 'Jastip & Anjem',
  'lainnya': 'Layanan Lainnya',
};

export const emptyBooking: BookingData = { bookingType: 'pasien', category: 'jauh', ordererName: '', phone: '', relation: '', area: '', email: '', personName: '', age: '', gender: '', condition: '', complaint: '', diagnosis: '', specialNeeds: '', mobility: '', healthStatus: '', healthDetail: '', healthNote: '', locationType: '', locationName: '', building: '', room: '', roomNumber: '', floor: '', address: '', rtRw: '', village: '', district: '', city: '', landmark: '', careType: '', careNeeds: '', indoorOutdoor: 'indoor', indoorLocation: '', activity: '', oneLocation: '', pickup: '', pickupAddress: '', firstDestination: '', firstDestinationAddress: '', transport: '', pickupHelp: '', destinations: [], crewPreference: 'Tidak ada preferensi', startDate: '', endDate: '', startTime: '', endTime: '', scheduleStatus: 'Sudah pasti', extra: '', hygieneSubservice: '', hygieneClientType: '', hygieneLocation: '', hygieneAddress: '', jastipMode: '', jastipItems: '', jastipType: '', jastipQuantity: '', jastipDestination: '', jastipScheduleType: '', jastipEta: '', vehicle: '', otherDescription: '' };

export function isCareBooking(type: BookingType): boolean { return type === 'pasien' || type === 'bayi-anak-lansia'; }
export function routesToGroup(data: BookingData): boolean { return !isCareBooking(data.bookingType) || data.category === 'dadakan'; }

export function todayInJakarta(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function addDays(key: string, days: number): string { const value = new Date(`${key}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
export function dayLabel(key: string): string { if (!key) return 'Pilih tanggal'; return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${key}T12:00:00Z`)); }
export function durationLabel(data: BookingData): string { if (!data.startDate || !data.startTime || !data.endTime) return 'Belum dihitung'; const start = new Date(`${data.startDate}T${data.startTime}:00`); const endDate = data.endDate || data.startDate; const end = new Date(`${endDate}T${data.endTime}:00`); if (end <= start) end.setDate(end.getDate() + 1); const minutes = Math.round((end.getTime() - start.getTime()) / 60000); if (minutes <= 0) return 'Waktu tidak valid'; const days = Math.floor(minutes / 1440); const hours = Math.floor((minutes % 1440) / 60); const mins = minutes % 60; return [days ? `${days} hari` : '', hours ? `${hours} jam` : '', mins ? `${mins} menit` : ''].filter(Boolean).join(' '); }
export function categoryText(category: BookingCategory): string { return category === 'jauh' ? 'Ajukan dari jauh-jauh hari' : category === 'h1' ? 'Ajukan permintaan H-1' : 'Ajukan permintaan dadakan di hari H'; }
function compact(value: string): string { return value.trim() || '-'; }
function itemsText(cart: CartItem[]): string { return cart.length ? cart.map((item, index) => `${index + 1}. ${item.name} × ${item.quantity} (${item.options}${item.note ? `; ${item.note}` : ''})`).join('\n') : '-'; }

export function validateBooking(data: BookingData, today: string): string | null {
  if (data.startDate && data.startDate < today) return 'Tanggal tidak boleh sebelum hari ini.';
  if (data.bookingType === 'jastip-anjem' && !data.jastipMode) return 'Pilih Jastip atau Anjem terlebih dahulu.';
  if (!isCareBooking(data.bookingType)) return null;
  if (data.category === 'h1' && data.startDate !== addDays(today, 1)) return 'Permintaan H-1 harus tanggal besok (WIB).';
  if (data.category === 'dadakan' && data.startDate !== today) return 'Permintaan dadakan harus tanggal hari ini (WIB).';
  if (data.category === 'jauh' && data.startDate <= addDays(today, 1)) return 'Ajukan dari jauh-jauh hari harus lebih dari satu hari dari tanggal pengajuan.';
  if (durationLabel(data) === 'Waktu tidak valid') return 'Jam selesai harus lebih lambat dari jam mulai, atau gunakan tanggal selesai untuk jadwal beberapa hari.';
  return null;
}

const closing = 'Mohon konfirmasi tarif, jadwal, dan ketersediaan crew. Pengajuan ini belum merupakan booking terkonfirmasi.';
const orderer = (data: BookingData) => `DATA PEMESAN\nNama: ${compact(data.ordererName)}\nWhatsApp: ${compact(data.phone)}\nWilayah: ${compact(data.area)}`;
const simpleSchedule = (data: BookingData) => `JADWAL\nTanggal: ${dayLabel(data.startDate)}\nJam: ${compact(data.startTime)}${data.endTime ? ` - ${data.endTime}` : ''}`;

function careMessage(data: BookingData, cart: CartItem[]): string {
  const location = data.indoorOutdoor === 'outdoor' ? `Penjemputan: ${compact(data.pickup)}; ${compact(data.pickupAddress)}\nTujuan pertama: ${compact(data.firstDestination)}; ${compact(data.firstDestinationAddress)}\nTujuan tambahan:\n${data.destinations.length ? data.destinations.map((item, i) => `${i + 1}. ${compact(item.name)} — ${compact(item.address)} — ${compact(item.note)}`).join('\n') : '-'}` : `Jenis lokasi: ${compact(data.locationType)}\nNama lokasi: ${compact(data.locationName)}\nAlamat: ${compact(data.address)}\nDetail: ${compact([data.building, data.room, data.roomNumber && `Kamar ${data.roomNumber}`, data.floor && `Lantai ${data.floor}`, data.village, data.district, data.city, data.landmark].filter(Boolean).join(', '))}`;
  const person = data.bookingType === 'pasien' ? `Pasien: ${compact(data.personName)}; usia ${compact(data.age)}; ${compact(data.gender)}\nKondisi: ${compact(data.condition)}\nKeluhan: ${compact(data.complaint)}\nDiagnosis/riwayat: ${compact(data.diagnosis)}\nKebutuhan khusus: ${compact(data.specialNeeds)}\nMobilitas: ${compact(data.mobility)}\nPenyakit menular/kondisi khusus: ${compact(data.healthStatus)}${data.healthStatus === 'Ada' ? ` — ${compact(data.healthDetail)}` : ''}\nKeterangan kesehatan: ${compact(data.healthNote)}` : `Yang didampingi: ${compact(data.personName)}; usia ${compact(data.age)}; ${compact(data.gender)}\nKondisi: ${compact(data.condition)}\nKebutuhan khusus: ${compact(data.specialNeeds)}\nCatatan: ${compact(data.careNeeds)}`;
  const care = data.bookingType === 'bayi-anak-lansia' ? `Mode: ${data.indoorOutdoor.toUpperCase()}\nAktivitas: ${compact(data.activity)}\nTransportasi: ${compact(data.transport)}\nPreferensi crew: ${compact(data.crewPreference)}` : `Jenis pendampingan: ${compact(data.careType)}\nKebutuhan selama pendampingan: ${compact(data.careNeeds)}`;
  const opening = data.category === 'jauh' ? `Izin bertanya, apabila saya mengajukan pendampingan di tanggal ${dayLabel(data.startDate)}, kira-kira biayanya berapa ya?` : data.category === 'h1' ? 'Halo Admin Dampingcare, saya ingin mengajukan permintaan pendampingan untuk besok.' : 'Halo Admin Dampingcare, saya mengajukan permintaan dadakan hari ini.';
  return `${opening}\n\nJENIS PENGAJUAN\n${categoryText(data.category)}\nJenis layanan: ${bookingTypeLabels[data.bookingType]}\n\n${orderer(data)}\nEmail: ${compact(data.email)}\nHubungan: ${compact(data.relation)}\n\nDATA YANG DIDAMPINGI\n${person}\n\nLOKASI\n${location}\n\nDETAIL PENDAMPINGAN\nLayanan:\n${itemsText(cart)}\n${care}\nCatatan tambahan: ${compact(data.extra)}\n\nJADWAL\nTanggal: ${dayLabel(data.startDate)}${data.endDate ? ` sampai ${dayLabel(data.endDate)}` : ''}\nJam: ${compact(data.startTime)} - ${compact(data.endTime)}\nDurasi: ${durationLabel(data)}\nStatus jadwal: ${compact(data.scheduleStatus)}\n\n${closing}`;
}

function hygieneMessage(data: BookingData): string {
  return `Halo Admin Dampingcare, saya ingin mengajukan layanan Personal Care & Hygiene.\n\n${orderer(data)}\n\nDETAIL LAYANAN\nSublayanan: ${compact(data.hygieneSubservice)}\nUntuk: ${compact(data.hygieneClientType)}\nJenis lokasi: ${compact(data.hygieneLocation)}\nAlamat: ${compact(data.hygieneAddress)}\n\n${simpleSchedule(data)}\nCatatan: ${compact(data.extra)}\n\n${closing}`;
}

function jastipMessage(data: BookingData): string {
  return `Halo Admin Dampingcare, saya ingin mengajukan layanan Jastip.\n\n${orderer(data)}\n\nDETAIL JASTIP\nTitip apa: ${compact(data.jastipItems)}\nJenis barang: ${compact(data.jastipType)}\nJumlah: ${compact(data.jastipQuantity)}\nAntar ke: ${compact(data.jastipDestination)}\nWaktu pesan: ${compact(data.jastipScheduleType)}\n\n${simpleSchedule(data)}\nPerkiraan jam sampai: ${compact(data.jastipEta)}\nCatatan: ${compact(data.extra)}\n\n${closing}`;
}

function anjemMessage(data: BookingData): string {
  return `Halo Admin Dampingcare, saya ingin mengajukan layanan Anjem.\n\n${orderer(data)}\n\nDETAIL ANJEM\nKendaraan: ${compact(data.vehicle)}\nJemput dari: ${compact(data.pickup)}\nAlamat jemput: ${compact(data.pickupAddress)}\nAntar ke: ${compact(data.firstDestination)}\nAlamat tujuan: ${compact(data.firstDestinationAddress)}\nWaktu pesan: ${compact(data.jastipScheduleType)}\n\n${simpleSchedule(data)}\nPerkiraan jam sampai: ${compact(data.jastipEta)}\nCatatan: ${compact(data.extra)}\n\n${closing}`;
}

function otherMessage(data: BookingData): string {
  return `Halo Admin Dampingcare, saya ingin mengajukan ${bookingTypeLabels.lainnya}.\n\n${orderer(data)}\n\nDETAIL LAYANAN\nKebutuhan: ${compact(data.otherDescription)}\n\n${simpleSchedule(data)}\nCatatan: ${compact(data.extra)}\n\n${closing}`;
}

export function buildMessage(data: BookingData, cart: CartItem[]): string {
  const cartBlock = cart.length ? `\n\nLAYANAN DARI KERANJANG\n${itemsText(cart)}` : '';
  switch (data.bookingType) {
    case 'pasien':
    case 'bayi-anak-lansia': return careMessage(data, cart);
    case 'personal-care': return hygieneMessage(data) + cartBlock;
    case 'jastip-anjem': return (data.jastipMode === 'anjem' ? anjemMessage(data) : jastipMessage(data)) + cartBlock;
    case 'lainnya': return otherMessage(data) + cartBlock;
  }
}
