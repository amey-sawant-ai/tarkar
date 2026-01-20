"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { Language, getTranslation } from "@/lib/translations";
import { STORAGE_KEYS } from "@/lib/constants";

// ============================================================================
// TYPES
// ============================================================================

interface LanguageContextType {
  /** Current language code */
  language: Language;
  /** Function to change the language */
  setLanguage: (lang: Language) => void;
  /** Translation function - returns translated string for a key */
  t: (key: string, fallback?: string) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
  /** Initial language (overrides localStorage) */
  defaultLanguage?: Language;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SUPPORTED_LANGUAGES: Language[] = ["en", "hi", "mr"];
const DEFAULT_LANGUAGE: Language = "en";

// ============================================================================
// CONTEXT
// ============================================================================

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access language context
 * Must be used within LanguageProvider
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get saved language from localStorage with validation
 */
function getSavedLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.language) as Language;
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Save language to localStorage
 */
function saveLanguage(lang: Language): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.language, lang);
  } catch (error) {
    console.warn("Failed to save language to localStorage:", error);
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

export function LanguageProvider({
  children,
  defaultLanguage,
}: LanguageProviderProps) {
  // Initialize with default language to prevent hydration mismatch
  // localStorage will be read after mount in useEffect
  const [language, setLanguageState] = useState<Language>(
    defaultLanguage && SUPPORTED_LANGUAGES.includes(defaultLanguage)
      ? defaultLanguage
      : DEFAULT_LANGUAGE
  );

  // Track if we've hydrated (client-side mounted)
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    if (!defaultLanguage) {
      const savedLang = getSavedLanguage();
      if (savedLang !== language) {
        setLanguageState(savedLang);
      }
    }
    setIsHydrated(true);
  }, [defaultLanguage, language]);

  // Memoized language setter with persistence
  const setLanguage = useCallback((lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  // Memoized translation function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      return getTranslation(key, language) || fallback || key;
    },
    [language]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
