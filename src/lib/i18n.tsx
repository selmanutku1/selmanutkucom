import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectLanguageFromLocation, translateUrlForLanguage } from './routes';

export type Language = 'tr' | 'en';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const STORAGE_KEY = 'selmanutku_lang_v2';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return detectLanguageFromLocation(window.location.pathname, window.location.hash);
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [lang]);

  useEffect(() => {
    const handlePopState = () => {
      const nextLang = detectLanguageFromLocation(window.location.pathname, window.location.hash);
      setLangState(nextLang);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      const translatedUrl = translateUrlForLanguage(
        window.location.pathname,
        window.location.hash,
        next,
      );
      const currentUrl = `${window.location.pathname}${window.location.hash}`;
      if (currentUrl !== translatedUrl) {
        window.history.pushState({}, '', translatedUrl);
        window.dispatchEvent(new Event('app:urlchange'));
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export const UI_COPY = {
  tr: {
    skipToContent: 'İçeriğe geç',
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımda',
      expertise: 'Uzmanlık Alanları',
      experience: 'Deneyim',
      projects: 'Projeler',
      articles: 'Araştırma',
      academic: 'Akademik',
      contact: 'İletişim',
      mainMenuAria: 'Ana menü',
      mobileMenuAria: 'Mobil menü',
      openMenu: 'Menüyü aç',
      closeMenu: 'Menüyü kapat',
      languageAria: 'Dil seçimi',
    },
    about: {
      profileTitle: 'Profesyonel Profil',
      careerTitle: 'Kariyer Yolculuğum',
      educationTitle: 'Eğitim Geçmişim',
      affiliationsTitle: 'Üyelikler ve Profesyonel Ağlar',
      visionTitle: 'Vizyon ve Yaklaşım',
    },
    expertise: {
      heading: 'Uzmanlık Alanları',
      lead: 'Stratejik analizden uygulamalı teknoloji mimarisine kadar odaklandığım dört ana yetkinlik alanı.',
    },
    experience: {
      heading: 'Deneyim',
      lead: 'Kurumsal teknoloji, iş analizi, dijital kanallar ve spor stratejileri odağındaki profesyonel kronoloji.',
      responsibilities: 'Görev ve Sorumluluklar',
      highlights: 'Öne Çıkan Çalışmalar',
      deliverables: 'Proje ve Çıktılar',
    },
    projects: {
      heading: 'Projeler',
      lead: 'Spor teknolojileri, spor bilgi teknolojisi, dijital yönetim yazılımları ve SportTech ekosistemi odağında geliştirilen girişimler.',
      countSuffix: 'Seçili Çalışma',
      viewDetail: 'Proje Detayını İncele',
      visitWebsite: 'Siteyi Ziyaret Et',
      backToAll: 'Tüm Projelere Dön',
      projectLabel: 'Proje',
      overview: 'Proje Tanıtımı',
      problem: 'Problem ve İhtiyaç',
      solution: 'Geliştirilen Çözüm',
      outcomes: 'Proje Çıktıları',
      technologies: 'Kullanılan Teknolojiler ve Yaklaşımlar',
      projectLinkFallback: 'Proje Bağlantısı',
      screenshots: 'Ekran Görüntüleri ve Görsel Çıktılar',
      zoomHint: 'Büyütmek için görsele tıklayın',
      nextProject: 'Sonraki Proje',
      closeImage: 'Görseli kapat',
    },
    articles: {
      heading: 'Araştırma',
      lead: 'Dijital dönüşüm, yapay zekâ, spor teknolojileri, teknoloji stratejisi, girişimcilik ve inovasyon eksenindeki araştırma başlıkları ve kısa değerlendirmeler.',
      allFilter: 'Tümü',
      filterAria: 'Araştırma başlıkları',
      readMore: 'Detayı İncele',
      backToAll: 'Tüm Araştırmalara Dön',
      authorLabel: 'Araştırmacı',
      copyLink: 'Bağlantıyı Kopyala',
      linkCopied: 'Bağlantı Kopyalandı',
      keyTakeaways: 'Öne Çıkan Bulgular ve Odak Noktaları',
      discussTitle: 'Bu araştırma başlığı üzerine görüş alışverişi yapmak ister misiniz?',
      discussText:
        'Dijital dönüşüm, teknoloji stratejisi ve spor teknolojileri üzerine doğrudan iletişime geçebilirsiniz.',
      discussCta: 'İletişime Geç',
      relatedTitle: 'Diğer Araştırma Başlıkları',
      readArticle: 'Detayı İncele',
    },
    academic: {
      educationTitle: 'Eğitim Geçmişi',
      publicationsTitle: 'Akademik Yayınlar ve Çalışmalar',
      conferencesTitle: 'Konferanslar ve Bildiriler',
      researchAreasTitle: 'Araştırma Alanları',
      interestsTitle: 'Akademik İlgi Alanları',
    },
    contact: {
      heading: 'Birlikte değer üretelim.',
      lead: 'Dijital dönüşüm danışmanlığı, teknoloji stratejisi, yapay zekâ ve otomasyon projeleri, SportTech girişimleri veya akademik iş birlikleri için doğrudan ulaşabilirsiniz.',
      emailLabel: 'E-posta',
      copy: 'Kopyala',
      copied: 'Kopyalandı',
      copyEmailAria: 'E-posta adresini kopyala',
      linkedinLabel: 'LinkedIn',
      locationLabel: 'Konum',
      successTitle: 'Mesajınız başarıyla iletildi.',
      successTextStart: 'İlginiz için teşekkür ederim,',
      successTextMiddle: 'Mesajınız kayıt altına alındı; en kısa sürede',
      successTextEnd: 'adresiniz üzerinden dönüş yapacağım.',
      sendAnother: 'Yeni Mesaj Gönder',
      openMailClient: 'E-posta İstemcisiyle Gönder',
      fullNameLabel: 'Ad Soyad',
      fullNamePlaceholder: 'Adınız ve soyadınız',
      emailFieldLabel: 'E-posta',
      emailPlaceholder: 'ornek@kurum.com',
      subjectLabel: 'Konu',
      subjectPlaceholder: 'Dijital dönüşüm, proje iş birliği, konuşma daveti...',
      messageLabel: 'Mesaj',
      messagePlaceholder: 'Projeniz, ihtiyacınız veya iş birliği konunuz hakkında kısa bilgi paylaşın...',
      privacyNote: 'Bilgileriniz yalnızca iletişime dönüş sağlamak amacıyla kullanılır.',
      submit: 'Mesaj Gönder',
      submitting: 'Gönderiliyor...',
      errors: {
        fullName: 'Lütfen adınızı ve soyadınızı girin.',
        email: 'Lütfen geçerli bir e-posta adresi girin.',
        subject: 'Lütfen mesajınız için kısa bir konu belirtin.',
        message: 'Lütfen en az 15 karakterlik bir mesaj yazın.',
        submitError:
          'Mesaj gönderilirken geçici bir bağlantı hatası oluştu. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.',
        activationError:
          'Form servisi ilk kullanım için tek seferlik aktivasyon bekliyor. info@selmanutku.com gelen kutusuna (veya spam klasörüne) gönderilen "Activate Form" bağlantısına bir kez tıkladıktan sonra tüm mesajlar anında düşecektir.',
      },
    },
    footer: {
      pagesTitle: 'Sayfalar',
      linksTitle: 'Bağlantılar',
      rights: 'Tüm hakları saklıdır.',
    },
    notFound: {
      seoTitle: 'Sayfa Bulunamadı | Selman Utku',
      seoDesc: 'Aradığınız içerik bulunamadı. Ana sayfaya dönerek projeleri ve yazıları inceleyebilirsiniz.',
      heading: 'Aradığınız içerik bulunamadı.',
      text: 'İçerik taşınmış veya bağlantı adresi değişmiş olabilir. Ana sayfaya dönerek tüm projelere ve yazılara ulaşabilirsiniz.',
      cta: 'Ana Sayfaya Dön',
    },
    seo: {
      homeTitle: 'Selman Utku – Dijital Dönüşüm, İnovasyon & Spor Teknolojileri',
      homeDesc:
        "Spor yönetimi, teknoloji ve dijital dönüşüm alanlarının kesişiminde çalışan Selman Utku'nun profesyonel portfolyosu, projeleri, yazıları ve akademik çalışmaları.",
    },
    share: {
      label: 'Paylaş',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      whatsapp: 'WhatsApp',
      copyLink: 'Bağlantıyı Kopyala',
      linkCopied: 'Bağlantı Kopyalandı',
      linkedinAria: 'LinkedIn üzerinden paylaş',
      twitterAria: 'Twitter (X) üzerinden paylaş',
      whatsappAria: 'WhatsApp üzerinden paylaş',
      groupAria: 'Sosyal medya paylaşım seçenekleri',
    },
  },
  en: {
    skipToContent: 'Skip to content',
    nav: {
      home: 'Home',
      about: 'About',
      expertise: 'Expertise',
      experience: 'Experience',
      projects: 'Projects',
      articles: 'Research',
      academic: 'Academic',
      contact: 'Contact',
      mainMenuAria: 'Primary navigation',
      mobileMenuAria: 'Mobile navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      languageAria: 'Language selector',
    },
    about: {
      profileTitle: 'Professional Profile',
      careerTitle: 'Career Journey',
      educationTitle: 'Education',
      affiliationsTitle: 'Memberships & Professional Networks',
      visionTitle: 'Vision & Approach',
    },
    expertise: {
      heading: 'Areas of Expertise',
      lead: 'Four core disciplines spanning strategic business analysis, artificial intelligence, sports technology, and applied innovation.',
    },
    experience: {
      heading: 'Experience',
      lead: 'Chronological background across technology analysis, digital channels, institutional transformation, and sports strategy.',
      responsibilities: 'Roles & Responsibilities',
      highlights: 'Key Highlights',
      deliverables: 'Projects & Deliverables',
    },
    projects: {
      heading: 'Projects',
      lead: 'Selected ventures built across sports technology, sports information technology, digital management software, and the SportTech ecosystem.',
      countSuffix: 'Selected Works',
      viewDetail: 'Explore Case Study',
      visitWebsite: 'Visit Website',
      backToAll: 'Back to All Projects',
      projectLabel: 'Project',
      overview: 'Project Overview',
      problem: 'Problem & Need',
      solution: 'Solution Architecture',
      outcomes: 'Key Outcomes',
      technologies: 'Technologies & Methodologies',
      projectLinkFallback: 'Project Inquiry',
      screenshots: 'Visuals & Platform Views',
      zoomHint: 'Click an image to expand',
      nextProject: 'Next Project',
      closeImage: 'Close image',
    },
    articles: {
      heading: 'Research',
      lead: 'Focused research themes and concise briefs spanning digital transformation, artificial intelligence, sports technology, strategy, entrepreneurship, and innovation.',
      allFilter: 'All',
      filterAria: 'Research topics',
      readMore: 'View Brief',
      backToAll: 'Back to Research',
      authorLabel: 'Researcher',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied',
      keyTakeaways: 'Key Focus & Findings',
      discussTitle: 'Interested in discussing this research theme?',
      discussText:
        'Feel free to reach out directly regarding digital transformation, technology strategy, or SportTech research.',
      discussCta: 'Get in Touch',
      relatedTitle: 'Other Research Themes',
      readArticle: 'View Brief',
    },
    academic: {
      educationTitle: 'Academic Background',
      publicationsTitle: 'Academic Publications & Research',
      conferencesTitle: 'Conferences & Proceedings',
      researchAreasTitle: 'Research Areas',
      interestsTitle: 'Academic Interests',
    },
    contact: {
      heading: "Let's create value together.",
      lead: 'Reach out directly for digital transformation advisory, technology strategy, AI and automation projects, SportTech ventures, or academic collaborations.',
      emailLabel: 'Email',
      copy: 'Copy',
      copied: 'Copied',
      copyEmailAria: 'Copy email address',
      linkedinLabel: 'LinkedIn',
      locationLabel: 'Location',
      successTitle: 'Your message has been sent.',
      successTextStart: 'Thank you for reaching out,',
      successTextMiddle: 'Your inquiry has been received and I will respond shortly via',
      successTextEnd: '.',
      sendAnother: 'Send Another Message',
      openMailClient: 'Open in Email Client',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Your full name',
      emailFieldLabel: 'Email',
      emailPlaceholder: 'name@company.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Digital transformation, project collaboration, speaking...',
      messageLabel: 'Message',
      messagePlaceholder: 'Share a brief overview of your project, challenge, or inquiry...',
      privacyNote: 'Your details are used solely to respond to your message.',
      submit: 'Send Message',
      submitting: 'Sending...',
      errors: {
        fullName: 'Please enter your full name.',
        email: 'Please enter a valid email address.',
        subject: 'Please provide a brief subject for your message.',
        message: 'Please write a message of at least 15 characters.',
        submitError:
          'A temporary connection issue prevented sending your message. Please try again or send via email directly.',
        activationError:
          'The form service requires a one-time activation. Please click the "Activate Form" link sent to info@selmanutku.com (check Spam/Junk if needed), and all submissions will deliver immediately afterward.',
      },
    },
    footer: {
      pagesTitle: 'Pages',
      linksTitle: 'Connect',
      rights: 'All rights reserved.',
    },
    notFound: {
      seoTitle: 'Page Not Found | Selman Utku',
      seoDesc: 'The requested content could not be found. Return to the homepage to explore projects and articles.',
      heading: 'Content not found.',
      text: 'This page may have been moved or the link may be outdated. Return home to browse all projects and articles.',
      cta: 'Back to Home',
    },
    seo: {
      homeTitle: 'Selman Utku – Digital Transformation, Innovation & Sports Technology',
      homeDesc:
        'Personal brand and professional portfolio of Selman Utku — Tech Analyst working at the intersection of sports management, digital transformation, AI, and SportTech.',
    },
    share: {
      label: 'Share',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      whatsapp: 'WhatsApp',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied',
      linkedinAria: 'Share on LinkedIn',
      twitterAria: 'Share on Twitter (X)',
      whatsappAria: 'Share on WhatsApp',
      groupAria: 'Social media sharing options',
    },
  },
} as const;
