import { useEffect } from 'react';
import { QrCode, X } from 'lucide-react';

export function PaymentQrisModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-[fadeIn_.18s_ease]" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true" aria-labelledby="qris-modal-title">
    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
      <button onClick={onClose} aria-label="Tutup QRIS" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"><X size={18} /></button>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><QrCode size={20} /></span>
        <div>
          <h2 id="qris-modal-title" className="text-lg font-bold text-slate-900">Pembayaran QRIS</h2>
          <p className="text-xs text-slate-600">QRIS resmi Dampingcare, bebas biaya admin bank.</p>
        </div>
      </div>
      <img src="/IMG_20261027_143504_594.webp" alt="QRIS resmi Dampingcare" className="mx-auto w-full rounded-xl border border-slate-200" />
      <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">Setelah membayar, kirim bukti pembayaran ke Admin Utama untuk konfirmasi.</p>
    </div>
  </div>;
}
