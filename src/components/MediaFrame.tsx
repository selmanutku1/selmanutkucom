import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export function MediaFrame({
  src,
  alt,
  aspectClass = 'aspect-[4/3]',
  className = '',
  imgClassName = '',
  fallbackTitle,
  priority = false,
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 ${aspectClass} ${className}`}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-neutral-200 bg-neutral-50 px-6 text-center text-neutral-500">
          <ImageIcon className="h-6 w-6 text-neutral-400" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-xs font-medium tracking-tight text-neutral-600">
            {fallbackTitle || alt}
          </span>
        </div>
      )}
    </div>
  );
}
