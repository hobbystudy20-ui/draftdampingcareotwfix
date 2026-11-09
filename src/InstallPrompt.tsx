import { useEffect, useState } from 'react';
import { Download, Apple, Share, Home, X, Smartphone } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document)) return 'ios';
  return 'other';
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}

export function InstallPrompt() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    const p = detectPlatform();
    setPlatform(p);

    const dismissed = localStorage.getItem('dampingcare-install-dismissed');
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      if (!dismissed) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (p === 'ios' && !dismissed) setShowBanner(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setShowBanner(false);
    localStorage.setItem('dampingcare-install-dismissed', '1');
  };

  const handleInstallClick = () => {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(() => { setDeferred(null); setShowModal(false); });
    } else {
      setShowModal(true);
    }
  };

  if (isStandalone()) return null;

  return <>
    {showBanner && <button className="install-banner" onClick={() => { setShowBanner(false); handleInstallClick(); }}>
      <span className="install-banner-text">
        <Download size={16} />
        Ingin Install? Klik Di Sini ya!
      </span>
      <span className="install-banner-close" onClick={(e) => { e.stopPropagation(); dismiss(); }}><X size={14} /></span>
    </button>}

    {showModal && <div className="install-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowModal(false)}>
      <div className="install-modal">
        <button className="install-modal-close" onClick={() => setShowModal(false)} aria-label="Tutup"><X size={20} /></button>
        <div className="install-modal-icon"><Smartphone size={28} /></div>
        <h2>Install Dampingcare</h2>
        <p className="install-modal-sub">Tambahkan ke layar utama agar lebih cepat diakses tanpa browser.</p>

        <div className="install-tabs">
          <button className={platform === 'ios' ? 'active' : ''} onClick={() => setPlatform('ios')}><Apple size={16} /> iOS</button>
          <button className={platform === 'android' ? 'active' : ''} onClick={() => setPlatform('android')}>Android</button>
        </div>

        {platform === 'ios' ? <ol className="install-steps">
          <li><span>1</span><div><strong>Buka via Safari</strong><small>Install hanya bisa dilakukan dari browser Safari di iPhone/iPad.</small></div></li>
          <li><span>2</span><div><strong>Tap tombol Share</strong><small><Share size={14} /> Ikon kotak dengan panah ke atas di bilah bawah Safari.</small></div></li>
          <li><span>3</span><div><strong>Pilih "Tambah ke Layar Utama"</strong><small><PlusIcon /> Gulir ke bawah lalu pilih opsi tersebut.</small></div></li>
          <li><span>4</span><div><strong>Tap "Tambah"</strong><small>Ikon Dampingcare muncul di layar utama dan bisa dibuka seperti aplikasi.</small></div></li>
        </ol> : <ol className="install-steps">
          <li><span>1</span><div><strong>Buka via Chrome</strong><small>Install hanya bisa dilakukan dari browser Google Chrome di Android.</small></div></li>
          <li><span>2</span><div><strong>Tap menu titik tiga</strong><small> <MenuIcon /> Ikon di pojok kanan atas browser Chrome.</small></div></li>
          <li><span>3</span><div><strong>Pilih "Tambah ke Layar Utama"</strong><small>atau "Install aplikasi" dari menu yang muncul.</small></div></li>
          <li><span>4</span><div><strong>Tap "Install" / "Tambah"</strong><small><Home size={14} /> Dampingcare muncul di layar utama dan bisa dibuka seperti aplikasi.</small></div></li>
        </ol>}

        {deferred && platform === 'android' && <button className="primary-button full-width install-modal-action" onClick={handleInstallClick}><Download size={16} /> Install sekarang</button>}
        <button className="quiet-button full-width" onClick={() => { setShowModal(false); dismiss(); }}>Nanti saja</button>
      </div>
    </div>}
  </>;
}

function PlusIcon() { return <span style={{ fontWeight: 700 }}>＋</span>; }
function MenuIcon() { return <span style={{ fontWeight: 700, letterSpacing: '-2px' }}>⋮</span>; }
