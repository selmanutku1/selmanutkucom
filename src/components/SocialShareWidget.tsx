import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { UI_COPY, useLanguage } from '../lib/i18n';

interface SocialShareWidgetProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  showCopy?: boolean;
}

function LinkedInMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

function TwitterMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m5.81 14.08c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.91-.12-.44-.14-1.01-.33-1.74-.64-3.05-1.31-5.04-4.38-5.19-4.58-.15-.2-1.24-1.65-1.24-3.15 0-1.5.79-2.23 1.07-2.54.28-.3.61-.38.82-.38.2 0 .41.01.59.01.19.01.45-.07.7.53.26.62.88 2.15.96 2.31.08.15.13.34.03.54-.1.2-.15.34-.3.52-.15.18-.32.4-.45.54-.15.15-.31.32-.13.63.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.36 2.46 1.52.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.77.84 2.07.99.3.15.51.23.58.35.08.13.08.73-.17 1.41Z" />
    </svg>
  );
}

export function SocialShareWidget({
  url,
  title,
  description,
  hashtags = [],
  showCopy = true,
}: SocialShareWidgetProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].share;
  const [copied, setCopied] = useState(false);

  const trimmedSummary = description
    ? description.length > 130
      ? `${description.slice(0, 127).trimEnd()}...`
      : description
    : '';

  const twitterText = trimmedSummary ? `${title} — ${trimmedSummary}` : title;
  const cleanHashtags = hashtags
    .map((tag) => tag.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, ''))
    .filter(Boolean)
    .slice(0, 3)
    .join(',');

  const linkedInParams = new URLSearchParams({ url });
  const twitterParams = new URLSearchParams({
    url,
    text: twitterText,
  });
  if (cleanHashtags) {
    twitterParams.set('hashtags', cleanHashtags);
  }

  const whatsAppMessage = trimmedSummary
    ? `${title}\n${trimmedSummary}\n${url}`
    : `${title}\n${url}`;
  const whatsAppParams = new URLSearchParams({ text: whatsAppMessage });

  const shareLinks = [
    {
      key: 'linkedin',
      label: copy.linkedin,
      ariaLabel: copy.linkedinAria,
      href: `https://www.linkedin.com/sharing/share-offsite/?${linkedInParams.toString()}`,
      Icon: LinkedInMark,
    },
    {
      key: 'twitter',
      label: copy.twitter,
      ariaLabel: copy.twitterAria,
      href: `https://twitter.com/intent/tweet?${twitterParams.toString()}`,
      Icon: TwitterMark,
    },
    {
      key: 'whatsapp',
      label: copy.whatsapp,
      ariaLabel: copy.whatsappAria,
      href: `https://api.whatsapp.com/send?${whatsAppParams.toString()}`,
      Icon: WhatsAppMark,
    },
  ];

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="group"
      aria-label={copy.groupAria}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 text-[12.5px] font-medium text-[#5B7086]">
        {copy.label}:
      </span>

      {shareLinks.map(({ key, label, ariaLabel, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#D4E2F0] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#33485E] transition-colors duration-150 hover:border-[#145DA0] hover:bg-[#F3F8FC] hover:text-[#0A192F]"
        >
          <Icon />
          <span>{label}</span>
        </a>
      ))}

      {showCopy && (
        <button
          type="button"
          onClick={handleCopyUrl}
          className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#D4E2F0] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#33485E] transition-colors duration-150 hover:border-[#145DA0] hover:bg-[#F3F8FC] hover:text-[#0A192F]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#145DA0]" strokeWidth={2} aria-hidden="true" />
              <span>{copy.linkCopied}</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>{copy.copyLink}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
