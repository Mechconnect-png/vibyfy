import React from "react";
import { Crown, Sparkles, Lock } from "lucide-react";
import useSubscriptionStore from "../../store/subscriptionStore";
import useUsageStore from "../../store/usageStore";

export const UsageIndicator = ({ target = "scan", onOpenPremium, onOpenLimitModal }) => {
  const { isPremium } = useSubscriptionStore();
  const { usage } = useUsageStore();

  if (isPremium) {
    return (
      <div
        onClick={onOpenPremium}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer hover:opacity-90 transition shadow-sm"
      >
        <Crown size={14} className="text-amber-400" />
        <span>VIBYFY Premium • ∞ Unlimited</span>
      </div>
    );
  }

  const used = target === "relief" ? usage.reliefSessionsUsed : usage.moodScansUsed;
  const total = target === "relief" ? usage.totalAllowedRelief : usage.totalAllowedScans;
  const isLimitReached = used >= total;

  return (
    <div
      onClick={isLimitReached ? onOpenLimitModal : onOpenPremium}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition ${
        isLimitReached
          ? "bg-red-500/10 border-red-500/40 text-red-300 animate-pulse"
          : "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-purple-400" />
      <span>
        Today's {target === "relief" ? "Relief Journeys" : "Vibe Scans"}:{" "}
        <strong className={isLimitReached ? "text-red-400" : "text-white"}>
          {used} / {total}
        </strong>{" "}
        Used
      </span>
      {isLimitReached ? (
        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black uppercase">
          Unlock
        </span>
      ) : (
        <Sparkles size={12} className="text-purple-400" />
      )}
    </div>
  );
};

export default UsageIndicator;
