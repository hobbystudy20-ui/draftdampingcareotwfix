import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { areas, type BookingData, dayLabel, durationLabel } from '@/booking/bookingModel';

export type FormProps = { data: BookingData; today: string; update: (key: keyof BookingData, value: string) => void };
export type DestinationFormProps = FormProps & { setData: Dispatch<SetStateAction<BookingData>> };

export function Fieldset({ title, children }: { title: string; children: ReactNode }) { return <fieldset className="booking-fieldset"><legend>{title}</legend>{children}</fieldset>; }

export function Field({ label, value, onChange, type = 'text', options, placeholder, required, textarea, min, readOnly }: { label: string; value: string; onChange: (value: string) => void; type?: string; options?: string[]; placeholder?: string; required?: boolean; textarea?: boolean; min?: string; readOnly?: boolean }) { return <label className="field"><span>{label}{required && !label.endsWith('*') ? ' *' : ''}</span>{options ? <select value={value} onChange={(event) => onChange(event.target.value)} required={required}><option value="">Pilih</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} rows={3} readOnly={readOnly} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} min={min} readOnly={readOnly} />}</label>; }

export function OrdererFields({ data, update, isCare }: { data: BookingData; update: FormProps['update']; isCare: boolean }) {
  return <Fieldset title="Data pemesan"><div className="form-grid">
    <Field label="Nama lengkap pemesan *" value={data.ordererName} onChange={(value) => update('ordererName', value)} required />
    <Field label="Nomor WhatsApp aktif *" type="tel" value={data.phone} onChange={(value) => update('phone', value)} required />
    {isCare && <Field label="Hubungan dengan pasien / yang didampingi *" value={data.relation} onChange={(value) => update('relation', value)} required />}
    <Field label="Wilayah layanan *" value={data.area} onChange={(value) => update('area', value)} options={areas.map((area) => area.name)} required />
    {isCare && <Field label="Email (opsional)" type="email" value={data.email} onChange={(value) => update('email', value)} />}
  </div></Fieldset>;
}

export function ScheduleFields({ data, update, today, requireEnd = false }: FormProps & { requireEnd?: boolean }) {
  return <div className="form-grid">
    <Field label="Tanggal *" type="date" value={data.startDate} onChange={(value) => update('startDate', value)} min={today} required />
    <Field label="Hari otomatis" value={data.startDate ? dayLabel(data.startDate) : ''} onChange={() => undefined} readOnly />
    <Field label="Jam mulai *" type="time" value={data.startTime} onChange={(value) => update('startTime', value)} required />
    <Field label={requireEnd ? 'Jam selesai *' : 'Jam selesai (opsional)'} type="time" value={data.endTime} onChange={(value) => update('endTime', value)} required={requireEnd} />
  </div>;
}

export function CareTimingFields({ data, update, today }: FormProps) {
  const categories = [['jauh', 'Ajukan dari jauh-jauh hari'], ['h1', 'Ajukan permintaan H-1'], ['dadakan', 'Ajukan permintaan dadakan di hari H']] as const;
  const hint = data.category === 'jauh' ? 'lebih dari satu hari dari tanggal pengajuan' : data.category === 'h1' ? 'tepat besok' : 'hari ini';
  return <Fieldset title="Jadwal pendampingan">
    <label className="field"><span>Kategori waktu pengajuan *</span><select value={data.category} onChange={(event) => update('category', event.target.value)}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <p className="field-hint">Tanggal harus {hint} berdasarkan WIB.</p>
    <div className="form-grid">
      <Field label="Tanggal mulai *" type="date" value={data.startDate} onChange={(value) => update('startDate', value)} min={today} required />
      <Field label="Hari otomatis" value={data.startDate ? dayLabel(data.startDate) : ''} onChange={() => undefined} readOnly />
      <Field label="Jam mulai *" type="time" value={data.startTime} onChange={(value) => update('startTime', value)} required />
      <Field label="Tanggal selesai" type="date" value={data.endDate} onChange={(value) => update('endDate', value)} min={data.startDate || today} />
      <Field label="Jam selesai *" type="time" value={data.endTime} onChange={(value) => update('endTime', value)} required />
      <Field label="Status jadwal" value={data.scheduleStatus} onChange={(value) => update('scheduleStatus', value)} options={['Sudah pasti', 'Masih perkiraan']} required />
    </div>
    <div className="duration-card"><span className="clock-icon">◷</span> Durasi otomatis: <strong>{durationLabel(data)}</strong></div>
  </Fieldset>;
}
