import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  AlertTriangle,
  Code2,
  Activity,
  ShieldCheck,
  Clock,
  RefreshCw,
  X,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  fetchAnalyticsStats,
  fetchRecentEvents,
} from "../services/analyticsApiService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const maskKey = (keyHint, prefix = "sk_live_") =>
  `${prefix}${keyHint}${"•".repeat(20)}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** One-time reveal card shown immediately after creation */
const NewKeyRevealCard = ({ fullKey, name, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullKey);
    setCopied(true);
    toast.success("API key copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 mb-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle size={18} />
          <span className="font-bold text-sm">Copy this key now — it won't be shown again</span>
        </div>
        <button onClick={onDismiss} className="text-slate-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <p className="text-slate-400 text-xs mb-3">
        The full API key for <span className="text-white font-semibold">"{name}"</span> is displayed
        below. Store it securely (e.g. in your P2 environment variables).
      </p>

      <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3">
        <code className="flex-1 text-sm text-emerald-400 font-mono break-all">{fullKey}</code>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
        >
          {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
};

/** A single API key row card */
const ApiKeyCard = ({ apiKey, onRevoke }) => {
  const [confirming, setConfirming] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!confirming) return setConfirming(true);
    setRevoking(true);
    try {
      await onRevoke(apiKey._id || apiKey.id);
      toast.success(`Key "${apiKey.name}" revoked.`);
    } catch (err) {
      toast.error(err.message || "Failed to revoke key.");
    } finally {
      setRevoking(false);
      setConfirming(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`bg-slate-900 border rounded-2xl p-5 transition ${
        apiKey.isActive
          ? "border-slate-800 hover:border-slate-700"
          : "border-red-900/40 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Key name + status */}
          <div className="flex items-center gap-2 mb-1">
            <Key size={15} className="text-purple-400 shrink-0" />
            <span className="font-bold text-white truncate">{apiKey.name}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                apiKey.isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
            >
              {apiKey.isActive ? "Active" : "Revoked"}
            </span>
          </div>

          {/* Project name */}
          {apiKey.projectName && (
            <p className="text-xs text-slate-500 mb-2">{apiKey.projectName}</p>
          )}

          {/* Masked key hint */}
          <code className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg block mb-3 truncate">
            {maskKey(apiKey.keyHint, apiKey.prefix || "sk_live_")}
          </code>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={11} /> Created {formatDate(apiKey.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Activity size={11} /> Last used:{" "}
              {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : "Never"}
            </span>
            {!apiKey.isActive && apiKey.revokedAt && (
              <span className="flex items-center gap-1 text-red-400">
                <X size={11} /> Revoked {formatDate(apiKey.revokedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Revoke button */}
        {apiKey.isActive && (
          <div className="shrink-0">
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-semibold">Sure?</span>
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {revoking ? "Revoking..." : "Yes, revoke"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleRevoke}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-900/20 border border-transparent hover:border-red-800/40"
              >
                <Trash2 size={13} />
                Revoke
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/** Create key form modal */
const CreateKeyModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Key name is required.");
    setLoading(true);
    try {
      await onCreate(name.trim(), projectName.trim() || "Default Project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-purple-400" />
            Create New API Key
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">
              Key Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production Tracker"
              maxLength={100}
              className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. P2 Live Analytics Tracker"
              maxLength={100}
              className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition placeholder:text-slate-600"
            />
          </div>

          <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-400">
              The full API key will be shown <strong className="text-amber-400">only once</strong>{" "}
              after creation. Copy and store it securely before leaving this page.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Key"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/** Collapsible developer integration section */
const DevIntegration = () => {
  const [open, setOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "https://p1-app.com";

  const snippet = `// Install in your P2 tracker
fetch("${API_URL}/api/analytics/events", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    event: "page_view",
    page: window.location.pathname,
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    timestamp: new Date().toISOString(),
    metadata: {
      referrer: document.referrer,
      screen: \`\${screen.width}x\${screen.height}\`
    }
  })
});`;

  const curlSnippet = `curl -X POST ${API_URL}/api/analytics/events \\
  -H "Authorization: Bearer sk_live_YOUR_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "page_view",
    "page": "/products",
    "sessionId": "session_123",
    "timestamp": "2026-10-01T12:00:00Z",
    "metadata": {
      "referrer": "https://google.com",
      "screen": "1920x1080"
    }
  }'`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center gap-2 text-white font-bold">
          <Code2 size={18} className="text-cyan-400" />
          Developer Integration
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-slate-800">
              <div className="mt-5">
                <p className="text-sm text-slate-400 mb-3">
                  Use the endpoint below from your P2 Live Analytics Tracker. Replace{" "}
                  <code className="text-purple-300 text-xs">YOUR_API_KEY</code> with a key you
                  create above.
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300">Endpoint</span>
                </div>
                <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-sm text-emerald-400 mb-4">
                  POST {API_URL}/api/analytics/events
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300">JavaScript</span>
                </div>
                <pre className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap mb-4">
                  {snippet}
                </pre>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300">cURL (testing)</span>
                </div>
                <pre className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {curlSnippet}
                </pre>
              </div>

              <div className="bg-slate-950/80 border border-slate-700 rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info size={14} className="text-cyan-400" /> Event Schema
                </h4>
                <table className="w-full text-xs text-slate-400 border-separate border-spacing-y-1">
                  <thead>
                    <tr className="text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="text-left">Field</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Required</th>
                      <th className="text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["event", "string", "✅", "Event type (e.g. page_view, click)"],
                      ["page", "string", "❌", "URL path (e.g. /products)"],
                      ["sessionId", "string", "❌", "Anonymous session identifier"],
                      ["visitorId", "string", "❌", "Anonymous visitor identifier"],
                      ["timestamp", "ISO 8601", "❌", "Client-side event time"],
                      ["metadata", "object", "❌", "Free-form key/value data"],
                    ].map(([field, type, req, desc]) => (
                      <tr key={field} className="bg-slate-900/50 rounded">
                        <td className="py-1 pr-3 text-purple-300 font-mono">{field}</td>
                        <td className="py-1 pr-3 text-cyan-400 font-mono">{type}</td>
                        <td className="py-1 pr-3">{req}</td>
                        <td className="py-1">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const AnalyticsApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyReveal, setNewKeyReveal] = useState(null); // { fullKey, name }
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [keysRes, statsRes] = await Promise.allSettled([
        fetchApiKeys(),
        fetchAnalyticsStats(),
      ]);
      if (keysRes.status === "fulfilled") setKeys(keysRes.value.keys || []);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.stats || []);
    } catch (err) {
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCreateKey = async (name, projectName) => {
    try {
      const res = await createApiKey(name, projectName);
      const created = res.key;
      // Prepend to list (without fullKey — it's gone from state after reveal)
      setKeys((prev) => [{ ...created, fullKey: undefined }, ...prev]);
      setNewKeyReveal({ fullKey: created.fullKey, name: created.name });
      setShowCreateModal(false);
      toast.success("API key created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create API key.");
      throw err;
    }
  };

  const handleRevoke = async (keyId) => {
    await revokeApiKey(keyId);
    setKeys((prev) =>
      prev.map((k) =>
        (k._id || k.id) === keyId
          ? { ...k, isActive: false, revokedAt: new Date().toISOString() }
          : k
      )
    );
  };

  const activeKeys = keys.filter((k) => k.isActive);
  const revokedKeys = keys.filter((k) => !k.isActive);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400">
        <div className="text-center space-y-2">
          <Activity size={28} className="mx-auto animate-pulse text-purple-400" />
          <p className="text-sm">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck size={28} className="text-purple-400" />
            Analytics API Keys
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Manage API keys that allow external trackers (P2) to send analytics events to VIBYFY.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg"
          >
            <Plus size={16} />
            Create Key
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      {/* One-time key reveal */}
      <AnimatePresence>
        {newKeyReveal && (
          <NewKeyRevealCard
            fullKey={newKeyReveal.fullKey}
            name={newKeyReveal.name}
            onDismiss={() => setNewKeyReveal(null)}
          />
        )}
      </AnimatePresence>

      {/* Event Stats */}
      {stats.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
            <Activity size={15} className="text-cyan-400" />
            Event Statistics
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.slice(0, 10).map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5"
              >
                <span className="text-xs font-mono text-purple-300">{s._id}</span>
                <span className="text-xs text-slate-500">→</span>
                <span className="text-xs font-bold text-white">{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Keys */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key size={16} className="text-purple-400" />
            Active Keys
            <span className="text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
              {activeKeys.length}
            </span>
          </h2>
        </div>

        {activeKeys.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-8 text-center">
            <Key size={24} className="mx-auto text-slate-600 mb-2" />
            <p className="text-slate-500 text-sm">No active API keys yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 text-purple-400 hover:text-purple-300 text-sm font-semibold transition"
            >
              + Create your first key
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {activeKeys.map((k) => (
                <ApiKeyCard key={k._id || k.id} apiKey={k} onRevoke={handleRevoke} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Revoked Keys (collapsed) */}
      {revokedKeys.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
            <Trash2 size={14} />
            Revoked Keys ({revokedKeys.length})
          </h2>
          <div className="space-y-3">
            {revokedKeys.map((k) => (
              <ApiKeyCard key={k._id || k.id} apiKey={k} onRevoke={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Developer Integration */}
      <DevIntegration />

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateKeyModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateKey} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsApiKeys;
