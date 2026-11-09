import { CareTimingFields, Field, Fieldset, type FormProps } from '@/booking/FormFields';

export function PatientForm({ data, update, today }: FormProps) {
  return <>
    <Fieldset title="Data pasien">
      <div className="form-grid">
        <Field label="Nama lengkap pasien *" value={data.personName} onChange={(value) => update('personName', value)} required />
        <Field label="Usia *" value={data.age} onChange={(value) => update('age', value)} required />
        <Field label="Jenis kelamin *" value={data.gender} onChange={(value) => update('gender', value)} options={['Perempuan', 'Laki-laki', 'Tidak ingin menyebutkan']} required />
        <Field label="Kondisi pasien saat ini *" value={data.condition} onChange={(value) => update('condition', value)} required />
        <Field label="Keluhan utama" value={data.complaint} onChange={(value) => update('complaint', value)} />
        <Field label="Diagnosis / riwayat penyakit (jika diketahui)" value={data.diagnosis} onChange={(value) => update('diagnosis', value)} />
        <Field label="Kebutuhan khusus pasien" value={data.specialNeeds} onChange={(value) => update('specialNeeds', value)} />
        <Field label="Kondisi mobilitas" value={data.mobility} onChange={(value) => update('mobility', value)} />
      </div>
    </Fieldset>
    <Fieldset title="Informasi penyakit menular dan kondisi khusus">
      <p className="field-hint">Mohon diisi jujur. Informasi ini membantu admin mempersiapkan pendampingan, bukan penolakan otomatis, dan akan dijaga kerahasiaannya.</p>
      <label className="field"><span>Apakah ada riwayat penyakit menular atau kondisi kesehatan khusus? *</span><select value={data.healthStatus} onChange={(event) => update('healthStatus', event.target.value)} required><option value="">Pilih jawaban</option><option>Tidak ada</option><option>Ada</option><option>Tidak diketahui</option></select></label>
      {data.healthStatus === 'Ada' && <Field label="Mohon sebutkan jenis penyakit atau kondisi kesehatan tersebut *" value={data.healthDetail} onChange={(value) => update('healthDetail', value)} required />}
      <Field label="Keterangan tambahan kondisi pasien" value={data.healthNote} onChange={(value) => update('healthNote', value)} textarea />
      <p className="privacy-copy">Mohon diisi dengan jujur dan sesuai kondisi pasien saat ini. Informasi kesehatan pasien akan dijaga kerahasiaannya.</p>
    </Fieldset>
    <Fieldset title="Lokasi pendampingan">
      <div className="form-grid">
        <Field label="Jenis lokasi *" value={data.locationType} onChange={(value) => update('locationType', value)} options={['Rumah sakit', 'Rumah', 'Kost', 'Klinik', 'Puskesmas', 'Fasilitas kesehatan lainnya', 'Lokasi lainnya']} required />
        <Field label="Nama lokasi / rumah sakit *" value={data.locationName} onChange={(value) => update('locationName', value)} required />
        <Field label="Alamat lengkap *" value={data.address} onChange={(value) => update('address', value)} textarea required />
        <Field label="Gedung / paviliun" value={data.building} onChange={(value) => update('building', value)} />
        <Field label="Ruang perawatan" value={data.room} onChange={(value) => update('room', value)} />
        <Field label="Nomor kamar" value={data.roomNumber} onChange={(value) => update('roomNumber', value)} />
        <Field label="Lantai" value={data.floor} onChange={(value) => update('floor', value)} />
        <Field label="Patokan lokasi" value={data.landmark} onChange={(value) => update('landmark', value)} />
      </div>
    </Fieldset>
    <Fieldset title="Kebutuhan pendampingan">
      <div className="form-grid">
        <Field label="Jenis pendampingan *" value={data.careType} onChange={(value) => update('careType', value)} options={['Rawat inap', 'Kontrol', 'IGD', 'Tindakan', 'Aktivitas harian', 'Kebutuhan lainnya']} required />
        <Field label="Kebutuhan khusus selama pendampingan" value={data.careNeeds} onChange={(value) => update('careNeeds', value)} textarea />
      </div>
    </Fieldset>
    <CareTimingFields data={data} update={update} today={today} />
    <Field label="Catatan tambahan" value={data.extra} onChange={(value) => update('extra', value)} textarea />
  </>;
}
