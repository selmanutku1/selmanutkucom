import type { RouteLanguage } from '../lib/routes';

export interface HomeProfileSchemaOptions {
  siteUrl: string;
  lang: RouteLanguage;
  title: string;
  description: string;
  homePath: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
}

export const VERIFIED_PERSON_SAME_AS = [
  'https://www.linkedin.com/in/selmanutku',
  'https://www.instagram.com/selmanutku',
  'https://scholar.google.com/scholar?q=Selman+Utku',
  'https://sporttech.com.tr',
  'https://sporsepeti.com.tr',
  'https://sportsfly.com.tr',
] as const;

export function buildHomeProfileSchema({
  siteUrl,
  lang,
  title,
  description,
  homePath,
  ogImage = '/og-image.png',
  ogImageWidth = 1200,
  ogImageHeight = 549,
}: HomeProfileSchemaOptions): Record<string, unknown> {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const normalizedHomePath = homePath.startsWith('/') ? homePath : `/${homePath}`;
  const homeUrl = `${cleanSiteUrl}${normalizedHomePath}`;
  const normalizedOgImage = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
  const isTr = lang === 'tr';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${homeUrl}#profilepage`,
    name: title,
    url: homeUrl,
    inLanguage: isTr ? 'tr-TR' : 'en-US',
    description,
    isPartOf: {
      '@id': `${cleanSiteUrl}/#website`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${cleanSiteUrl}${normalizedOgImage}`,
      width: ogImageWidth,
      height: ogImageHeight,
    },
    mainEntity: {
      '@type': 'Person',
      '@id': `${cleanSiteUrl}/#person`,
      name: 'Selman Utku',
      givenName: 'Selman',
      familyName: 'Utku',
      url: `${cleanSiteUrl}/`,
      email: 'mailto:iletisim@selmanutku.com',
      jobTitle: isTr
        ? 'Tech Analyst, Bilişim Vadisi Spor Teknolojileri Mentoru & SportTech Kurucusu'
        : 'Tech Analyst, Bilişim Vadisi Sports Technology Mentor & SportTech Founder',
      description: isTr
        ? 'İstanbul merkezli Tech Analyst, Bilişim Vadisi Spor Teknolojileri Mentoru ve SportTech Türkiye (sporttech.com.tr), Sporsepeti (sporsepeti.com.tr) ile SportsFly (sportsfly.com.tr) kurucusu. Spor teknolojileri, spor bilişimi, spor yönetimi ve dijital dönüşüm alanlarında çalışmaktadır.'
        : 'Istanbul-based Tech Analyst, Bilişim Vadisi Sports Technology Mentor, and founder of SportTech Türkiye (sporttech.com.tr), Sporsepeti (sporsepeti.com.tr), and SportsFly (sportsfly.com.tr). Focused on sports technology, sports informatics, sports management, and digital transformation.',
      image: {
        '@type': 'ImageObject',
        url: `${cleanSiteUrl}/assets/aistudio/selman-utku-com_c1d77ca5.png`,
        width: 1254,
        height: 1254,
        caption: isTr
          ? 'Selman Utku – Tech Analyst, Spor Teknolojileri Mentoru & SportTech Kurucusu'
          : 'Selman Utku – Tech Analyst, Sports Technology Mentor & SportTech Founder',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Istanbul',
        addressRegion: 'Istanbul',
        addressCountry: 'TR',
      },
      knowsLanguage: ['en-US', 'tr-TR'],
      knowsAbout: [
        'Sports Technology',
        'Spor Teknolojileri',
        'Sports Informatics',
        'Spor Bilişimi',
        'Sports Management',
        'Spor Yönetimi',
        'Digital Transformation',
        'Dijital Dönüşüm',
        'Tech Analysis',
        'Innovation Management',
        'Artificial Intelligence',
      ],
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'Marmara University',
          alternateName: 'Marmara Üniversitesi',
          department: isTr ? 'Bilişim Teknolojileri' : 'Information Technologies',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'Marmara University',
          alternateName: 'Marmara Üniversitesi',
          department: isTr ? 'Spor Yöneticiliği' : 'Sports Management',
        },
      ],
      affiliation: [
        {
          '@type': 'OrganizationRole',
          roleName: isTr ? 'Spor Teknolojileri Mentoru' : 'Sports Technology Mentor',
          alternateName: isTr ? 'Sports Technology Mentor' : 'Spor Teknolojileri Mentoru',
          description: isTr
            ? 'Bilişim Vadisi girişimcilik ekosisteminde spor teknolojileri ve spor bilişimi girişimlerine ürün stratejisi, iş modeli kurgusu, ticarileşme ve spor ekosistemi iş birlikleri mentorluğu.'
            : 'Mentoring SportTech and sports informatics startups within the Bilişim Vadisi innovation ecosystem on product strategy, business modeling, commercialization, and sports industry partnerships.',
          affiliation: {
            '@type': 'Organization',
            '@id': `${cleanSiteUrl}/#bilisim-vadisi`,
            name: 'Bilişim Vadisi',
            url: 'https://bilisimvadisi.com.tr',
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'Kocaeli',
              addressCountry: 'TR',
            },
          },
        },
        {
          '@type': 'OrganizationRole',
          roleName: isTr ? 'Kurucu' : 'Founder',
          alternateName: isTr ? 'Founder' : 'Kurucu',
          affiliation: {
            '@type': 'Organization',
            '@id': `${cleanSiteUrl}/#sporttech-turkiye`,
            name: 'SportTech Türkiye',
            url: 'https://sporttech.com.tr',
            sameAs: `${cleanSiteUrl}${isTr ? '/projeler/sporttech-turkiye' : '/projects/sporttech-turkiye'}`,
          },
        },
        {
          '@type': 'OrganizationRole',
          roleName: isTr ? 'Kurucu' : 'Founder',
          alternateName: isTr ? 'Founder' : 'Kurucu',
          affiliation: {
            '@type': 'Organization',
            '@id': `${cleanSiteUrl}/#sporsepeti`,
            name: 'Sporsepeti',
            url: 'https://sporsepeti.com.tr',
            sameAs: `${cleanSiteUrl}${isTr ? '/projeler/sporsepeti' : '/projects/sporsepeti'}`,
          },
        },
        {
          '@type': 'OrganizationRole',
          roleName: isTr ? 'Kurucu' : 'Founder',
          alternateName: isTr ? 'Founder' : 'Kurucu',
          affiliation: {
            '@type': 'Organization',
            '@id': `${cleanSiteUrl}/#sportsfly-org`,
            name: 'SportsFly',
            url: 'https://sportsfly.com.tr',
            sameAs: `${cleanSiteUrl}${isTr ? '/projeler/sportsfly' : '/projects/sportsfly'}`,
          },
        },
      ],
      sameAs: [...VERIFIED_PERSON_SAME_AS],
    },
  };
}
