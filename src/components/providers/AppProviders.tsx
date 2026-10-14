"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n";
import { AuthUser, DEMO_ACCOUNTS, UserRole } from "@/lib/auth";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}

interface AuthContextType {
  user: AuthUser | null;
  loginAs: (role: "citizen" | "officer" | "head" | "cdo") => void;
  logout: () => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  showJourneyModal: boolean;
  setShowJourneyModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "hi",
  setLang: () => {},
  t: translations.hi,
});

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginAs: () => {},
  logout: () => {},
  isDemoMode: true,
  toggleDemoMode: () => {},
  showJourneyModal: false,
  setShowJourneyModal: () => {},
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("hi");
  const [user, setUser] = useState<AuthUser | null>(DEMO_ACCOUNTS.citizen.user);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [showJourneyModal, setShowJourneyModal] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("sahaj_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      setLangState(savedLang);
    }
    const savedUser = localStorage.getItem("sahaj_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEMO_ACCOUNTS.citizen.user);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("sahaj_lang", newLang);
  };

  const loginAs = (role: "citizen" | "officer" | "head" | "cdo") => {
    const account = DEMO_ACCOUNTS[role].user;
    setUser(account);
    localStorage.setItem("sahaj_user", JSON.stringify(account));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sahaj_user");
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const t = translations[lang] || translations.hi;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <AuthContext.Provider
        value={{
          user,
          loginAs,
          logout,
          isDemoMode,
          toggleDemoMode,
          showJourneyModal,
          setShowJourneyModal,
        }}
      >
        {children}
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useAuth() {
  return useContext(AuthContext);
}
