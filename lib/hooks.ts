/**
 * Custom React Hooks
 * Reusable stateful logic for consistent behavior across components
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BREAKPOINTS, STORAGE_KEYS } from "./constants";

// ============================================================================
// LOCAL STORAGE HOOK
// ============================================================================

/**
 * Hook for persisting state to localStorage with SSR safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// ============================================================================
// MEDIA QUERY HOOK
// ============================================================================

/**
 * Hook for responsive design - returns true if screen matches breakpoint
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Convenience hooks for Tailwind breakpoints
 */
export function useIsMobile(): boolean {
  return !useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}

export function useIsTablet(): boolean {
  const isAboveMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isBelowLg = !useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  return isAboveMd && isBelowLg;
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================

/**
 * Hook for debouncing values (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// TOGGLE HOOK
// ============================================================================

/**
 * Simple toggle hook for boolean states
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

// ============================================================================
// CLICK OUTSIDE HOOK
// ============================================================================

/**
 * Hook to detect clicks outside of an element
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}

// ============================================================================
// COPY TO CLIPBOARD HOOK
// ============================================================================

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for copying text to clipboard with feedback
 */
export function useCopyToClipboard(
  resetDelay: number = 2000
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), resetDelay);
      return () => clearTimeout(timer);
    }
  }, [copied, resetDelay]);

  return { copied, copy, reset };
}

// ============================================================================
// SCROLL LOCK HOOK
// ============================================================================

/**
 * Hook to lock body scroll (useful for modals)
 */
export function useScrollLock(lock: boolean): void {
  useEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}

// ============================================================================
// INTERSECTION OBSERVER HOOK
// ============================================================================

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Hook for observing element visibility (for animations, lazy loading)
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0, root = null, rootMargin = "0px", freezeOnceVisible = false } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return [ref, isVisible];
}

// ============================================================================
// COUNTDOWN HOOK
// ============================================================================

interface UseCountdownReturn {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Hook for countdown timers (for offers, limited time deals)
 */
export function useCountdown(targetDate: Date | string): UseCountdownReturn {
  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

// ============================================================================
// FORM VALIDATION HOOK
// ============================================================================

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule[];
};

interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  handleChange: (field: keyof T, value: string) => void;
  handleBlur: (field: keyof T) => void;
  validateAll: () => boolean;
  reset: () => void;
}

/**
 * Hook for form validation
 */
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: ValidationRules<T>
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (field: keyof T, value: string): string | undefined => {
      const fieldRules = rules[field];
      if (!fieldRules) return undefined;

      for (const rule of fieldRules) {
        if (rule.required && !value.trim()) {
          return rule.message;
        }
        if (rule.minLength && value.length < rule.minLength) {
          return rule.message;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return rule.message;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message;
        }
        if (rule.custom && !rule.custom(value)) {
          return rule.message;
        }
      }
      return undefined;
    },
    [rules]
  );

  const handleChange = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [values, validateField]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(values) as Array<keyof T>) {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      )
    );
    return isValid;
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll,
    reset,
  };
}

// ============================================================================
// CART HOOK
// ============================================================================

interface UseCartReturn {
  cart: Record<number, number>;
  itemCount: number;
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
}

/**
 * Hook for shopping cart management
 */
export function useCart(): UseCartReturn {
  const [cart, setCart] = useLocalStorage<Record<number, number>>(
    STORAGE_KEYS.cart,
    {}
  );

  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const addItem = useCallback(
    (id: number) => {
      setCart((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    },
    [setCart]
  );

  const removeItem = useCallback(
    (id: number) => {
      setCart((prev) => {
        const newCart = { ...prev };
        if (newCart[id] > 1) {
          newCart[id]--;
        } else {
          delete newCart[id];
        }
        return newCart;
      });
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      setCart((prev) => {
        if (quantity <= 0) {
          // Remove item from cart - use rest spread without unused variable
          const newCart = { ...prev };
          delete newCart[id];
          return newCart;
        }
        return { ...prev, [id]: quantity };
      });
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  const getItemQuantity = useCallback(
    (id: number): number => {
      return cart[id] || 0;
    },
    [cart]
  );

  return {
    cart,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };
}
