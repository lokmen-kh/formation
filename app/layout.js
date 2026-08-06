import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import './globals.css';

// Déclaration de la police de langue anglaise/latine
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

// Déclaration de la police de langue arabe (Cairo)
const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata = {
  title: 'Next.js Platform',
  description: 'Plateforme e-learning bilingue biculturelle',
};

export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <html lang="fr" className={`${plusJakartaSans.variable} ${cairo.variable}`} suppressHydrationWarning>
            <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col" suppressHydrationWarning>
              {children}
            </body>
          </html>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}