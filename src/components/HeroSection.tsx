import { ArrowRight, ArrowDownRight, ArrowUpRight, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { getProfileContent, SITE_CONFIG } from '../data/profile';
import { useLanguage } from '../lib/i18n';
import { getSectionHref, getSectionId } from '../lib/routes';
import { MediaFrame } from './MediaFrame';
import { PressLogoBar } from './PressLogoBar';

interface HeroSectionProps {
  onNavigate: (to: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { lang } = useLanguage();
  const profile = getProfileContent(lang);

  return (
    <section
      id={getSectionId('home', lang)}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white"
    >
      {/* Subtle flue-blue atmospheric wash inspired by the conference portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#38BDF8]/[0.12] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/3 h-[380px] w-[480px] rounded-full bg-[#0284C7]/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20">
        {/* Split-column balanced hero */}
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Typographic Column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between text-center lg:col-span-7 lg:text-left"
          >
            <div>
              <p className="text-[14px] font-medium tracking-tight text-[#145DA0]">
                {profile.hero.subtitle}
              </p>

              <h1
                id="hero-heading"
                className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.25rem,4.3vw,3.65rem)] font-bold leading-[1.09] tracking-[-0.03em] text-[#0A192F] lg:mx-0"
              >
                {profile.hero.title}
                {profile.hero.titleAccent && (
                  <>
                    {' '}
                    <span className="text-[#145DA0]">{profile.hero.titleAccent}</span>
                  </>
                )}
              </h1>

              <p className="mx-auto mt-8 max-w-[60ch] text-[17px] leading-[1.7] text-[#33485E] lg:mx-0 lg:text-[18px]">
                {profile.hero.intro}
              </p>

              <figure className="mt-8 border-t border-[#DCE7F2] pt-6">
                <blockquote className="mx-auto max-w-[46ch] text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-[#0A192F] lg:mx-0 lg:text-[21px]">
                  “{profile.hero.slogan}”
                </blockquote>
                <figcaption className="mt-2 text-[13.5px] font-medium text-[#5B7086]">
                  — {profile.hero.sloganAuthor}
                </figcaption>
              </figure>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
              <button
                type="button"
                onClick={() => onNavigate(getSectionHref('about', lang))}
                className="inline-flex min-h-[46px] items-center gap-2.5 whitespace-nowrap shrink-0 rounded-md bg-[#0C2340] px-6 py-3 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#143966]"
              >
                <span>{profile.hero.primaryCta}</span>
                <ArrowDownRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate(getSectionHref('projects', lang))}
                className="inline-flex min-h-[46px] items-center gap-2.5 whitespace-nowrap shrink-0 rounded-md border border-[#C6D8EA] bg-white/80 px-6 py-3 text-[14px] font-medium text-[#0A192F] backdrop-blur-sm transition-colors duration-150 hover:border-[#145DA0] hover:bg-[#F3F8FC]"
              >
                <span>{profile.hero.secondaryCta}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Right Portrait Column + LinkedIn Link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:col-span-5"
          >
            <div className="flex-1 overflow-hidden rounded-lg border border-[#D4E3F1] bg-[#EDF5FC] shadow-[0_20px_50px_-28px_rgba(20,93,160,0.22)]">
              <MediaFrame
                src={SITE_CONFIG.portraitImage}
                alt={profile.portraitAlt}
                aspectClass="aspect-square sm:aspect-[4/4.2] lg:aspect-auto lg:h-full lg:min-h-[430px]"
                imgClassName="object-[50%_20%]"
                fallbackTitle="Selman Utku"
                priority
              />
            </div>

            <div className="mt-3.5 flex items-center justify-center lg:justify-between">
              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Selman Utku LinkedIn"
                className="group inline-flex items-center gap-2.5 rounded-md border border-[#DCE7F2] bg-white/90 px-3.5 py-2 text-[13px] font-medium text-[#0A192F] transition-colors duration-150 hover:border-[#145DA0] hover:bg-[#F3F8FC]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#0C2340] text-white transition-colors duration-150 group-hover:bg-[#145DA0]">
                  <Linkedin className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span>LinkedIn</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-[#5B7086] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#145DA0]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </a>
              <span className="hidden text-[12.5px] text-[#5B7086] lg:inline">
                {SITE_CONFIG.linkedinHandle}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Press & Media Transparent Logo Strip */}
        <PressLogoBar lang={lang} />

        {/* Full-width 3-Column Brand Positioning Strip below press logos */}
        <div className="border-t border-[#DCE7F2] pt-10 lg:pt-12">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-10 md:text-left">
            {profile.brandPillars.map((pillar) => (
              <div key={pillar.index} className="space-y-2.5">
                <span className="text-[12px] font-semibold text-[#145DA0] tabular-nums">
                  {pillar.index}.
                </span>
                <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#0A192F]">
                  {pillar.title}
                </h2>
                <p className="text-[14.5px] leading-[1.65] text-[#465B71]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
