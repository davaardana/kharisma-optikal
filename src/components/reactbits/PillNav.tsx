import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import './PillNav.css';

type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type PillNavProps = {
  logo: ReactNode;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
};

export default function PillNav({
  logo,
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = '#020617',
  pillColor = 'rgba(15,23,42,0.88)',
  hoveredPillTextColor = '#0f172a',
  pillTextColor = '#dbeafe',
  initialLoadAnimation = true,
}: PillNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector('.pill-label');
        const hover = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hover) gsap.set(hover, { y: h + 12, opacity: 0 });

        tlRefs.current[i]?.kill();

        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.5, ease }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 0.5, ease }, 0);
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 0.5, ease }, 0);

        tlRefs.current[i] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);

    if (initialLoadAnimation && navItemsRef.current) {
      gsap.fromTo(
        navItemsRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease },
      );
    }

    return () => {
      window.removeEventListener('resize', layout);
    };
  }, [ease, initialLoadAnimation]);

  useEffect(() => {
    if (!menuRef.current) return;
    if (isMobileMenuOpen) {
      gsap.set(menuRef.current, { visibility: 'visible' });
      gsap.fromTo(menuRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease });
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.2,
        ease,
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { visibility: 'hidden' });
        },
      });
    }
  }, [isMobileMenuOpen, ease]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.25, ease });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease });
  };

  return (
    <div className={`pill-nav-container ${className}`}>
      <nav
        className="pill-nav"
        style={{
          ['--base' as string]: baseColor,
          ['--pill-bg' as string]: pillColor,
          ['--hover-text' as string]: hoveredPillTextColor,
          ['--pill-text' as string]: pillTextColor,
        }}
      >
        <a className="pill-logo" href="#beranda" aria-label="Home">
          {logo}
        </a>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href} role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button className="mobile-menu-button mobile-only" onClick={() => setIsMobileMenuOpen((v) => !v)}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={menuRef}>
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={`${item.href}-m`}>
              <a
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
