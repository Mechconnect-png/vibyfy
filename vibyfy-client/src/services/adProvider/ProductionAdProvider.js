import AdProvider from "./AdProvider";
import MockAdProvider from "./MockAdProvider";

export class ProductionAdProvider extends AdProvider {
  constructor() {
    super();
    // Fallback to MockAdProvider if no real AdMob / AdSense SDK key is injected
    this.fallbackSimulator = new MockAdProvider();
  }

  showRewardedAd(options) {
    if (window.google || window.admob) {
      console.log("🎬 Production Ad SDK detected — launching native rewarded ad stream");
      // Future SDK hook implementation...
    } else {
      console.log("ℹ️ Production Ad SDK pending — using VIBYFY Ad Simulator");
      this.fallbackSimulator.showRewardedAd(options);
    }
  }
}

export default ProductionAdProvider;
