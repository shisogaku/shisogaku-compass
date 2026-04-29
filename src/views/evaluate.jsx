import { useState, useEffect } from 'react';
import { RADAR_AXES, RADAR_DESC, BC } from '../data.js';
import { _sb, sbDb } from '../lib/supabase.js';

// 軸ごとの評価質問文
const EVAL_QUESTIONS = {
  社交力:   "人付き合いが積極的で、場を明るくしていますか？",
  行動力:   "やりたいことをすぐ行動に移していますか？",
  計画性:   "物事を段取りよく進めていますか？",
  感情安定: "感情の切り替えが早く、引きずりにくいですか？",
  協調性:   "周囲に合わせ、チームワークを大切にしていますか？",
  独創性:   "ユニークなアイデアや発想を出していますか？",
};

// ─────────────────────────────────────────
// 評価フォーム（評価者側）
// ─────────────────────────────────────────
export function EvaluationFormView({ token, user }) {
  const [request, setRequest]   = useState(null);
  const [scores, setScores]     = useState({});
  const [loading, setLoading]   = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!token) return;
    sbDb.getEvaluationRequest(token).then(req => {
      setRequest(req);
      setLoading(false);
    });
  }, [token]);

  const toggle = (ax) =>
    setScores(prev => ({ ...prev, [ax]: prev[ax] === true ? undefined : true }));

  const setNo = (ax) =>
    setScores(prev => ({ ...prev, [ax]: false }));

  const handleSubmit = async () => {
    if (!user) { setError("回答するにはログインが必要です"); return; }
    if (user.id === request?.requester_id) { setError("自分への評価はできません"); return; }
    const allAnswered = RADAR_AXES.every(ax => scores[ax] !== undefined);
    if (!allAnswered) { setError("全ての項目に回答してください"); return; }
    const ok = await sbDb.submitEvaluationResponse(request.id, user.id, scores);
    if (ok) setSubmitted(true);
    else setError("送信に失敗しました。もう一度お試しください");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-sm text-amber-800">
      <span className="inline-block w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin mr-2"/>
      読み込み中…
    </div>
  );

  if (!request) return (
    <div className="text-center py-16 space-y-3">
      <div className="text-4xl">❌</div>
      <div className="font-bold text-gray-700">このリンクは無効または期限切れです</div>
    </div>
  );

  if (submitted) return (
    <div className="text-center py-16 space-y-3">
      <div className="text-4xl">🎉</div>
      <div className="font-bold text-gray-700">評価を送りました！</div>
      <div className="text-sm text-gray-500">{request.requester_name} さんに届きます</div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-16 space-y-4">
      <div className="text-4xl">🔐</div>
      <div className="font-bold text-gray-700">{request.requester_name} さんへの評価</div>
      <div className="text-sm text-gray-500">回答するにはログインが必要です</div>
      <button
        onClick={() => _sb?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } })}
        className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-white border-2 border-indigo-300 shadow text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-all">
        Googleでログイン
      </button>
    </div>
  );

  const bloodKey = request.profile_key; // e.g. "AB男性"
  const blood = bloodKey.replace(/男性|女性/, "");
  const color = BC[blood]?.color || "#6366f1";

  return (
    <div className="space-y-4 p-4">
      <div className="text-center space-y-1">
        <div className="text-base font-black text-gray-800">
          {request.requester_name} さんへの評価
        </div>
        <div className="text-xs text-gray-500">
          それぞれの項目について「はい」か「まだ」で答えてください
        </div>
      </div>

      <div className="space-y-3">
        {RADAR_AXES.map(ax => (
          <div key={ax} className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="text-xs font-bold mb-1" style={{ color }}>{ax}</div>
            <div className="text-sm text-gray-700 mb-2">{EVAL_QUESTIONS[ax]}</div>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(ax)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                  scores[ax] === true
                    ? "text-white border-transparent"
                    : "border-gray-200 text-gray-500"
                }`}
                style={scores[ax] === true ? { backgroundColor: color, borderColor: color } : {}}>
                ✅ はい
              </button>
              <button
                onClick={() => setNo(ax)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                  scores[ax] === false
                    ? "bg-gray-200 border-gray-400 text-gray-700"
                    : "border-gray-200 text-gray-500"
                }`}>
                🔲 まだ
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-xs text-red-500 text-center">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={!RADAR_AXES.every(ax => scores[ax] !== undefined)}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          RADAR_AXES.every(ax => scores[ax] !== undefined)
            ? "text-white"
            : "bg-gray-200 text-gray-400"
        }`}
        style={RADAR_AXES.every(ax => scores[ax] !== undefined) ? { backgroundColor: color } : {}}>
        評価を送る
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// 評価結果表示（依頼者側・プロフィール内）
// ─────────────────────────────────────────
export function EvaluationPanel({ user, profileKey, requesterName, selfChecks }) {
  const [token, setToken]       = useState(null);
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [open, setOpen]         = useState(false);

  const blood = profileKey?.replace(/男性|女性/, "");
  const color = BC[blood]?.color || "#6366f1";

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [t, r] = await Promise.all([
      sbDb.getMyEvaluationToken(user.id, profileKey),
      sbDb.getEvaluationResults(user.id, profileKey),
    ]);
    setToken(t);
    setResults(r);
    setLoading(false);
  };

  useEffect(() => { if (open) loadData(); }, [open, user?.id, profileKey]);

  const createLink = async () => {
    setLoading(true);
    const t = await sbDb.createEvaluationRequest(user.id, profileKey, requesterName);
    setToken(t);
    setLoading(false);
  };

  const copyLink = () => {
    if (!token) return;
    const base = window.location.href.split("#")[0];
    navigator.clipboard?.writeText(`${base}#/evaluate/${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 自己評価スコアを軸ごとに%で計算
  const selfScore = (ax) => {
    if (!selfChecks) return null;
    const keys = Object.keys(selfChecks).filter(k => k.startsWith(`${ax}_`));
    if (keys.length === 0) return null;
    const done = keys.filter(k => selfChecks[k]).length;
    return Math.round((done / keys.length) * 100);
  };

  // 複数回答の集計（最新1件のみ表示）
  const latestResult = results?.[results.length - 1];

  return (
    <div className="mt-2 rounded-xl border border-indigo-200 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-indigo-50 text-left">
        <span className="text-xs font-bold text-indigo-700">👥 相手からの評価を依頼する</span>
        <span className="text-xs text-indigo-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-3 bg-white">
          {!user ? (
            <div className="text-xs text-gray-500 text-center py-2">ログインが必要です</div>
          ) : (
            <>
              {/* リンク発行 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  リンクを LINE や SNS で相手に送ると、あなたの成長を評価してもらえます。
                </div>
                {!token ? (
                  <button
                    onClick={createLink}
                    disabled={loading}
                    className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all"
                    style={{ backgroundColor: color }}>
                    {loading ? "作成中…" : "📎 評価リンクを作成する"}
                  </button>
                ) : (
                  <button
                    onClick={copyLink}
                    className={`w-full py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      copied ? "bg-green-50 border-green-400 text-green-700" : "border-indigo-300 text-indigo-700"
                    }`}>
                    {copied ? "✅ コピーしました！" : "🔗 評価リンクをコピー"}
                  </button>
                )}
              </div>

              {/* 結果表示 */}
              {loading && <div className="text-xs text-gray-400 text-center">読み込み中…</div>}
              {latestResult && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-700">
                    📊 自己評価 vs 相手評価（最新）
                  </div>
                  <div className="space-y-1.5">
                    {RADAR_AXES.map(ax => {
                      const peerScore = latestResult.scores?.[ax]; // true/false/undefined
                      const self = selfScore(ax);
                      const gap = peerScore !== undefined && self !== null
                        ? (peerScore ? 100 : 0) - self
                        : null;
                      return (
                        <div key={ax} className="flex items-center gap-2 text-xs">
                          <span className="w-14 font-bold text-gray-600 flex-shrink-0">{ax}</span>
                          <span className="w-12 text-center px-1.5 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: color }}>
                            自己 {self !== null ? `${self}%` : "-"}
                          </span>
                          <span className={`w-12 text-center px-1.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                            peerScore === true ? "bg-green-100 text-green-700" : peerScore === false ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-400"
                          }`}>
                            {peerScore === true ? "✅ はい" : peerScore === false ? "🔲 まだ" : "-"}
                          </span>
                          {gap !== null && (
                            <span className={`text-xs font-bold ${
                              gap > 20 ? "text-orange-500" : gap < -20 ? "text-blue-500" : "text-gray-400"
                            }`}>
                              {gap > 20 ? "▲過大評価かも" : gap < -20 ? "▼もっと自信を！" : "◎一致"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    {new Date(latestResult.created_at).toLocaleDateString("ja-JP")} 回答
                  </div>
                </div>
              )}
              {results?.length === 0 && token && (
                <div className="text-xs text-gray-400 text-center py-2">
                  まだ回答がありません。リンクを送ってみましょう！
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
