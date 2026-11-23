import { useEffect, useRef, useState, type FormEvent } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, ArrowUpRight, Check, CheckCircle2, ChevronDown, Copy, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../data/profile';
import { trackEvent } from '../lib/analytics';
import {
  CONTACT_EMAIL_REGEX,
  CONTACT_LIMITS,
  CONTACT_MESSAGES_COLLECTION,
  db,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { getSectionId } from '../lib/routes';

interface FormValues {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

const EMAIL_PATTERN = CONTACT_EMAIL_REGEX;

export function ContactSection() {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].contact;

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [emailCopied, setEmailCopied] = useState(false);
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const topicMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicMenuRef.current && !topicMenuRef.current.contains(event.target as Node)) {
        setIsTopicMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTopicMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const validate = (data: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    const trimmedName = data.fullName.trim();
    const trimmedEmail = data.email.trim();
    const trimmedSubject = data.subject.trim();
    const trimmedMessage = data.message.trim();

    if (
      trimmedName.length < CONTACT_LIMITS.fullNameMin ||
      trimmedName.length > CONTACT_LIMITS.fullNameMax
    ) {
      nextErrors.fullName = copy.errors.fullName;
    }
    if (
      trimmedEmail.length < CONTACT_LIMITS.emailMin ||
      trimmedEmail.length > CONTACT_LIMITS.emailMax ||
      !EMAIL_PATTERN.test(trimmedEmail)
    ) {
      nextErrors.email = copy.errors.email;
    }
    if (
      trimmedSubject.length < CONTACT_LIMITS.subjectMin ||
      trimmedSubject.length > CONTACT_LIMITS.subjectMax
    ) {
      nextErrors.subject = copy.errors.subject;
    }
    if (
      trimmedMessage.length < CONTACT_LIMITS.messageMin ||
      trimmedMessage.length > CONTACT_LIMITS.messageMax
    ) {
      nextErrors.message = copy.errors.message;
    }
    return nextErrors;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (honeypot.trim().length > 0) {
      setStatus('submitted');
      return;
    }

    setSubmitError(null);
    setStatus('submitting');

    const payload = {
      fullName: values.fullName.trim().slice(0, CONTACT_LIMITS.fullNameMax),
      email: values.email.trim().slice(0, CONTACT_LIMITS.emailMax),
      subject: values.subject.trim().slice(0, CONTACT_LIMITS.subjectMax),
      message: values.message.trim().slice(0, CONTACT_LIMITS.messageMax),
      lang,
      status: 'unread' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), payload);
      setStatus('submitted');
      trackEvent('contact_form_submit', { subject_category: payload.subject.slice(0, 40) });
    } catch (error) {
      setStatus('idle');
      setSubmitError(copy.errors.submitError);
      try {
        handleFirestoreError(error, OperationType.CREATE, CONTACT_MESSAGES_COLLECTION);
      } catch {
        // Structured FirestoreErrorInfo logged for diagnostics; friendly error shown in UI
      }
    }
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setHoneypot('');
    setErrors({});
    setSubmitError(null);
    setStatus('idle');
    setIsCustomTopic(false);
    setIsTopicMenuOpen(false);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <section
      id={getSectionId('contact', lang)}
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-[#DCE7F2] bg-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-[360px] w-[420px] rounded-full bg-[#38BDF8]/[0.09] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading & Direct Contact Channels */}
          <div className="flex flex-col justify-between text-center lg:col-span-5 lg:text-left">
            <div>
              <p className="text-[12px] font-semibold tracking-wider text-[#145DA0] tabular-nums">07</p>
              <h2
                id="contact-heading"
                className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[40px]"
              >
                {copy.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-[#465B71] lg:mx-0">
                {copy.lead}
              </p>

              {/* Direct Channels */}
              <div className="mt-10 divide-y divide-[#DCE7F2] border-y border-[#DCE7F2] text-left">
                <div className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="text-[12.5px] text-[#5B7086]">{copy.emailLabel}</p>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="mt-1 inline-flex items-center gap-2 text-[15px] font-medium text-[#0A192F] transition-colors hover:text-[#145DA0]"
                    >
                      <Mail className="h-4 w-4 text-[#145DA0]" strokeWidth={1.75} aria-hidden="true" />
                      <span>{SITE_CONFIG.email}</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={copy.copyEmailAria}
                    className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#D4E2F0] px-3 text-[12.5px] font-medium text-[#33485E] transition-colors hover:border-[#145DA0] hover:bg-[#F3F8FC] hover:text-[#0A192F]"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#145DA0]" strokeWidth={2} />
                        <span>{copy.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>{copy.copy}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="text-[12.5px] text-[#5B7086]">{copy.linkedinLabel}</p>
                    <a
                      href={SITE_CONFIG.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#0A192F] transition-colors hover:text-[#145DA0]"
                    >
                      <span>{SITE_CONFIG.linkedinHandle}</span>
                      <ArrowUpRight className="h-4 w-4 text-[#145DA0]" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <figure className="mx-auto mt-8 max-w-[46ch] lg:mx-0">
              <blockquote className="text-[16.5px] font-medium leading-[1.55] tracking-[-0.01em] text-[#0A192F]">
                “{copy.proverbQuote}”
              </blockquote>
              <figcaption className="mt-2 text-[13px] font-medium text-[#5B7086]">
                — {copy.proverbAuthor}
              </figcaption>
            </figure>
          </div>

          {/* Right Column: Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-[#DCE7F2] bg-[#F3F8FC]/90 p-7 backdrop-blur-sm lg:p-10">
              {status === 'submitted' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-5 py-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#0C2340] text-white">
                    <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                      {copy.successTitle}
                    </h3>
                    <p className="max-w-[52ch] text-[15px] leading-[1.7] text-[#465B71]">
                      {copy.successText}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="whitespace-nowrap shrink-0 rounded-md bg-[#0C2340] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[#143966]"
                    >
                      {copy.sendAnother}
                    </button>
                    <a
                      href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(values.subject)}`}
                      className="whitespace-nowrap shrink-0 rounded-md border border-[#C6D8EA] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[#0A192F] transition-colors hover:border-[#145DA0]"
                    >
                      {copy.openMailClient}
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Anti-spam honeypot field (hidden from human visitors) */}
                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    aria-hidden="true"
                    className="hidden"
                  />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-fullName"
                        className="block text-[13.5px] font-medium text-[#0A192F]"
                      >
                        {copy.fullNameLabel}
                      </label>
                      <input
                        id="contact-fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        maxLength={CONTACT_LIMITS.fullNameMax}
                        required
                        value={values.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                        placeholder={copy.fullNamePlaceholder}
                        className={`mt-2 block w-full rounded-md border bg-white px-4 py-3 text-[14.5px] text-[#0A192F] placeholder:text-[#8FA4BA] transition-colors focus:outline-none ${
                          errors.fullName
                            ? 'border-red-600 focus:border-red-600'
                            : 'border-[#CEDEEA] focus:border-[#145DA0]'
                        }`}
                      />
                      {errors.fullName && (
                        <p
                          id="error-fullName"
                          className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-red-700"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[13.5px] font-medium text-[#0A192F]"
                      >
                        {copy.emailFieldLabel}
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={CONTACT_LIMITS.emailMax}
                        required
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        placeholder={copy.emailPlaceholder}
                        className={`mt-2 block w-full rounded-md border bg-white px-4 py-3 text-[14.5px] text-[#0A192F] placeholder:text-[#8FA4BA] transition-colors focus:outline-none ${
                          errors.email
                            ? 'border-red-600 focus:border-red-600'
                            : 'border-[#CEDEEA] focus:border-[#145DA0]'
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="error-email"
                          className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-red-700"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div ref={topicMenuRef} className="relative">
                    <label
                      htmlFor="contact-subject-trigger"
                      className="block text-[13.5px] font-medium text-[#0A192F]"
                    >
                      {copy.subjectLabel}
                    </label>
                    <button
                      id="contact-subject-trigger"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isTopicMenuOpen}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'error-subject' : undefined}
                      onClick={() => setIsTopicMenuOpen((prev) => !prev)}
                      className={`mt-2 flex w-full items-center justify-between gap-3 rounded-md border bg-white px-4 py-3 text-left text-[14.5px] transition-colors focus:outline-none ${
                        errors.subject
                          ? 'border-red-600 focus:border-red-600'
                          : isTopicMenuOpen
                            ? 'border-[#145DA0]'
                            : 'border-[#CEDEEA] hover:border-[#94BBE0] focus:border-[#145DA0]'
                      }`}
                    >
                      <span
                        className={
                          isCustomTopic || values.subject
                            ? 'font-medium text-[#0A192F]'
                            : 'text-[#8FA4BA]'
                        }
                      >
                        {isCustomTopic
                          ? copy.otherTopicLabel
                          : values.subject || copy.selectTopicPlaceholder}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#5B7086] transition-transform duration-150 ${
                          isTopicMenuOpen ? 'rotate-180 text-[#145DA0]' : ''
                        }`}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>

                    {isTopicMenuOpen && (
                      <div
                        role="listbox"
                        aria-label={copy.quickTopicsLabel}
                        className="absolute left-0 right-0 z-20 mt-1.5 overflow-hidden rounded-md border border-[#CEDEEA] bg-white py-1 shadow-[0_12px_32px_-8px_rgba(12,35,64,0.16)]"
                      >
                        {copy.quickTopics.map((topic) => {
                          const isSelected = !isCustomTopic && values.subject === topic;
                          return (
                            <button
                              key={topic}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setIsCustomTopic(false);
                                handleChange('subject', topic);
                                setIsTopicMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] transition-colors ${
                                isSelected
                                  ? 'bg-[#F3F8FC] font-medium text-[#145DA0]'
                                  : 'text-[#33485E] hover:bg-[#F3F8FC] hover:text-[#0A192F]'
                              }`}
                            >
                              <span>{topic}</span>
                              {isSelected && (
                                <Check className="h-4 w-4 shrink-0 text-[#145DA0]" strokeWidth={2} aria-hidden="true" />
                              )}
                            </button>
                          );
                        })}
                        <div className="my-1 border-t border-[#EAF1F8]" />
                        <button
                          type="button"
                          role="option"
                          aria-selected={isCustomTopic}
                          onClick={() => {
                            const presetTopics: readonly string[] = copy.quickTopics;
                            if (presetTopics.includes(values.subject)) {
                              handleChange('subject', '');
                            }
                            setIsCustomTopic(true);
                            setIsTopicMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] transition-colors ${
                            isCustomTopic
                              ? 'bg-[#F3F8FC] font-medium text-[#145DA0]'
                              : 'text-[#33485E] hover:bg-[#F3F8FC] hover:text-[#0A192F]'
                          }`}
                        >
                          <span>{copy.otherTopicLabel}</span>
                          {isCustomTopic && (
                            <Check className="h-4 w-4 shrink-0 text-[#145DA0]" strokeWidth={2} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    )}

                    {isCustomTopic && (
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        maxLength={CONTACT_LIMITS.subjectMax}
                        required
                        autoFocus
                        value={values.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? 'error-subject' : undefined}
                        placeholder={copy.subjectPlaceholder}
                        className={`mt-2.5 block w-full rounded-md border bg-white px-4 py-3 text-[14.5px] text-[#0A192F] placeholder:text-[#8FA4BA] transition-colors focus:outline-none ${
                          errors.subject
                            ? 'border-red-600 focus:border-red-600'
                            : 'border-[#CEDEEA] focus:border-[#145DA0]'
                        }`}
                      />
                    )}

                    {errors.subject && (
                      <p
                        id="error-subject"
                        className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-red-700"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[13.5px] font-medium text-[#0A192F]"
                    >
                      {copy.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={CONTACT_LIMITS.messageMax}
                      required
                      value={values.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'error-message' : undefined}
                      placeholder={copy.messagePlaceholder}
                      className={`mt-2 block w-full resize-y rounded-md border bg-white px-4 py-3 text-[14.5px] leading-[1.6] text-[#0A192F] placeholder:text-[#8FA4BA] transition-colors focus:outline-none ${
                        errors.message
                          ? 'border-red-600 focus:border-red-600'
                          : 'border-[#CEDEEA] focus:border-[#145DA0]'
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="error-message"
                        className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-red-700"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50/80 p-4 text-[13.5px] text-red-800 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                        <span>{submitError}</span>
                      </div>
                      <a
                        href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
                          values.subject || 'Contact',
                        )}&body=${encodeURIComponent(
                          `${values.fullName} (${values.email})\n\n${values.message}`,
                        )}`}
                        className="whitespace-nowrap shrink-0 font-medium text-[#0C2340] underline underline-offset-2 hover:text-[#145DA0]"
                      >
                        {copy.openMailClient}
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12.5px] text-[#5B7086]">{copy.privacyNote}</p>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex min-h-[46px] items-center justify-center whitespace-nowrap shrink-0 rounded-md bg-[#0C2340] px-7 py-3 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#143966] disabled:opacity-60"
                    >
                      {status === 'submitting' ? copy.submitting : copy.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
