import type { Language } from '../lib/i18n';
import { translateArticleSlug } from '../lib/routes';

export type ArticleCategoryKey =
  | 'digital-transformation'
  | 'ai'
  | 'sports-tech'
  | 'tech-strategy'
  | 'entrepreneurship'
  | 'innovation';

export interface ArticleCategoryOption {
  key: ArticleCategoryKey;
  label: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleItem {
  slug: string;
  title: string;
  categoryKey: ArticleCategoryKey;
  category: string;
  publishedAt: string;
  isoDate: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  seoTitle: string;
  seoDescription: string;
}

const CATEGORIES_BY_LANG: Record<Language, ArticleCategoryOption[]> = {
  tr: [
    { key: 'digital-transformation', label: 'Dijital Dönüşüm' },
    { key: 'ai', label: 'Yapay Zekâ' },
    { key: 'sports-tech', label: 'Spor Teknolojileri' },
    { key: 'tech-strategy', label: 'Teknoloji Stratejisi' },
    { key: 'entrepreneurship', label: 'Girişimcilik' },
    { key: 'innovation', label: 'İnovasyon' },
  ],
  en: [
    { key: 'digital-transformation', label: 'Digital Transformation' },
    { key: 'ai', label: 'Artificial Intelligence' },
    { key: 'sports-tech', label: 'Sports Technology' },
    { key: 'tech-strategy', label: 'Technology Strategy' },
    { key: 'entrepreneurship', label: 'Entrepreneurship' },
    { key: 'innovation', label: 'Innovation' },
  ],
};

const ARTICLES_BY_LANG: Record<Language, ArticleItem[]> = {
  tr: [
    {
      slug: 'kurumsal-dijital-donusumde-is-analizinin-stratejik-rolu',
      title: 'Kurumsal Dijital Dönüşümde İş Analizinin Stratejik Rolü',
      categoryKey: 'digital-transformation',
      category: 'Dijital Dönüşüm',
      publishedAt: '14 Ekim 2026',
      isoDate: '2026-10-14',
      readTime: '5 dk okuma',
      excerpt:
        'Dijital dönüşüm yalnızca yeni yazılımlar devreye almak değildir. Doğru kurgulanmış iş analizi disiplini, teknoloji yatırımının gerçek kurumsal değere dönüşmesini belirler.',
      coverImage: '/src/assets/images/project_digital_transformation_1795161846316.jpg',
      coverAlt: 'Kurumsal dijital dönüşümde mimari düzen ve stratejik iş analizi',
      keyTakeaways: [
        'Kötü tasarlanmış bir süreci dijitalleştirmek yalnızca verimsizliği hızlandırır.',
        'İş analizi, teknik ekipler ile karar vericiler arasında stratejik çeviri katmanıdır.',
        'Ölçülebilir başarı kriterleri proje başlangıcında tanımlanmalıdır.',
      ],
      sections: [
        {
          heading: 'Neden Pek Çok Dönüşüm Projesi Beklenen Değeri Üretemez?',
          paragraphs: [
            'Kurumların dijital dönüşüm yolculuğunda en sık yaptığı hata, süreci sadeleştirmeden doğrudan yazılım veya araç seçimine geçmektir. Mevcut iş yapış biçimlerindeki belirsizlikler ve yetki karmaşaları çözümlenmeden geliştirilen sistemler, kısa sürede kullanıcı direnciyle karşılaşır.',
            'Gerçek dönüşüm; hangi işin neden yapıldığını sorgulayan, tekrarlayan adımları eleyen ve veri akışını şeffaflaştıran bir iş analizi disipliniyle başlar.',
          ],
        },
        {
          heading: 'Gereksinim Toplamaktan Değer Mimarisine',
          paragraphs: [
            'Modern iş analisti yalnızca paydaşların taleplerini listeleyen bir kayıt tutucu değildir. Asıl sorumluluk; dile getirilen isteklerin arkasındaki kök ihtiyacı tespit etmek, kurumsal stratejiyle örtüşen en yalın çözümü kurgulamak ve kapsamı yönetilebilir fazlara ayırmaktır.',
            'Bu yaklaşım hem geliştirme maliyetlerini kontrol altında tutar hem de canlıya alınan her sürümün kurum içinde somut bir karşılık bulmasını sağlar.',
          ],
        },
        {
          heading: 'Sürdürülebilir Dönüşüm İçin Ölçümleme Kültürü',
          paragraphs: [
            'Bir dijital ürünün canlıya alınması projenin sonu değil, değer üretiminin başlangıcıdır. Süreç tamamlanma süresi, hata oranı ve kullanıcı adaptasyonu gibi net göstergeler takip edilerek sistem sürekli iyileştirilmelidir.',
          ],
        },
      ],
      seoTitle: 'Kurumsal Dijital Dönüşümde İş Analizinin Stratejik Rolü | Selman Utku',
      seoDescription:
        'Dijital dönüşüm projelerinde iş analizinin süreç sadeleştirme, gereksinim yönetimi ve kurumsal değer üretimindeki stratejik rolü.',
    },
    {
      slug: 'yapay-zeka-destekli-is-surecleri-ve-kurumsal-verimlilik',
      title: 'Yapay Zekâ Destekli İş Süreçleri ve Kurumsal Verimlilik',
      categoryKey: 'ai',
      category: 'Yapay Zekâ',
      publishedAt: '28 Eylül 2026',
      isoDate: '2026-09-28',
      readTime: '6 dk okuma',
      excerpt:
        'Üretken yapay zekâyı bireysel denemelerin ötesine taşıyıp kurumsal iş akışlarına güvenli, izlenebilir ve ölçülebilir biçimde entegre etmenin temel ilkeleri.',
      coverImage: '/src/assets/images/project_ai_automation_1795161842262.jpg',
      coverAlt: 'Yapay zekâ destekli kurumsal süreç mimarisi ve ışık geometrisi',
      keyTakeaways: [
        'Yapay zekâ entegrasyonu önce dar kapsamlı ve yüksek getirili süreçlerde doğrulanmalıdır.',
        'İnsan onaylı kontrol mekanizmaları kurumsal güvenilirliğin temelidir.',
        'Veri kalitesi ve süreç standardizasyonu olmadan yapay zekâdan kalıcı verim alınamaz.',
      ],
      sections: [
        {
          heading: 'Bireysel Kullanımdan Kurumsal Entegrasyona Geçiş',
          paragraphs: [
            'Üretken yapay zekâ araçları bireysel üretkenliği hızla artırdı; ancak kurumsal ölçekte kalıcı rekabet avantajı, bu yeteneklerin doğrudan iş süreçlerine entegre edilmesiyle ortaya çıkar. Doküman sınıflandırma, analiz taslağı üretimi, müşteri taleplerinin önceliklendirilmesi ve bilgi tabanı sorgulama gibi alanlar bu geçişin en somut örnekleridir.',
          ],
        },
        {
          heading: 'Doğru Senaryoyu Seçmek ve Riskleri Yönetmek',
          paragraphs: [
            'Her süreç otomasyona veya yapay zekâya uygun değildir. Yüksek hacimli, kuralları belirli ya da metin ağırlıklı operasyonlar ilk odak alanı olmalıdır. Bunun yanında veri gizliliği, çıktı doğrulaması ve yetkilendirme sınırları tasarım aşamasında netleştirilmelidir.',
            'İnsan uzmanlığını devre dışı bırakan değil, uzmanların karar kalitesini güçlendiren hibrit modeller uzun vadede en sağlıklı sonuçları verir.',
          ],
        },
      ],
      seoTitle: 'Yapay Zekâ Destekli İş Süreçleri ve Kurumsal Verimlilik | Selman Utku',
      seoDescription:
        'Kurumlarda üretken yapay zekâ ve süreç otomasyonunun güvenli, ölçülebilir ve sürdürülebilir biçimde uygulanması.',
    },
    {
      slug: 'spor-kulubleri-ve-tesisler-icin-dijital-yonetim-mimarisi',
      title: 'Spor Kulüpleri ve Tesisler İçin Dijital Yönetim Mimarisi',
      categoryKey: 'sports-tech',
      category: 'Spor Teknolojileri',
      publishedAt: '11 Eylül 2026',
      isoDate: '2026-09-11',
      readTime: '5 dk okuma',
      excerpt:
        'Spor okullarından profesyonel kulüplere kadar tüm spor organizasyonlarında veri odaklı yönetim, operasyonel şeffaflık ve SportTech dönüşümü nasıl kurgulanmalı?',
      coverImage: '/src/assets/images/project_sportsfly_platform_1795161841713.jpg',
      coverAlt: 'Modern spor tesisi ve dijital kulüp yönetim platformu',
      keyTakeaways: [
        'Spor organizasyonlarında operasyonel veri, sportif performans verisi kadar kritiktir.',
        'Antrenör, yönetici ve veli deneyimi aynı platformda yalın biçimde birleşmelidir.',
        'Dijitalleşme, spor okullarının ölçeklenebilir büyümesinin ön koşuludur.',
      ],
      sections: [
        {
          heading: 'Spor Yönetiminde Görünmeyen Operasyonel Yük',
          paragraphs: [
            'Spor okulları ve kulüpler saha içinde yüksek disiplinle çalışırken, saha dışındaki idari süreçlerde çoğu zaman parçalı araçlara bağımlı kalır. Yoklama takibi, aidat planlaması, tesis doluluk yönetimi ve veli iletişimi düzenli bir sistemde birleşmediğinde yönetim ekibi stratejik gelişime zaman ayıramaz.',
          ],
        },
        {
          heading: 'Bütünleşik Bir SportTech Platformu Ne Sunmalı?',
          paragraphs: [
            'İyi bir spor yönetim sistemi karmaşık menülerle kullanıcıyı yormamalı; sahadaki antrenörün birkaç saniyede yoklama alabileceği, yöneticinin finansal ve katılım trendlerini anlık görebileceği bir yalınlık sunmalıdır.',
            'SportsFly gibi modern yaklaşımların temel hedefi; spor yöneticiliğinin gerektirdiği kurumsal ciddiyeti modern yazılım ergonomisiyle buluşturmaktır.',
          ],
        },
      ],
      seoTitle: 'Spor Kulüpleri ve Tesisler İçin Dijital Yönetim Mimarisi | Selman Utku',
      seoDescription:
        'Spor okulları, kulüpler ve tesisler için SportTech odaklı dijital yönetim sistemleri ve veri temelli organizasyon yapısı.',
    },
    {
      slug: 'teknoloji-stratejisi-arac-seciminden-deger-mimarisine',
      title: 'Teknoloji Stratejisi: Araç Seçiminden Değer Mimarisine',
      categoryKey: 'tech-strategy',
      category: 'Teknoloji Stratejisi',
      publishedAt: '19 Ağustos 2026',
      isoDate: '2026-08-19',
      readTime: '4 dk okuma',
      excerpt:
        'Teknoloji kararlarını dönemsel trendlerden kurtarıp uzun vadeli iş hedefleriyle hizalayan bütüncül bir stratejik planlama yaklaşımı.',
      coverImage: '/src/assets/images/editorial_strategy_architecture_1795161845108.jpg',
      coverAlt: 'Minimalist mimari yapı ve teknoloji stratejisi perspektifi',
      keyTakeaways: [
        'Teknoloji stratejisi bir yazılım listesi değil, kurumsal önceliklendirme çerçevesidir.',
        'Entegrasyon kabiliyeti ve sürdürülebilirlik, ilk kurulum maliyetinden daha belirleyicidir.',
        'Yol haritaları değişen piyasa koşullarına uyum sağlayabilecek esneklikte olmalıdır.',
      ],
      sections: [
        {
          heading: 'Trendlerin Gürültüsünde Stratejik Netlik',
          paragraphs: [
            'Her yıl onlarca yeni yazılım, platform ve teknoloji kavramı iş dünyasının gündemine giriyor. Güçlü bir teknoloji stratejisi, kurumun neyi yapacağı kadar neyi yapmayacağına da net biçimde karar verebilmesidir.',
          ],
        },
        {
          heading: 'Mimari Uyum ve Uzun Vadeli Esneklik',
          paragraphs: [
            'Birbirleriyle konuşmayan sistemler kurumsal hafızayı parçalar. Stratejik planlama aşamasında veri sahipliği, modülerlik ve entegrasyon standartları merkeze alındığında kurumlar gelecekteki dönüşüm adımlarına çok daha hızlı hazırlanır.',
          ],
        },
      ],
      seoTitle: 'Teknoloji Stratejisi: Araç Seçiminden Değer Mimarisine | Selman Utku',
      seoDescription:
        'Kurumlar için uzun vadeli teknoloji stratejisi oluşturma, önceliklendirme ve değer odaklı mimari planlama ilkeleri.',
    },
    {
      slug: 'sporttech-ekosisteminde-urun-gelistirme-ve-girisimcilik',
      title: 'SportTech Ekosisteminde Ürün Geliştirme ve Girişimcilik',
      categoryKey: 'entrepreneurship',
      category: 'Girişimcilik',
      publishedAt: '03 Ağustos 2026',
      isoDate: '2026-08-03',
      readTime: '5 dk okuma',
      excerpt:
        'Spor sektörünün kendine özgü dinamiklerini anlamadan geliştirilen teknoloji ürünleri sahada tutunamaz. Saha içgörüsüyle beslenen ürün geliştirme prensipleri.',
      coverImage: '/src/assets/images/project_sporsepeti_ecosystem_1795161843771.jpg',
      coverAlt: 'SportTech ürün geliştirme ve dijital spor girişimciliği',
      keyTakeaways: [
        'Spor sektöründe güven ve saha referansı, dijital pazarlama kadar etkilidir.',
        'İlk sürümde az sayıda problemi kusursuz çözmek, karmaşık özellik yığınından değerlidir.',
        'Alan uzmanlığı ile teknoloji yetkinliğinin birleşimi güçlü bir rekabet avantajı yaratır.',
      ],
      sections: [
        {
          heading: 'Saha Gerçekliğini Ürün Kararlarına Taşımak',
          paragraphs: [
            'Spor dünyası sezonluk döngüleri, yüksek insan etkileşimi ve kendine özgü operasyon kültürüyle diğer sektörlerden ayrılır. SportTech girişimlerinde başarı, masa başında kurgulanan varsayımlardan çok antrenörlerle, kulüp yöneticileriyle ve sporcularla kurulan sürekli geri bildirim döngüsünden doğar.',
          ],
        },
        {
          heading: 'Yalın Başlangıç, Sağlam Mimari',
          paragraphs: [
            'Erken aşama bir dijital üründe en kritik denge; pazara hızlı çıkarken teknik ve kavramsal borç biriktirmemektir. Doğru tanımlanmış çekirdek problem, sürdürülebilir abonelik ve büyüme modelinin temelini oluşturur.',
          ],
        },
      ],
      seoTitle: 'SportTech Ekosisteminde Ürün Geliştirme ve Girişimcilik | Selman Utku',
      seoDescription:
        'Spor teknolojileri alanında ürün geliştirme, saha doğrulaması ve sürdürülebilir girişimcilik yaklaşımları.',
    },
    {
      slug: 'kurum-ici-inovasyon-kulturu-ve-surdurulebilir-degisim',
      title: 'Kurum İçi İnovasyon Kültürü ve Sürdürülebilir Değişim',
      categoryKey: 'innovation',
      category: 'İnovasyon',
      publishedAt: '16 Temmuz 2026',
      isoDate: '2026-07-16',
      readTime: '4 dk okuma',
      excerpt:
        'İnovasyonu tek seferlik projelerden çıkarıp kurumun günlük refleksi haline getiren liderlik, süreç tasarımı ve ölçümleme alışkanlıkları.',
      coverImage: '/src/assets/images/editorial_strategy_architecture_1795161845108.jpg',
      coverAlt: 'Kurum içi inovasyon kültürü ve çağdaş mimari çizgiler',
      keyTakeaways: [
        'İnovasyon yalnızca büyük sıçramalar değil, disiplinli ve sürekli iyileştirmeler bütünüdür.',
        'Fikirlerin değerlendirildiği şeffaf bir süreç, ekiplerin dönüşüme sahipliğini artırır.',
        'Akademik merak ve pratik uygulama birlikte yürütüldüğünde yenilikçi bakış derinleşir.',
      ],
      sections: [
        {
          heading: 'İnovasyon Bir Departman Değil, Bir Çalışma Biçimidir',
          paragraphs: [
            'Pek çok kurum inovasyonu yalnızca belirli proje takvimlerine sıkıştırır. Oysa sürdürülebilir yenilik; süreç sahiplerinin mevcut sorunları açıkça dile getirebildiği, küçük pilot uygulamaların hızla test edilebildiği ve öğrenilen derslerin kurumsal hafızaya aktarıldığı bir kültürde filizlenir.',
          ],
        },
        {
          heading: 'Disiplinlerarası Perspektifin Gücü',
          paragraphs: [
            'Farklı disiplinlerin kesişiminde çalışmak — örneğin spor yönetimi deneyimini bilişim teknolojileri ve iş analiziyle birleştirmek — alışılmış kalıpların dışına çıkmayı kolaylaştırır. Gerçek inovasyon çoğu zaman iki farklı dünyanın yöntemlerini bir araya getirmekle başlar.',
          ],
        },
      ],
      seoTitle: 'Kurum İçi İnovasyon Kültürü ve Sürdürülebilir Değişim | Selman Utku',
      seoDescription:
        'Kurumlarda sürdürülebilir inovasyon kültürü oluşturma, pilot doğrulama ve disiplinlerarası yenilik yönetimi.',
    },
  ],
  en: [
    {
      slug: 'strategic-role-of-business-analysis-in-digital-transformation',
      title: 'The Strategic Role of Business Analysis in Enterprise Digital Transformation',
      categoryKey: 'digital-transformation',
      category: 'Digital Transformation',
      publishedAt: 'Oct 14, 2026',
      isoDate: '2026-10-14',
      readTime: '5 min read',
      excerpt:
        'Digital transformation is never just about deploying new software. Disciplined business analysis determines whether technology investments translate into real institutional value.',
      coverImage: '/src/assets/images/project_digital_transformation_1795161846316.jpg',
      coverAlt: 'Architectural order and strategic analysis in digital transformation',
      keyTakeaways: [
        'Digitizing a poorly designed workflow only accelerates inefficiency.',
        'Analysis serves as the strategic translation layer between leadership and engineering.',
        'Measurable success indicators must be defined before development begins.',
      ],
      sections: [
        {
          heading: 'Why Many Transformation Programs Fall Short',
          paragraphs: [
            'The most frequent mistake organizations make during digital transformation is jumping straight to tool selection before simplifying underlying operations. Systems built on ambiguous ownership and redundant approvals inevitably meet user resistance.',
            'Lasting transformation begins with rigorous analysis that questions why each step exists, eliminates friction, and clarifies data flow.',
          ],
        },
        {
          heading: 'From Requirements Gathering to Value Architecture',
          paragraphs: [
            'A modern analyst does far more than transcribe stakeholder wish lists. The real responsibility lies in uncovering root needs behind surface requests, shaping lean solutions aligned with strategy, and phasing delivery effectively.',
            'This discipline keeps engineering costs predictable while ensuring every release delivers concrete operational value.',
          ],
        },
        {
          heading: 'Building a Culture of Continuous Measurement',
          paragraphs: [
            'Launching a digital platform is not the finish line — it is the starting point of value creation. Tracking cycle times, error rates, and adoption metrics enables ongoing refinement.',
          ],
        },
      ],
      seoTitle: 'The Strategic Role of Business Analysis in Digital Transformation | Selman Utku',
      seoDescription:
        'How structured business analysis drives process simplification, clear requirements, and measurable enterprise value.',
    },
    {
      slug: 'ai-powered-business-workflows-and-institutional-productivity',
      title: 'AI-Powered Business Workflows and Institutional Productivity',
      categoryKey: 'ai',
      category: 'Artificial Intelligence',
      publishedAt: 'Sep 28, 2026',
      isoDate: '2026-09-28',
      readTime: '6 min read',
      excerpt:
        'Core principles for moving generative AI beyond individual experimentation into secure, auditable, and measurable organizational workflows.',
      coverImage: '/src/assets/images/project_ai_automation_1795161842262.jpg',
      coverAlt: 'AI-assisted enterprise workflow architecture',
      keyTakeaways: [
        'Validate AI integration first in narrow, high-leverage operational workflows.',
        'Human-in-the-loop checkpoints form the foundation of institutional trust.',
        'Without data quality and process standards, AI gains remain temporary.',
      ],
      sections: [
        {
          heading: 'Moving from Personal Tools to Enterprise Integration',
          paragraphs: [
            'Generative AI rapidly boosted individual output, yet lasting organizational advantage emerges when these capabilities are woven directly into core workflows — document triage, structured drafting, request prioritization, and knowledge retrieval.',
          ],
        },
        {
          heading: 'Selecting the Right Use Cases and Managing Risk',
          paragraphs: [
            'Not every process belongs in an automated pipeline. High-volume, text-heavy, and rule-bounded tasks make the strongest initial candidates. Privacy boundaries, output verification, and role permissions must be designed upfront.',
            'Hybrid models that elevate expert judgment rather than replacing accountability consistently yield the strongest long-term outcomes.',
          ],
        },
      ],
      seoTitle: 'AI-Powered Business Workflows and Institutional Productivity | Selman Utku',
      seoDescription:
        'Practical principles for implementing generative AI and automation safely and measurably inside organizations.',
    },
    {
      slug: 'digital-management-architecture-for-sports-clubs-and-facilities',
      title: 'Digital Management Architecture for Sports Clubs and Facilities',
      categoryKey: 'sports-tech',
      category: 'Sports Technology',
      publishedAt: 'Sep 11, 2026',
      isoDate: '2026-09-11',
      readTime: '5 min read',
      excerpt:
        'How sports academies, clubs, and facilities can design data-informed operations, transparent communication, and modern SportTech platforms.',
      coverImage: '/src/assets/images/project_sportsfly_platform_1795161841713.jpg',
      coverAlt: 'Modern athletic facility and digital club management platform',
      keyTakeaways: [
        'Operational data in sports organizations is just as vital as on-field performance data.',
        'Coach, administrator, and parent workflows should converge cleanly in one platform.',
        'Digital infrastructure is a prerequisite for scalable academy growth.',
      ],
      sections: [
        {
          heading: 'The Hidden Administrative Load in Sports Management',
          paragraphs: [
            'While sports clubs operate with high discipline on the pitch or court, off-field administration frequently relies on fragmented tools. When attendance, membership dues, facility scheduling, and parent updates live in silos, leadership loses time for strategic growth.',
          ],
        },
        {
          heading: 'What an Integrated SportTech Platform Must Deliver',
          paragraphs: [
            'Effective sports management software avoids overwhelming menus — letting coaches record attendance in seconds while giving directors real-time financial and participation visibility.',
            'Modern platforms like SportsFly bridge institutional rigor with effortless everyday usability.',
          ],
        },
      ],
      seoTitle: 'Digital Management Architecture for Sports Clubs and Facilities | Selman Utku',
      seoDescription:
        'Designing SportTech management platforms and data-driven workflows for sports academies, clubs, and facilities.',
    },
    {
      slug: 'technology-strategy-from-tool-selection-to-value-architecture',
      title: 'Technology Strategy: From Tool Selection to Value Architecture',
      categoryKey: 'tech-strategy',
      category: 'Technology Strategy',
      publishedAt: 'Aug 19, 2026',
      isoDate: '2026-08-19',
      readTime: '4 min read',
      excerpt:
        'A holistic strategic planning approach that separates technology decisions from short-lived hype and anchors them to long-term business goals.',
      coverImage: '/src/assets/images/editorial_strategy_architecture_1795161845108.jpg',
      coverAlt: 'Minimalist architecture symbolizing technology strategy',
      keyTakeaways: [
        'Technology strategy is a prioritization framework, not a shopping list of tools.',
        'Interoperability and maintainability outweigh initial licensing costs.',
        'Roadmaps must stay modular enough to adapt to shifting market dynamics.',
      ],
      sections: [
        {
          heading: 'Strategic Clarity Amid Constant Noise',
          paragraphs: [
            'Every year brings dozens of new software categories and technology trends. A disciplined technology strategy defines what an organization chooses not to pursue just as clearly as what it commits to build.',
          ],
        },
        {
          heading: 'Architectural Cohesion and Long-Term Flexibility',
          paragraphs: [
            'Disconnected systems fracture institutional memory. Prioritizing data ownership, modular architecture, and integration standards upfront enables organizations to adapt rapidly to future shifts.',
          ],
        },
      ],
      seoTitle: 'Technology Strategy: From Tool Selection to Value Architecture | Selman Utku',
      seoDescription:
        'Principles for crafting resilient technology roadmaps, prioritization frameworks, and value-driven architectures.',
    },
    {
      slug: 'product-development-and-entrepreneurship-in-sporttech',
      title: 'Product Development and Entrepreneurship in the SportTech Ecosystem',
      categoryKey: 'entrepreneurship',
      category: 'Entrepreneurship',
      publishedAt: 'Aug 03, 2026',
      isoDate: '2026-08-03',
      readTime: '5 min read',
      excerpt:
        'Technology products built without deep empathy for the realities of sports rarely survive on the field. Field-driven principles for SportTech builders.',
      coverImage: '/src/assets/images/project_sporsepeti_ecosystem_1795161843771.jpg',
      coverAlt: 'SportTech product development and digital sports entrepreneurship',
      keyTakeaways: [
        'Trust and peer referrals carry as much weight in sports as digital acquisition.',
        'Solving a focused set of operational pains exceptionally well beats bloated feature lists.',
        'Combining domain fluency with technical execution creates a durable moat.',
      ],
      sections: [
        {
          heading: 'Translating Field Reality into Product Decisions',
          paragraphs: [
            'The sports sector stands apart with its seasonal cycles, high human interaction, and distinct operational culture. Lasting SportTech ventures emerge from continuous feedback loops with coaches, club managers, and athletes rather than isolated assumptions.',
          ],
        },
        {
          heading: 'Lean Execution, Solid Foundations',
          paragraphs: [
            'Early-stage products must balance speed to market with clean conceptual architecture. Clearly validating the core problem establishes the groundwork for sustainable recurring growth.',
          ],
        },
      ],
      seoTitle: 'Product Development and Entrepreneurship in SportTech | Selman Utku',
      seoDescription:
        'Field-tested principles for building products and sustainable ventures across the sports technology ecosystem.',
    },
    {
      slug: 'building-an-internal-innovation-culture-for-sustainable-change',
      title: 'Building an Internal Innovation Culture for Sustainable Change',
      categoryKey: 'innovation',
      category: 'Innovation',
      publishedAt: 'Jul 16, 2026',
      isoDate: '2026-07-16',
      readTime: '4 min read',
      excerpt:
        'Leadership habits, workflow design, and evaluation routines that turn innovation from isolated events into an everyday institutional reflex.',
      coverImage: '/src/assets/images/editorial_strategy_architecture_1795161845108.jpg',
      coverAlt: 'Contemporary architectural lines representing innovation culture',
      keyTakeaways: [
        'Innovation thrives on disciplined continuous improvement as much as major leaps.',
        'Transparent idea evaluation strengthens team ownership over transformation.',
        'Combining academic curiosity with field execution deepens innovative insight.',
      ],
      sections: [
        {
          heading: 'Innovation Is a Way of Working, Not a Department',
          paragraphs: [
            'Too many organizations confine innovation to occasional workshops. Sustainable progress flourishes when process owners can voice friction openly, test focused pilots quickly, and retain lessons within institutional memory.',
          ],
        },
        {
          heading: 'The Power of Interdisciplinary Thinking',
          paragraphs: [
            'Operating across disciplines — such as uniting sports management experience with information technology and analysis — breaks conventional patterns. Meaningful innovation often starts by transferring proven methods across boundaries.',
          ],
        },
      ],
      seoTitle: 'Building an Internal Innovation Culture for Sustainable Change | Selman Utku',
      seoDescription:
        'Cultivating sustainable institutional innovation through focused pilots, transparent workflows, and interdisciplinary thinking.',
    },
  ],
};

export function getArticleCategories(lang: Language): ArticleCategoryOption[] {
  return CATEGORIES_BY_LANG[lang];
}

export function getArticles(lang: Language): ArticleItem[] {
  return ARTICLES_BY_LANG[lang];
}

export function getArticleBySlug(slug: string, lang: Language): ArticleItem | undefined {
  const localizedSlug = translateArticleSlug(slug, lang);
  return ARTICLES_BY_LANG[lang].find((a) => a.slug === localizedSlug || a.slug === slug);
}
