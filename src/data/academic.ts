import type { Language } from '../lib/i18n';

export interface AcademicDegree {
  institution: string;
  department: string;
  level: string;
  status: string;
  description: string;
}

export interface AcademicPublication {
  title: string;
  venue: string;
  year: string;
  status: string;
  summary: string;
}

export interface ConferenceItem {
  title: string;
  event: string;
  year: string;
  status: string;
  topic: string;
}

export interface AcademicProfileData {
  heading: string;
  lead: string;
  education: AcademicDegree[];
  doctoralStudies: {
    title: string;
    status: string;
    summary: string;
    focusPoints: string[];
  };
  researchAreas: string[];
  publications: AcademicPublication[];
  conferences: ConferenceItem[];
  academicInterests: string[];
}

const ACADEMIC_BY_LANG: Record<Language, AcademicProfileData> = {
  tr: {
    heading: 'Akademik Çalışmalar',
    lead: 'Profesyonel saha ve teknoloji deneyimimizi bilimsel araştırma disipliniyle bütünleştiriyor; spor teknolojileri, spor bilişimi, spor yönetimi ve dijital dönüşüm ekseninde akademik çalışmalarımızı sürdürüyoruz.',
    education: [
      {
        institution: 'Marmara Üniversitesi',
        department: 'Bilişim Teknolojileri',
        level: 'Lisansüstü Eğitim',
        status: 'Tamamlandı',
        description:
          'Kurumsal bilgi sistemleri, dijital platformlar, veri analitiği ve teknoloji uygulamaları üzerine uzmanlaşma.',
      },
      {
        institution: 'Marmara Üniversitesi',
        department: 'Spor Yöneticiliği',
        level: 'Lisans Eğitimi',
        status: 'Tamamlandı',
        description:
          'Spor organizasyonlarının yönetimi, stratejik planlama, tesis işletmeciliği ve spor ekonomisi alanlarında temel akademik eğitim.',
      },
    ],
    doctoralStudies: {
      title: 'Akademik Araştırmalar',
      status: 'Devam Ediyor · Araştırma ve Hazırlık Sürecinde',
      summary:
        'Spor yönetimi, kurumsal dijital dönüşüm, yapay zekâ destekli karar destek mekanizmaları ve SportTech ekosistemlerinin kurumsal olgunluk modelleri üzerine akademik literatür taraması, araştırma tasarımı ve saha odaklı çalışmalar yürütüyoruz.',
      focusPoints: [
        'Spor organizasyonlarında dijital olgunluk ve süreç dönüşüm çerçeveleri',
        'Yapay zekâ ve veri analitiğinin spor yönetiminde karar alma süreçlerine etkisi',
        'SportTech girişimlerinin sürdürülebilir iş modelleri ve kullanıcı benimseme dinamikleri',
      ],
    },
    researchAreas: [
      'Spor Teknolojileri (SportTech) ve Dijital Spor Platformları',
      'Kurumsal Dijital Dönüşüm ve İş Süreçleri Analizi',
      'Yapay Zekâ Destekli Yönetim ve Karar Destek Sistemleri',
      'Spor Yönetiminde Veri Analitiği ve Dijital Olgunluk Modelleri',
      'Teknoloji Stratejisi ve İnovasyon Yönetimi',
      'Spor Girişimciliği ve Yeni Nesil İş Modelleri',
      'Liderlik ve Stratejik Yönetim Yaklaşımları',
      'Mindfulness ve Sürdürülebilir Performans',
    ],
    publications: [
      {
        title: 'Spor Organizasyonlarında Dijital Dönüşüm ve Yönetim Bilişim Sistemlerinin Rolü',
        venue: 'Spor Bilimleri ve Teknoloji Araştırmaları',
        year: '2025',
        status: 'Hazırlık / Değerlendirme Sürecinde',
        summary:
          'Spor kulüpleri ve tesis yönetiminde dijital platformların operasyonel verimlilik ve karar alma süreçlerine katkısını inceleyen kavramsal ve uygulamalı araştırma çalışması.',
      },
      {
        title: 'Yapay Zekâ Tabanlı İş Süreçleri Otomasyonunun Kurumsal Verimlilik Üzerindeki Etkileri',
        venue: 'Dijital Dönüşüm ve Yönetim Bilişimi Çalışmaları',
        year: '2026',
        status: 'Taslak / Araştırma Aşamasında',
        summary:
          'Kurumsal iş analizi perspektifiyle üretken yapay zekâ uygulamalarının süreç kalitesi ve iş yükü optimizasyonu açısından değerlendirilmesi.',
      },
    ],
    conferences: [
      {
        title: 'Spor Teknolojileri ve Dijital Ekosistemler Üzerine Sektörel-Akademik Perspektifler',
        event: 'Ulusal Spor Bilimleri ve Teknoloji Buluşmaları',
        year: '2025',
        status: 'Bildiri & Panel Katılımı',
        topic: 'SportTech uygulamaları, tesis dijitalleşmesi ve üniversite-girişim etkileşimi.',
      },
      {
        title: 'Kurumsal Dijital Dönüşümde Süreç Analizi ve Yapay Zekâ Entegrasyonu',
        event: 'Bilişim, Strateji ve İnovasyon Sempozyumu',
        year: '2026',
        status: 'Hazırlık Aşamasında',
        topic: 'İş analizi metodolojileri ile yapay zekâ destekli otomasyon mimarilerinin bütünleştirilmesi.',
      },
    ],
    academicInterests: [
      'Spor Bilişimi',
      'Sporda Bilişim Teknolojileri',
      'Spor Yönetimi',
      'Dijital Olgunluk Modelleri',
      'İnovasyon Yönetimi',
      'Spor Girişimciliği',
      'Liderlik',
      'Mindfulness',
      'Yapay Zekâ Yönetişimi',
      'Spor Ekonomisinde Dijitalleşme',
      'İnsan-Bilgisayar Etkileşimi',
      'Stratejik Teknoloji Yönetimi',
    ],
  },
  en: {
    heading: 'Academic Profile',
    lead: 'Integrating real-world industry and technology experience with scientific research across sports technology, sports informatics, sports management, and digital transformation.',
    education: [
      {
        institution: 'Marmara University',
        department: 'Information Technologies',
        level: 'Graduate Studies',
        status: 'Completed',
        description:
          'Specialization in enterprise information systems, digital platforms, data analytics, and applied technology solutions.',
      },
      {
        institution: 'Marmara University',
        department: 'Sports Management',
        level: "Bachelor's Degree",
        status: 'Completed',
        description:
          'Core academic training in sports organization leadership, strategic planning, facility management, and sports economics.',
      },
    ],
    doctoralStudies: {
      title: 'Academic Research',
      status: 'In Progress · Research & Preparation Phase',
      summary:
        'Conducting academic literature reviews, research design, and applied studies focused on sports management, institutional digital transformation, AI-assisted decision support, and digital maturity models in SportTech ecosystems.',
      focusPoints: [
        'Digital maturity and process transformation frameworks in sports organizations',
        'Impact of artificial intelligence and data analytics on sports management decisions',
        'Sustainable business models and user adoption dynamics in SportTech ventures',
      ],
    },
    researchAreas: [
      'Sports Technology (SportTech) & Digital Sports Platforms',
      'Enterprise Digital Transformation & Process Analysis',
      'AI-Assisted Management & Decision Support Systems',
      'Data Analytics & Digital Maturity in Sports Governance',
      'Technology Strategy & Innovation Management',
      'Sports Entrepreneurship & Next-Generation Business Models',
      'Leadership & Strategic Management Approaches',
      'Mindfulness & Sustainable Performance',
    ],
    publications: [
      {
        title: 'The Role of Digital Transformation and Management Information Systems in Sports Organizations',
        venue: 'Sports Sciences & Technology Research',
        year: '2025',
        status: 'In Preparation / Under Review',
        summary:
          'Conceptual and applied study examining how digital platforms enhance operational efficiency and decision quality across sports clubs and facilities.',
      },
      {
        title: 'Effects of AI-Driven Workflow Automation on Enterprise Productivity',
        venue: 'Digital Transformation & Management Informatics Studies',
        year: '2026',
        status: 'Draft / Research Stage',
        summary:
          'Evaluating generative AI integration in terms of process quality and workload optimization from an enterprise business analysis lens.',
      },
    ],
    conferences: [
      {
        title: 'Industry-Academic Perspectives on Sports Technology and Digital Ecosystems',
        event: 'National Sports Sciences & Technology Forums',
        year: '2025',
        status: 'Paper & Panel Participation',
        topic: 'SportTech implementations, facility digitalization, and university-venture collaboration.',
      },
      {
        title: 'Process Analysis and Artificial Intelligence Integration in Enterprise Transformation',
        event: 'Informatics, Strategy & Innovation Symposium',
        year: '2026',
        status: 'In Preparation',
        topic: 'Bridging business analysis methodologies with AI-supported automation architectures.',
      },
    ],
    academicInterests: [
      'Sports Informatics',
      'Information Technologies in Sports',
      'Sports Management',
      'Digital Maturity Models',
      'Innovation Management',
      'Sports Entrepreneurship',
      'Leadership',
      'Mindfulness',
      'AI Governance',
      'Digitalization in Sports Economics',
      'Human-Computer Interaction',
      'Strategic Technology Management',
    ],
  },
};

export function getAcademicProfile(lang: Language): AcademicProfileData {
  return ACADEMIC_BY_LANG[lang];
}
