function LogoIcon({ size = 52 }) {
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
      {/* 外枠 */}
      <circle cx="60" cy="60" r="58" fill="url(#lgBorder)" filter="url(#lgShadow)"/>
      <circle cx="60" cy="60" r="52" fill="url(#lgBg)"/>
      {/* 装飾 */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="#e9b8f0" strokeWidth="0.5" opacity="0.4"/>
      {/* 目盛り */}
      <g stroke="#e9b8f0" strokeWidth="1" opacity="0.6">
        <line x1="60" y1="16" x2="60" y2="22"/>
        <line x1="60" y1="98" x2="60" y2="104"/>
        <line x1="16" y1="60" x2="22" y2="60"/>
        <line x1="98" y1="60" x2="104" y2="60"/>
        <line x1="31" y1="31" x2="35" y2="35"/>
        <line x1="89" y1="31" x2="85" y2="35"/>
        <line x1="31" y1="89" x2="35" y2="85"/>
        <line x1="89" y1="89" x2="85" y2="85"/>
      </g>
      {/* 血液型バッジ */}
      <circle cx="60" cy="22" r="10" fill="white" opacity="0.95"/>
      <circle cx="60" cy="22" r="10" fill="#ff6eb4" opacity="0.15"/>
      <text x="60" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="bold" fill="#e05ba0">A</text>
      <circle cx="60" cy="98" r="10" fill="white" opacity="0.95"/>
      <circle cx="60" cy="98" r="10" fill="#a78bfa" opacity="0.15"/>
      <text x="60" y="102" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="bold" fill="#7c3aed">B</text>
      <circle cx="98" cy="60" r="10" fill="white" opacity="0.95"/>
      <circle cx="98" cy="60" r="10" fill="#fb923c" opacity="0.1"/>
      <text x="98" y="63.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="bold" fill="#ea580c">AB</text>
      <circle cx="22" cy="60" r="10" fill="white" opacity="0.95"/>
      <circle cx="22" cy="60" r="10" fill="#34d399" opacity="0.1"/>
      <text x="22" y="63.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="bold" fill="#059669">O</text>
      {/* コンパスローズ(薄) */}
      <g opacity="0.1" fill="#c084fc">
        <polygon points="60,32 63,57 60,60 57,57"/>
        <polygon points="60,88 63,63 60,60 57,63"/>
        <polygon points="32,60 57,63 60,60 57,57"/>
        <polygon points="88,60 63,63 60,60 63,57"/>
      </g>
      {/* 針（上） */}
      <g filter="url(#lgGlow)">
        <polygon points="60,40 63,57 60,60 57,57" fill="url(#lgNeedleUp)"/>
        <path d="M60,32 C60,32 53,25 50,28 C47,31 51,37 60,43 C69,37 73,31 70,28 C67,25 60,32 60,32 Z" fill="#ff6eb4"/>
        <path d="M60,32 C60,32 53,25 50,28 C47,31 51,37 60,43 C69,37 73,31 70,28 C67,25 60,32 60,32 Z" fill="white" opacity="0.25"/>
      </g>
      {/* 針（下） */}
      <polygon points="60,80 63,63 60,60 57,63" fill="url(#lgNeedleDown)"/>
      {/* 中心 */}
      <circle cx="60" cy="60" r="7" fill="white" opacity="0.9"/>
      <circle cx="60" cy="60" r="5.5" fill="#f9a8d4"/>
      <circle cx="60" cy="60" r="4" fill="white"/>
      <circle cx="60" cy="60" r="2.5" fill="#c084fc"/>
      <circle cx="59" cy="59" r="1" fill="white" opacity="0.6"/>
      {/* スパークル */}
      <polygon points="18,18 19.5,22 23,23.5 19.5,25 18,29 16.5,25 13,23.5 16.5,22" fill="#f9a8d4" opacity="0.7"/>
      <polygon points="102,102 103,105 106,106 103,107 102,110 101,107 98,106 101,105" fill="#c084fc" opacity="0.7"/>
    </svg>
  );
}

// ─────────────────────────────────────────
// メイン
// ─────────────────────────────────────────
function CommunicationCompass() {
  const [view,setView] = useState("toroku");
  const [blood,setBlood] = useState(null);
  const [gender,setGender] = useState(null);

  // ── 認証状態 ──
  const [user, setUser] = useState(null);       // Supabase ユーザー
  const [authLoading, setAuthLoading] = useState(!!_sb);

  // ── プロフィール（localStorage + Supabase）──
  const [profiles, setProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shisogaku_profiles")) || []; } catch { return []; }
  });
  const [myId, setMyId] = useState(() => {
    try { return localStorage.getItem("shisogaku_myId") || null; } catch { return null; }
  });

  // localStorage への永続化（ログアウト中は書き込まない）
  useEffect(() => {
    if (!user && profiles.length === 0) return; // ログアウト直後は書き込みスキップ
    try { localStorage.setItem("shisogaku_profiles", JSON.stringify(profiles)); } catch {}
  }, [profiles, user]);
  useEffect(() => {
    if (!user && !myId) return; // ログアウト直後は書き込みスキップ
    try { if (myId) localStorage.setItem("shisogaku_myId", myId); else localStorage.removeItem("shisogaku_myId"); } catch {}
  }, [myId, user]);

  // ── Supabase 認証初期化 ──
  useEffect(() => {
    if (!_sb) return;
    // 現在のセッションを確認
    _sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) loadFromSupabase(session.user.id);
    });
    // 認証状態変化を監視
    const { data: { subscription } } = _sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setAuthLoading(false);
      if (u) {
        loadFromSupabase(u.id);
        sbDb.log(u.id, "login", { provider: session?.user?.app_metadata?.provider });
      } else {
        // ログアウト時：表示とlocalStorageをクリア
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

  // Supabase からデータを読み込んで上書き（ローカルデータを優先マージ）
  const loadFromSupabase = async (userId) => {
    const [sbProfiles, sbMyId] = await Promise.all([
      sbDb.getProfiles(userId),
      sbDb.getMyId(userId),
    ]);

    // ローカルに保存済みのデータを取得
    let localProfiles = [];
    let localMyId = null;
    try { localProfiles = JSON.parse(localStorage.getItem("shisogaku_profiles")) || []; } catch {}
    try { localMyId = localStorage.getItem("shisogaku_myId") || null; } catch {}

    if (sbProfiles !== null && sbProfiles.length > 0) {
      // Supabase にデータあり → Supabase を優先して使用
      setProfiles(sbProfiles);
      localStorage.setItem("shisogaku_profiles", JSON.stringify(sbProfiles));
    } else if (localProfiles.length > 0) {
      // Supabase にデータなし、ローカルにデータあり → ローカルを維持＆Supabaseへ移行保存
      setProfiles(localProfiles);
      for (const p of localProfiles) {
        const isMe = p.id === localMyId;
        await sbDb.saveProfile(userId, p, isMe);
      }
    }
    // どちらにもデータがない場合はそのまま（0件を維持）

    if (sbMyId !== null) {
      setMyId(sbMyId);
      localStorage.setItem("shisogaku_myId", sbMyId);
    } else if (localMyId) {
      setMyId(localMyId);
    }
  };

  // Google ログイン
  const handleLogin = async () => {
    if (!_sb) return;
    await _sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href }
    });
  };

  // ログアウト（Supabaseにデータは残す・表示はクリア）
  const handleLogout = async () => {
    if (!_sb) return;
    await _sb.auth.signOut();
    setUser(null);
    setProfiles([]);
    setMyId(null);
    try {
      localStorage.removeItem("shisogaku_profiles");
      localStorage.removeItem("shisogaku_myId");
    } catch {}
  };

  // タブ切り替え時にログ記録
  const handleViewChange = (v) => {
    setView(v);
    if (user) sbDb.log(user.id, "view_tab", { tab: v });
  };

  const views = [
    {id:"toroku",label:"登録",icon:"👤"},
    {id:"pair",label:"ペア",icon:"👥"},
    {id:"life",label:"ライフ",icon:"💑"},
    {id:"compat",label:"相性",icon:"💑"},
    {id:"scene",label:"シーン",icon:"🎬"},
    {id:"power",label:"知識",icon:"📚"},
    {id:"simulate",label:"シミュ",icon:"🎯"},
    {id:"plan",label:"プラン",icon:"🏦"},
    {id:"ai",label:"AI相談",icon:"🤖"},
  ];

  const sbConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-3">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={52} />
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent leading-tight">支礎学コンパス</h1>
            </div>
          </div>
          {/* 認証ボタン */}
          {sbConfigured && (
            authLoading ? (
              <div className="text-xs text-gray-400">読込中…</div>
            ) : user ? (
              <div className="flex items-center gap-1.5">
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-700 max-w-24 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <div className="text-xs text-green-600 font-bold">☁️ 同期中</div>
                </div>
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-green-400" />
                )}
                <button onClick={handleLogout}
                  className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-500 border border-gray-200">
                  ログアウト
                </button>
              </div>
            ) : (
              <button onClick={handleLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-indigo-200 shadow-sm text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-all">
                <span>🔑</span> Googleログイン
              </button>
            )
          )}
        </div>
        {/* タブ（2段） */}
        <div className="grid grid-cols-4 gap-0.5 mb-1 bg-white rounded-xl p-1 shadow-sm">
          {views.slice(0,4).map(v=><button key={v.id} onClick={()=>handleViewChange(v.id)} className={`py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${view===v.id?"bg-indigo-600 text-white shadow":"text-gray-500 hover:bg-gray-100"}`}>
            <span>{v.icon}</span><span style={{fontSize:"9px"}}>{v.label}</span>
          </button>)}
        </div>
        <div className="grid grid-cols-4 gap-0.5 mb-3 bg-white rounded-xl p-1 shadow-sm">
          {views.slice(4).map(v=><button key={v.id} onClick={()=>handleViewChange(v.id)} className={`py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${view===v.id?"bg-indigo-600 text-white shadow":"text-gray-500 hover:bg-gray-100"}`}>
            <span>{v.icon}</span><span style={{fontSize:"9px"}}>{v.label}</span>
          </button>)}
        </div>
        {/* カード */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          {view==="toroku"&&<TorokuView profiles={profiles} setProfiles={setProfiles} myId={myId} setMyId={setMyId} user={user} onLogin={handleLogin}/>}
          {view==="pair"&&<PairView profiles={profiles} setProfiles={setProfiles} myId={myId}/>}
          {view==="life"&&<LifeView/>}
          {view==="compat"&&<CompatView profiles={profiles} myId={myId}/>}
          {view==="scene"&&<SceneView profiles={profiles} myId={myId}/>}
          {view==="power"&&<PowerView profiles={profiles}/>}
          {view==="simulate"&&<SimulateView profiles={profiles} myId={myId}/>}
          {view==="plan"&&<PlanView/>}
          {view==="ai"&&<AIView profiles={profiles} myId={myId} user={user}/>}
        </div>
        <div className="text-center text-xs text-gray-400 mt-3">
          {user && <span className="text-green-500">☁️ Supabase 同期中</span>}
        </div>
      </div>
    </div>
  );
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(CommunicationCompass));
