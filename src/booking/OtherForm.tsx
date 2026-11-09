import { Field, Fieldset, ScheduleFields, type FormProps } from '@/booking/FormFields';

export function OtherForm({ data, update, today }: FormProps) {
  return <>
    <Fieldset title="Detail layanan">
      <Field label="Jelaskan kebutuhan layanan *" value={data.otherDescription} onChange={(value) => update('otherDescription', value)} textarea placeholder="Contoh: pendampingan acara, bantuan administrasi, kebutuhan khusus lainnya" required />
    </Fieldset>
    <Fieldset title="Tanggal dan jam">
      <ScheduleFields data={data} update={update} today={today} requireEnd />
    </Fieldset>
    <Field label="Catatan tambahan" value={data.extra} onChange={(value) => update('extra', value)} textarea />
  </>;
}
