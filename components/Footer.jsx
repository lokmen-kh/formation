"use client";

/**
 * Footer — component réutilisable, même identité que le Navbar.
 * Placement : import et affichage une seule fois dans `app/layout.jsx`
 * (pas besoin de le remettre dans chaque page).
 *
 * Refonte : fond bleu plein (coherent avec la bande stats et le Hero,
 * aucun degrade nulle part), logo aligne sur celui de la Navbar.
 */

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3C15.9 3.2 15 3.1 13.9 3.1c-2.9 0-4.4 1.7-4.4 4.3v2.4H6.8v3.2h2.7V21h4z" />
    </svg>
  );
}
function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconYoutube(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconWhatsapp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}
function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  );
}
function IconMapPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const columns = [
    {
      title: isAr ? 'المنصة' : 'Platform',
      links: [
        { label: isAr ? 'الدورات' : 'Courses', href: '/#catalog' },
        { label: isAr ? 'كيف تعمل' : 'How it works', href: '/#how-it-works' },
        { label: isAr ? 'الأسئلة الشائعة' : 'FAQ', href: '/#faq' },
      ],
    },
    {
      title: isAr ? 'الفئات' : 'Categories',
      links: [
        { label: isAr ? 'التطوير' : 'Development', href: '/?category=Development' },
        { label: isAr ? 'البيانات والذكاء الاصطناعي' : 'Data & AI', href: '/?category=Data' },
        { label: isAr ? 'التصميم' : 'Design', href: '/?category=Design' },
        { label: isAr ? 'الأعمال' : 'Business', href: '/?category=Business' },
      ],
    },
    {
      title: isAr ? 'الدعم' : 'Support',
      links: [
        { label: isAr ? 'مركز المساعدة' : 'Help center', href: '/#faq' },
        { label: isAr ? 'طرق الدفع' : 'Payment methods', href: '/#features' },
        { label: isAr ? 'شروط الاستخدام' : 'Terms of use', href: '/terms' },
        { label: isAr ? 'سياسة الخصوصية' : 'Privacy policy', href: '/privacy' },
      ],
    },
  ];

  const socials = [
    { key: 'facebook', Icon: IconFacebook, label: 'Facebook' },
    { key: 'instagram', Icon: IconInstagram, label: 'Instagram' },
    { key: 'youtube', Icon: IconYoutube, label: 'YouTube' },
    { key: 'whatsapp', Icon: IconWhatsapp, label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 text-xs">
        {/* Bloc marque + contact + réseaux */}
        <div className="col-span-2 lg:col-span-2 space-y-5">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 border border-white/10">
              <IconGraduationCap className="w-4.5 h-4.5 text-white" />
            </span>
            <span className="text-base font-black leading-none">
              {isAr ? 'التعليم بلس' : 'EduPlus'}
            </span>
          </Link>

          <p className="text-white/70 leading-relaxed max-w-xs">
            {isAr
              ? 'منصة أكاديمية ثنائية اللغة تربط النظرية بالتطبيق، ببث فيديو آمن ودفع محلي مرن.'
              : 'A bilingual academic platform bridging theory and practice, with secure streaming and flexible local payment.'}
          </p>

          <ul className="space-y-2.5 text-white/70">
            <li className="flex items-center gap-2.5">
              <IconMail className="w-4 h-4 shrink-0 text-white/50" />
              <a href="mailto:contact@eduplus.dz" className="hover:text-white transition-colors">contact@eduplus.dz</a>
            </li>
            <li className="flex items-center gap-2.5">
              <IconMapPin className="w-4 h-4 shrink-0 text-white/50" />
              <span>{isAr ? 'الجزائر' : 'Algeria'}</span>
            </li>
          </ul>

          <div className="flex items-center gap-2.5 pt-1">
            {socials.map(({ key, Icon, label }) => (
              <a
                key={key}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 border border-white/10 text-white/80 hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-3.5">
            <h5 className="font-bold text-white">{col.title}</h5>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
          <span>© {new Date().getFullYear()} EduPlus. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
          <span>{isAr ? 'صُنع لطلاب الجزائر والوطن العربي' : 'Made for students in Algeria & the Arab world'}</span>
        </div>
      </div>
    </footer>
  );
}