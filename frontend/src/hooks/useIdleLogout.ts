"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseIdleLogoutOptions {
  isAuthenticated: boolean;
  logout: (reason?: "manual" | "idle" | "password_changed") => Promise<void>;
}

const AUTH_CHANNEL_NAME = "taskflow_auth_session";
const DEFAULT_IDLE_TIMEOUT_MINUTES = 30;

function getIdleTimeoutMinutes(): number {
  const envVal = process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES;
  if (!envVal) {
    return DEFAULT_IDLE_TIMEOUT_MINUTES;
  }
  const parsed = Number(envVal.trim());
  if (isNaN(parsed) || parsed <= 0) {
    console.warn(
      `[IdleTimeout] Invalid NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES ("${envVal}"). Using fallback ${DEFAULT_IDLE_TIMEOUT_MINUTES} minutes.`
    );
    return DEFAULT_IDLE_TIMEOUT_MINUTES;
  }
  return parsed;
}

export function useIdleLogout({
  isAuthenticated,
  logout,
}: UseIdleLogoutOptions) {
  const router = useRouter();

  // Read and validate configured timeout
  const timeoutMinutes = getIdleTimeoutMinutes();
  const timeoutMs = timeoutMinutes * 60 * 1000;

  // Warning window: 2 minutes before timeout, or half the timeout if timeout is <= 2 minutes
  const warningMs = Math.min(timeoutMs / 2, 2 * 60 * 1000);

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Keep mutable references to avoid re-triggering the monitoring effect
  const logoutRef = useRef(logout);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const showWarningRef = useRef(showWarning);
  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  // Activity timestamp and lifecycle refs
  const lastActivityRef = useRef<number>(Date.now());
  const lastThrottledRecordRef = useRef<number>(0);
  const isLoggingOutRef = useRef<boolean>(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Centralized logout executor with stable reference
  const performLogout = useCallback(
    async (reason: "idle" | "manual" | "password_changed" = "idle") => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;
      showWarningRef.current = false;
      setShowWarning(false);

      try {
        await logoutRef.current(reason);
      } catch (err) {
        console.warn("[Session] Logout error:", err);
      } finally {
        routerRef.current.replace(`/login?reason=${reason}`);
      }
    },
    []
  );

  // User activity resets the timestamp and dismisses warning if active
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    // Throttle activity recording to at most once per 500ms
    if (now - lastThrottledRecordRef.current >= 500) {
      lastThrottledRecordRef.current = now;
      lastActivityRef.current = now;

      // If warning modal was open, user activity automatically stays signed in
      if (showWarningRef.current) {
        showWarningRef.current = false;
        setShowWarning(false);
        setSecondsRemaining(0);
      }
    }
  }, []);

  // Explicit "Stay signed in" action from modal
  const staySignedIn = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    lastThrottledRecordRef.current = now;
    showWarningRef.current = false;
    setShowWarning(false);
    setSecondsRemaining(0);
  }, []);

  // Cross-tab BroadcastChannel synchronization
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    broadcastChannelRef.current = channel;

    channel.onmessage = async (event) => {
      if (event.data?.type === "AUTH_LOGOUT") {
        if (!isLoggingOutRef.current && isAuthenticatedRef.current) {
          isLoggingOutRef.current = true;
          showWarningRef.current = false;
          setShowWarning(false);
          try {
            await logoutRef.current(event.data.reason || "sync");
          } finally {
            routerRef.current.replace(
              `/login?reason=${event.data.reason || "sync"}`
            );
          }
        }
      }
    };

    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, []);

  // Main idle monitoring loop
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      showWarningRef.current = false;
      isLoggingOutRef.current = false;
      return;
    }

    // Initialize activity timestamp when entering authenticated state
    lastActivityRef.current = Date.now();
    lastThrottledRecordRef.current = Date.now();
    isLoggingOutRef.current = false;

    // Attach passive activity event listeners
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity, { passive: true });
    });

    // Inactivity evaluation function
    const checkIdleState = () => {
      if (isLoggingOutRef.current || !isAuthenticatedRef.current) return;

      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const remainingMs = timeoutMs - elapsed;

      if (remainingMs <= 0) {
        performLogout("idle");
      } else if (remainingMs <= warningMs) {
        setShowWarning(true);
        showWarningRef.current = true;
        setSecondsRemaining(Math.max(1, Math.ceil(remainingMs / 1000)));
      } else {
        if (showWarningRef.current) {
          setShowWarning(false);
          showWarningRef.current = false;
          setSecondsRemaining(0);
        }
      }
    };

    // Periodic heartbeat check (every 1 second)
    const intervalId = setInterval(checkIdleState, 1000);

    // Immediate evaluation when tab is focused, un-minimized, or laptop wakes up
    const onVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        checkIdleState();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityOrFocus);
    window.addEventListener("focus", onVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });
      document.removeEventListener("visibilitychange", onVisibilityOrFocus);
      window.removeEventListener("focus", onVisibilityOrFocus);
    };
  }, [isAuthenticated, timeoutMs, warningMs, handleUserActivity, performLogout]);

  return {
    showWarning,
    secondsRemaining,
    staySignedIn,
    signOutNow: () => performLogout("manual"),
  };
}
