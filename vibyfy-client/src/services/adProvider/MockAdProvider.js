import AdProvider from "./AdProvider";

export const AD_STATES = {
  IDLE: "IDLE",
  REQUESTED: "REQUESTED",
  LOADING: "LOADING",
  SHOWING: "SHOWING",
  COMPLETED: "COMPLETED",
  REWARD_GRANTED: "REWARD_GRANTED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
};

export class MockAdProvider extends AdProvider {
  constructor() {
    super();
    this.currentState = AD_STATES.IDLE;
    this.processedAdCompletionIds = new Set();
    this.activeTimers = [];
  }

  showRewardedAd({ target = "scan", onStateChange, onComplete, onError }) {
    if (this.currentState !== AD_STATES.IDLE && this.currentState !== AD_STATES.REWARD_GRANTED && this.currentState !== AD_STATES.CANCELLED) {
      console.warn("⚠️ Ad request rejected: provider is busy in state", this.currentState);
      if (onError) onError(new Error("Ad provider is currently busy"));
      return;
    }

    this.clearActiveTimers();

    console.log("👉 STEP 24 DEBUG — AD STARTED:", { target, time: new Date().toISOString() });
    this.updateState(AD_STATES.REQUESTED, onStateChange);

    // Simulate ad loading delay (500ms)
    const t1 = setTimeout(() => {
      this.updateState(AD_STATES.LOADING, onStateChange);

      const t2 = setTimeout(() => {
        this.updateState(AD_STATES.SHOWING, onStateChange);

        // Simulate 3-second interactive ad viewing
        const t3 = setTimeout(() => {
          const completionId = `ad-${target}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

          if (this.processedAdCompletionIds.has(completionId)) {
            console.warn("⚠️ Duplicate ad completion ID blocked:", completionId);
            return;
          }

          this.processedAdCompletionIds.add(completionId);
          this.updateState(AD_STATES.COMPLETED, onStateChange);

          console.log("👉 STEP 24 DEBUG — AD COMPLETED:", { completionId, target });

          if (onComplete) {
            onComplete({
              success: true,
              completionId,
              target,
              timestamp: Date.now(),
            });
          }

          this.updateState(AD_STATES.REWARD_GRANTED, onStateChange);

          const t4 = setTimeout(() => {
            this.updateState(AD_STATES.IDLE, onStateChange);
          }, 1000);
          this.activeTimers.push(t4);
        }, 3000);
        this.activeTimers.push(t3);
      }, 500);
      this.activeTimers.push(t2);
    }, 500);
    this.activeTimers.push(t1);
  }

  cancelAd(onStateChange) {
    console.log("⚠️ AD CANCELLED EARLY BY USER");
    this.clearActiveTimers();
    this.updateState(AD_STATES.CANCELLED, onStateChange);
    setTimeout(() => {
      this.updateState(AD_STATES.IDLE, onStateChange);
    }, 500);
  }

  clearActiveTimers() {
    this.activeTimers.forEach((t) => clearTimeout(t));
    this.activeTimers = [];
  }

  updateState(newState, callback) {
    this.currentState = newState;
    console.log("📺 AD STATE MACHINE:", newState);
    if (callback) callback(newState);
  }
}

export default MockAdProvider;
