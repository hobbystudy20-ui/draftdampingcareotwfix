import { CareTimingFields, Field, Fieldset, type DestinationFormProps } from '@/booking/FormFields';
import type { Destination } from '@/booking/bookingModel';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

export function CareForm({ data, update, today, setData }: DestinationFormProps) {
  const changeDestination = (index: number, key: keyof Destination, value: string) => setData((current) => ({ ...current, destinations: current.destinations.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  const moveDestination = (index: number, direction: -1 | 1) => setData((current) => { const next = [...current.destinations]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return { ...current, destinations: next }; });
  const removeDestination = (index: number) => setData((current) => ({ ...current, destinations: current.destinations.filter((_, i) => i !== index) }));
  const addDestination = () => setData((current) => ({ ...current, destinations: [...current.destinations, { name: '', address: '', note: '' }] }));

  return <>
    <Fieldset title="Data yang didampingi">
      <div className="form-grid">
        <Field label="Nama lengkap *" value={data.personName} onChange={(value) => update('personName', value)} required />
        <Field label="Usia *" value={data.age} onChange={(value) => update('age', value)} required />
        <Field label="Jenis kelamin *" value={data.gender} onChange={(value) => update('gender', value)} options={['Perempuan', 'Laki-laki', 'Tidak ingin menyebutkan']} required />
        <Field label="Kondisi saat ini *" value={data.condition} onChange={(value) => update('condition', value)} required />
        <Field label="Kebutuhan khusus" value={data.specialNeeds} onChange={(value) => update('specialNeeds', value)} />
        <Field label="Catatan tambahan" value={data.careNeeds} onChange={(value) => update('careNeeds', value)} />
      </div>
    </Fieldset>
    <Fieldset title="Jenis pendampingan">
      <div className="booking-choice-grid">
        <button type="button" className={data.indoorOutdoor === 'indoor' ? 'selected' : ''} onClick={() => update('indoorOutdoor', 'indoor')}>INDOOR<small>Di dalam ruangan atau tempat tinggal</small></button>
        <button type="button" className={data.indoorOutdoor === 'outdoor' ? 'selected' : ''} onClick={() => update('indoorOutdoor', 'outdoor')}>OUTDOOR<small>Di luar ruangan atau aktivitas luar</small></button>
      </div>
      {data.indoorOutdoor === 'indoor' ? <div className="form-grid">
        <Field label="Jenis lokasi indoor *" value={data.indoorLocation} onChange={(value) => update('indoorLocation', value)} options={['Rumah', 'Kost', 'Apartemen', 'Hotel', 'Rumah keluarga', 'Lokasi indoor lainnya']} required />
        <Field label="Nama lokasi *" value={data.locationName} onChange={(value) => update('locationName', value)} required />
        <Field label="Alamat lengkap *" value={data.address} onChange={(value) => update('address', value)} textarea required />
        <Field label="Patokan lokasi" value={data.landmark} onChange={(value) => update('landmark', value)} />
        <Field label="Aktivitas yang didampingi *" value={data.activity} onChange={(value) => update('activity', value)} textarea required />
        <Field label="Hanya satu lokasi? *" value={data.oneLocation} onChange={(value) => update('oneLocation', value)} options={['Ya', 'Tidak']} required />
      </div> : <div className="form-grid">
        <Field label="Aktivitas outdoor *" value={data.activity} onChange={(value) => update('activity', value)} options={['Rekreasi', 'Taman atau ruang terbuka', 'Mall', 'Tempat wisata', 'Acara keluarga', 'Aktivitas lainnya', 'Pengantaran ke lokasi tertentu']} required />
        <Field label="Moda transportasi" value={data.transport} onChange={(value) => update('transport', value)} options={['Kendaraan keluarga', 'Transportasi umum', 'Transportasi online', 'Kendaraan crew jika tersedia', 'Lainnya']} />
        <Field label="Lokasi penjemputan *" value={data.pickup} onChange={(value) => update('pickup', value)} required />
        <Field label="Alamat penjemputan *" value={data.pickupAddress} onChange={(value) => update('pickupAddress', value)} textarea required />
        <Field label="Tujuan pertama *" value={data.firstDestination} onChange={(value) => update('firstDestination', value)} required />
        <Field label="Alamat tujuan pertama *" value={data.firstDestinationAddress} onChange={(value) => update('firstDestinationAddress', value)} textarea required />
        <Field label="Bantuan penjemputan/pengantaran?" value={data.pickupHelp} onChange={(value) => update('pickupHelp', value)} options={['Ya', 'Tidak']} />
        <div className="destination-box"><strong>Tujuan tambahan</strong><span>Tambahkan beberapa tujuan dan ubah urutannya.</span>{data.destinations.map((item, index) => <div className="destination-row" key={`${index}-${item.name}`}><GripVertical size={15} /><div><input placeholder={`Nama tujuan ${index + 2}`} value={item.name} onChange={(event) => changeDestination(index, 'name', event.target.value)} /><input placeholder="Alamat lengkap" value={item.address} onChange={(event) => changeDestination(index, 'address', event.target.value)} /><input placeholder="Catatan aktivitas" value={item.note} onChange={(event) => changeDestination(index, 'note', event.target.value)} /></div><button type="button" onClick={() => moveDestination(index, -1)} aria-label="Naikkan tujuan">↑</button><button type="button" onClick={() => moveDestination(index, 1)} aria-label="Turunkan tujuan">↓</button><button type="button" onClick={() => removeDestination(index)} aria-label="Hapus tujuan"><Trash2 size={14} /></button></div>)}<button type="button" className="add-destination" onClick={addDestination}><Plus size={15} /> TAMBAH TUJUAN</button></div>
      </div>}
    </Fieldset>
    <CareTimingFields data={data} update={update} today={today} />
    <Field label="Catatan tambahan" value={data.extra} onChange={(value) => update('extra', value)} textarea />
  </>;
}
