"use client";

import {createContext,useContext,useEffect,useState,useCallback, type ReactNode} from "react";
import {getCurrentUser,loginUser,logoutUser,refreshAccessToken,registerUser} from "@/services/auth.service";
import { setApiAccessToken } from "@/services/api";
import type {LoginData,RegisterData} from "@/types/auth";
import type { User } from "@/types/user";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { IdleWarningModal } from "@/components/auth/IdleWarningModal";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    data: LoginData
  ) => Promise<User>;

  register: (
    data: RegisterData
  ) => Promise<void>;

  logout: (
    reason?: "manual" | "idle" | "password_changed"
  ) => Promise<void>;

  updateUser: (updatedUser: User) => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
};

/*
 * IMPORTANT
 *
 * This promise is outside the React component.
 *
 * It prevents multiple components / React Strict Mode
 * from calling /auth/refresh at the same time.
 */
let refreshPromise: Promise<string> | null = null;

const restoreSession = async (): Promise<string> => {
  const response =
    await refreshAccessToken();

  const token =
    response.data.accessToken;

  setApiAccessToken(token);

  return token;
};

const restoreSessionOnce =
  async (): Promise<string> => {
    if (!refreshPromise) {
      refreshPromise =
        restoreSession().finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const isAuthenticated =
    !!user && !!accessToken;

  // RESTORE SESSION

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log(
          "[Auth] Restoring session..."
        );

        // Only ONE refresh request can happen at a time.
        
        const token =
          await restoreSessionOnce();

        if (!mounted) {
          return;
        }

        setAccessToken(token);

        console.log(
          "[Auth] Access token restored"
        );

        // Now that Axios has the access token,request the current user.

        const userResponse =
          await getCurrentUser();

        if (!mounted) {
          return;
        }

        setUser(
          userResponse.data
        );

        console.log(
          "[Auth] User restored:",
          userResponse.data.email
        );
      } catch (error: any) {
        console.log(
          "[Auth] No active session"
        );

        if (!mounted) {
          return;
        }

        setUser(null);

        setAccessToken(null);

        setApiAccessToken(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // LOGIN

  const login = async (
    data: LoginData
  ): Promise<User> => {
    const response =
      await loginUser(data);

    const {
      user,
      accessToken,
    } = response.data;


    // Set Axios token immediately.

    setApiAccessToken(
      accessToken
    );

    // Update React state.

    setAccessToken(
      accessToken
    );

    setUser(user);

    return user;
  };

  // REGISTER

  const register = async (
    data: RegisterData
  ): Promise<void> => {
    await registerUser(data);
  };

  // LOGOUT

  const logout = useCallback(
    async (
      reason: "manual" | "idle" | "password_changed" = "manual"
    ): Promise<void> => {
      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          try {
            const channel = new BroadcastChannel("taskflow_auth_session");
            channel.postMessage({ type: "AUTH_LOGOUT", reason });
            channel.close();
          } catch {
            // ignore channel errors
          }
        }
        await logoutUser();
      } catch (error) {
        console.warn("[Auth] Backend logout request failed:", error);
      } finally {
        // Clear everything from memory.
        setUser(null);

        setAccessToken(null);

        setApiAccessToken(null);
      }
    },
    []
  );

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // IDLE SESSION MONITORING & MODAL

  const {
    showWarning,
    secondsRemaining,
    staySignedIn,
    signOutNow,
  } = useIdleLogout({
    isAuthenticated,
    logout,
  });


  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
      {showWarning && (
        <IdleWarningModal
          secondsRemaining={secondsRemaining}
          onStaySignedIn={staySignedIn}
          onSignOut={signOutNow}
        />
      )}
    </AuthContext.Provider>
  );
}

// USE AUTH CONTEXT

export function useAuthContext() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}