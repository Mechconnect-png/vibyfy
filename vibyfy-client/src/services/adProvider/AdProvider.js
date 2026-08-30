/**
 * Abstract Base AdProvider Interface
 */
export class AdProvider {
  /**
   * Request and show a rewarded ad
   * @param {Object} options - { target: 'scan' | 'relief', onStateChange: Function, onComplete: Function, onError: Function }
   */
  showRewardedAd(options) {
    throw new Error("showRewardedAd must be implemented by subclass");
  }

  isReady() {
    return true;
  }
}

export default AdProvider;
