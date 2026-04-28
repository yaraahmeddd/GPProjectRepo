import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { ROLE_LABELS } from "../../../types/auth";
import {
  LogOut,
  User,
  Home,
  CreditCard,
  Trophy,
  Dumbbell,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { resolveFileUrl } from "../../../utils/fileUrl";
import { useLanguage } from "../../../hooks/useLanguage";
import { useTranslation } from "react-i18next";

const hucLogo = "/assets/HUC_logo.jpeg";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  const { t } = useTranslation(["nav", "common"]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        dir="rtl"
        className="bg-[#F9FAFB] rounded-[12px] shadow-xl w-full max-w-[440px] overflow-hidden"
        style={{ fontFamily: "'Cairo', 'Segoe UI', Roboto, sans-serif" }}
      >
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <div className="text-[#2563EB]">
              <LogOut size={32} />
            </div>
          </div>

          <h3 className="text-[22px] font-bold text-[#1F2937] text-center px-6">
            {t("nav:navbar.logoutConfirmTitle")}
          </h3>
        </div>

        <div className="px-8 pb-8 text-center">
          <p className="text-[14px] leading-relaxed text-[#6B7280]">
            {t("nav:navbar.logoutConfirmDesc")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-3 px-6 pb-6">
          <button
            onClick={onConfirm}
            className="flex-1 h-[44px] bg-[#DC2626] text-white text-[14px] font-semibold rounded-[8px] transition-all hover:bg-red-700 active:scale-95"
          >
            {t("nav:navbar.logout")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[44px] bg-[#E5E7EB] text-[#111827] text-[14px] font-medium rounded-[8px] transition-all hover:bg-gray-300 active:scale-95"
          >
            {t("common:cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export function Navbar() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language } = useLanguage();
  const { t, i18n } = useTranslation(["nav"]);
  const location = useLocation();

  if (!user) return null;

  const isMember = user.role === "MEMBER";

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const photoUrl = resolveFileUrl(user.photo);

  const memberTabs = [
    { title: "member.home", path: "/member/dashboard/home", icon: Home },
    { title: "member.profile", path: "/member/dashboard/profile", icon: User },
    { title: "member.memberships", path: "/member/dashboard/memberships", icon: CreditCard },
    { title: "member.sports", path: "/member/dashboard/sports", icon: Trophy },
    { title: "member.subscribe", path: "/member/dashboard/subscribe", icon: Dumbbell },
    { title: "member.courts", path: "/member/dashboard/courts", icon: MapPin },
  ];

  const isActiveMemberTab = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 h-16 bg-card border-b border-border">
        <div className="px-4 sm:px-6 h-full">
          <div className="flex flex-row h-full items-center gap-2 sm:gap-4">
            <div className={`${isMember ? "w-[80px] sm:w-[120px] xl:w-[170px]" : "flex-1"} flex items-center gap-2 sm:gap-3 min-w-0`}>
              <img
                src={hucLogo}
                alt="HUC"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover bg-card"
              />
              <span className="font-bold text-lg text-foreground hidden xl:block truncate">{t("navbar.clubName")}</span>
            </div>

            {isMember && (
              <div className="flex-1 min-w-0 hidden md:flex justify-center px-1">
                <nav className="w-full max-w-[1020px] rounded-2xl bg-[#e8f2fb] p-1 sm:p-1.5 flex items-center gap-1">
                  {memberTabs.map((tab) => {
                    const active = isActiveMemberTab(tab.path);
                    const TabIcon = tab.icon;
                    return (
                      <NavLink
                        key={tab.path}
                        to={tab.path}
                        title={t(tab.title)}
                        className="relative flex-1 min-w-0 h-8 sm:h-9 px-1.5 rounded-xl text-[11px] sm:text-xs xl:text-sm flex items-center justify-center gap-1"
                      >
                        {active && (
                          <motion.span
                            layoutId="member-tab-active-pill"
                            className="absolute inset-0 rounded-xl bg-[#cfe5f8]"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <TabIcon
                          className={`relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors duration-200 ${
                            active ? "text-[#0f3f6d]" : "text-[#2f5f8a]"
                          }`}
                        />
                        <span
                          className={`relative z-10 transition-colors duration-200 hidden xl:inline ${
                            active ? "text-[#0f3f6d] font-semibold" : "text-[#2f5f8a]"
                          }`}
                        >
                          {t(tab.title)}
                        </span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            )}

            <div className={`${isMember ? "w-[110px] sm:w-[170px] xl:w-[250px]" : "flex-1"} flex items-center justify-end gap-2 sm:gap-4 min-w-0`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-semibold text-foreground truncate max-w-[110px] sm:max-w-[180px]">{user.fullName}</p>
                  <Badge className="bg-huc-orange text-huc-orange-foreground text-[12px] px-3 py-0.5 rounded-full">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
                {photoUrl ? (
                  <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-border">
                    <img src={photoUrl} alt={user.fullName} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen((v) => !v)}
                  className="h-9 px-2 sm:px-3 rounded-lg hover:bg-muted flex flex-row items-center justify-center transition-colors shadow-sm border border-border bg-card hover:border-primary/20 gap-1.5"
                  title={t("navbar.language")}
                >
                  {language === "ar" ? (
                    <img src="https://flagcdn.com/w20/eg.png" alt="AR" className="w-5 rounded-sm shadow-sm" />
                  ) : (
                    <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 rounded-sm shadow-sm" />
                  )}
                  <span className="hidden sm:block text-xs font-bold text-primary leading-none">
                    {language === "ar" ? "AR" : "EN"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {langDropdownOpen && (
                  <div
                    className="absolute top-11 end-0 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in"
                    onMouseLeave={() => setLangDropdownOpen(false)}
                  >
                    <button
                      onClick={() => { void i18n.changeLanguage("ar"); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-start text-sm font-semibold transition-colors ${i18n.language.startsWith("ar") ? "bg-blue-50 text-[#2596be]" : "text-[#0e1c38] hover:bg-gray-50"}`}
                    >
                      <img src="https://flagcdn.com/w20/eg.png" alt="AR" className="w-5 rounded-sm shadow-sm" />
                      {"\u0627\u0644\u0639\u0631\u0628\u064A\u0629"}
                    </button>
                    <button
                      onClick={() => { void i18n.changeLanguage("en"); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-start text-sm font-semibold transition-colors ${i18n.language.startsWith("en") ? "bg-blue-50 text-[#2596be]" : "text-[#0e1c38] hover:bg-gray-50"}`}
                    >
                      <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 rounded-sm shadow-sm" />
                      English
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                title={t("navbar.logout")}
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {isMember && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
          <nav className="flex items-center justify-around px-2 h-16 bg-[#e8f2fb]/30 backdrop-blur-md">
            {memberTabs.map((tab) => {
              const active = isActiveMemberTab(tab.path);
              const TabIcon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  title={t(tab.title)}
                  className="relative flex flex-col items-center justify-center w-full h-full gap-1"
                >
                  {active && (
                    <motion.span
                      layoutId="member-tab-active-pill-mobile"
                      className="absolute inset-x-2 top-1 bottom-1 rounded-xl bg-[#cfe5f8] -z-10"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <TabIcon
                    className={`relative z-10 h-5 w-5 transition-colors duration-200 ${
                      active ? "text-[#0f3f6d]" : "text-[#2f5f8a]"
                    }`}
                  />
                  <span
                    className={`relative z-10 text-[10px] text-center leading-none transition-colors duration-200 ${
                      active ? "text-[#0f3f6d] font-bold" : "text-[#2f5f8a] font-medium"
                    }`}
                  >
                    {t(tab.title)}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}