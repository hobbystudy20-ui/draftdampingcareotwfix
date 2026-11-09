import { hygieneServices } from '@/data/services';
import { Field, Fieldset, ScheduleFields, type FormProps } from '@/booking/FormFields';

export function HygieneForm({ data, update, today }: FormProps) {
  return <>
    <Fieldset title="Detail Personal Care & Hygiene">
      <div className="form-grid">
        <Field label="Sublayanan *" value={data.hygieneSubservice} onChange={(value) => update('hygieneSubservice', value)} options={hygieneServices.map((item) => item.name)} required />
        <Field label="Untuk *" value={data.hygieneClientType} onChange={(value) => update('hygieneClientType', value)} options={['Pasien', 'Non-pasien']} required />
        <Field label="Jenis lokasi *" value={data.hygieneLocation} onChange={(value) => update('hygieneLocation', value)} options={['Rumah', 'Kost', 'Rumah sakit', 'Lainnya']} required />
        <Field label="Alamat lengkap *" value={data.hygieneAddress} onChange={(value) => update('hygieneAddress', value)} textarea required />
      </div>
    </Fieldset>
    <Fieldset title="Tanggal dan jam">
      <ScheduleFields data={data} update={update} today={today} />
    </Fieldset>
    <Field label="Catatan tambahan" value={data.extra} onChange={(value) => update('extra', value)} textarea />
  </>;
}
