import { useMemo } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

type Card = {
  title: string;
  description: string;
  label: string;
};

type Props = {
  cards: Card[];
  theme?: 'dark' | 'light';
};

export default function MagicBento({ cards, theme = 'dark' }: Props) {
  const safeCards = useMemo(() => cards.slice(0, 6), [cards]);

  return (
    <div className={`card-grid bento-section ${theme === 'light' ? 'magic-bento--light' : 'magic-bento--dark'}`}>
      {safeCards.map((card, index) => (
        <article
          key={`${card.title}-${index}`}
          className="magic-bento-card magic-bento-card--border-glow"
          onMouseMove={(e) => {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty('--glow-x', `${x}%`);
            el.style.setProperty('--glow-y', `${y}%`);
            gsap.to(el, { y: -2, duration: 0.2, ease: 'power2.out' });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, { y: 0, duration: 0.25, ease: 'power2.out' });
          }}
        >
          <div className="magic-bento-card__header">
            <div className="magic-bento-card__label">{card.label}</div>
          </div>
          <div className="magic-bento-card__content">
            <h3 className="magic-bento-card__title">{card.title}</h3>
            <p className="magic-bento-card__description">{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
