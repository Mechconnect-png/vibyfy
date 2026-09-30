import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalyticsTracker, trackPageView } from "../../analytics/tracker";

/**
 * AnalyticsTracker Component
 * Automatically tracks route changes and initializes telemetry listeners.
 * Non-rendering component with zero visual impact.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  // Initialize global listeners (button click delegation, performance, error handlers)
  useEffect(() => {
    const cleanup = initAnalyticsTracker();
    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

  // Track SPA route changes
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
