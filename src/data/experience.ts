import type { Language } from '../lib/i18n';

export interface ExperienceItem {
  id: string;
  organization?: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
  highlights: string[];
  deliverables: string[];
}

const EXPERIENCES_BY_LANG: Record<Language, ExperienceItem[]> = {
  tr: [
    {
      id: 'tech-analyst',
      role: 'Tech Analyst',
      period: 'Güncel',
      location: 'İstanbul',
      summary:
        'Kurumsal dijital dönüşüm, iş süreçleri modelleme, yazılım gereksinim analizi ve veri odaklı teknoloji projelerinin planlanmasından canlıya alınmasına kadar uçtan uca analiz süreçlerini yönetiyorum.',
      responsibilities: [
        'İş birimlerinin operasyonel ihtiyaçlarını analiz ederek kapsamlı fonksiyonel ve teknik gereksinim dokümanları oluşturmak',
        'Mevcut (As-Is) ve hedeflenen (To-Be) iş süreçlerini modelleyerek darboğazları ortadan kaldıran iyileştirme önerileri geliştirmek',
        'Yazılım geliştirme, ürün ve test ekipleri arasında çevik iletişim ve kabul kriterleri yönetimini koordine etmek',
        'Kurumsal sistemlerde yapay zekâ ve otomasyon potansiyeli taşıyan süreçleri tespit edip önceliklendirmek',
      ],
      highlights: [
        'Çok paydaşlı kurumsal dijital dönüşüm modüllerinde analiz standartlarının ve dokümantasyon disiplinlerinin yapılandırılması',
        'Manuel veri toplama ve raporlama süreçlerinin otomatik iş akışlarıyla yeniden kurgulanması',
      ],
      deliverables: [
        'Kurumsal Süreç Mimarisi ve İş Analizi Standart Seti',
        'Dijital Hizmet ve İç Operasyon Modülleri Analiz Çıktıları',
        'Otomasyon ve Karar Destek Raporlama Kurguları',
      ],
    },
    {
      id: 'bilisim-vadisi-spor-teknolojileri-mentoru',
      organization: 'Bilişim Vadisi',
      role: 'Spor Teknolojileri Mentoru',
      period: 'Güncel',
      location: 'Kocaeli / İstanbul',
      summary:
        'Bilişim Vadisi girişimcilik ekosisteminde spor teknolojileri, spor bilişimi ve dijital spor ürünleri geliştiren girişimlere ürün stratejisi, iş modeli kurgusu, ticarileşme ve spor ekosistemi iş birlikleri konularında mentorluk desteği sunuyorum.',
      responsibilities: [
        'Spor teknolojileri ve spor bilişimi girişimlerine ürün-pazar uyumu, değer önerisi ve yol haritası mentorluğu sağlamak',
        'Spor kulüpleri, federasyonlar ve spor işletmeleriyle saha doğrulaması ve iş birliği stratejileri geliştirmek',
        'Girişimlerin ölçeklenebilir SaaS, veri analitiği ve iş modeli kurgularını değerlendirmek',
        'Türkiye SportTech girişimcilik ekosisteminin ulusal ve uluslararası paydaşlarla bağlantısını güçlendirmek',
      ],
      highlights: [
        'Spor teknolojileri dikeyinde erken aşama girişimlere doğrudan saha ve ürün mimarisi rehberliği',
        'Spor yönetimi, spor bilişimi ve teknoloji girişimciliği disiplinlerini birleştiren stratejik mentorluk yaklaşımı',
      ],
      deliverables: [
        'SportTech Girişimleri İçin Ürün & Büyüme Mentorluğu',
        'Spor Kulüpleri ve Federasyonlara Yönelik İş Birliği Kurguları',
        'Ticarileşme ve Dijital Ekosistem Strateji Geri Bildirimleri',
      ],
    },
    {
      id: 'universite-spor-dijital-strateji',
      organization: 'Üniversite',
      role: 'Spor ve Dijital Stratejiler Koordinatörü',
      period: 'Önceki Görev',
      location: 'İstanbul',
      summary:
        'Üniversite ekosisteminde spor yönetimi süreçlerinin dijitalleştirilmesi, kurumsal dijital strateji planlaması ve öğrenci-paydaş deneyimini geliştiren teknoloji girişimlerinin koordinasyonunu üstlendim.',
      responsibilities: [
        'Spor birimleri ve tesis operasyonları için dijital dönüşüm yol haritasının oluşturulması ve uygulanması',
        'Üniversite içi ve dışı spor organizasyonlarında dijital kayıt, takip ve iletişim süreçlerinin kurgulanması',
        'Akademik birimler, idari ekipler ve teknoloji paydaşları arasında stratejik proje koordinasyonunun sağlanması',
        'Dijital dönüşüm performans göstergelerinin (KPI) tanımlanması ve yönetim raporlamalarının hazırlanması',
      ],
      highlights: [
        'Spor yönetimi operasyonlarının geleneksel takip yöntemlerinden merkezi dijital platform yapısına taşınması',
        'Kurumsal spor kültürü ile dijital strateji vizyonunu birleştiren sürdürülebilir yönetim modelinin oluşturulması',
      ],
      deliverables: [
        'Spor ve Dijital Strateji Yol Haritası',
        'Dijital Tesis ve Etkinlik Yönetim İş Akışları',
        'Paydaş İletişim ve Veri Takip Modeli',
      ],
    },
    {
      id: 'universite-dijital-kanallar',
      organization: 'Üniversite',
      role: 'Dijital Kanallar Uzmanı',
      period: 'Önceki Görev',
      location: 'İstanbul',
      summary:
        'Kurumsal dijital temas noktalarının yönetimi, kullanıcı yolculuklarının iyileştirilmesi ve veri temelli dijital kanal performansının geliştirilmesi süreçlerinde görev aldım.',
      responsibilities: [
        'Web platformları ve dijital iletişim kanallarının içerik, yapı ve kullanıcı deneyimi süreçlerini yönetmek',
        'Dijital kanal verilerini analiz ederek etkileşim, erişilebilirlik ve dönüşüm iyileştirmeleri tasarlamak',
        'Kurum içi birimlerle birlikte dijital duyuru, kampanya ve servis akışlarını standartlaştırmak',
        'Yeni nesil dijital araçların ve içerik yönetim süreçlerinin kurumsal yapıya entegrasyonunu desteklemek',
      ],
      highlights: [
        'Kurumsal dijital kanallarda tutarlı marka dili ve bilgi mimarisinin tesis edilmesi',
        'Kullanıcı geri bildirimleri ve analitik veriler doğrultusunda dijital hizmet erişim süreçlerinin sadeleştirilmesi',
      ],
      deliverables: [
        'Dijital Kanal Bilgi Mimarisi ve İyileştirme Raporları',
        'Standartlaştırılmış İçerik ve Yayın İş Akışları',
        'Analitik Performans ve Etkileşim Takip Panoları',
      ],
    },
  ],
  en: [
    {
      id: 'tech-analyst',
      role: 'Tech Analyst',
      period: 'Current',
      location: 'Istanbul',
      summary:
        'Leading end-to-end analysis across enterprise digital transformation, process modeling, software requirements engineering, and data-driven technology initiatives from discovery to production.',
      responsibilities: [
        'Analyzing operational requirements across business units to author comprehensive functional and technical specifications',
        'Modeling current (As-Is) and target (To-Be) workflows to eliminate bottlenecks and design measurable improvements',
        'Coordinating agile alignment and acceptance criteria across engineering, product, and QA teams',
        'Identifying and prioritizing high-impact AI and automation opportunities within enterprise workflows',
      ],
      highlights: [
        'Structured analysis standards and documentation frameworks for multi-stakeholder transformation modules',
        'Redesigned manual data collection and reporting workflows into automated operational pipelines',
      ],
      deliverables: [
        'Enterprise Process Architecture & Analysis Playbook',
        'Digital Service & Internal Operations Analysis Specifications',
        'Automation & Decision-Support Reporting Blueprints',
      ],
    },
    {
      id: 'bilisim-vadisi-spor-teknolojileri-mentoru',
      organization: 'Bilişim Vadisi',
      role: 'Sports Technology Mentor',
      period: 'Current',
      location: 'Kocaeli / Istanbul',
      summary:
        'Mentoring early-stage founders and technology teams within the Bilişim Vadisi innovation ecosystem across sports technology, sports informatics, product strategy, business modeling, commercialization, and sports industry partnerships.',
      responsibilities: [
        'Advising SportTech and sports informatics startups on product-market fit, value proposition, and technical roadmaps',
        'Guiding field validation and institutional partnerships with sports clubs, national federations, and athletic enterprises',
        'Reviewing scalable SaaS, data analytics, and monetization architectures for emerging sports ventures',
        'Strengthening bridges between Türkiye’s SportTech founder community and corporate/academic stakeholders',
      ],
      highlights: [
        'Hands-on product strategy and sports domain mentoring for early-stage SportTech startups',
        'Multidisciplinary guidance uniting sports management, sports informatics, and technology entrepreneurship',
      ],
      deliverables: [
        'Product & Growth Mentoring for SportTech Ventures',
        'Club & Federation Partnership Strategy Playbooks',
        'Commercialization & Ecosystem Positioning Reviews',
      ],
    },
    {
      id: 'universite-spor-dijital-strateji',
      organization: 'University',
      role: 'Sports & Digital Strategies Coordinator',
      period: 'Previous Role',
      location: 'Istanbul',
      summary:
        'Coordinated the digital transformation of university sports operations, institutional digital strategy planning, and technology initiatives elevating student and stakeholder experience.',
      responsibilities: [
        'Developing and executing the digital transformation roadmap for sports departments and facility operations',
        'Designing digital registration, attendance tracking, and communication workflows for campus and inter-university events',
        'Aligning academic departments, administrative teams, and technology partners around strategic projects',
        'Defining transformation KPIs and preparing executive progress reports',
      ],
      highlights: [
        'Transitioned sports administration from fragmented manual tracking to centralized digital workflows',
        'Established a sustainable governance model uniting institutional sports culture with digital strategy',
      ],
      deliverables: [
        'Sports & Digital Strategy Roadmap',
        'Digital Facility & Event Management Workflows',
        'Stakeholder Communication & Data Tracking Framework',
      ],
    },
    {
      id: 'universite-dijital-kanallar',
      organization: 'University',
      role: 'Digital Channels Specialist',
      period: 'Previous Role',
      location: 'Istanbul',
      summary:
        'Managed institutional digital touchpoints, streamlined user journeys, and improved digital channel performance through structured analytics.',
      responsibilities: [
        'Managing information architecture, content workflows, and UX across web platforms and digital communication channels',
        'Analyzing channel performance metrics to drive engagement, accessibility, and conversion improvements',
        'Standardizing announcement, campaign, and digital service flows across internal departments',
        'Supporting the adoption of modern digital tools and editorial governance practices',
      ],
      highlights: [
        'Established consistent brand voice and information architecture across institutional digital channels',
        'Simplified digital service access journeys informed by user feedback and behavioral analytics',
      ],
      deliverables: [
        'Digital Channel Information Architecture & UX Audits',
        'Standardized Editorial & Publishing Workflows',
        'Analytics Performance & Engagement Dashboards',
      ],
    },
  ],
};

export function getExperiences(lang: Language): ExperienceItem[] {
  return EXPERIENCES_BY_LANG[lang];
}
