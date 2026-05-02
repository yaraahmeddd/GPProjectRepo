import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ─── Arabic namespaces ────────────────────────────────────────────────────────
import arCommon from './i18n/locales/ar/common.json';
import arNav from './i18n/locales/ar/nav.json';
import arDashboard from './i18n/locales/ar/dashboard.json';
import arDashboardPage from './i18n/locales/ar/DashboardPage.json';
import arMembers from './i18n/locales/ar/members.json';
import arSports from './i18n/locales/ar/sports.json';
import arFinance from './i18n/locales/ar/finance.json';
import arRegistrations from './i18n/locales/ar/registrations.json';
import arRegistrationManagementPage from './i18n/locales/ar/RegistrationManagementPage.json';
import arFaculties from './i18n/locales/ar/faculties.json';
import arBranches from './i18n/locales/ar/branches.json';
import arProfessions from './i18n/locales/ar/professions.json';
import arMedia from './i18n/locales/ar/media.json';
import arAdmin from './i18n/locales/ar/admin.json';
import arLanding from './i18n/locales/ar/landing.json';
import arTeam from './i18n/locales/ar/team.json';
import arMember from './i18n/locales/ar/member.json';
import arMemberManagementPage from './i18n/locales/ar/MemberManagementPage.json';
import arManageInvitationsPage from './i18n/locales/ar/ManageInvitationsPage.json';
import arSportsPage from './i18n/locales/ar/SportsPage.json';

// ─── English namespaces ───────────────────────────────────────────────────────
import enCommon from './i18n/locales/en/common.json';
import enNav from './i18n/locales/en/nav.json';
import enDashboard from './i18n/locales/en/dashboard.json';
import enDashboardPage from './i18n/locales/en/DashboardPage.json';
import enMembers from './i18n/locales/en/members.json';
import enSports from './i18n/locales/en/sports.json';
import enFinance from './i18n/locales/en/finance.json';
import enRegistrations from './i18n/locales/en/registrations.json';
import enRegistrationManagementPage from './i18n/locales/en/RegistrationManagementPage.json';
import enFaculties from './i18n/locales/en/faculties.json';
import enBranches from './i18n/locales/en/branches.json';
import enProfessions from './i18n/locales/en/professions.json';
import enMedia from './i18n/locales/en/media.json';
import enAdmin from './i18n/locales/en/admin.json';
import enLanding from './i18n/locales/en/landing.json';
import enTeam from './i18n/locales/en/team.json';
import enMember from './i18n/locales/en/member.json';
import enMemberManagementPage from './i18n/locales/en/MemberManagementPage.json';
import enManageInvitationsPage from './i18n/locales/en/ManageInvitationsPage.json';
import enSportsPage from './i18n/locales/en/SportsPage.json';

const RTL_LANGUAGES = new Set(['ar']);

const syncDocumentLanguage = (language?: string) => {
  if (typeof document === 'undefined') return;
  const lang = (language ?? 'ar').split('-')[0];
  const normalized = lang === 'en' ? 'en' : 'ar';
  document.documentElement.lang = normalized;
  document.documentElement.dir = RTL_LANGUAGES.has(normalized) ? 'rtl' : 'ltr';
  localStorage.setItem('dashboard-lang', normalized);
};

i18n.on('languageChanged', syncDocumentLanguage);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: arCommon,
        nav: arNav,
        dashboard: arDashboard,
        DashboardPage: arDashboardPage,
        members: arMembers,
        sports: arSports,
        finance: arFinance,
        registrations: arRegistrations,
        RegistrationManagementPage: arRegistrationManagementPage,
        faculties: arFaculties,
        branches: arBranches,
        professions: arProfessions,
        media: arMedia,
        admin: arAdmin,
        landing: arLanding,
        team: arTeam,
        member: arMember,
        MemberManagementPage: arMemberManagementPage,
        ManageInvitationsPage: arManageInvitationsPage,
        SportsPage: arSportsPage,
      },
      en: {
        common: enCommon,
        nav: enNav,
        dashboard: enDashboard,
        DashboardPage: enDashboardPage,
        members: enMembers,
        sports: enSports,
        finance: enFinance,
        registrations: enRegistrations,
        RegistrationManagementPage: enRegistrationManagementPage,
        faculties: enFaculties,
        branches: enBranches,
        professions: enProfessions,
        media: enMedia,
        admin: enAdmin,
        landing: enLanding,
        team: enTeam,
        member: enMember,
        MemberManagementPage: enMemberManagementPage,
        ManageInvitationsPage: enManageInvitationsPage,
        SportsPage: enSportsPage,
      },
    },

    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    load: 'languageOnly',         // strips "en-US" → "en", "ar-EG" → "ar"

    defaultNS: 'common',
    ns: [
      'common', 'nav', 'dashboard', 'DashboardPage',
      'members', 'sports', 'finance', 'registrations',
      'RegistrationManagementPage', 'faculties', 'branches',
      'professions', 'media', 'admin', 'landing', 'team', 'member',
      'MemberManagementPage', 'ManageInvitationsPage', 'SportsPage'
    ],

    interpolation: { escapeValue: false },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'dashboard-lang',
      caches: ['localStorage'],
      // Sanitize cached region-suffixed locales ("ar-EG" → "ar") at runtime.
      convertDetectedLanguage: (lng: string) => lng.split('-')[0],
    },

    keySeparator: '.',
    saveMissing: false,
  })
  .then(() => {
    syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
  })
  .catch((error) => {
    console.error('Failed to initialize i18n', error);
  });
export default i18n;
