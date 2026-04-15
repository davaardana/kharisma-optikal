import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

type Item = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
};

type Props = {
  logo: React.ReactNode;
  items: Item[];
};

export default function BubbleMenu({ logo, items }: Props) {
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const toggle = () => {
    const next = !open;
    if (next) setShowOverlay(true);
    setOpen(next);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
    if (!overlay || bubbles.length === 0) return;

    if (open) {
      gsap.set(overlay, { display: 'flex' });
      gsap.set(bubbles, { scale: 0, y: 20, opacity: 0 });
      gsap.to(bubbles, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(1.5)',
        stagger: 0.08,
      });
      return;
    }

    if (showOverlay) {
      gsap.to(bubbles, {
        scale: 0.8,
        y: 14,
        opacity: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        },
      });
    }
  }, [open, showOverlay]);

  return (
    <>
      <nav className="bubble-menu fixed" aria-label="Mobile navigation">
        <div className="bubble logo-bubble">{logo}</div>
        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${open ? 'open' : ''}`}
          onClick={toggle}
          aria-label="Toggle menu"
          aria-pressed={open}
        >
          <span className="menu-line" />
          <span className="menu-line short" />
        </button>
      </nav>

      {showOverlay && (
        <div ref={overlayRef} className="bubble-menu-items fixed" aria-hidden={!open}>
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {items.map((item, idx) => (
              <li key={item.label} className="pill-col" role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={{
                    ['--item-rot' as string]: `${item.rotation ?? 0}deg`,
                    ['--hover-bg' as string]: item.hoverStyles?.bgColor || '#1d4ed8',
                    ['--hover-color' as string]: item.hoverStyles?.textColor || '#dbeafe',
                  }}
                  ref={(el) => {
                    bubblesRef.current[idx] = el;
                  }}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <span className="pill-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
