import MockAdProvider, { AD_STATES } from "./adProvider/MockAdProvider";
import ProductionAdProvider from "./adProvider/ProductionAdProvider";
import { shouldShowAd } from "./adPolicyService";
import useSubscriptionStore from "../store/subscriptionStore";

// Default to MockAdProvider for development
const isProd = process.env.NODE_ENV === "production";
const activeProvider = isProd ? new ProductionAdProvider() : new MockAdProvider();

/**
 * Single Entry Point for Rewarded Ads across all pages
 */
export const showRewardedAd = ({ target = "scan", context = "limit_modal", onStateChange, onComplete, onError }) => {
  const { isPremium } = useSubscriptionStore.getState();

  // Premium users skip ads completely
  if (isPremium) {
    console.log("👑 Premium User — skipping ad system");
    if (onComplete) onComplete({ success: true, isPremium: true });
    return;
  }

  // Policy check (prevent ads during scanning or auto-lock)
  if (!shouldShowAd(context)) {
    console.warn("🚫 Ad policy blocked ad in context:", context);
    if (onError) onError(new Error("Ads not permitted in current active context"));
    return;
  }

  activeProvider.showRewardedAd({
    target,
    onStateChange,
    onComplete,
    onError,
  });
};

export { AD_STATES };
export default {
  showRewardedAd,
  AD_STATES,
};
