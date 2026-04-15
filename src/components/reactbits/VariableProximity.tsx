import { forwardRef, useEffect, useMemo, useRef, type CSSProperties, type RefObject } from 'react';
import './VariableProximity.css';

type FalloffType = 'linear' | 'exponential' | 'gaussian';

type VariableProximityProps = {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: RefObject<HTMLDivElement | null>;
  radius?: number;
  falloff?: FalloffType;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0;
    let isActive = !document.hidden;

    const onVisibilityChange = () => {
      isActive = !document.hidden;
      if (isActive && frameId === 0) {
        frameId = requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      if (!isActive) {
        frameId = 0;
        return;
      }
      callback();
      frameId = requestAnimationFrame(loop);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    frameId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [callback]);
}

function useMousePositionRef(containerRef?: RefObject<HTMLDivElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(function VariableProximity(
  {
    label,
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 800, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  },
  ref,
) {
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null as number | null, y: null as number | null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)] as [string, number];
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;

    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
    lastPositionRef.current = { x, y };

    letterRefs.current.forEach((letterRef) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(mousePositionRef.current.x, mousePositionRef.current.y, letterCenterX, letterCenterY);

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const indexedWords = useMemo(() => {
    const words = label.split(' ');
    return words.map((word, wordIndex) => {
      const indexOffset = words.slice(0, wordIndex).reduce((sum, currentWord) => sum + currentWord.length, 0);
      const letters = word.split('').map((letter, letterIndex) => ({
        letter,
        index: indexOffset + letterIndex,
      }));
      return { word, letters };
    });
  }, [label]);

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {indexedWords.map((wordGroup, wordIndex) => (
        <span key={`${wordGroup.word}-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {wordGroup.letters.map(({ letter, index }) => (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              style={{
                display: 'inline-block',
                fontVariationSettings: fromFontVariationSettings,
              }}
              aria-hidden="true"
            >
              {letter}
            </span>
          ))}
          {wordIndex < indexedWords.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

export default VariableProximity;
