"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type UserRole = "user" | "admin" | "staff";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  walletBalancePaise?: number;
  role?: UserRole;
  isActive?: boolean;
  preferences?: {
    darkMode: boolean;
    language: "en" | "hi" | "mr";
  };
  notifications?: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    sms: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from localStorage with error handling
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("auth_token");
      if (
        storedToken &&
        storedToken !== "null" &&
        storedToken !== "undefined"
      ) {
        setToken(storedToken);
      }
    } catch (error) {
      console.warn("Error reading auth token from localStorage:", error);
      localStorage.removeItem("auth_token");
    }
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  const isAuthenticated = !!user && !!token;

  // Fetch user profile
  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.success ? data.data : null;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const userProfile = await fetchUserProfile(token);
        if (userProfile) {
          setUser(userProfile);
        } else {
          // Token is invalid, clear it
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    // Only start loading if we haven't loaded yet
    if (isLoading) {
      initAuth();
    }
  }, [token, isLoading]);

  // Login function
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token: authToken, user: userProfile } = data.data;

        // Update state synchronously
        setToken(authToken);
        setUser(userProfile);

        // Ensure localStorage is updated immediately
        localStorage.setItem("auth_token", authToken);

        return { success: true, user: userProfile };
      } else {
        return { success: false, error: data.error?.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error occurred" };
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        const { token: authToken, user: userProfile } = data.data;
        setToken(authToken);
        setUser(userProfile);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error?.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error occurred" };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoading(false); // Ensure not loading after logout
    // Clear other local storage if needed
    localStorage.removeItem("cart");
  };

  // Update user function
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Refresh user profile
  const refreshUser = async () => {
    if (token) {
      const userProfile = await fetchUserProfile(token);
      if (userProfile) {
        setUser(userProfile);
      }
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page or show login modal
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// API helper with authentication
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
    throw new Error("Authentication expired");
  }

  return response;
}
