import { lazy, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import MagicBento from './components/reactbits/MagicBento';
import TextType from './components/reactbits/TextType';
import PillNav from './components/reactbits/PillNav';
import VariableProximity from './components/reactbits/VariableProximity';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';
import img6 from './img6.jpg';

const GridScan = lazy(() => import('./components/reactbits/GridScan'));
const CircularGallery = lazy(() => import('./components/reactbits/CircularGallery'));
const SoftAurora = lazy(() => import('./components/reactbits/SoftAurora'));

declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

type ImageKey = 'img1' | 'img2' | 'img3' | 'img4' | 'img5' | 'img6' | 'lensCustom';

const imageFallbackMap: Record<ImageKey, string> = {
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  lensCustom: '/optimized/lens-custom-768.webp',
};

const imageWebpSetMap: Record<ImageKey, string> = {
  img1: '/optimized/img1-640.webp 640w, /optimized/img1-960.webp 960w, /optimized/img1-1280.webp 1280w',
  img2: '/optimized/img2-640.webp 640w, /optimized/img2-960.webp 960w, /optimized/img2-1280.webp 1280w',
  img3: '/optimized/img3-640.webp 640w, /optimized/img3-960.webp 960w, /optimized/img3-1280.webp 1280w',
  img4: '/optimized/img4-640.webp 640w, /optimized/img4-960.webp 960w, /optimized/img4-1280.webp 1280w',
  img5: '/optimized/img5-640.webp 640w, /optimized/img5-960.webp 960w, /optimized/img5-1280.webp 1280w',
  img6: '/optimized/img6-640.webp 640w, /optimized/img6-960.webp 960w, /optimized/img6-1280.webp 1280w',
  lensCustom: '/optimized/lens-custom-480.webp 480w, /optimized/lens-custom-768.webp 768w, /optimized/lens-custom-1024.webp 1024w',
};

type ResponsiveImageProps = {
  imageKey: ImageKey;
  alt: string;
  className: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
};

function ResponsiveImage({
  imageKey,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  loading = 'lazy',
  fetchPriority = 'low',
}: ResponsiveImageProps) {
  return (
    <picture>
      <source type="image/webp" srcSet={imageWebpSetMap[imageKey]} sizes={sizes} />
      <img
        src={imageFallbackMap[imageKey]}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}

function useSectionInView(ref: RefObject<HTMLElement | null>, rootMargin = '240px') {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

type LensItem = {
  title: string;
  subtitle: string;
  description: string;
  image: ImageKey;
  badge: string;
  details: string;
};

const navItems = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'kontak', label: 'Kontak' },
];

const lensData: LensItem[] = [
  {
    title: 'Lensa Anti-Radiasi',
    subtitle: 'Digital Comfort Shield',
    description: 'Ideal untuk pengguna laptop dan smartphone dengan paparan layar tinggi.',
    image: 'lensCustom',
    badge: 'Trending',
    details:
      'Lensa anti-radiasi membantu menurunkan silau dari layar digital dan lampu malam. Cocok untuk pekerja kantor, gamer, dan pelajar.',
  },
  {
    title: 'Lensa Photochromic',
    subtitle: 'Adaptive UV Response',
    description: 'Bening di dalam ruangan, otomatis gelap saat terkena UV di luar ruangan.',
    image: 'lensCustom',
    badge: 'Smart Outdoor',
    details:
      'Pilihan praktis untuk pengguna aktif. Satu kacamata untuk indoor dan outdoor tanpa perlu ganti lensa sunglasses terpisah.',
  },
  {
    title: 'Lensa Bluechromic',
    subtitle: 'Dual Blue + UV Protection',
    description: 'Proteksi cahaya biru dan UV dalam satu lensa premium yang adaptif.',
    image: 'lensCustom',
    badge: 'Premium Choice',
    details:
      'Kombinasi fitur anti blue light dan photochromic. Dirancang untuk kenyamanan visual maksimal sepanjang hari.',
  },
];

function GlassesLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="42" height="24" viewBox="0 0 80 48" fill="none" aria-hidden="true">
        <ellipse cx="22" cy="24" rx="18" ry="18" stroke="#3b82f6" strokeWidth="2.8" fill="none" />
        <ellipse cx="58" cy="24" rx="18" ry="18" stroke="#3b82f6" strokeWidth="2.8" fill="none" />
        <line x1="40" y1="22" x2="40" y2="26" stroke="#3b82f6" strokeWidth="2.8" />
        <path d="M4 24 C4 24 0 20 0 24" stroke="#3b82f6" strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <path d="M76 24 C76 24 80 20 80 24" stroke="#3b82f6" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
      <div className="leading-none">
        <div className="text-[11px] tracking-[0.32em] text-blue-100">KHARISMA</div>
        <div className="mt-0.5 text-[9px] tracking-[0.4em] text-blue-300/90">OPTIKAL</div>
      </div>
    </div>
  );
}

export default function KharismaOptikal() {
  const [showLensDetail, setShowLensDetail] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLightMode, setIsLightMode] = useState(false);
  const [startHeavyFx, setStartHeavyFx] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const berandaRef = useRef<HTMLElement>(null);
  const layananRef = useRef<HTMLElement>(null);
  const kontakRef = useRef<HTMLElement>(null);

  const isBerandaInView = useSectionInView(berandaRef);
  const isLayananInView = useSectionInView(layananRef);
  const isKontakInView = useSectionInView(kontakRef);

  const isLowPowerDevice = useMemo(() => {
    const cores = navigator.hardwareConcurrency || 8;
    const memory = navigator.deviceMemory || 8;
    return cores <= 4 || memory <= 4;
  }, []);

  const shouldRunGridScan = !isLightMode && !isLowPowerDevice && startHeavyFx && isBerandaInView;

  const galleryItems = useMemo(
    () => [
      { imageKey: 'img1' as ImageKey, image: img1, text: 'Pemeriksaan' },
      { imageKey: 'img2' as ImageKey, image: img2, text: 'Konsultasi' },
      { imageKey: 'img3' as ImageKey, image: img3, text: 'Alat Modern' },
      { imageKey: 'img4' as ImageKey, image: img4, text: 'Tim Ahli' },
      { imageKey: 'img5' as ImageKey, image: img5, text: 'Diagnostik' },
      { imageKey: 'img6' as ImageKey, image: img6, text: 'Bakti Sosial' },
    ],
    [],
  );

  const bentoCards = useMemo(
    () => [
      {
        title: 'Pemeriksaan Akurat',
        description: 'Pemeriksaan refraksi ditangani tenaga profesional dengan alat modern.',
        label: 'Precision',
      },
      {
        title: 'Frame Elegan',
        description: 'Koleksi frame minimalis, bold, dan modern menyesuaikan karakter wajah.',
        label: 'Style',
      },
      {
        title: 'Lensa Sesuai Aktivitas',
        description: 'Rekomendasi lensa dipilih berdasarkan pola kerja dan gaya hidup harian.',
        label: 'Personalized',
      },
      {
        title: 'After Sales Care',
        description: 'Kontrol kenyamanan dan penyesuaian frame untuk hasil pakai jangka panjang.',
        label: 'Service',
      },
      {
        title: 'Ruang Nyaman',
        description: 'Interior bersih dan tenang untuk pengalaman konsultasi lebih fokus.',
        label: 'Experience',
      },
      {
        title: 'Konsultasi Cepat',
        description: 'Alur pelayanan ringkas untuk tetap efisien tanpa mengurangi akurasi.',
        label: 'Fast Flow',
      },
    ],
    [],
  );

  useEffect(() => {
    gsap.fromTo(
      '.hero-fade',
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
      },
    );
  }, []);

  useEffect(() => {
    const start = () => {
      window.setTimeout(() => setStartHeavyFx(true), 1100);
    };

    if ('requestIdleCallback' in window) {
      const idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(start, { timeout: 1800 });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
        }
      };
    }

    start();
    return () => {};
  }, []);

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(max-width: 1024px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: coarse)'),
    ];

    const updateMode = () => {
      setIsLightMode(mediaQueries.some((query) => query.matches));
    };

    updateMode();
    mediaQueries.forEach((query) => query.addEventListener('change', updateMode));

    return () => {
      mediaQueries.forEach((query) => query.removeEventListener('change', updateMode));
    };
  }, []);

  const navPills = navItems.map((item) => ({
    label: item.label,
    href: `#${item.id}`,
  }));

  const isThemeLight = theme === 'light';
  const heroTopTextClass = isThemeLight ? 'text-blue-900' : 'text-blue-300';
  const heroTitleTextClass = isThemeLight ? 'text-slate-900' : 'text-slate-100';
  const heroTypingTextClass = isThemeLight ? 'text-blue-950/85' : 'text-blue-100/45';
  const heroBodyTextClass = isThemeLight ? 'text-slate-800/95' : 'text-slate-200/85';
  const heroSupportTextClass = isThemeLight ? 'text-blue-900' : 'text-blue-100';
  const heroSupportLabelClass = isThemeLight ? 'text-blue-900/95' : 'text-blue-100/85';
  const heroPrimaryBtnClass = isThemeLight
    ? 'rounded-md border border-blue-700/70 bg-blue-100 px-6 py-3 text-xs uppercase tracking-[0.2em] text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-200'
    : 'rounded-md border border-blue-400/60 bg-blue-500/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500/25';
  const heroSecondaryBtnClass = isThemeLight
    ? 'rounded-md border border-slate-500/40 bg-white/80 px-6 py-3 text-xs uppercase tracking-[0.2em] text-slate-800 transition hover:border-blue-700/40 hover:text-blue-900'
    : 'rounded-md border border-slate-400/30 bg-slate-900/60 px-6 py-3 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-blue-300/40 hover:text-blue-100';

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      <button
        type="button"
        onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        className="fixed bottom-5 right-5 z-[100] rounded-full border border-blue-400/40 bg-slate-900/85 px-4 py-2 text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:bg-slate-800"
      >
        {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>

      <PillNav
        logo={<GlassesLogo />}
        items={navPills}
        activeHref="#beranda"
        baseColor="rgba(2,6,23,0.92)"
        pillColor="rgba(15,23,42,0.92)"
        pillTextColor="#dbeafe"
        hoveredPillTextColor="#0f172a"
        initialLoadAnimation
      />

      <main className="relative z-10">
        <section
          id="beranda"
          ref={berandaRef}
          className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 pb-10 pt-28 text-center sm:px-6 md:px-10 lg:px-16"
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            {isLightMode ? (
              <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.36),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.22),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />
            ) : (
              shouldRunGridScan && (
                <Suspense fallback={<div className="h-full w-full bg-slate-900/60" />}>
                  <GridScan
                    sensitivity={0.5}
                    lineThickness={1}
                    linesColor="#1e3a8a"
                    gridScale={0.1}
                    scanColor="#60a5fa"
                    scanOpacity={0.2}
                    enablePost={false}
                    bloomIntensity={0.18}
                    chromaticAberration={0.0008}
                    noiseIntensity={0.004}
                    scanDirection="pingpong"
                    scanSoftness={1.6}
                    scanGlow={0.4}
                  />
                </Suspense>
              )
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/35 via-slate-950/15 to-slate-950/55" />

          <div ref={heroContainerRef} className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
            <div className={`hero-fade mb-6 ${heroTopTextClass}`}>
              <VariableProximity
                label="Kesehatan Mata Profesional"
                className="text-[11px] uppercase tracking-[0.55em]"
                fromFontVariationSettings="'wght' 500, 'opsz' 9"
                toFontVariationSettings="'wght' 900, 'opsz' 40"
                containerRef={heroContainerRef}
                radius={130}
                falloff="gaussian"
              />
            </div>
            <div className={`hero-fade ${heroTitleTextClass}`}>
              <VariableProximity
                label="Look Stylish"
                className="text-5xl font-semibold leading-[0.95] sm:text-6xl md:text-7xl"
                fromFontVariationSettings="'wght' 600, 'opsz' 20"
                toFontVariationSettings="'wght' 900, 'opsz' 56"
                containerRef={heroContainerRef}
                radius={140}
                falloff="gaussian"
              />
            </div>
            <div className="hero-fade mt-2 min-h-[74px] sm:min-h-[82px] md:min-h-[92px]">
              <TextType
                text="with Kharisma Optikal"
                as="h2"
                className={`typed-3d text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl ${heroTypingTextClass}`}
                typingSpeed={72}
                pauseDuration={3000}
                deletingSpeed={38}
                loop
                showCursor
                cursorCharacter="|"
              />
            </div>
            <div className="hero-fade my-4">
              <GlassesLogo />
            </div>
            <div className={`hero-fade mt-4 max-w-5xl ${heroBodyTextClass}`}>
              <VariableProximity
                label="Penglihatan bukan sekadar kemampuan melihat. Di Kharisma Optikal, kami menyatukan akurasi klinis dan estetika modern agar kamu terlihat rapi, elegan, dan tetap nyaman sepanjang hari, baik untuk aktivitas profesional, perjalanan, maupun gaya hidup digital yang dinamis."
                className="text-base leading-8 sm:text-lg md:text-[1.2rem] md:leading-9"
                fromFontVariationSettings="'wght' 420, 'opsz' 10"
                toFontVariationSettings="'wght' 780, 'opsz' 22"
                containerRef={heroContainerRef}
                radius={95}
                falloff="gaussian"
              />
            </div>
            <div className={`hero-fade mt-4 ${heroSupportTextClass}`}>
              <VariableProximity
                label="Pilih frame yang tepat, tampil percaya diri setiap hari."
                className={`text-sm tracking-[0.08em] sm:text-base ${heroSupportLabelClass}`}
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 900, 'opsz' 30"
                containerRef={heroContainerRef}
                radius={120}
                falloff="gaussian"
              />
            </div>
            <div className="hero-fade mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#layanan"
                className={heroPrimaryBtnClass}
              >
                Layanan Kami
              </a>
              <a
                href="#tentang"
                className={heroSecondaryBtnClass}
              >
                Tentang Kami
              </a>
            </div>
          </div>
        </section>

        <section id="tentang" className="relative w-full overflow-hidden bg-slate-950/70 px-4 py-24 sm:px-6 md:px-10">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.24),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_36%)]" />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Tentang Kami</p>
              <TextType
                as="h2"
                text={['Elegan, Modern, dan Presisi', 'Pelayanan Ramah & Profesional', 'Akurat untuk Kesehatan Mata']}
                typingSpeed={60}
                pauseDuration={1800}
                deletingSpeed={36}
                className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl md:text-5xl"
                showCursor
                cursorCharacter="|"
              />
            </div>

            <MagicBento cards={bentoCards} theme={theme} />
          </div>
        </section>

        <section id="layanan" ref={layananRef} className="relative w-full overflow-hidden px-4 py-24 sm:px-6 md:px-10">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-75">
            {!isLightMode && isLayananInView ? (
              <Suspense fallback={<div className="h-full w-full bg-slate-900/70" />}>
                <SoftAurora
                  speed={0.65}
                  scale={1.75}
                  brightness={1.2}
                  color1="#2563eb"
                  color2="#67e8f9"
                  noiseFrequency={2.2}
                  noiseAmplitude={0.88}
                  bandHeight={0.55}
                  bandSpread={1.03}
                  octaveDecay={0.2}
                  colorSpeed={0.95}
                  enableMouseInteraction={false}
                  mouseInfluence={0.1}
                />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.32),transparent_45%),radial-gradient(circle_at_82%_78%,rgba(14,165,233,0.24),transparent_42%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/55" />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Edukasi Lensa</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-100 md:text-5xl">Flowbite Style Lens Cards</h2>
            </div>

            <div className="mx-auto mb-14 h-[440px] w-full max-w-6xl overflow-hidden rounded-2xl border border-blue-300/20 bg-slate-900/50 sm:h-[500px]">
              {isLightMode ? (
                <div className="grid h-full w-full gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryItems.slice(0, 6).map((item) => (
                    <article key={item.text} className="overflow-hidden rounded-lg border border-blue-300/20 bg-slate-900/80">
                      <ResponsiveImage imageKey={item.imageKey} alt={item.text} className="h-[78%] w-full object-cover" />
                      <p className="px-3 py-2 text-sm tracking-wide text-blue-100">{item.text}</p>
                    </article>
                  ))}
                </div>
              ) : (
                isLayananInView && (
                  <Suspense fallback={<div className="h-full w-full bg-slate-900/70" />}>
                    <CircularGallery
                      items={galleryItems}
                      bend={3}
                      textColor="#dbeafe"
                      borderRadius={0.08}
                      scrollEase={0.028}
                      scrollSpeed={1.5}
                    />
                  </Suspense>
                )
              )}
            </div>

            <div className="mx-auto grid w-full max-w-7xl place-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
              {lensData.map((lens, index) => (
                <article
                  key={lens.title}
                  className="block w-full max-w-sm overflow-hidden rounded-xl border border-blue-200/20 bg-slate-900/85 shadow-sm transition hover:-translate-y-1 hover:shadow-blue-500/25"
                >
                  <ResponsiveImage imageKey={lens.image} alt={lens.title} className="h-52 w-full object-cover" />
                  <div className="p-6 text-center">
                    <span className="inline-flex items-center rounded border border-blue-300/30 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-200">
                      {lens.badge}
                    </span>
                    <h3 className="mb-2 mt-4 text-2xl font-semibold tracking-tight text-slate-100">{lens.title}</h3>
                    <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-200/80">{lens.subtitle}</p>
                    <p className="mb-6 text-slate-300/80">{lens.description}</p>
                    <button
                      type="button"
                      onClick={() => setShowLensDetail(showLensDetail === index ? null : index)}
                      className="inline-flex items-center rounded-md border border-blue-400/40 bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Read more
                    </button>
                    {showLensDetail === index && (
                      <p className="mt-4 rounded-md border border-blue-300/20 bg-blue-950/50 p-3 text-left text-sm leading-7 text-blue-100/90">
                        {lens.details}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        <section id="kontak" ref={kontakRef} className="relative w-full overflow-hidden bg-black px-4 pb-20 pt-20 sm:px-6 md:px-10">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
            {!isLightMode && isKontakInView ? (
              <Suspense fallback={<div className="h-full w-full bg-slate-950" />}>
                <SoftAurora
                  speed={0.56}
                  scale={1.68}
                  brightness={1.12}
                  color1="#2563eb"
                  color2="#67e8f9"
                  noiseFrequency={2}
                  noiseAmplitude={0.82}
                  bandHeight={0.56}
                  bandSpread={1.02}
                  octaveDecay={0.2}
                  colorSpeed={0.92}
                  enableMouseInteraction={false}
                  mouseInfluence={0.08}
                />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-[linear-gradient(180deg,#000_0%,#0b1120_100%)]" />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/60" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-3">
                <GlassesLogo />
              </div>
              <h3 className="text-3xl font-semibold text-white">Informasi Kontak</h3>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-200/90">
                Kharisma Optikal melayani pemeriksaan mata, konsultasi lensa, dan penyesuaian frame dengan standar profesional.
              </p>
              <div className="mt-8 space-y-3 text-slate-100">
                <p>
                  <span className="font-semibold text-blue-300">Alamat:</span> Jl.Kamasan No.2 Kota Tasikmalaya Jawa Barat Indonesia
                </p>
                <p>
                  <span className="font-semibold text-blue-300">WhatsApp:</span> 088229362384
                </p>
                <p>
                  <span className="font-semibold text-blue-300">Jam Operasional:</span> 07.00 - 21.00 WIB
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-slate-950/85 p-5">
              <h4 className="text-xl font-semibold text-white">Our Location</h4>
              <p className="mt-4 text-slate-300/90">
                Jl.Kamasan No.2 Kota Tasikmalaya Jawa Barat Indonesia.
              </p>
              <div className="mt-5 h-[260px] w-full overflow-hidden rounded-lg border border-blue-300/20 bg-slate-900">
                <iframe
                  title="Kharisma Optikal Location"
                  src="https://maps.google.com/maps?q=tasikmalaya&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-12 w-full max-w-7xl border-t border-blue-500/15 pt-7 text-sm text-slate-300">
            <p>Hak Cipta ©2026 Kharisma Optikal. All Rights Reserved.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
