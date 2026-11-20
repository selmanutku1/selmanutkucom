import type { Language } from '../lib/i18n';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  slug: string;
  index: string;
  title: string;
  category: string;
  year: string;
  shortDescription: string;
  coverImage: string;
  coverAlt: string;
  overview: string;
  problemAndNeed: string[];
  solutionDeveloped: string[];
  technologies: string[];
  screenshots: ProjectScreenshot[];
  outcomes: string[];
  projectUrl?: string;
  projectUrlLabel?: string;
  seoTitle: string;
  seoDescription: string;
}

const SPORTTECH_TR_LOGO = '/assets/aistudio/1705766270488_925cf152.jpg';
const SPORSEPETI_SPORTSFLY_LOGO = '/assets/aistudio/images__1__e22ba1d6.jpg';

const PROJECTS_BY_LANG: Record<Language, ProjectItem[]> = {
  tr: [
    {
      slug: 'sporttech-turkiye',
      index: '01',
      title: 'SportTech Türkiye',
      category: 'Spor Teknolojileri · Ekosistem & Topluluk',
      year: '2023 – Güncel',
      shortDescription:
        'Türkiye’de spor teknolojileri ekosistemini, girişimcileri, kulüpleri ve akademiyi bir araya getiren inovasyon ve bilgi paylaşım platformu.',
      coverImage: SPORTTECH_TR_LOGO,
      coverAlt: 'SportTech Türkiye logosu',
      overview:
        'SportTech Türkiye; spor endüstrisinin dijital dönüşümünü hızlandırmak, yerli ve uluslararası spor teknolojisi girişimlerini görünür kılmak, kulüpler ile teknoloji üreticileri arasında köprü kurmak amacıyla yapılandırılmış çok paydaşlı bir ekosistem girişimidir.',
      problemAndNeed: [
        'Spor kulüpleri, federasyonlar, üniversiteler ve spor teknolojisi girişimleri çoğu zaman birbirinden kopuk hareket etmekte; sektördeki yenilikçi çözümler ve küresel trendler sistematik biçimde paylaşılamamaktadır.',
        'Türkiye’de spor teknolojileri alanında sürdürülebilir iş birliklerini, saha testlerini ve sektörel farkındalığı büyütecek merkezi bir topluluk yapısına ihtiyaç duyulmaktadır.',
      ],
      solutionDeveloped: [
        'Girişimciler, spor yöneticileri, yatırımcılar ve akademisyenleri ortak bir vizyon etrafında buluşturan sektörel ağ ve içerik mimarisi oluşturuldu.',
        'Spor teknolojileri trend raporları, ekosistem haritalama çalışmaları, etkinlikler ve disiplinlerarası bilgi paylaşım kanalları kurgulandı.',
        'Yerel SportTech girişimlerinin uluslararası ekosistemlerle etkileşimini güçlendiren iletişim ve iş birliği zemini oluşturuldu.',
      ],
      technologies: [
        'Ekosistem & Topluluk Stratejisi',
        'SportTech Trend Analizi',
        'Dijital İçerik & Medya Mimarisi',
        'Paydaş ve İş Birliği Yönetimi',
        'İnovasyon & Girişimcilik Ağı',
      ],
      screenshots: [],
      outcomes: [
        'Spor teknolojileri alanında kurumsal aktörler, girişimciler ve akademi arasında ortak bir buluşma zemini oluşturuldu.',
        'Türkiye’de SportTech kavramının, veri odaklı spor yönetiminin ve dijital dönüşüm vizyonunun bilinirliği artırıldı.',
        'Yeni nesil spor girişimleri ve kulüp iş birlikleri için sürdürülebilir bir etkileşim ağı geliştirildi.',
      ],
      projectUrl: 'https://sporttech.com.tr',
      projectUrlLabel: 'sporttech.com.tr',
      seoTitle: 'SportTech Türkiye – Spor Teknolojileri Ekosistemi | Selman Utku',
      seoDescription:
        'Türkiye spor teknolojileri ekosistemini, girişimcileri, kulüpleri ve akademiyi bir araya getiren SportTech Türkiye platformu.',
    },
    {
      slug: 'sporsepeti',
      index: '02',
      title: 'Sporsepeti',
      category: 'Spor Bilgi Teknolojisi · Spor Ekosistemi',
      year: '2023 – Güncel',
      shortDescription:
        'Sporsepeti (sporsepeti.com.tr), spor kulüpleri, işletmeler ve spor meraklıları için dijital yönetim yazılımları, etkinlik keşif platformları ve spor içerikleri sunan bir spor teknolojileri girişimidir.',
      coverImage: SPORSEPETI_SPORTSFLY_LOGO,
      coverAlt: 'Sporsepeti logosu',
      overview:
        'Sporsepeti (sporsepeti.com.tr); spor kulüpleri, spor işletmeleri ve spor meraklıları için dijital yönetim yazılımları, etkinlik keşif platformları ve spor içeriklerini tek bir çatı altında sunan kapsamlı bir spor bilgi teknolojisi ve SportTech girişimidir.',
      problemAndNeed: [
        'Spor kulüpleri, tesis işletmeleri ve spor meraklıları; yönetim araçları, etkinlik keşfi ve nitelikli spor içeriklerine parçalı ve birbirinden kopuk platformlar üzerinden ulaşmaktadır.',
        'Spor ekosistemindeki farklı paydaşları tek bir dijital bilgi teknolojisi altyapısında buluşturan, ölçülebilir ve ölçeklenebilir bir platform yapısına ihtiyaç duyulmaktadır.',
      ],
      solutionDeveloped: [
        'Spor kulüpleri ve işletmeler için operasyonel verimliliği artıran dijital yönetim yazılımları ve modüler ürün mimarisi geliştirildi.',
        'Spor meraklılarının branş bazlı etkinlik, turnuva ve organizasyonlara kolayca ulaşabileceği etkinlik keşif platformu kurgulandı.',
        'Arama motoru uyumlu spor içerikleri ve ekosistem modülleriyle çok yönlü bir spor bilgi teknolojisi altyapısı oluşturuldu.',
      ],
      technologies: [
        'Spor Bilgi Teknolojisi Mimarisi',
        'Dijital Yönetim Yazılımları',
        'Etkinlik Keşif Platformu',
        'Teknik SEO & Schema.org',
        'Analitik & Ekosistem Ölçümleme',
      ],
      screenshots: [],
      outcomes: [
        'Spor kulüpleri, işletmeler ve spor meraklılarını tek ekosistemde buluşturan çok katmanlı bir dijital ürün altyapısı kuruldu.',
        'Etkinlik keşfi, yönetim araçları ve spor içerikleri bir araya getirilerek sürdürülebilir kullanıcı etkileşimi sağlandı.',
        'Türkiye spor teknolojileri ekosisteminde ölçeklenebilir ve yenilikçi bir spor bilgi teknolojisi markası konumlandırıldı.',
      ],
      projectUrl: 'https://sporsepeti.com.tr',
      projectUrlLabel: 'sporsepeti.com.tr',
      seoTitle: 'Sporsepeti – Spor Bilgi Teknolojisi ve Spor Ekosistemi | Selman Utku',
      seoDescription:
        'Sporsepeti (sporsepeti.com.tr), spor kulüpleri, işletmeler ve spor meraklıları için dijital yönetim yazılımları, etkinlik keşif platformları ve spor içerikleri sunan bir spor teknolojileri girişimidir.',
    },
    {
      slug: 'sportsfly',
      index: '03',
      title: 'SportsFly',
      category: 'Spor Teknolojileri · SaaS Platformu',
      year: '2024 – Güncel',
      shortDescription:
        'Spor okulları, kulüpler ve spor tesisleri için geliştirilen uçtan uca dijital yönetim platformu.',
      coverImage: SPORSEPETI_SPORTSFLY_LOGO,
      coverAlt: 'SportsFly logosu',
      overview:
        'SportsFly; spor okulları, amatör ve profesyonel kulüpler ile spor tesislerinin sporcu kayıt, yoklama, aidat, antrenman planlama, veli iletişimi ve gelişim takibi süreçlerini tek bir merkezi platformda birleştiren modern bir SportTech yazılım ekosistemidir.',
      problemAndNeed: [
        'Birçok spor okulu ve kulüp; sporcu kayıtlarını, ödeme takibini, antrenman programlarını ve veli bilgilendirmelerini birbirinden kopuk tablolar ve mesajlaşma grupları üzerinden yürütmektedir.',
        'Bu dağınık yapı; veri kaybına, operasyonel zaman maliyetine, şeffaf olmayan finansal takibe ve sporcu gelişim geçmişinin ölçülememesine yol açmaktadır.',
      ],
      solutionDeveloped: [
        'Kulüp yöneticileri, antrenörler ve veliler için rol bazlı, yalın ve mobil uyumlu bir merkezi yönetim mimarisi tasarlandı.',
        'Sporcu profili, grup ve şube yönetimi, düzenli yoklama ve aidat takibi, otomatik bilgilendirme akışları ve yönetici raporlama panelleri tek çatı altında birleştirildi.',
        'İş analizi temelli ürün geliştirme yaklaşımıyla, saha gerçekliğine tam uyumlu ve düşük öğrenme eşiğine sahip modüler ekranlar oluşturuldu.',
      ],
      technologies: [
        'React & TypeScript',
        'Next.js Mimarisi',
        'Modern REST API',
        'İlişkisel Veri Modelleme',
        'Rol Bazlı Yetkilendirme',
        'Bulut Altyapı & Analitik',
      ],
      screenshots: [],
      outcomes: [
        'Spor okulları için kayıt, yoklama ve aidat süreçlerinde standartlaştırılmış dijital iş akışı oluşturuldu.',
        'Antrenör ve yönetici operasyon yükünü azaltan, veli iletişimini şeffaflaştıran merkezi veri yapısı kuruldu.',
        'SportTech alanında büyümeye elverişli, yeni modüllerle genişletilebilir ürün mimarisi hayata geçirildi.',
      ],
      projectUrl: 'https://sportsfly.com.tr',
      projectUrlLabel: 'sportsfly.com.tr',
      seoTitle: 'SportsFly – Spor Okulları ve Kulüpler İçin Dijital Yönetim Platformu | Selman Utku',
      seoDescription:
        'Spor okulları, kulüpler ve tesisler için geliştirilen SportsFly dijital yönetim platformunun problem tanımı, çözüm mimarisi ve proje çıktıları.',
    },
  ],
  en: [
    {
      slug: 'sporttech-turkiye',
      index: '01',
      title: 'SportTech Türkiye',
      category: 'Sports Technology · Ecosystem & Community',
      year: '2023 – Present',
      shortDescription:
        'An innovation and knowledge-sharing platform uniting sports technology founders, clubs, industry leaders, and academia across Türkiye.',
      coverImage: SPORTTECH_TR_LOGO,
      coverAlt: 'SportTech Türkiye logo',
      overview:
        'SportTech Türkiye is a multi-stakeholder ecosystem initiative designed to accelerate digital transformation across the sports industry, elevate local and international SportTech ventures, and bridge sports organizations with technology builders.',
      problemAndNeed: [
        'Sports clubs, federations, universities, and SportTech startups often operate in silos, limiting structured knowledge transfer and real-world pilot collaboration.',
        'The ecosystem needed a dedicated central hub to foster partnerships, showcase emerging technologies, and advance data-driven sports management across Türkiye.',
      ],
      solutionDeveloped: [
        'Established a community and knowledge network connecting founders, club executives, investors, and academic researchers around a shared vision.',
        'Developed SportTech trend perspectives, ecosystem mapping, events, and interdisciplinary publishing channels.',
        'Created a collaboration bridge connecting domestic sports technology initiatives with global industry practices.',
      ],
      technologies: [
        'Ecosystem & Community Strategy',
        'SportTech Trend Intelligence',
        'Digital Content Architecture',
        'Stakeholder & Partnership Management',
        'Innovation & Venture Network',
      ],
      screenshots: [],
      outcomes: [
        'Built a dedicated meeting ground connecting sports organizations, entrepreneurs, and researchers.',
        'Expanded industry awareness around SportTech, data-informed sports management, and digital transformation.',
        'Cultivated a sustainable collaboration network supporting emerging sports ventures and club initiatives.',
      ],
      projectUrl: 'https://sporttech.com.tr',
      projectUrlLabel: 'sporttech.com.tr',
      seoTitle: 'SportTech Türkiye – Sports Technology Ecosystem | Selman Utku',
      seoDescription:
        'SportTech Türkiye — an ecosystem initiative uniting sports technology founders, clubs, industry leaders, and academia.',
    },
    {
      slug: 'sporsepeti',
      index: '02',
      title: 'Sporsepeti',
      category: 'Sports Information Technology · Sports Ecosystem',
      year: '2023 – Present',
      shortDescription:
        'Sporsepeti (sporsepeti.com.tr) is a sports technology venture offering digital management software, event discovery platforms, and sports content for sports clubs, businesses, and sports enthusiasts.',
      coverImage: SPORSEPETI_SPORTSFLY_LOGO,
      coverAlt: 'Sporsepeti logo',
      overview:
        'Sporsepeti (sporsepeti.com.tr) is a comprehensive sports information technology venture delivering digital management software, event discovery platforms, and curated sports content for sports clubs, businesses, and enthusiasts under one ecosystem.',
      problemAndNeed: [
        'Sports clubs, athletic businesses, and sports enthusiasts rely on fragmented, disconnected tools for management operations, event discovery, and reliable sports information.',
        'The ecosystem needed a unified sports information technology infrastructure bringing stakeholders together with scalable software and discoverable digital experiences.',
      ],
      solutionDeveloped: [
        'Built modular digital management software helping sports clubs and businesses streamline daily operations.',
        'Designed an event discovery platform enabling sports enthusiasts to find tournaments, activities, and community events effortlessly.',
        'Combined search-optimized sports content with scalable digital product modules inside one cohesive ecosystem.',
      ],
      technologies: [
        'Sports Information Technology Architecture',
        'Digital Management Software',
        'Event Discovery Platform',
        'Technical SEO & Schema.org',
        'Analytics & Ecosystem Measurement',
      ],
      screenshots: [],
      outcomes: [
        'Established a multi-layered digital ecosystem connecting sports clubs, businesses, and enthusiasts.',
        'Unified management software, event discovery, and sports content to drive sustained user engagement.',
        'Positioned Sporsepeti as a scalable sports information technology venture within the SportTech landscape.',
      ],
      projectUrl: 'https://sporsepeti.com.tr',
      projectUrlLabel: 'sporsepeti.com.tr',
      seoTitle: 'Sporsepeti – Sports Information Technology Venture | Selman Utku',
      seoDescription:
        'Sporsepeti (sporsepeti.com.tr) is a sports technology venture offering digital management software, event discovery platforms, and sports content for clubs, businesses, and enthusiasts.',
    },
    {
      slug: 'sportsfly',
      index: '03',
      title: 'SportsFly',
      category: 'Sports Technology · SaaS Platform',
      year: '2024 – Present',
      shortDescription:
        'End-to-end digital management platform built for sports academies, clubs, and athletic facilities.',
      coverImage: SPORSEPETI_SPORTSFLY_LOGO,
      coverAlt: 'SportsFly logo',
      overview:
        'SportsFly is a modern SportTech software ecosystem unifying athlete registration, attendance tracking, fee management, training schedules, parent communication, and progression analytics into one centralized platform for academies, clubs, and facilities.',
      problemAndNeed: [
        'Many sports academies and clubs manage registrations, membership dues, training rosters, and parent updates across fragmented spreadsheets and messaging groups.',
        'This disjointed setup leads to data loss, administrative overhead, opaque financial tracking, and an inability to measure athlete development over time.',
      ],
      solutionDeveloped: [
        'Designed a role-based, intuitive, mobile-first management architecture tailored for club directors, coaches, and parents.',
        'Consolidated athlete profiles, branch and group rosters, recurring attendance and payment tracking, automated notifications, and executive dashboards.',
        'Applied structured business analysis to keep workflows grounded in real-world coaching routines with minimal onboarding friction.',
      ],
      technologies: [
        'React & TypeScript',
        'Next.js Architecture',
        'Modern REST API',
        'Relational Data Modeling',
        'Role-Based Access Control',
        'Cloud Infrastructure & Analytics',
      ],
      screenshots: [],
      outcomes: [
        'Standardized digital registration, attendance, and dues tracking workflows for sports academies.',
        'Reduced administrative workload for coaches and directors while increasing parent communication transparency.',
        'Established a modular SportTech product foundation ready to scale with analytics extensions.',
      ],
      projectUrl: 'https://sportsfly.com.tr',
      projectUrlLabel: 'sportsfly.com.tr',
      seoTitle: 'SportsFly – Digital Management Platform for Sports Clubs & Academies | Selman Utku',
      seoDescription:
        'Case study of SportsFly — an end-to-end SportTech management platform for sports schools, clubs, and athletic facilities.',
    },
  ],
};

export function getProjects(lang: Language): ProjectItem[] {
  return PROJECTS_BY_LANG[lang];
}

export function getProjectBySlug(slug: string, lang: Language): ProjectItem | undefined {
  return PROJECTS_BY_LANG[lang].find((p) => p.slug === slug);
}
