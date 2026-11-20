import { getAcademicProfile } from '../data/academic';
import { UI_COPY, useLanguage } from '../lib/i18n';

export function AcademicSection() {
  const { lang } = useLanguage();
  const academic = getAcademicProfile(lang);
  const copy = UI_COPY[lang].academic;

  return (
    <section
      id="akademik"
      aria-labelledby="academic-heading"
      className="relative overflow-hidden border-t border-[#DCE7F2] bg-[#F3F8FC] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-0 h-[360px] w-[360px] rounded-full bg-[#38BDF8]/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
          <p className="font-mono text-[12px] text-[#145DA0] tabular-nums">06</p>
          <h2
            id="academic-heading"
            className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
          >
            {academic.heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
            {academic.lead}
          </p>
        </div>

        <div className="mt-14 space-y-12 text-center sm:text-left">
          {/* Row 1: Eğitim Geçmişi + Doktora Çalışmaları */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Eğitim Geçmişi */}
            <div className="rounded-lg border border-[#DCE7F2] bg-white/95 p-8 backdrop-blur-sm lg:col-span-6">
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.educationTitle}
              </h3>
              <div className="mt-6 divide-y divide-[#E4EDF6]">
                {academic.education.map((edu, idx) => (
                  <div key={idx} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-[#5B7086] sm:justify-between">
                      <span>
                        {edu.institution} · {edu.level}
                      </span>
                      <span className="font-medium text-[#145DA0]">{edu.status}</span>
                    </div>
                    <h4 className="mt-2 text-[17px] font-semibold text-[#0A192F]">
                      {edu.department}
                    </h4>
                    <p className="mt-2 text-[14.5px] leading-[1.65] text-[#465B71]">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doktora Çalışmaları */}
            <div className="flex flex-col justify-between rounded-lg border border-[#DCE7F2] bg-white/95 p-8 backdrop-blur-sm lg:col-span-6">
              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
                  <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                    {academic.doctoralStudies.title}
                  </h3>
                  <span className="text-[12.5px] font-medium text-[#145DA0]">
                    {academic.doctoralStudies.status}
                  </span>
                </div>

                <p className="mt-4 text-[15px] leading-[1.7] text-[#33485E]">
                  {academic.doctoralStudies.summary}
                </p>

                <ul className="mt-5 space-y-2.5 text-left">
                  {academic.doctoralStudies.focusPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-[#465B71]"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#145DA0]/60"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Row 2: Akademik Yayınlar & Konferanslar */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Akademik Yayınlar */}
            <div className="rounded-lg border border-[#DCE7F2] bg-white/95 p-8 backdrop-blur-sm lg:col-span-6">
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.publicationsTitle}
              </h3>
              <div className="mt-6 divide-y divide-[#E4EDF6]">
                {academic.publications.map((pub, idx) => (
                  <div key={idx} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px] text-[#5B7086] sm:justify-start">
                      <span className="font-mono tabular-nums">{pub.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pub.venue}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#145DA0]">{pub.status}</span>
                    </div>
                    <h4 className="mt-2 text-[16px] font-semibold leading-[1.4] text-[#0A192F]">
                      {pub.title}
                    </h4>
                    <p className="mt-2 text-[14.5px] leading-[1.65] text-[#465B71]">
                      {pub.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Konferanslar ve Bildiriler */}
            <div className="rounded-lg border border-[#DCE7F2] bg-white/95 p-8 backdrop-blur-sm lg:col-span-6">
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.conferencesTitle}
              </h3>
              <div className="mt-6 divide-y divide-[#E4EDF6]">
                {academic.conferences.map((conf, idx) => (
                  <div key={idx} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px] text-[#5B7086] sm:justify-start">
                      <span className="font-mono tabular-nums">{conf.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{conf.event}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#145DA0]">{conf.status}</span>
                    </div>
                    <h4 className="mt-2 text-[16px] font-semibold leading-[1.4] text-[#0A192F]">
                      {conf.title}
                    </h4>
                    <p className="mt-2 text-[14.5px] leading-[1.65] text-[#465B71]">
                      {conf.topic}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Araştırma Alanları & Akademik İlgi Alanları */}
          <div className="grid grid-cols-1 gap-8 border-t border-[#DCE7F2] pt-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="text-[16px] font-semibold text-[#0A192F]">
                {copy.researchAreasTitle}
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2">
                {academic.researchAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-[#2C4157]"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#145DA0]/60"
                      aria-hidden="true"
                    />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <h3 className="text-[16px] font-semibold text-[#0A192F]">
                {copy.interestsTitle}
              </h3>
              <p className="mt-4 text-[14.5px] leading-[1.9] text-[#465B71]">
                {academic.academicInterests.join('  ·  ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
