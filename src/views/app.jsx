import React, { useState, useEffect } from 'react';
import { BC, PLAN_DB, SCENE_DB } from '../data.js';
import { _sb, sbDb, SUPABASE_URL } from '../lib/supabase.js';
import { TorokuView } from './profile.jsx';
import { PairView } from './pair.jsx';
import { LifeView } from './life.jsx';
import { CompatView, SceneView, SimulateView } from './social.jsx';
import { PowerView } from './knowledge.jsx';
import { AIView, PlanView } from './plan.jsx';

// ─────────────────────────────────────────
// ロゴ
// ─────────────────────────────────────────
export function LogoIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <defs>
        <radialGradient id="lgBg" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe4f5"/>
          <stop offset="100%" stopColor="#d9a8e8"/>
        </radialGradient>
        <linearGradient id="lgBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4"/>
          <stop offset="50%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
        <linearGradient id="lgNeedleUp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6eb4"/>
          <stop offset="100%" stopColor="#ff9ed0"/>
        </linearGradient>
        <linearGradient id="lgNeedleDown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4a5e8"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
        <filter id="lgShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#d8b4fe" floodOpacity="0.5"/>
        </filter>
        <filter id="lgGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#lgBg)" stroke="url(#lgBorder)" strokeWidth="3.5" filter="url(#lgShadow)"/>
      <circle cx="60" cy="60" r="6" fill="white" opacity="0.9"/>
      <circle cx="60" cy="60" r="3" fill="#c084fc"/>
      <line x1="60" y1="54" x2="60" y2="12" stroke="url(#lgNeedleUp)" strokeWidth="5" strokeLinecap="round" filter="url(#lgGlow)"/>
      <line x1="60" y1="66" x2="60" y2="100" stroke="url(#lgNeedleDown)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="60" x2="95" y2="60" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round"/>
      <line x1="60" y1="60" x2="25" y2="60" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="60" cy="12" r="5" fill="#ff6eb4" filter="url(#lgGlow)"/>
      <text x="60" y="112" textAnchor="middle" fontSize="9" fill="#a78bfa" fontWeight="bold" letterSpacing="1">COMPASS</text>
    </svg>
  );
}

// ─────────────────────────────────────────
// シンプル SVGアイコン（フェミニン・細線）
// ─────────────────────────────────────────
export function Icon({ name, size=20, color="currentColor", sw=1.5 }) {
  const P = (d, op) => <path strokeLinecap="round" strokeLinejoin="round" d={d} opacity={op||1}/>;
  const C = (cx,cy,r,f) => <circle cx={cx} cy={cy} r={r} fill={f||"none"}/>;
  const icons = {
    user:     <>{C(12,8,4)}{P("M4 20a8 8 0 0116 0")}</>,
    people:   <>{C(9,7,4)}{P("M3 21v-1a6 6 0 016-6h4a6 6 0 016 6v1",.65)}{P("M16 3.13a4 4 0 010 7.75",.45)}</>,
    heart:    <>{P("M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z")}</>,
    matrix:   <>{P("M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18")}</>,
    chat:     <>{P("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z")}{P("M8 10h8M8 13h5",.45)}</>,
    book:     <>{P("M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25")}</>,
    sparkle:  <>{P("M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z")}{P("M18 9.75l-.26-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259A3.375 3.375 0 0017.74 3.3L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 9.75z",.7)}</>,
    envelope: <>{P("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z")}{P("M22 6l-10 7L2 6")}</>,
    calender: <>{P("M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z")}{P("M16 1v4M8 1v4M3 9h18")}{P("M8 13h2M12 13h2M8 17h2",.55)}</>,
    journey:  <>{P("M3 17c2-5 4-2 6-4s4-8 6-6 4 6 6 2")}{C(3,17,1.5,color)}{C(9,13,1.5,color)}{C(15,7,1.5,color)}</>,
    robot:    <>{P("M9 3H7a2 2 0 00-2 2v2M15 3h2a2 2 0 012 2v2M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z")}{C(9,13,1.5)}{C(15,13,1.5)}{P("M9 17h6",.6)}</>,
    menu:     <>{P("M4 6h16M4 12h16M4 18h16")}</>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]||null}
    </svg>
  );
}

// ─────────────────────────────────────────
// 検索インデックス構築
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// 初回起動オンボーディング（3ステップ）
// ─────────────────────────────────────────
export function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: '支礎学コンパスへようこそ',
      body: (
        <>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-800">血液型コミュニケーション</span>の視点で、
            自分と周りの人との関わりかたを見つけるツールです。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            プロフィールを登録すると、相性・シーン別会話のヒント・長期プランまで、
            あなたと相手に合わせた提案が見られるようになります。
          </p>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            ※ 血液型による性格論は娯楽目的の参考としてお楽しみください。
          </p>
        </>
      ),
    },
    {
      title: 'まず「自分」を登録',
      body: (
        <>
          <div className="flex justify-center gap-2 mb-4">
            {['O','A','B','AB'].map(b => (
              <div key={b}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow"
                style={{backgroundColor:BC[b].color}}>{b}</div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">
            左のメニュー <span className="font-bold text-amber-700">「自分」</span> から、
            あなたの名前と血液型を登録してください。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            入力は端末とSupabaseに保存されます。ログインすれば別端末からも同じデータが使えます。
          </p>
        </>
      ),
    },
    {
      title: '「相手」を登録して相性チェック',
      body: (
        <>
          <p className="text-gray-600 leading-relaxed">
            続けて <span className="font-bold text-amber-700">「相手」</span> タブから、
            気になる人（家族・同僚・パートナーなど）を登録。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            自分と相手が揃うと、 <span className="font-bold">相性</span>・<span className="font-bold">シーン別の伝え方</span>・
            <span className="font-bold">プラン</span>タブでぐっと情報が増えます。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            上部の検索バーでキーワード検索もできます（「O型 仕事」「恋愛 A」など）。
          </p>
        </>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const cur = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)'}}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{border:'1px solid rgba(180,130,70,0.18)'}}>

        {/* ヘッダー */}
        <div className="px-6 pt-6 pb-3 flex items-start gap-3">
          <LogoIcon size={40}/>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-800 leading-tight">{cur.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">ステップ {step+1} / {steps.length}</div>
          </div>
          <button onClick={onClose} aria-label="閉じる"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1">×</button>
        </div>

        {/* 進捗バー */}
        <div className="px-6 pb-4">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-colors"
                style={{background: i <= step
                  ? 'linear-gradient(90deg,#f472b6,#a78bfa)'
                  : '#f3e8ff'}} />
            ))}
          </div>
        </div>

        {/* 本文 */}
        <div className="px-6 pb-5 min-h-[180px]">
          {cur.body}
        </div>

        {/* フッター */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-2 py-2">
            スキップ
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step-1)}
                className="text-sm text-gray-600 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg">
                戻る
              </button>
            )}
            <button onClick={() => isLast ? onClose() : setStep(step+1)}
              className="text-sm font-bold text-white px-5 py-2 rounded-lg shadow transition-all"
              style={{background:'linear-gradient(135deg,#f472b6,#a78bfa)'}}>
              {isLast ? 'はじめる' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 検索用テキスト正規化
//  - 大文字↔小文字、全角↔半角、カタカナ↔ひらがな、血液型の表記ゆれを吸収
// ─────────────────────────────────────────
function normalizeForSearch(s) {
  if (!s) return '';
  let t = String(s);
  // 全角英数 → 半角
  t = t.replace(/[！-～]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  // 大文字 → 小文字（ただし日本語には影響なし）
  t = t.toLowerCase();
  // カタカナ → ひらがな（濁点付きもまとめて）
  t = t.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  // 血液型の表記ゆれ → 統一形（長音 ー を含むパターンを先に処理）
  //   これにより「おがた」などの名前を O型 と誤解釈しない
  t = t.replace(/えーびー型/g, 'ab型');
  t = t.replace(/おー型/g, 'o型');
  t = t.replace(/えー型/g, 'a型');
  t = t.replace(/びー型/g, 'b型');
  // 残った長音 ー を削除（例：「バランス」→「ばらんす」）
  t = t.replace(/ー/g, '');
  // 空白正規化
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function buildSearchIndex() {
  const entries = [];

  // ── 血液型データ (BC) ──
  const bcCats = ['心理','仕事','時間','愛情','距離','相性','攻撃性','素質','表の面','裏の面','恋愛結婚','keywords'];
  Object.entries(BC).forEach(([type, data]) => {
    bcCats.forEach(cat => {
      const arr = data[cat];
      if (Array.isArray(arr)) {
        arr.forEach(text => {
          if (typeof text === 'string' && text.trim().length > 3) {
            entries.push({
              id: `bc-${type}-${cat}-${entries.length}`,
              category: '血液型',
              label: `${data.label}（${cat}）`,
              text: text.trim(),
              color: data.color,
              tab: 'power',
            });
          }
        });
      }
    });
  });

  // ── プランDB (PLAN_DB) ──
  if (typeof PLAN_DB !== 'undefined') {
    Object.entries(PLAN_DB).forEach(([planKey, plan]) => {
      ['O','A','B','AB'].forEach(bt => {
        const tips = plan.tips?.[bt];
        if (tips && typeof tips === 'object') {
          Object.entries(tips).forEach(([, text]) => {
            if (typeof text === 'string' && text.trim().length > 3) {
              entries.push({
                id: `plan-${planKey}-${bt}-${entries.length}`,
                category: 'プラン',
                label: `${plan.label}（${BC[bt]?.label || bt+'型'}）`,
                text: text.trim(),
                color: plan.color || '#6366f1',
                tab: 'plan',
              });
            }
          });
        }
      });
    });
  }

  // ── シーンDB (SCENE_DB) ──
  if (typeof SCENE_DB !== 'undefined') {
    Object.entries(SCENE_DB).forEach(([, scene]) => {
      if (!scene?.tips) return;
      Object.entries(scene.tips).forEach(([btKey, tip]) => {
        if (tip?.text) {
          entries.push({
            id: `scene-${btKey}-${entries.length}`,
            category: 'シーン',
            label: `${scene.label}（${btKey}）`,
            text: tip.text,
            color: '#0ea5e9',
            tab: 'scene',
          });
        }
        if (tip?.example) {
          entries.push({
            id: `scene-ex-${btKey}-${entries.length}`,
            category: 'シーン例文',
            label: `${scene.label}（${btKey}）`,
            text: tip.example,
            color: '#0ea5e9',
            tab: 'scene',
          });
        }
      });
    });
  }

  return entries;
}

// ─────────────────────────────────────────
// 検索結果コンポーネント
// ─────────────────────────────────────────
export function SearchResults({ results, query, onTabJump }) {
  if (!query.trim()) return null;

  const highlight = (text) => {
    const q = query.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </span>
    );
  };

  const catColor = {
    '血液型': 'bg-purple-100 text-purple-700',
    'プラン': 'bg-green-100 text-green-700',
    'シーン': 'bg-sky-100 text-sky-700',
    'シーン例文': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 font-medium mb-3">
        「{query}」の検索結果：{results.length} 件{results.length === 30 ? '（上位30件）' : ''}
      </div>
      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-sm">一致する内容が見つかりませんでした</div>
        </div>
      ) : results.map(r => (
        <div key={r.id}
          onClick={() => onTabJump(r.tab)}
          className="bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${catColor[r.category] || 'bg-gray-100 text-gray-600'}`}>
              {r.category}
            </span>
            <span className="text-xs text-gray-500 truncate">{r.label}</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {highlight(r.text)}
          </div>
          <div className="text-xs text-indigo-500 mt-1.5 font-medium">→ {r.tab === 'power' ? '知識' : r.tab === 'plan' ? 'プラン' : 'シーン'}タブで見る</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// メイン
// ─────────────────────────────────────────
export function CommunicationCompass() {
  const [view, setView] = useState("toroku");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ── 初回起動時のオンボーディング表示 ──
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem('sg_onboarded'); } catch { return false; }
  });
  const closeWelcome = () => {
    try { localStorage.setItem('sg_onboarded', '1'); } catch {}
    setShowWelcome(false);
  };

  // 検索インデックス（初回のみ構築、正規化テキストもキャッシュ）
  const searchIndexRef = React.useRef(null);
  const getIndex = () => {
    if (!searchIndexRef.current) {
      const raw = buildSearchIndex();
      searchIndexRef.current = raw.map(e => ({
        ...e,
        _ntext: normalizeForSearch(e.text),
        _nlabel: normalizeForSearch(e.label),
      }));
    }
    return searchIndexRef.current;
  };

  // 検索実行（正規化 + スコアリング）
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const nq = normalizeForSearch(q);
    if (!nq) { setSearchResults([]); return; }

    const scored = [];
    for (const e of getIndex()) {
      let score = 0;
      // label 一致は強め
      if (e._nlabel.includes(nq)) score += 3;
      // text の前方一致は真ん中、部分一致は最小
      const ti = e._ntext.indexOf(nq);
      if (ti === 0) score += 2;
      else if (ti > 0) score += 1;
      // 単語境界的な一致（前後が日本語/英数以外）をさらに加点
      if (ti > 0 && /[\s、。・（）「」]/.test(e._ntext[ti-1])) score += 1;
      if (score > 0) scored.push({ ...e, _score: score });
    }
    scored.sort((a, b) => b._score - a._score);
    setSearchResults(scored.slice(0, 30));
  };

  // ── 認証状態 ──
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(!!_sb);

  // ── プロフィール（localStorage + Supabase）──
  const [profiles, setProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shisogaku_profiles")) || []; } catch { return []; }
  });
  const [myId, setMyId] = useState(() => {
    try { return localStorage.getItem("shisogaku_myId") || null; } catch { return null; }
  });

  useEffect(() => {
    if (!user && profiles.length === 0) return;
    try { localStorage.setItem("shisogaku_profiles", JSON.stringify(profiles)); } catch {}
  }, [profiles, user]);
  useEffect(() => {
    if (!user && !myId) return;
    try { if (myId) localStorage.setItem("shisogaku_myId", myId); else localStorage.removeItem("shisogaku_myId"); } catch {}
  }, [myId, user]);

  // ── Supabase 認証初期化 ──
  useEffect(() => {
    if (!_sb) return;
    _sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) loadFromSupabase(session.user.id);
    });
    const { data: { subscription } } = _sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setAuthLoading(false);
      if (u) {
        loadFromSupabase(u.id);
        sbDb.log(u.id, "login", { provider: session?.user?.app_metadata?.provider });
      } else {
        setProfiles([]);
        setMyId(null);
        try {
          localStorage.removeItem("shisogaku_profiles");
          localStorage.removeItem("shisogaku_myId");
        } catch {}
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadFromSupabase = async (userId) => {
    const [sbProfiles, sbMyId] = await Promise.all([
      sbDb.getProfiles(userId),
      sbDb.getMyId(userId),
    ]);
    let localProfiles = [];
    let localMyId = null;
    try { localProfiles = JSON.parse(localStorage.getItem("shisogaku_profiles")) || []; } catch {}
    try { localMyId = localStorage.getItem("shisogaku_myId") || null; } catch {}
    if (sbProfiles !== null && sbProfiles.length > 0) {
      setProfiles(sbProfiles);
      localStorage.setItem("shisogaku_profiles", JSON.stringify(sbProfiles));
    } else if (localProfiles.length > 0) {
      setProfiles(localProfiles);
      for (const p of localProfiles) {
        const isMe = p.id === localMyId;
        await sbDb.saveProfile(userId, p, isMe);
      }
    }
    if (sbMyId !== null) {
      setMyId(sbMyId);
      localStorage.setItem("shisogaku_myId", sbMyId);
    } else if (localMyId) {
      setMyId(localMyId);
    }
  };

  const handleLogin = async () => {
    if (!_sb) return;
    await _sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
  };
  const handleLogout = async () => {
    if (!_sb) return;
    await _sb.auth.signOut();
    setUser(null); setProfiles([]); setMyId(null);
    try { localStorage.removeItem("shisogaku_profiles"); localStorage.removeItem("shisogaku_myId"); } catch {}
  };
  const handleViewChange = (v) => {
    setView(v);
    setSidebarOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    if (user) sbDb.log(user.id, "view_tab", { tab: v });
  };

  const me = profiles.find(p => p.id === myId);
  const partners = profiles.filter(p => p.id !== myId);
  const sbConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL";

  // ── タブ定義 ──
  const sidebarItems = [
    { id:"toroku", label:"自分の登録", icon:"user",   badge: me ? (me.blood + '型') : null, badgeColor: me?.color },
    { id:"pair",   label:"相手の登録", icon:"people", badge: partners.length > 0 ? String(partners.length) : null },
    { id:"ai",     label:"AIに確認",  icon:"robot" },
  ];
  const mainTabs = [
    { id:"life",     label:"ライフ",  icon:"journey"  },
    { id:"compat",   label:"相性",    icon:"heart"    },
    { id:"scene",    label:"シーン",  icon:"chat"     },
    { id:"power",    label:"知識",    icon:"book"     },
    { id:"simulate", label:"シミュ",  icon:"envelope" },
    { id:"plan",     label:"プラン",  icon:"calender" },
  ];

  const isSidebarView = ['toroku','pair','ai'].includes(view);
  const activeMain = !isSidebarView ? view : null;

  // ── レンダー ──
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#fdf9f3'}}>

      {/* ── 初回オンボーディング ── */}
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}

      {/* ── サイドバー（デスクトップ固定 / モバイルオーバーレイ）── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={[
        "flex flex-col z-30 transition-transform duration-300",
        "fixed md:static inset-y-0 left-0 w-56",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ].join(' ')} style={{background:'#fffcf7',borderRight:'1px solid rgba(180,130,70,0.18)'}}>

        {/* ロゴ */}
        <div className="flex items-center gap-2.5 px-4 py-4" style={{borderBottom:'1px solid rgba(180,130,70,0.15)'}}>
          <LogoIcon size={36} />
          <div>
            <div className="text-sm font-black bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent leading-tight">
              支礎学コンパス
            </div>
            <div className="text-xs text-gray-400">血液型コミュニティ</div>
          </div>
        </div>

        {/* ナビ */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 px-2 pt-2 pb-1.5 tracking-wider uppercase">Profile</div>

          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => handleViewChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={view === item.id
                ? {background:'linear-gradient(135deg,#92400e,#b45309)',color:'white',boxShadow:'0 2px 8px rgba(146,64,14,0.3)'}
                : {color:'#5c3d1e'}}>
              <span className="w-5 flex items-center justify-center">
                <Icon name={item.icon} size={16} color={view===item.id?"white":"#92400e"} sw={1.5}/>
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={[
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  view === item.id
                    ? "bg-white bg-opacity-25 text-white"
                    : "bg-gray-100 text-gray-600"
                ].join(' ')}
                  style={view !== item.id && item.badgeColor ? {background: item.badgeColor + '22', color: item.badgeColor} : {}}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="text-xs font-bold text-gray-400 px-2 pt-4 pb-1.5 tracking-wider uppercase">Features</div>

          {mainTabs.map(tab => (
            <button key={tab.id} onClick={() => handleViewChange(tab.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={view === tab.id
                ? {background:'rgba(146,64,14,0.09)',color:'#92400e',fontWeight:700}
                : {color:'#7c5c3e'}}>
              <span className="w-5 flex items-center justify-center">
                <Icon name={tab.icon} size={15} color={view===tab.id?"#92400e":"#a07850"} sw={1.5}/>
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* 認証エリア */}
        <div className="border-t border-gray-100 p-3">
          {sbConfigured && (
            authLoading ? (
              <div className="text-xs text-gray-400 px-2">読込中…</div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  {user.user_metadata?.avatar_url && (
                    <img src={user.user_metadata.avatar_url} alt="avatar"
                      className="w-7 h-7 rounded-full border-2 border-green-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-700 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <div className="text-xs text-green-600">☁️ 同期中</div>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full text-xs py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all font-medium">
                  ログアウト
                </button>
              </div>
            ) : (
              <button onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                style={{background:'rgba(146,64,14,0.08)',border:'1px solid rgba(146,64,14,0.2)',color:'#92400e'}}>
                🔑 Googleログイン
              </button>
            )
          )}
        </div>
      </aside>

      {/* ── メインエリア ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* トップバー */}
        <header className="px-4 py-2.5 flex items-center gap-3 flex-shrink-0" style={{background:'#fffcf7',borderBottom:'1px solid rgba(180,130,70,0.18)'}}>
          {/* ハンバーガー（モバイルのみ） */}
          <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            onClick={() => setSidebarOpen(s => !s)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
            </svg>
          </button>

          {/* モバイル：ロゴ表示 */}
          <div className="md:hidden flex items-center gap-1.5">
            <LogoIcon size={24} />
            <span className="text-sm font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">支礎学コンパス</span>
          </div>

          {/* 検索バー */}
          <div className="flex-1 relative max-w-xl">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="血液型・特徴・アドバイスを検索…（A型 愛情、謝り方 など）"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all" style={{background:'#fdf4e8',border:'1px solid rgba(180,130,70,0.25)',outline:'none'}} onFocus={e=>{e.target.style.boxShadow='0 0 0 2px rgba(146,64,14,0.2)';e.target.style.borderColor='rgba(146,64,14,0.4)'}} onBlur={e=>{e.target.style.boxShadow='';e.target.style.borderColor='rgba(180,130,70,0.25)'}}
            />
            {searchQuery && (
              <button onClick={() => handleSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold">
                ✕
              </button>
            )}
          </div>
        </header>

        {/* タブバー（検索中は非表示・サイドバービュー時も非表示） */}
        {!searchQuery && !isSidebarView && (
          <div className="px-4 flex-shrink-0" style={{background:'#fffcf7',borderBottom:'1px solid rgba(180,130,70,0.15)'}}>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
              {mainTabs.map(tab => (
                <button key={tab.id} onClick={() => handleViewChange(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
                  style={view === tab.id
                    ? {background:'linear-gradient(135deg,#92400e,#b45309)',color:'white',boxShadow:'0 2px 6px rgba(146,64,14,0.25)'}
                    : {color:'#7c5c3e',background:'transparent'}}>
                  <Icon name={tab.icon} size={13} color={view===tab.id?"white":"#92400e"} sw={1.5}/>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4">

            {/* 検索結果 */}
            {searchQuery ? (
              <SearchResults results={searchResults} query={searchQuery} onTabJump={(tab) => { handleSearch(''); handleViewChange(tab); }} />
            ) : (
              <div className="bg-white rounded-2xl p-5" style={{boxShadow:'0 1px 12px rgba(180,130,70,0.1)',border:'1px solid rgba(180,130,70,0.15)'}}>
                {view==="toroku"    && <TorokuView profiles={profiles} setProfiles={setProfiles} myId={myId} setMyId={setMyId} user={user} onLogin={handleLogin}/>}
                {view==="pair"      && <PairView profiles={profiles} setProfiles={setProfiles} myId={myId}/>}
                {view==="life"      && <LifeView/>}
                {view==="compat"    && <CompatView profiles={profiles} myId={myId}/>}
                {view==="scene"     && <SceneView profiles={profiles} myId={myId}/>}
                {view==="power"     && <PowerView profiles={profiles}/>}
                {view==="simulate"  && <SimulateView profiles={profiles} myId={myId}/>}
                {view==="plan"      && <PlanView/>}
                {view==="ai"        && <AIView profiles={profiles} myId={myId} user={user}/>}
              </div>
            )}
          </div>
        </div>

        {/* ── モバイル下部ナビ ── */}
        <nav className="md:hidden flex items-center justify-around px-1 py-2 flex-shrink-0" style={{background:'#2c1a0e',borderTop:'1px solid rgba(255,220,160,0.08)'}}>
          {[
            { id:"toroku", icon:"user",   label:"自分" },
            { id:"pair",   icon:"people", label:"相手" },
            { id:"compat", icon:"heart",  label:"相性" },
            { id:"scene",  icon:"chat",   label:"シーン" },
            { id:"ai",     icon:"robot",  label:"AI" },
          ].map(item => (
            <button key={item.id} onClick={() => handleViewChange(item.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all flex-1"
              style={view===item.id
                ?{background:'linear-gradient(135deg,#92400e,#b45309)',boxShadow:'0 2px 8px rgba(146,64,14,0.5)'}
                :{}}>
              <Icon name={item.icon} size={20} color={view===item.id?"#fdf8f0":"rgba(253,248,240,0.38)"} sw={1.5}/>
              <span className="text-xs font-bold" style={{color:view===item.id?"#fdf8f0":"rgba(253,248,240,0.38)"}}>{item.label}</span>
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl flex-1">
            <Icon name="menu" size={20} color="rgba(253,248,240,0.38)" sw={1.5}/>
            <span className="text-xs font-bold" style={{color:"rgba(253,248,240,0.38)"}}>メニュー</span>
          </button>
        </nav>

      </div>
    </div>
  );
}


export default CommunicationCompass;
