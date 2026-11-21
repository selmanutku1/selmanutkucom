import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { AboutGalleryItem } from '../data/profile';
import type { Language } from '../lib/i18n';
import { MediaFrame } from './MediaFrame';

interface AboutGallerySliderProps {
  photos: AboutGalleryItem[];
  lang: Language;
}

export function AboutGallerySlider({ photos, lang }: AboutGallerySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(photos.length > 1);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const currentLeft = el.scrollLeft;

    setCanScrollPrev(currentLeft > 8);
    setCanScrollNext(currentLeft < maxScroll - 8);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    if (currentLeft >= maxScroll - 8 && maxScroll > 0) {
      setActiveIndex(children.length - 1);
      return;
    }

    let closestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < children.length; i++) {
      const distance = Math.abs(children[i].offsetLeft - currentLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }
    }
    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    syncScrollState();
    window.addEventListener('resize', syncScrollState);
    return () => window.removeEventListener('resize', syncScrollState);
  }, [syncScrollState, photos.length]);

  const scrollToIndex = (targetIdx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(photos.length - 1, targetIdx));
    const targetChild = el.children[clamped] as HTMLElement | undefined;
    if (!targetChild) return;

    el.scrollTo({
      left: targetChild.offsetLeft,
      behavior: 'smooth',
    });
  };

  const handleStep = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    const stepDistance = firstChild ? firstChild.offsetWidth + 20 : el.clientWidth * 0.75;

    el.scrollBy({
      left: direction * stepDistance,
      behavior: 'smooth',
    });
  };

  if (photos.length === 0) return null;

  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(photos.length).padStart(2, '0');

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={lang === 'tr' ? 'Fotoğraf galerisi' : 'Photo gallery'}
      className="mt-16 border-t border-[#DCE7F2] pt-10"
    >
      {/* Minimal Slider Controls Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] font-semibold tracking-wider text-[#0A192F] tabular-nums">
            {formattedIndex}
            <span className="mx-1 text-[#8FA4BA]">/</span>
            <span className="text-[#5B7086]">{formattedTotal}</span>
          </span>

          {/* Subtle segment indicator */}
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                tabIndex={-1}
                onClick={() => scrollToIndex(idx)}
                className={`h-1 rounded-full transition-all duration-200 ${
                  idx === activeIndex
                    ? 'w-6 bg-[#145DA0]'
                    : 'w-2.5 bg-[#D4E3F1] hover:bg-[#94BBE0]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={!canScrollPrev}
            aria-label={lang === 'tr' ? 'Önceki fotoğraf' : 'Previous photo'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#DCE7F2] bg-white text-[#0A192F] transition-colors hover:border-[#145DA0] hover:bg-[#F3F8FC] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#DCE7F2] disabled:hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={!canScrollNext}
            aria-label={lang === 'tr' ? 'Sonraki fotoğraf' : 'Next photo'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#DCE7F2] bg-white text-[#0A192F] transition-colors hover:border-[#145DA0] hover:bg-[#F3F8FC] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#DCE7F2] disabled:hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap-Scroll Track (3+peek on desktop, swipeable on mobile) */}
      <div
        ref={trackRef}
        onScroll={syncScrollState}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, idx) => (
          <figure
            key={`${photo.src}-${idx}`}
            className="group relative w-[82%] shrink-0 snap-start overflow-hidden rounded-lg border border-[#D4E3F1] bg-[#EDF5FC] sm:w-[46%] lg:w-[31%]"
          >
            <MediaFrame
              src={photo.src}
              alt={photo.alt}
              aspectClass="aspect-[4/4.2]"
              imgClassName={`grayscale contrast-[1.08] group-hover:scale-[1.02] ${
                photo.objectPosition || 'object-center'
              }`}
              fallbackTitle={photo.location || photo.alt}
            />
            {photo.location && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07111E]/55 via-[#07111E]/15 to-transparent"
                />
                <figcaption className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-sm bg-[#07111E]/80 px-2.5 py-1 text-[12.5px] font-medium tracking-[0.01em] text-white backdrop-blur-sm">
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 text-[#38BDF8]"
                    strokeWidth={1.85}
                    aria-hidden="true"
                  />
                  <span>{photo.location}</span>
                </figcaption>
              </>
            )}
          </figure>
        ))}
      </div>

      {/* Mobile progress dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {photos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            tabIndex={-1}
            onClick={() => scrollToIndex(idx)}
            className={`h-1 rounded-full transition-all duration-200 ${
              idx === activeIndex ? 'w-5 bg-[#145DA0]' : 'w-2 bg-[#D4E3F1]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
