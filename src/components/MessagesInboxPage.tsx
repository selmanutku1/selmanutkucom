import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Check,
  Copy,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MailOpen,
  Reply,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  auth,
  CONTACT_MESSAGES_COLLECTION,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { useLanguage } from '../lib/i18n';
import { getHomePath } from '../lib/routes';
import { useDocumentSEO } from '../lib/seo';

type MessageStatus = 'unread' | 'read' | 'archived';
type FilterTab = 'all' | 'unread' | 'read' | 'archived';

interface ContactMessageRecord {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  lang: 'tr' | 'en';
  status: MessageStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface MessagesInboxPageProps {
  onNavigate: (to: string) => void;
}

function formatMessageDate(ts: Timestamp | null, lang: 'tr' | 'en'): string {
  if (!ts) return '—';
  const date = ts.toDate();
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MessagesInboxPage({ onNavigate }: MessagesInboxPageProps) {
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const homePath = getHomePath(lang);

  useDocumentSEO({
    title: isTr ? 'Mesaj Kutusu | Selman Utku' : 'Inbox | Selman Utku',
    description: isTr
      ? 'İletişim formu mesajları yönetim ekranı.'
      : 'Private contact form submissions inbox.',
    path: isTr ? '/mesajlar' : '/inbox',
    lang,
    noIndex: true,
  });

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyMessageId, setBusyMessageId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isAuthorizedAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified,
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthorizedAdmin) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    setLoadingMessages(true);
    setFirestoreError(null);

    const messagesQuery = query(
      collection(db, CONTACT_MESSAGES_COLLECTION),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const items: ContactMessageRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullName: String(data.fullName || ''),
            email: String(data.email || ''),
            subject: String(data.subject || ''),
            message: String(data.message || ''),
            lang: data.lang === 'en' ? 'en' : 'tr',
            status:
              data.status === 'read' || data.status === 'archived'
                ? data.status
                : 'unread',
            createdAt: (data.createdAt as Timestamp | null) ?? null,
            updatedAt: (data.updatedAt as Timestamp | null) ?? null,
          };
        });
        setMessages(items);
        setLoadingMessages(false);
      },
      (error) => {
        setLoadingMessages(false);
        setFirestoreError(
          isTr
            ? 'Mesajlar yüklenirken yetki veya bağlantı hatası oluştu.'
            : 'Unable to load messages due to a permission or connection error.',
        );
        try {
          handleFirestoreError(error, OperationType.LIST, CONTACT_MESSAGES_COLLECTION);
        } catch {
          // Structured error logged by handleFirestoreError; surfaced in UI state above
        }
      },
    );

    return () => unsubscribe();
  }, [authReady, isAuthorizedAdmin, isTr]);

  const counts = useMemo(() => {
    let unread = 0;
    let read = 0;
    let archived = 0;
    for (const item of messages) {
      if (item.status === 'unread') unread += 1;
      else if (item.status === 'read') read += 1;
      else if (item.status === 'archived') archived += 1;
    }
    return { all: messages.length - archived, unread, read, archived };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return messages.filter((item) => {
      if (filter === 'all' && item.status === 'archived') return false;
      if (filter !== 'all' && item.status !== filter) return false;
      if (!q) return true;
      return (
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, searchQuery]);

  const selectedMessage = useMemo(() => {
    if (!filteredMessages.length) return null;
    if (selectedId) {
      const found = filteredMessages.find((m) => m.id === selectedId);
      if (found) return found;
    }
    return filteredMessages[0];
  }, [filteredMessages, selectedId]);

  const handleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          isTr
            ? 'Bu alan adı henüz Firebase Authentication yetkili alan adlarına eklenmemiş. Firebase Console → Authentication → Settings → Authorized domains bölümünden alan adınızı ekleyin.'
            : 'This domain is not yet listed in Firebase Authorized Domains. Add it under Firebase Console → Authentication → Settings → Authorized domains.',
        );
      } else if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          isTr
            ? 'Google ile giriş yapılamadı. Lütfen tekrar deneyin.'
            : 'Could not sign in with Google. Please try again.',
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const handleUpdateStatus = async (item: ContactMessageRecord, nextStatus: MessageStatus) => {
    if (item.status === nextStatus) return;
    const docPath = `${CONTACT_MESSAGES_COLLECTION}/${item.id}`;
    setBusyMessageId(item.id);
    try {
      await updateDoc(doc(db, CONTACT_MESSAGES_COLLECTION, item.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setFirestoreError(
        isTr ? 'Mesaj durumu güncellenemedi.' : 'Failed to update message status.',
      );
      try {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      } catch {
        // Logged by handleFirestoreError
      }
    } finally {
      setBusyMessageId(null);
    }
  };

  const handleSelectMessage = (item: ContactMessageRecord) => {
    setSelectedId(item.id);
    setConfirmDeleteId(null);
    setCopiedEmail(false);
    if (item.status === 'unread') {
      void handleUpdateStatus(item, 'read');
    }
  };

  const handleDelete = async (id: string) => {
    const docPath = `${CONTACT_MESSAGES_COLLECTION}/${id}`;
    setBusyMessageId(id);
    try {
      await deleteDoc(doc(db, CONTACT_MESSAGES_COLLECTION, id));
      setConfirmDeleteId(null);
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      setFirestoreError(
        isTr ? 'Mesaj silinirken hata oluştu.' : 'Failed to delete message.',
      );
      try {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      } catch {
        // Logged by handleFirestoreError
      }
    } finally {
      setBusyMessageId(null);
    }
  };

  const handleCopySenderEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      setCopiedEmail(false);
    }
  };

  // Loading auth state
  if (!authReady) {
    return (
      <section className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-[460px] rounded-lg border border-[#DCE7F2] bg-[#F3F8FC]/60 p-8 text-center">
          <p className="text-[14.5px] text-[#465B71]">
            {isTr ? 'Oturum kontrol ediliyor...' : 'Checking session...'}
          </p>
        </div>
      </section>
    );
  }

  // Unauthenticated or wrong Google account gate
  if (!isAuthorizedAdmin) {
    return (
      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[480px] rounded-lg border border-[#DCE7F2] bg-white p-8 sm:p-10">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#DCE7F2] bg-[#F3F8FC] text-[#0C2340]">
            <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-[26px] font-bold tracking-[-0.025em] text-[#0A192F]">
            {isTr ? 'İletişim Mesajları Paneli' : 'Contact Messages Inbox'}
          </h1>

          <p className="mt-3 text-[15px] leading-[1.7] text-[#465B71]">
            {user
              ? isTr
                ? `Şu an ${user.email} hesabı ile giriş yaptınız. Bu panel yalnızca yönetici hesabına açıktır.`
                : `You are signed in as ${user.email}. This inbox is restricted to the site owner.`
              : isTr
                ? 'Siteden gelen iletişim formu mesajlarını görüntülemek için yetkili Google hesabınızla giriş yapın.'
                : 'Sign in with your authorized Google account to view incoming contact form submissions.'}
          </p>

          {authError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50/80 p-3.5 text-[13.5px] leading-[1.6] text-red-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#0C2340] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#143966]"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span>{isTr ? 'Farklı Hesapla Giriş Yap' : 'Switch Account'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={authLoading}
                onClick={handleSignIn}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-[#0C2340] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#143966] disabled:opacity-60"
              >
                <span>
                  {authLoading
                    ? isTr
                      ? 'Giriş yapılıyor...'
                      : 'Signing in...'
                    : isTr
                      ? 'Google ile Giriş Yap'
                      : 'Sign in with Google'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate(homePath)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#DCE7F2] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:bg-[#F3F8FC] hover:text-[#0A192F]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span>{isTr ? 'Ana Sayfaya Dön' : 'Back to Website'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: isTr ? 'Gelen Kutusu' : 'Inbox', count: counts.all },
    { key: 'unread', label: isTr ? 'Okunmadı' : 'Unread', count: counts.unread },
    { key: 'read', label: isTr ? 'Okundu' : 'Read', count: counts.read },
    { key: 'archived', label: isTr ? 'Arşiv' : 'Archived', count: counts.archived },
  ];

  const statusLabel = (status: MessageStatus) => {
    if (status === 'unread') return isTr ? 'Okunmadı' : 'Unread';
    if (status === 'read') return isTr ? 'Okundu' : 'Read';
    return isTr ? 'Arşiv' : 'Archived';
  };

  return (
    <section className="min-h-[75vh] bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Top Utility Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-[#DCE7F2] pb-7 md:flex-row md:items-end">
          <div>
            <button
              type="button"
              onClick={() => onNavigate(homePath)}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B7086] transition-colors hover:text-[#145DA0]"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>{isTr ? 'Siteye Dön' : 'Back to Site'}</span>
            </button>
            <h1 className="mt-3 text-[28px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[34px]">
              {isTr ? 'Gelen Form Mesajları' : 'Contact Form Inbox'}
            </h1>
            <p className="mt-1.5 text-[14px] text-[#465B71]">
              <span className="tabular-nums font-medium text-[#0A192F]">{counts.unread}</span>{' '}
              {isTr ? 'okunmamış' : 'unread'}
              <span className="mx-2 text-[#8FA4BA]" aria-hidden="true">
                ·
              </span>
              <span className="tabular-nums">{messages.length}</span>{' '}
              {isTr ? 'toplam mesaj' : 'total messages'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] text-[#5B7086]">{user?.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md border border-[#DCE7F2] bg-white px-3.5 text-[13px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:bg-[#F3F8FC] hover:text-[#0A192F]"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>{isTr ? 'Çıkış' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="mt-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div
            role="tablist"
            aria-label={isTr ? 'Mesaj filtreleri' : 'Message filters'}
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#F3F8FC] p-1"
          >
            {filterTabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(tab.key);
                    setConfirmDeleteId(null);
                  }}
                  className={`inline-flex min-h-[38px] items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active
                      ? 'bg-white text-[#0A192F] shadow-xs'
                      : 'text-[#4B6075] hover:text-[#0A192F]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`tabular-nums text-[12px] ${
                      active ? 'text-[#145DA0]' : 'text-[#7D95AE]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-[320px]">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D95AE]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Ad, e-posta veya konu ara...' : 'Search name, email, or subject...'}
              aria-label={isTr ? 'Mesajlarda ara' : 'Search messages'}
              className="h-10 w-full rounded-md border border-[#CEDEEA] bg-white pl-10 pr-4 text-[13.5px] text-[#0A192F] placeholder:text-[#8FA4BA] transition-colors focus:border-[#145DA0] focus:outline-none"
            />
          </div>
        </div>

        {firestoreError && (
          <div
            role="alert"
            className="mt-5 flex items-center gap-2.5 rounded-md border border-red-200 bg-red-50/80 p-4 text-[13.5px] text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
            <span>{firestoreError}</span>
          </div>
        )}

        {/* Main Master-Detail Inbox Area */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Message List */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-[#DCE7F2] bg-white">
              {loadingMessages ? (
                <div className="divide-y divide-[#EAF1F8]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="animate-pulse space-y-2.5 p-5">
                      <div className="h-3.5 w-1/3 rounded bg-[#EAF1F8]" />
                      <div className="h-4 w-3/4 rounded bg-[#E4EDF6]" />
                      <div className="h-3 w-full rounded bg-[#F3F8FC]" />
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <Inbox className="h-7 w-7 text-[#8FA4BA]" strokeWidth={1.5} aria-hidden="true" />
                  <p className="mt-3 text-[15px] font-medium text-[#0A192F]">
                    {isTr ? 'Bu görünümde mesaj yok.' : 'No messages in this view.'}
                  </p>
                  <p className="mt-1 text-[13.5px] text-[#5B7086]">
                    {isTr
                      ? 'İletişim formundan yeni bir mesaj geldiğinde burada anında listelenir.'
                      : 'New contact form submissions will appear here in real time.'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#EAF1F8]">
                  {filteredMessages.map((item) => {
                    const isSelected = selectedMessage?.id === item.id;
                    const isUnread = item.status === 'unread';
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectMessage(item)}
                          className={`block w-full px-5 py-4 text-left transition-colors ${
                            isSelected
                              ? 'bg-[#F3F8FC]'
                              : 'bg-white hover:bg-[#F8FBFE]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[12px] text-[#5B7086]">
                            <span
                              className={`truncate ${
                                isUnread
                                  ? 'font-semibold text-[#0A192F]'
                                  : 'font-medium text-[#33485E]'
                              }`}
                            >
                              {item.fullName}
                            </span>
                            <span className="shrink-0 tabular-nums">
                              {formatMessageDate(item.createdAt, lang)}
                            </span>
                          </div>
                          <p
                            className={`mt-1.5 truncate text-[14.5px] ${
                              isUnread
                                ? 'font-semibold text-[#0A192F]'
                                : 'font-medium text-[#33485E]'
                            }`}
                          >
                            {item.subject}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] text-[#5B7086]">
                            {item.message}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-[11.5px] text-[#7D95AE]">
                            <span
                              className={
                                isUnread ? 'font-semibold text-[#145DA0]' : ''
                              }
                            >
                              {statusLabel(item.status)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{item.email}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Selected Message Reader */}
          <div className="lg:col-span-7">
            <div className="min-h-[360px] rounded-lg border border-[#DCE7F2] bg-[#F8FBFE]/60 p-6 lg:p-8">
              {selectedMessage ? (
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#5B7086]">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            selectedMessage.status === 'unread'
                              ? 'font-semibold text-[#145DA0]'
                              : 'font-medium text-[#33485E]'
                          }
                        >
                          {statusLabel(selectedMessage.status)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{selectedMessage.lang.toUpperCase()}</span>
                      </div>
                      <span className="tabular-nums">
                        {formatMessageDate(selectedMessage.createdAt, lang)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-[#0A192F]">
                      {selectedMessage.subject}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-[#DCE7F2] py-4">
                      <div>
                        <p className="text-[15px] font-semibold text-[#0A192F]">
                          {selectedMessage.fullName}
                        </p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="mt-0.5 inline-block text-[13.5px] text-[#145DA0] hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopySenderEmail(selectedMessage.email)}
                        className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#D4E2F0] bg-white px-3 text-[12.5px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:text-[#0A192F]"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#145DA0]" strokeWidth={2} />
                            <span>{isTr ? 'Kopyalandı' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                            <span>{isTr ? 'E-postayı Kopyala' : 'Copy Email'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-6 whitespace-pre-wrap text-[15px] leading-[1.75] text-[#1E3248]">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE7F2] pt-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                          `Re: ${selectedMessage.subject}`,
                        )}`}
                        className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-md bg-[#0C2340] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#143966]"
                      >
                        <Reply className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        <span>{isTr ? 'Yanıtla' : 'Reply'}</span>
                      </a>

                      <button
                        type="button"
                        disabled={busyMessageId === selectedMessage.id}
                        onClick={() =>
                          handleUpdateStatus(
                            selectedMessage,
                            selectedMessage.status === 'unread' ? 'read' : 'unread',
                          )
                        }
                        className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-md border border-[#D4E2F0] bg-white px-3.5 py-2 text-[13px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:text-[#0A192F] disabled:opacity-50"
                      >
                        {selectedMessage.status === 'unread' ? (
                          <>
                            <MailOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                            <span>{isTr ? 'Okundu İşaretle' : 'Mark Read'}</span>
                          </>
                        ) : (
                          <>
                            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                            <span>{isTr ? 'Okunmadı İşaretle' : 'Mark Unread'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={busyMessageId === selectedMessage.id}
                        onClick={() =>
                          handleUpdateStatus(
                            selectedMessage,
                            selectedMessage.status === 'archived' ? 'read' : 'archived',
                          )
                        }
                        className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-md border border-[#D4E2F0] bg-white px-3.5 py-2 text-[13px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:text-[#0A192F] disabled:opacity-50"
                      >
                        {selectedMessage.status === 'archived' ? (
                          <>
                            <ArchiveRestore
                              className="h-3.5 w-3.5"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                            <span>{isTr ? 'Arşivden Çıkar' : 'Unarchive'}</span>
                          </>
                        ) : (
                          <>
                            <Archive className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                            <span>{isTr ? 'Arşivle' : 'Archive'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {confirmDeleteId === selectedMessage.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyMessageId === selectedMessage.id}
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-md bg-red-700 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                        >
                          <span>{isTr ? 'Silmeyi Onayla' : 'Confirm Delete'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-md border border-[#D4E2F0] bg-white px-3 py-2 text-[13px] font-medium text-[#4B6075] hover:text-[#0A192F]"
                        >
                          {isTr ? 'Vazgeç' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(selectedMessage.id)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-md border border-[#E6D4D4] bg-white px-3.5 py-2 text-[13px] font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        <span>{isTr ? 'Sil' : 'Delete'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <p className="text-[14.5px] text-[#5B7086]">
                    {isTr
                      ? 'Detayını görmek için soldan bir mesaj seçin.'
                      : 'Select a message from the list to inspect its details.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
