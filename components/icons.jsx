/**
 * Icons — jeu d'icônes SVG partagées, converties depuis TS vers JSX
 * (aucune prop typée, tout passe par `props` classique + spread).
 */

export function IconArrow(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 9l10-4.5L22 9l-10 4.5L2 9z" />
      <path d="M6 11.3V17c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-5.7" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 19c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <circle cx="17.5" cy="9" r="2.4" />
      <path d="M15.8 13.7c2.6.4 4.7 2.3 4.7 5.3" />
    </svg>
  );
}

export function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}
/**
 * icons/features.jsx — icônes SVG professionnelles pour la section "Pourquoi nous choisir".
 * Remplace les emojis (🔒💳🌍📈) par des icônes vectorielles cohérentes en style et poids de trait.
 */

export function IconShieldLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <rect x="9.5" y="11" width="5" height="4" rx="0.8" />
      <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
    </svg>
  );
}

export function IconReceiptCard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
      <path d="M7 17h2" />
    </svg>
  );
}

export function IconGlobeLanguage(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.2 12 20.5" />
      <path d="M12 3.5c-2.4 2.3-3.6 5.2-3.6 8.5s1.2 6.2 3.6 8.5" />
    </svg>
  );
}

export function IconRoute(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="6" r="2" />
      <path d="M5 16v-2a4 4 0 0 1 4-4h6a4 4 0 0 0 4-4" />
    </svg>
  );
}