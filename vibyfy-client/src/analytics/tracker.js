/**
 * Vibify Telemetry & Analytics Tracker
 * Lightweight, privacy-safe analytics layer.
 */

// Generate a random UUID-like string with fallback
const generateId = () => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // Fallback
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Safe storage access (handles private browsing / storage disabled)
const storage = {
  get: (type, key) => {
    try {
      const store = type === "local" ? window.localStorage : window.sessionStorage;
      return store?.getItem(key) || null;
    } catch {
      return null;
    }
  },
  set: (type, key, val) => {
    try {
      const store = type === "local" ? window.localStorage : window.sessionStorage;
      store?.setItem(key, val);
    } catch {
      // ignore
    }
  },
};

// Anonymous Visitor ID (Persisted in localStorage)
export const getVisitorId = () => {
  let vid = storage.get("local", "vibyfy_analytics_vid");
  if (!vid) {
    vid = generateId();
    storage.set("local", "vibyfy_analytics_vid", vid);
  }
  return vid;
};

// Anonymous Session ID (Persisted in sessionStorage)
export const getSessionId = () => {
  let sid = storage.get("session", "vibyfy_analytics_sid");
  if (!sid) {
    sid = generateId();
    storage.set("session", "vibyfy_analytics_sid", sid);
    storage.set("session", "vibyfy_analytics_session_start", Date.now().toString());
  }
  return sid;
};

// Check if returning visitor
export const isReturningVisitor = () => {
  const lastVisit = storage.get("local", "vibyfy_analytics_last_seen");
  const now = Date.now();
  storage.set("local", "vibyfy_analytics_last_seen", now.toString());
  return Boolean(lastVisit);
};

// Get Session Duration in seconds
export const getSessionDuration = () => {
  const start = parseInt(storage.get("session", "vibyfy_analytics_session_start") || "0", 10);
  if (!start) return 0;
  return Math.max(0, Math.round((Date.now() - start) / 1000));
};

// Device Information
export const getDeviceInfo = () => {
  if (typeof window === "undefined") {
    return {
      type: "desktop",
      browser: "unknown",
      os: "unknown",
      screen_width: 0,
      screen_height: 0,
      viewport_width: 0,
      viewport_height: 0,
      language: "en",
      timezone: "UTC",
    };
  }

  const ua = navigator.userAgent || "";
  let type = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    type = "tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    type = "mobile";
  }

  let browser = "Other";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  let timezone = "UTC";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    // fallback
  }

  return {
    type,
    browser,
    os,
    screen_width: window.screen?.width || 0,
    screen_height: window.screen?.height || 0,
    viewport_width: window.innerWidth || 0,
    viewport_height: window.innerHeight || 0,
    language: navigator.language || navigator.userLanguage || "en",
    timezone,
  };
};

// Traffic Source and UTM extraction
export const getTrafficSource = () => {
  if (typeof window === "undefined") {
    return {
      source: "direct",
      medium: "none",
      campaign: "",
      term: "",
      content: "",
      category: "direct",
    };
  }

  let searchParams;
  try {
    searchParams = new URLSearchParams(window.location.search);
  } catch {
    searchParams = new URLSearchParams();
  }

  const utmSource = searchParams.get("utm_source") || "";
  const utmMedium = searchParams.get("utm_medium") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";
  const utmTerm = searchParams.get("utm_term") || "";
  const utmContent = searchParams.get("utm_content") || "";

  const referrer = document.referrer || "";
  let category = "direct";
  let derivedSource = "direct";
  let derivedMedium = "none";

  if (utmSource || utmCampaign) {
    category = "campaign";
    derivedSource = utmSource || "campaign";
    derivedMedium = utmMedium || "campaign";
  } else if (referrer) {
    try {
      const refHost = new URL(referrer).hostname.toLowerCase();
      const currentHost = window.location.hostname.toLowerCase();

      if (refHost === currentHost) {
        category = "direct";
        derivedSource = "internal";
      } else if (/(google|bing|duckduckgo|yahoo|baidu|yandex|ecosia)\./i.test(refHost)) {
        category = "organic";
        derivedSource = refHost.replace(/^www\./, "");
        derivedMedium = "organic";
      } else if (/(t\.co|twitter|x\.com|facebook|instagram|linkedin|reddit|pinterest|tiktok|youtube)/i.test(refHost)) {
        category = "social";
        derivedSource = refHost.replace(/^www\./, "");
        derivedMedium = "social";
      } else {
        category = "referral";
        derivedSource = refHost.replace(/^www\./, "");
        derivedMedium = "referral";
      }
    } catch {
      category = "referral";
      derivedSource = "unknown";
      derivedMedium = "referral";
    }
  }

  return {
    source: utmSource || derivedSource,
    medium: utmMedium || derivedMedium,
    campaign: utmCampaign,
    term: utmTerm,
    content: utmContent,
    category,
  };
};

// Get Backend Analytics API URL
export const getAnalyticsUrl = () => {
  try {
    return (
      (typeof import.meta !== "undefined" && (import.meta.env?.ANALYTICS_API_URL || import.meta.env?.VITE_ANALYTICS_API_URL)) ||
      (typeof process !== "undefined" && (process.env?.ANALYTICS_API_URL || process.env?.VITE_ANALYTICS_API_URL)) ||
      (typeof window !== "undefined" && window.__ANALYTICS_API_URL__) ||
      ""
    );
  } catch {
    return "";
  }
};

// Core Event Dispatcher
export const trackEvent = async (eventName, customData = {}) => {
  try {
    const apiUrl = getAnalyticsUrl();
    if (!apiUrl) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page: {
        url: window.location.href,
        path: window.location.pathname + window.location.search,
        title: document.title || "VIBYFY",
      },
      referrer: document.referrer || "",
      device: getDeviceInfo(),
      traffic: getTrafficSource(),
      data: customData,
    };

    // Non-blocking asynchronous network request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors",
    }).catch(() => {
      // Silently ignore server/CORS/network errors
    });
  } catch {
    // Fail-safe: Never break the application
  }
};

// Track Page View (with deduplication)
let lastTrackedPath = "";
let lastTrackedTime = 0;

export const trackPageView = (path) => {
  try {
    const currentPath = path || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
    const now = Date.now();

    // Prevent duplicate triggers within 250ms for identical path
    if (lastTrackedPath === currentPath && now - lastTrackedTime < 250) {
      return;
    }

    lastTrackedPath = currentPath;
    lastTrackedTime = now;

    // Increment page count in session
    const pagesCount = parseInt(storage.get("session", "vibyfy_analytics_page_count") || "0", 10) + 1;
    storage.set("session", "vibyfy_analytics_page_count", pagesCount.toString());

    trackEvent("page_view", {
      is_returning: isReturningVisitor(),
      session_duration_seconds: getSessionDuration(),
      session_page_number: pagesCount,
    });
  } catch {
    // fail-safe
  }
};

// Track Safe Button Clicks
export const trackButtonClick = (label, element, metadata = {}) => {
  try {
    trackEvent("button_click", {
      label: (label || "").slice(0, 100).trim(),
      element_type: element || "button",
      ...metadata,
    });
  } catch {
    // fail-safe
  }
};

// Performance Tracking
let performanceTracked = false;

export const trackPerformance = () => {
  try {
    const perf = typeof window !== "undefined" ? window.performance : null;
    if (performanceTracked || !perf) {
      return;
    }

    const navigationEntries = perf.getEntriesByType?.("navigation");
    let metrics = {};

    if (navigationEntries && navigationEntries.length > 0) {
      const nav = navigationEntries[0];
      metrics = {
        load_time_ms: Math.round(nav.loadEventEnd > 0 ? nav.loadEventEnd - nav.startTime : 0),
        dom_ready_ms: Math.round(nav.domContentLoadedEventEnd > 0 ? nav.domContentLoadedEventEnd - nav.startTime : 0),
        dns_time_ms: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcp_time_ms: Math.round(nav.connectEnd - nav.connectStart),
        ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
        transfer_size_bytes: nav.transferSize || 0,
      };
    } else if (perf.timing) {
      const t = perf.timing;
      const start = t.navigationStart;
      metrics = {
        load_time_ms: t.loadEventEnd > start ? t.loadEventEnd - start : 0,
        dom_ready_ms: t.domContentLoadedEventEnd > start ? t.domContentLoadedEventEnd - start : 0,
        dns_time_ms: t.domainLookupEnd - t.domainLookupStart,
        tcp_time_ms: t.connectEnd - t.connectStart,
        ttfb_ms: t.responseStart - t.requestStart,
      };
    }

    // Optional First Contentful Paint
    try {
      const paintEntries = perf.getEntriesByType?.("paint") || [];
      const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
      if (fcp) {
        metrics.first_contentful_paint_ms = Math.round(fcp.startTime);
      }
    } catch {
      // ignore
    }

    performanceTracked = true;
    trackEvent("performance", metrics);
  } catch {
    // fail-safe
  }
};

// Error Tracking
export const trackError = (errorInfo) => {
  try {
    const safeMessage = (errorInfo?.message || "Unknown error")
      .toString()
      .replace(/[a-zA-Z0-9_-]{24,}/g, "[REDACTED_TOKEN]")
      .slice(0, 300);

    const safeStack = (errorInfo?.stack || "")
      .toString()
      .replace(/[a-zA-Z0-9_-]{24,}/g, "[REDACTED_TOKEN]")
      .slice(0, 500);

    trackEvent("error", {
      error_type: errorInfo?.type || "JavaScriptError",
      message: safeMessage,
      filename: errorInfo?.filename ? String(errorInfo.filename).split("/").pop() : undefined,
      lineno: errorInfo?.lineno,
      colno: errorInfo?.colno,
      stack: safeStack || undefined,
    });
  } catch {
    // fail-safe
  }
};

// Auto-register global event listeners (Clicks, Global Errors, Performance)
let isInitialized = false;

export const initAnalyticsTracker = () => {
  if (isInitialized || typeof window === "undefined") {
    return () => {};
  }
  isInitialized = true;

  // 1. Delegated Button & CTA Click Handler (Safe Metadata Only)
  const handleClick = (e) => {
    try {
      const target = e.target;
      if (!target || !target.closest) return;

      const clickable = target.closest("button, a, [role='button'], input[type='button'], input[type='submit']");
      if (!clickable) return;

      // Skip sensitive input types
      if (clickable.tagName === "INPUT" && clickable.type === "password") {
        return;
      }

      // Extract safe label
      let label =
        clickable.getAttribute("data-track") ||
        clickable.getAttribute("aria-label") ||
        clickable.getAttribute("title") ||
        clickable.getAttribute("name") ||
        clickable.innerText ||
        clickable.textContent ||
        clickable.value ||
        "";

      label = label.replace(/\s+/g, " ").trim().slice(0, 80);

      // Filter out passwords, emails, card-like strings, or empty labels
      if (!label || label.includes("@") || label.length > 80 || /password|card|cvv|token|secret/i.test(label)) {
        label = clickable.tagName.toLowerCase();
      }

      const elementType = clickable.tagName.toLowerCase();
      trackButtonClick(label, elementType, {
        id: clickable.id ? clickable.id.slice(0, 50) : undefined,
        role: clickable.getAttribute("role") || undefined,
      });
    } catch {
      // fail-safe
    }
  };

  // 2. Global JavaScript Error Listener
  const handleError = (e) => {
    try {
      trackError({
        type: e.error?.name || "Error",
        message: e.message || e.error?.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
      });
    } catch {
      // fail-safe
    }
  };

  // 3. Unhandled Promise Rejection Listener
  const handleRejection = (e) => {
    try {
      const reason = e.reason;
      trackError({
        type: "UnhandledPromiseRejection",
        message: typeof reason === "object" ? reason?.message || "Promise rejected" : String(reason),
        stack: typeof reason === "object" ? reason?.stack : undefined,
      });
    } catch {
      // fail-safe
    }
  };

  // 4. Performance on Window Load
  const handleLoad = () => {
    setTimeout(() => {
      trackPerformance();
    }, 1000);
  };

  window.addEventListener("click", handleClick, { passive: true, capture: true });
  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  if (document.readyState === "complete") {
    handleLoad();
  } else {
    window.addEventListener("load", handleLoad, { once: true });
  }

  return () => {
    window.removeEventListener("click", handleClick, { capture: true });
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
    window.removeEventListener("load", handleLoad);
    isInitialized = false;
  };
};

export default {
  trackEvent,
  trackPageView,
  trackButtonClick,
  trackPerformance,
  trackError,
  initAnalyticsTracker,
};
