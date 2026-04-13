// ─────────────────────────────────────────
// ロゴ
// ─────────────────────────────────────────
function LogoIcon({ size = 44 }) {
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
// 検索インデックス構築
// ─────────────────────────────────────────
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
function SearchResults({ results, query, onTabJump }) {
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
function CommunicationCompass() {
  const [view, setView] = useState("toroku");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 検索インデックス（初回のみ構築）
  const searchIndexRef = React.useRef(null);
  const getIndex = () => {
    if (!searchIndexRef.current) searchIndexRef.current = buildSearchIndex();
    return searchIndexRef.current;
  };

  // 検索実行
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results = getIndex()
      .filter(e => e.text.toLowerCase().includes(lower) || e.label.toLowerCase().includes(lower))
      .slice(0, 30);
    setSearchResults(results);
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
    if (user) sbDb.log(user.id, "view_tab", { tab: v });
  };

  const me = profiles.find(p => p.id === myId);
  const partners = profiles.filter(p => p.id !== myId);
  const sbConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL";

  // ── タブ定義 ──
  const sidebarItems = [
    { id:"toroku", label:"自分の登録", icon:"👤", badge: me ? (me.blood + '型') : null, badgeColor: me?.color },
    { id:"pair",   label:"相手の登録", icon:"👥", badge: partners.length > 0 ? String(partners.length) : null },
    { id:"ai",     label:"AIに確認",  icon:"🤖" },
  ];
  const mainTabs = [
    { id:"life",     label:"ライフ",  icon:"💑" },
    { id:"compat",   label:"相性",    icon:"🔮" },
    { id:"scene",    label:"シーン",  icon:"🎬" },
    { id:"power",    label:"知識",    icon:"📚" },
    { id:"simulate", label:"シミュ",  icon:"🎯" },
    { id:"plan",     label:"プラン",  icon:"🏦" },
  ];

  const isSidebarView = ['toroku','pair','ai'].includes(view);
  const activeMain = !isSidebarView ? view : null;

  // ── レンダー ──
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#f8fafc'}}>

      {/* ── サイドバー（デスクトップ固定 / モバイルオーバーレイ）── */}
      {/* オーバーレイ背景（モバイルのみ） */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={[
        "flex flex-col bg-white border-r border-gray-200 z-30 transition-transform duration-300",
        "fixed md:static inset-y-0 left-0 w-56",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ].join(' ')}>

        {/* ロゴ */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
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
              className={[
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                view === item.id
                  ? (item.id === 'ai'
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-indigo-600 text-white shadow-md shadow-indigo-200")
                  : "text-gray-700 hover:bg-gray-50"
              ].join(' ')}>
              <span className="text-base w-5 text-center">{item.icon}</span>
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
              className={[
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                view === tab.id
                  ? "bg-gray-100 text-indigo-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              ].join(' ')}>
              <span className="text-base w-5 text-center">{tab.icon}</span>
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
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all">
                <span>🔑</span> Googleログイン
              </button>
            )
          )}
        </div>
      </aside>

      {/* ── メインエリア ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* トップバー */}
        <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
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
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
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
          <div className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
            <div className="flex gap-0.5 overflow-x-auto scrollbar-hide py-2">
              {mainTabs.map(tab => (
                <button key={tab.id} onClick={() => handleViewChange(tab.id)}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0",
                    view === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  ].join(' ')}>
                  <span>{tab.icon}</span>
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
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
        <nav className="md:hidden bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 flex-shrink-0">
          {[
            { id:"toroku", icon:"👤", label:"自分" },
            { id:"pair",   icon:"👥", label:"相手" },
            { id:"compat", icon:"🔮", label:"相性" },
            { id:"scene",  icon:"🎬", label:"シーン" },
            { id:"ai",     icon:"🤖", label:"AI" },
          ].map(item => (
            <button key={item.id} onClick={() => handleViewChange(item.id)}
              className={[
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all",
                view === item.id ? "text-indigo-600" : "text-gray-500"
              ].join(' ')}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-xs font-bold">{item.label}</span>
              {view === item.id && <span className="w-1 h-1 rounded-full bg-indigo-600" />}
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-gray-500">
            <span className="text-xl leading-none">⋯</span>
            <span className="text-xs font-bold">メニュー</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(CommunicationCompass));
