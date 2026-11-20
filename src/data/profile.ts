import type { Language } from '../lib/i18n';

export interface BrandPillar {
  index: string;
  title: string;
  description: string;
}

export interface EducationSummary {
  institution: string;
  program: string;
  degree: string;
  focus: string;
}

export interface AffiliationItem {
  organization: string;
  role: string;
  description: string;
}

export interface CareerJourneyItem {
  role: string;
  organization: string;
  summary: string;
  websiteUrl?: string;
  websiteLabel?: string;
}

export const SITE_CONFIG = {
  brandName: 'SELMAN UTKU',
  fullName: 'Selman Utku',
  domain: 'selmanutku.com',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://selmanutku.com',
  email: 'iletisim@selmanutku.com',
  linkedinUrl: 'https://www.linkedin.com/in/selmanutku',
  linkedinHandle: 'linkedin.com/in/selmanutku',
  instagramUrl: 'https://www.instagram.com/selmanutku',
  googleScholarUrl: 'https://scholar.google.com/scholar?q=Selman+Utku',
  // Portre fotoğrafını değiştirmek için yalnızca aşağıdaki görsel yolunu güncelleyin.
  portraitImage: '/assets/aistudio/selman-utku-com_c1d77ca5.png',
  ogImage: '/assets/aistudio/selman-utku-com_c1d77ca5.png',
  ogImageWidth: 1254,
  ogImageHeight: 1254,
  geo: {
    region: 'TR-34',
    placename: 'Istanbul, Türkiye',
    latitude: 41.0082,
    longitude: 28.9784,
  },
};

export interface LocalizedProfile {
  location: string;
  portraitAlt: string;
  hero: {
    title: string;
    titleAccent?: string;
    subtitle: string;
    intro: string;
    slogan: string;
    sloganAuthor: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footerSummary: string;
  brandPillars: BrandPillar[];
  about: {
    heading: string;
    lead: string;
    professionalProfile: string[];
    careerJourney: CareerJourneyItem[];
    education: EducationSummary[];
    affiliations: AffiliationItem[];
    visionAndApproach: string;
  };
}

const PROFILE_BY_LANG: Record<Language, LocalizedProfile> = {
  tr: {
    location: 'İstanbul, Türkiye',
    portraitAlt: 'Selman Utku – Konferans panel konuşması portre fotoğrafı',
    hero: {
      title: 'Sporun Geleceğine Stratejik Bakış.',
      subtitle: 'Dijital Dönüşüm | İnovasyon | Spor Teknolojileri',
      intro:
        'Spor yönetimi, teknoloji ve dijital dönüşüm alanlarının kesişiminde çalışan; iş süreçlerini teknolojiyle geliştirmeye, yapay zekâ ve otomasyon çözümleriyle değer üretmeye odaklanan bir profesyonelim.',
      slogan: 'Değişim kaçınılmazdır. Büyüme isteğe bağlıdır.',
      sloganAuthor: 'John C. Maxwell',
      primaryCta: 'Hakkımda',
      secondaryCta: 'Projelerimi Keşfet',
    },
    footerSummary:
      'Dijital dönüşüm, inovasyon, yapay zekâ ve spor teknolojileri odağında kurumsal değer ve sürdürülebilir ürün ekosistemleri geliştiriyorum.',
    brandPillars: [
      {
        index: '01',
        title: 'Dijital Dönüşüm ve İş Analizi',
        description:
          'Kurumsal süreçleri uçtan uca analiz ederek ölçülebilir verimlilik, yalın operasyon ve otomasyon mimarileri tasarlıyorum.',
      },
      {
        index: '02',
        title: 'Spor Teknolojileri ve Girişimcilik',
        description:
          'Spor okulları, kulüpler ve spor ekosistemi için ölçeklenebilir dijital platformlar ve ürün modelleri geliştiriyorum.',
      },
      {
        index: '03',
        title: 'Teknoloji Stratejisi ve Akademik Derinlik',
        description:
          'Saha deneyimini bilimsel araştırma disipliniyle birleştirerek uzun vadeli stratejik bakış açısı oluşturuyorum.',
      },
    ],
    about: {
      heading: 'Hakkımda',
      lead: 'Teknoloji, iş analizi ve spor yönetimi disiplinlerini tek bir stratejik çerçevede birleştirerek kurumlar ve girişimler için kalıcı dijital değer üretiyorum.',
      professionalProfile: [
        'Kariyerimi kurumsal iş süreçlerinin analiz edilmesi, dijital stratejilerin kurgulanması ve teknoloji odaklı dönüşüm projelerinin hayata geçirilmesi üzerine inşa ettim. Spor yönetimi kökenimi bilişim teknolojileri ve iş analizi uzmanlığıyla birleştirerek hem kurumsal yapılarda hem de girişimcilik ekosisteminde çok boyutlu bir bakış açısı geliştirdim.',
        'Bugün; kurumsal iş analizi, yapay zekâ destekli süreç otomasyonu, spor yönetim platformları ve dijital ürün stratejisi alanlarında aktif olarak çalışıyor; analitik düşünceyi uygulanabilir sistemlere dönüştürüyorum.',
      ],
      careerJourney: [
        {
          role: 'Tech Analyst',
          organization: '',
          summary:
            'Kurumsal yazılım, iş süreçleri analizi, gereksinim yönetimi ve dijital dönüşüm projelerinde stratejik iş birimleri ile teknik ekipler arasında köprü görevi üstlenerek süreçlerin veriye dayalı şekilde modernize edilmesine liderlik ediyorum.',
        },
        {
          role: 'Kurucu',
          organization: 'Sporsepeti',
          websiteUrl: 'https://sporsepeti.com.tr',
          websiteLabel: 'sporsepeti.com.tr',
          summary:
            'Spor kulüpleri, işletmeler ve spor meraklıları için dijital yönetim yazılımları, etkinlik keşif platformları ve spor içerikleri sunan spor teknolojileri girişiminin ürün ve büyüme stratejisine liderlik ediyorum.',
        },
        {
          role: 'Kurucu',
          organization: 'SportsFly',
          websiteUrl: 'https://sportsfly.com.tr',
          websiteLabel: 'sportsfly.com.tr',
          summary:
            'Spor okulları, kulüpler ve tesisler için sporcu kayıt, yoklama, aidat, antrenman ve veli iletişimi süreçlerini tek çatı altında toplayan SaaS yönetim platformunu geliştiriyorum.',
        },
        {
          role: 'Kurucu',
          organization: 'SportTech Türkiye',
          websiteUrl: 'https://sporttech.com.tr',
          websiteLabel: 'sporttech.com.tr',
          summary:
            'Türkiye’de spor teknolojileri ekosistemini, girişimcileri, kulüpleri ve akademiyi bir araya getiren inovasyon ve bilgi paylaşım topluluğuna liderlik ediyorum.',
        },
        {
          role: 'Spor ve Dijital Stratejiler Koordinatörü',
          organization: 'Üniversite',
          summary:
            'Üniversite bünyesindeki spor organizasyonlarının dijitalleşmesi, stratejik planlama, paydaş koordinasyonu ve yenilikçi dijital kanal modellerinin geliştirilmesi süreçlerini yönettim.',
        },
        {
          role: 'Dijital Kanallar Uzmanı',
          organization: 'Üniversite',
          summary:
            'Kurumsal dijital kanalların yapılandırılması, kullanıcı deneyimi optimizasyonu, dijital iletişim mimarisi ve performans analizleri üzerine çalıştım.',
        },
      ],
      education: [
        {
          institution: 'Marmara Üniversitesi',
          program: 'Bilişim Teknolojileri',
          degree: 'Lisansüstü / Uzmanlık Eğitimi',
          focus:
            'Kurumsal bilgi sistemleri, veri analitiği, dijital platformlar ve spor ekosisteminde teknoloji entegrasyonu.',
        },
        {
          institution: 'Marmara Üniversitesi',
          program: 'Spor Yöneticiliği',
          degree: 'Lisans Eğitimi',
          focus:
            'Spor organizasyon yönetimi, kurumsal strateji, tesis işletmeciliği ve spor ekonomisi temelleri.',
        },
      ],
      affiliations: [
        {
          organization: 'Spor Teknolojileri ve SportTech Girişimcilik Ağı',
          role: 'Kurucu & Ekosistem Katılımcısı',
          description:
            'Spor kulüpleri, akademiler ve teknoloji geliştiricileri arasında dijital ürün ve veri iş birlikleri.',
        },
        {
          organization: 'İş Analizi ve Kurumsal Dijital Dönüşüm Toplulukları',
          role: 'Profesyonel Üye & Bilgi Paylaşımcısı',
          description:
            'Süreç mimarisi, çevik iş analizi ve yapay zekâ destekli kurumsal dönüşüm üzerine mesleki paylaşımlar.',
        },
        {
          organization: 'Spor Federasyonları ve Çeşitli Spor Dernekleri',
          role: 'Üye & Kurumsal Paydaş',
          description:
            'Ulusal spor federasyonları ve çeşitli spor dernekleriyle dijitalleşme, organizasyon yönetimi ve spor ekosisteminin gelişimine yönelik aktif üyelik ve iş birlikleri.',
        },
        {
          organization: 'Üniversite & Akademik Araştırma Ağları',
          role: 'Araştırmacı & Danışman Paydaş',
          description:
            'Spor bilimleri ve bilişim teknolojileri kesişiminde disiplinlerarası çalışma ve konferans etkileşimleri.',
        },
      ],
      visionAndApproach:
        'Teknoloji tek başına bir amaç değil; doğru kurgulanmış bir stratejinin ve net tanımlanmış bir ihtiyacın kaldıraç gücüdür. Çalışma yaklaşımım; spor yönetimi perspektifiyle spor kulüpleri, spor federasyonları, spor işletmeleri ve kurumsal yapılar için karmaşık problemleri yalınlaştırmak, veriye dayalı karar mekanizmaları kurmak ve sahanın gerçek operasyonlarına doğrudan temas eden sürdürülebilir dijital mimariler üretmek üzerine kuruludur.',
    },
  },
  en: {
    location: 'Istanbul, Türkiye',
    portraitAlt: 'Selman Utku – Conference panel portrait',
    hero: {
      title: 'A Strategic Vision for the',
      titleAccent: 'Future of Sports.',
      subtitle: 'Digital Transformation | Innovation | Sports Technology',
      intro:
        'Working at the intersection of sports management, technology, and digital transformation — focused on elevating business processes through technology and creating measurable value with AI and automation solutions.',
      slogan: 'Change is inevitable. Growth is optional.',
      sloganAuthor: 'John C. Maxwell',
      primaryCta: 'About Me',
      secondaryCta: 'Explore Projects',
    },
    footerSummary:
      'Building institutional value and sustainable product ecosystems across digital transformation, innovation, artificial intelligence, and sports technology.',
    brandPillars: [
      {
        index: '01',
        title: 'Digital Transformation & Analysis',
        description:
          'Analyzing end-to-end organizational workflows to architect lean operations, automation systems, and measurable efficiency.',
      },
      {
        index: '02',
        title: 'Sports Technology & Ventures',
        description:
          'Developing scalable digital management platforms and product ecosystems for sports academies, clubs, and facilities.',
      },
      {
        index: '03',
        title: 'Strategy & Academic Depth',
        description:
          'Combining hands-on field experience with scientific research discipline to build durable long-term strategy.',
      },
    ],
    about: {
      heading: 'About',
      lead: 'Uniting technology, business analysis, and sports management within a single strategic framework to deliver lasting digital value for institutions and ventures.',
      professionalProfile: [
        'I have built my career around analyzing enterprise workflows, designing digital strategies, and delivering technology-driven transformation initiatives. Combining my foundation in sports management with information technologies and technical analysis allows me to bring a multidisciplinary lens to both corporate environments and early-stage ventures.',
        'Today, I focus on technology analysis, AI-assisted workflow automation, sports management platforms, and digital product strategy — turning analytical clarity into practical, resilient systems.',
      ],
      careerJourney: [
        {
          role: 'Tech Analyst',
          organization: '',
          summary:
            'Bridging strategic business units and engineering teams across enterprise software, process analysis, requirements engineering, and data-driven digital transformation initiatives.',
        },
        {
          role: 'Founder',
          organization: 'Sporsepeti',
          websiteUrl: 'https://sporsepeti.com.tr',
          websiteLabel: 'sporsepeti.com.tr',
          summary:
            'Leading product strategy and growth for a sports technology venture offering digital management software, event discovery platforms, and sports content for clubs, businesses, and sports enthusiasts.',
        },
        {
          role: 'Founder',
          organization: 'SportsFly',
          websiteUrl: 'https://sportsfly.com.tr',
          websiteLabel: 'sportsfly.com.tr',
          summary:
            'Building an end-to-end SaaS management platform unifying athlete registration, attendance, dues tracking, training schedules, and parent communication for sports clubs and academies.',
        },
        {
          role: 'Founder',
          organization: 'SportTech Türkiye',
          websiteUrl: 'https://sporttech.com.tr',
          websiteLabel: 'sporttech.com.tr',
          summary:
            'Leading an ecosystem and innovation platform connecting sports technology founders, clubs, industry leaders, and academia across Türkiye.',
        },
        {
          role: 'Sports & Digital Strategies Coordinator',
          organization: 'University',
          summary:
            'Led the digitalization of university sports organizations, strategic planning, multi-stakeholder coordination, and innovative digital channel models.',
        },
        {
          role: 'Digital Channels Specialist',
          organization: 'University',
          summary:
            'Managed institutional digital channels, user experience optimization, digital communication architecture, and analytics-driven performance improvements.',
        },
      ],
      education: [
        {
          institution: 'Marmara University',
          program: 'Information Technologies',
          degree: 'Graduate Studies',
          focus:
            'Enterprise information systems, data analytics, digital platforms, and technology integration across sports ecosystems.',
        },
        {
          institution: 'Marmara University',
          program: 'Sports Management',
          degree: "Bachelor's Degree",
          focus:
            'Sports organization management, institutional strategy, facility operations, and foundations of sports economics.',
        },
      ],
      affiliations: [
        {
          organization: 'Sports Technology & SportTech Venture Network',
          role: 'Founder & Ecosystem Contributor',
          description:
            'Building digital product and data collaborations between sports clubs, academies, and technology builders.',
        },
        {
          organization: 'Business Analysis & Digital Transformation Communities',
          role: 'Professional Member & Contributor',
          description:
            'Knowledge sharing on process architecture, agile analysis, and AI-enabled institutional transformation.',
        },
        {
          organization: 'Sports Federations & Sports Associations',
          role: 'Member & Institutional Stakeholder',
          description:
            'Active membership and collaboration with national sports federations and sports associations supporting digitalization, governance, and ecosystem growth.',
        },
        {
          organization: 'University & Academic Research Networks',
          role: 'Researcher & Advisory Stakeholder',
          description:
            'Interdisciplinary research and conference engagement at the intersection of sports sciences and information technology.',
        },
      ],
      visionAndApproach:
        'Technology is not an end in itself — it is a lever powered by clear strategy and accurately defined needs. Guided by a sports management perspective, my approach centers on simplifying complex challenges for sports clubs, sports federations, athletic enterprises, and institutions — establishing data-informed decision mechanisms and crafting sustainable digital architectures grounded in real on-the-ground operations.',
    },
  },
};

export function getProfileContent(lang: Language): LocalizedProfile {
  return PROFILE_BY_LANG[lang];
}
