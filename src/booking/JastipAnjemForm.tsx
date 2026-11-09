import { Field, Fieldset, ScheduleFields, type FormProps } from '@/booking/FormFields';

const bookingTimeOptions = ['Jauh-jauh hari', 'Hari H'];

function JastipFields({ data, update, today }: FormProps) {
  return <>
    <Fieldset title="Detail jastip">
      <div className="form-grid">
        <Field label="Jenis barang *" value={data.jastipType} onChange={(value) => update('jastipType', value)} options={['Makanan', 'Minuman', 'Obat', 'Barang', 'Kebutuhan pasien', 'Lainnya']} required />
        <Field label="Jumlah *" value={data.jastipQuantity} onChange={(value) => update('jastipQuantity', value)} placeholder="Contoh: 2 paket" required />
        <Field label="Titip apa? *" value={data.jastipItems} onChange={(value) => update('jastipItems', value)} textarea placeholder="Sebutkan barang yang dititipkan" required />
        <Field label="Antar ke (alamat lengkap) *" value={data.jastipDestination} onChange={(value) => update('jastipDestination', value)} textarea required />
      </div>
    </Fieldset>
    <Fieldset title="Waktu pesan dan pengantaran">
      <Field label="Pesan kapan? *" value={data.jastipScheduleType} onChange={(value) => update('jastipScheduleType', value)} options={bookingTimeOptions} required />
      <ScheduleFields data={data} update={update} today={today} />
      <Field label="Perkiraan jam sampai" type="time" value={data.jastipEta} onChange={(value) => update('jastipEta', value)} />
    </Fieldset>
  </>;
}

function AnjemFields({ data, update, today }: FormProps) {
  return <>
    <Fieldset title="Kendaraan">
      <div className="booking-choice-grid">
        <button type="button" className={data.vehicle === 'Mobil' ? 'selected' : ''} onClick={() => update('vehicle', 'Mobil')}>Mobil<small>Antar-jemput dengan mobil</small></button>
        <button type="button" className={data.vehicle === 'Motor' ? 'selected' : ''} onClick={() => update('vehicle', 'Motor')}>Motor<small>Antar-jemput dengan motor</small></button>
      </div>
    </Fieldset>
    <Fieldset title="Rute antar-jemput">
      <div className="form-grid">
        <Field label="Dijemput dari (titik jemput) *" value={data.pickup} onChange={(value) => update('pickup', value)} required />
        <Field label="Alamat jemput lengkap *" value={data.pickupAddress} onChange={(value) => update('pickupAddress', value)} textarea required />
        <Field label="Diantar ke (tujuan) *" value={data.firstDestination} onChange={(value) => update('firstDestination', value)} required />
        <Field label="Alamat tujuan lengkap *" value={data.firstDestinationAddress} onChange={(value) => update('firstDestinationAddress', value)} textarea required />
      </div>
    </Fieldset>
    <Fieldset title="Waktu pesan dan pengantaran">
      <Field label="Pesan kapan? *" value={data.jastipScheduleType} onChange={(value) => update('jastipScheduleType', value)} options={bookingTimeOptions} required />
      <ScheduleFields data={data} update={update} today={today} />
      <Field label="Perkiraan jam sampai" type="time" value={data.jastipEta} onChange={(value) => update('jastipEta', value)} />
    </Fieldset>
  </>;
}

export function JastipAnjemForm(props: FormProps) {
  const { data, update } = props;
  return <>
    <Fieldset title="Pilih layanan">
      <div className="booking-choice-grid">
        <button type="button" className={data.jastipMode === 'jastip' ? 'selected' : ''} onClick={() => update('jastipMode', 'jastip')}>Jastip<small>Titip beli atau titip antar barang</small></button>
        <button type="button" className={data.jastipMode === 'anjem' ? 'selected' : ''} onClick={() => update('jastipMode', 'anjem')}>Anjem<small>Antar-jemput dengan mobil atau motor</small></button>
      </div>
    </Fieldset>
    {data.jastipMode === 'jastip' && <JastipFields {...props} />}
    {data.jastipMode === 'anjem' && <AnjemFields {...props} />}
  </>;
}
