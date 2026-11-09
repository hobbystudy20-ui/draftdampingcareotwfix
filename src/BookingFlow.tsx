import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Clipboard, Copy, MessageCircle, Send, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { ADMIN_URL, areas, bookingTypeLabels, buildMessage, categoryText, dayLabel, emptyBooking, isCareBooking, routesToGroup, todayInJakarta, validateBooking, type BookingData, type BookingType, type CartItem } from '@/booking/bookingModel';
import { Fieldset, OrdererFields, type DestinationFormProps, type FormProps } from '@/booking/FormFields';
import { PatientForm } from '@/booking/PatientForm';
import { CareForm } from '@/booking/CareForm';
import { HygieneForm } from '@/booking/HygieneForm';
import { JastipAnjemForm } from '@/booking/JastipAnjemForm';
import { OtherForm } from '@/booking/OtherForm';

export function BookingFlow({ cart, subtotal, updateQty, removeItem, clearCart, onClose, onSent }: { cart: CartItem[]; subtotal: number; updateQty: (key: string, amount: number) => void; removeItem: (key: string) => void; clearCart: () => void; onClose: () => void; onSent: (url: string) => void }) {
  const [stage, setStage] = useState<'cart' | 'form' | 'review' | 'sudden'>('cart');
  const [data, setData] = useState<BookingData>(() => { try { return { ...emptyBooking, ...(JSON.parse(localStorage.getItem('dampingcare-booking') || '{}') as Partial<BookingData>) }; } catch { return emptyBooking; } });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { localStorage.setItem('dampingcare-booking', JSON.stringify(data)); }, [data]);
  const update = (key: keyof BookingData, value: string) => setData((current) => ({ ...current, [key]: value }));
  const today = todayInJakarta();
  const careType = isCareBooking(data.bookingType);
  const message = useMemo(() => buildMessage(data, cart), [data, cart]);
  const typeButtons: { type: BookingType; label: string }[] = [
    { type: 'pasien', label: 'Pendampingan Pasien' },
    { type: 'bayi-anak-lansia', label: 'Pendampingan Bayi/Anak/Lansia' },
    { type: 'personal-care', label: 'Personal Care & Hygiene' },
    { type: 'jastip-anjem', label: 'Jastip & Anjem' },
    { type: 'lainnya', label: 'Layanan Lainnya' },
  ];
  const formProps: FormProps = { data, today, update };
  const destinationFormProps: DestinationFormProps = { ...formProps, setData };
  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (careType && !cart.length) { setError('Tambahkan minimal satu layanan ke keranjang.'); return; }
    if (!data.ordererName || !data.phone || !data.area) { setError('Lengkapi nama, WhatsApp, dan wilayah pemesan.'); return; }
    if (!data.startDate || !data.startTime) { setError('Pilih tanggal dan jam mulai.'); return; }
    if (data.bookingType === 'personal-care' && !data.hygieneSubservice) { setError('Pilih sublayanan Personal Care.'); return; }
    if (data.bookingType === 'jastip-anjem') {
      if (!data.jastipMode) { setError('Pilih Jastip atau Anjem.'); return; }
      if (data.jastipMode === 'jastip' && (!data.jastipType || !data.jastipQuantity || !data.jastipDestination)) { setError('Lengkapi jenis, jumlah, dan tujuan jastip.'); return; }
      if (data.jastipMode === 'anjem' && (!data.pickup || !data.firstDestination || !data.vehicle)) { setError('Lengkapi kendaraan, titik jemput, dan tujuan anjem.'); return; }
    }
    if (data.bookingType === 'lainnya' && !data.otherDescription) { setError('Jelaskan kebutuhan layanan lainnya.'); return; }
    const validationError = validateBooking(data, today);
    if (validationError) { setError(validationError); return; }
    setStage('review');
  };
  const openWhatsApp = () => { onSent(`${ADMIN_URL}?text=${encodeURIComponent(message)}`); };
  const copySummary = async () => { await navigator.clipboard.writeText(message); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  const typeLabel = data.bookingType === 'jastip-anjem' ? (data.jastipMode === 'anjem' ? 'Anjem' : data.jastipMode === 'jastip' ? 'Jastip' : 'Jastip & Anjem') : bookingTypeLabels[data.bookingType];

  return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="booking-drawer">
    <div className="drawer-head"><div><span className="section-kicker">Pesanan Dampingcare</span><h2>{stage === 'cart' ? 'Keranjang' : stage === 'form' ? 'Formulir booking' : stage === 'review' ? 'Periksa kembali' : 'Pengajuan siap dikirim'}</h2></div><button onClick={onClose} aria-label="Tutup pesanan"><X /></button></div>
    {stage === 'cart' && <CartStage cart={cart} subtotal={subtotal} updateQty={updateQty} removeItem={removeItem} clearCart={clearCart} onStart={() => setStage('form')} />}
    {stage === 'form' && <form className="booking-form" onSubmit={submitForm}>
      <button type="button" className="booking-back" onClick={() => setStage('cart')}><ArrowLeft size={15} /> Kembali ke keranjang</button>
      <p className="booking-notice"><ShieldCheck size={16} /> Ini adalah pengajuan permintaan, bukan pembayaran dan belum menjadi booking terkonfirmasi.</p>
      <Fieldset title="Jenis pengajuan">
        <div className="booking-choice-grid">{typeButtons.map((item) => <button type="button" className={data.bookingType === item.type ? 'selected' : ''} key={item.type} onClick={() => update('bookingType', item.type)}>{item.label}</button>)}</div>
      </Fieldset>
      <OrdererFields data={data} update={update} isCare={careType} />
      {data.bookingType === 'pasien' && <PatientForm {...formProps} />}
      {data.bookingType === 'bayi-anak-lansia' && <CareForm {...destinationFormProps} />}
      {data.bookingType === 'personal-care' && <HygieneForm {...formProps} />}
      {data.bookingType === 'jastip-anjem' && <JastipAnjemForm {...formProps} />}
      {data.bookingType === 'lainnya' && <OtherForm {...formProps} />}
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button full-width" type="submit">Periksa ringkasan pengajuan <ArrowLeft size={15} /></button>
    </form>}
    {stage === 'review' && <ReviewStage data={data} cart={cart} message={message} typeLabel={typeLabel} onBack={() => setStage('form')} onSubmit={() => { if (routesToGroup(data)) setStage('sudden'); else openWhatsApp(); }} onCopy={copySummary} copied={copied} />}
    {stage === 'sudden' && <SuddenStage data={data} message={message} onCopy={copySummary} copied={copied} onClose={onClose} />}
  </aside></div>;
}

function CartStage({ cart, subtotal, updateQty, removeItem, clearCart, onStart }: { cart: CartItem[]; subtotal: number; updateQty: (key: string, amount: number) => void; removeItem: (key: string) => void; clearCart: () => void; onStart: () => void }) {
  return <div className="booking-cart-stage">
    <div className="cart-items">{cart.length ? cart.map((item) => <div className="cart-item" key={item.key}><div><strong>{item.name}</strong><small>{item.options}</small>{item.note && <small>Catatan: {item.note}</small>}<div className="quantity"><button onClick={() => updateQty(item.key, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQty(item.key, 1)}>+</button></div></div><div className="item-price"><b>{item.price === null ? 'Admin' : `Rp${(item.price * item.quantity).toLocaleString('id-ID')}`}</b><button onClick={() => removeItem(item.key)} aria-label="Hapus item"><Trash2 size={14} /></button></div></div>) : <div className="empty-cart"><ShoppingBag size={29} /><strong>Keranjang masih kosong</strong><span>Pilih layanan dari katalog untuk mulai memesan, atau lanjut untuk layanan tanpa keranjang.</span></div>}</div>
    {cart.length > 0 && <><button className="clear-cart" onClick={clearCart}>Kosongkan keranjang</button><div className="subtotal"><span>Estimasi subtotal jasa<small>Belum termasuk transportasi</small></span><strong>Rp{subtotal.toLocaleString('id-ID')}</strong></div></>}
    <button className="primary-button full-width" onClick={onStart}>Lanjutkan ke formulir booking <Send size={15} /></button>
    <p className="send-note">Tarif, jadwal, dan ketersediaan crew dikonfirmasi oleh Admin Dampingcare.</p>
  </div>;
}

function ReviewStage({ data, cart, message, typeLabel, onBack, onSubmit, onCopy, copied }: { data: BookingData; cart: CartItem[]; message: string; typeLabel: string; onBack: () => void; onSubmit: () => void; onCopy: () => void; copied: boolean }) {
  const [checks, setChecks] = useState([false, false, false]);
  const allChecked = checks.every(Boolean);
  const careType = isCareBooking(data.bookingType);
  return <div className="review-stage">
    <button className="booking-back" onClick={onBack}><ArrowLeft size={15} /> Ubah data</button>
    <p className="booking-notice"><ShieldCheck size={16} /> Periksa semua informasi sebelum pengajuan dikirim.</p>
    <div className="review-block">
      <strong>{careType ? categoryText(data.category) : typeLabel}</strong>
      <p>{typeLabel}</p>
      {cart.length > 0 && <p>{cart.map((item, i) => `${i + 1}. ${item.name} × ${item.quantity}`).join('\n')}</p>}
      <p>{data.ordererName || '-'} · {data.phone || '-'} · {data.area || '-'}</p>
      <p>{dayLabel(data.startDate)} · {data.startTime || '-'}{data.endTime ? `–${data.endTime}` : ''}</p>
    </div>
    <details open><summary>Lihat pesan WhatsApp lengkap</summary><pre>{message}</pre></details>
    <div className="review-checks">{['Saya memastikan bahwa informasi yang saya isi sudah benar dan sesuai kondisi sebenarnya.', 'Saya memahami bahwa pengajuan ini belum merupakan konfirmasi booking. Jadwal, tarif, dan ketersediaan crew harus dikonfirmasi oleh Admin Dampingcare.', 'Saya menyetujui penggunaan informasi yang saya berikan untuk keperluan administrasi dan persiapan pendampingan. Informasi kesehatan akan dijaga kerahasiaannya.'].map((text, index) => <label key={text}><input type="checkbox" checked={checks[index]} onChange={(event) => setChecks((current) => current.map((item, i) => i === index ? event.target.checked : item))} />{text}</label>)}</div>
    <div className="review-actions">
      <button className="quiet-button" onClick={onCopy}><Copy size={15} /> {copied ? 'Tersalin' : 'Salin ringkasan'}</button>
      <button className="primary-button" disabled={!allChecked} onClick={onSubmit}>{routesToGroup(data) ? 'Lanjut ke pengajuan' : 'Lanjutkan ke WhatsApp'} <MessageCircle size={15} /></button>
    </div>
  </div>;
}

function SuddenStage({ data, message, onCopy, copied, onClose }: { data: BookingData; message: string; onCopy: () => void; copied: boolean; onClose: () => void }) {
  const group = areas.find((item) => item.name === data.area) || areas[0];
  return <div className="sudden-stage">
    <div className="sudden-success"><Check size={23} /><div><h3>PENGAJUAN SIAP DIKIRIM!</h3><p>Pengajuan ini memerlukan koordinasi langsung dengan Admin Utama dan grup WhatsApp wilayah.</p></div></div>
    <div className="sudden-step"><span>LANGKAH 1</span><h3>Hubungi Admin Utama</h3><p>Kirim ringkasan pengajuan melalui WhatsApp Admin Dampingcare.</p><a className="primary-button full-width" href={`${ADMIN_URL}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> HUBUNGI ADMIN UTAMA</a></div>
    <div className="sudden-step"><span>LANGKAH 2</span><h3>Gabung Grup WhatsApp {group.name}</h3><p>Setelah menghubungi admin, bergabunglah ke grup wilayah yang dipilih. Tautan ini hanya undangan; ringkasan harus ditempel dan dikirim manual.</p><a className="quiet-button full-width" href={group.link} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> GABUNG GRUP WHATSAPP {group.name.toUpperCase()}</a></div>
    <button className="quiet-button full-width" onClick={onCopy}><Clipboard size={15} /> {copied ? 'Ringkasan tersalin' : 'SALIN RINGKASAN PENGAJUAN'}</button>
    <p className="sudden-instructions">Urutan yang disarankan: hubungi Admin Utama terlebih dahulu, kembali ke website, gabung grup wilayah, lalu tempelkan ringkasan ke grup.</p>
    <button className="booking-back" onClick={onClose}>Tutup halaman pengajuan</button>
  </div>;
}
