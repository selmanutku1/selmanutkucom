import type { Language } from '../lib/i18n';

export type ExpertiseIconKey = 'workflow' | 'cpu' | 'activity' | 'compass';

export interface ExpertiseArea {
  id: string;
  index: string;
  title: string;
  icon: ExpertiseIconKey;
  description: string;
  capabilities: string[];
}

const EXPERTISE_BY_LANG: Record<Language, ExpertiseArea[]> = {
  tr: [
    {
      id: 'dijital-donusum',
      index: '01',
      title: 'Dijital Dönüşüm',
      icon: 'workflow',
      description:
        'Kurumların mevcut operasyonlarını derinlemesine analiz ederek manuel yükleri azaltan, ölçülebilir ve ölçeklenebilir dijital iş modelleri kurguluyorum.',
      capabilities: [
        'İş süreçleri analizi',
        'Süreç geliştirme',
        'Dijitalleşme',
        'Kurumsal otomasyon',
      ],
    },
    {
      id: 'yapay-zeka-ve-teknoloji',
      index: '02',
      title: 'Yapay Zekâ ve Teknoloji',
      icon: 'cpu',
      description:
        'Üretken yapay zekâ ve veri analitiğini gerçek iş akışlarına entegre ederek karar alma hızını ve kurumsal verimliliği üst seviyeye taşıyorum.',
      capabilities: [
        'Yapay zekâ çözümleri',
        'AI destekli iş süreçleri',
        'Veri analizi',
        'Teknoloji uygulamaları',
      ],
    },
    {
      id: 'spor-teknolojileri',
      index: '03',
      title: 'Spor Teknolojileri',
      icon: 'activity',
      description:
        'Spor okulları, kulüpler ve tesisler için yönetimden sporcu verisine kadar uçtan uca dijital platformlar ve SportTech ürünleri tasarlıyorum.',
      capabilities: [
        'SportTech',
        'Spor yönetim sistemleri',
        'Dijital spor platformları',
        'Spor verisi ve analitiği',
      ],
    },
    {
      id: 'teknoloji-stratejisi',
      index: '04',
      title: 'Teknoloji Stratejisi',
      icon: 'compass',
      description:
        'Kurumsal hedeflerle uyumlu ürün yol haritaları, inovasyon portföyleri ve teknoloji odaklı büyüme stratejileri oluşturuyorum.',
      capabilities: [
        'Dijital strateji',
        'İnovasyon yönetimi',
        'Teknoloji odaklı iş geliştirme',
        'Stratejik planlama',
      ],
    },
  ],
  en: [
    {
      id: 'dijital-donusum',
      index: '01',
      title: 'Digital Transformation',
      icon: 'workflow',
      description:
        'Analyzing institutional operations in depth to design measurable, scalable digital workflows that eliminate manual bottlenecks.',
      capabilities: [
        'Business process analysis',
        'Process optimization',
        'Digitalization',
        'Enterprise automation',
      ],
    },
    {
      id: 'yapay-zeka-ve-teknoloji',
      index: '02',
      title: 'Artificial Intelligence & Technology',
      icon: 'cpu',
      description:
        'Integrating generative AI and data analytics directly into real operational pipelines to accelerate decision-making and productivity.',
      capabilities: [
        'AI solutions',
        'AI-powered business workflows',
        'Data analysis',
        'Applied technology systems',
      ],
    },
    {
      id: 'spor-teknolojileri',
      index: '03',
      title: 'Sports Technology',
      icon: 'activity',
      description:
        'Designing end-to-end digital platforms and SportTech products for sports schools, clubs, and facilities — from operations to athlete data.',
      capabilities: [
        'SportTech',
        'Sports management systems',
        'Digital sports platforms',
        'Sports data & analytics',
      ],
    },
    {
      id: 'teknoloji-stratejisi',
      index: '04',
      title: 'Technology Strategy',
      icon: 'compass',
      description:
        'Crafting product roadmaps, innovation portfolios, and technology-led growth strategies aligned with long-term institutional goals.',
      capabilities: [
        'Digital strategy',
        'Innovation management',
        'Tech-driven business development',
        'Strategic planning',
      ],
    },
  ],
};

export function getExpertiseAreas(lang: Language): ExpertiseArea[] {
  return EXPERTISE_BY_LANG[lang];
}
