// VIBYFY Ad Policy Control Service
// Guarantees ads NEVER interrupt camera scanning, face detection, or Auto Lock

import useSubscriptionStore from "../store/subscriptionStore";

export const shouldShowAd = (context = "general") => {
  const isPremium = useSubscriptionStore.getState().isPremium;
  if (isPremium) return false;

  // Never interrupt active camera scanning or auto-lock!
  if (context === "scanning" || context === "autolock") {
    return false;
  }

  // Allowed contexts: "after_recommendation", "between_sessions", "limit_unlock"
  return true;
};
