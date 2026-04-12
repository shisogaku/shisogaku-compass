function AIView({ profiles = [], myId = null, user = null }) {
  const bloods  = ["O","A","B","AB"];
  const genders = ["男性","女性"];

  // 自分・相手の初期値をプロフィールから設定
  const myProf = profiles.find(p => p.id === myId) || null;
  const others = profiles.filter(p => p.id !== myId);

  const [myBlood,  setMyBlood]  = useState(myProf?.blood  || null);
  const [myGender, setMyGender] = useState(myProf?.gender || null);
  const [tgBlood,  setTgBlood]  = useState(others[0]?.blood  || null);
  const [tgGender, setTgGender] = useState(others[0]?.gender || null);
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [helpful,  setHelpful]  = useState(null); // true/false/null
  const [lastLogId, setLastLogId] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 300;

  const handleSituationChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setSituation(val);
    setCharCount(val.length);
  };

  const handleAnalyze = async () => {
    if (!myBlood || !tgBlood || !situation.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setHelpful(null);
    setLastLogId(null);

    try {
      const bcMy     = BC[myBlood] || null;
      const bcTarget = BC[tgBlood] || null;
      const compatKey = [myBlood, tgBlood].sort().join("-");
      const compat   = COMPAT ? (COMPAT[[myBlood,tgBlood].sort().join("")] || COMPAT[compatKey] || null) : null;

      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myBlood, myGender, targetBlood: tgBlood, targetGender: tgGender,
          situation: situation.trim(),
          bcMy, bcTarget, compat,
          userId: user?.id || null,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.response);
      setLastLogId(data.logId || null);
    } catch (e) {
      setError(e.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (val) => {
    setHelpful(val);
    if (!lastLogId) return;
    try {
      await fetch(`${EDGE_URL.replace("ai-analyze","ai-feedback")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: lastLogId, helpful: val }),
      });
    } catch {}
  };

  const canAnalyze = myBlood && tgBlood && situation.trim().length >= 10;

  // セレクタ共通
  const BloodSel = ({ val, set, label }) => (
    <div>
      <div className="text-xs text-gray-500 font-bold mb-1">{label}</div>
      <div className="flex gap-1">
        {bloods.map(b => (
          <button key={b} onClick={() => set(b)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
            style={val===b ? {backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"} : {borderColor:"#e5e7eb",color:"#374151"}}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
  const GenderSel = ({ val, set }) => (
    <div className="flex gap-1 mt-1.5">
      {genders.map(g => (
        <button key={g} onClick={() => set(g)}
          className="flex-1 py-1 rounded-lg text-xs font-bold border-2 transition-all"
          style={val===g ? {backgroundColor:"#6366f1",borderColor:"#6366f1",color:"white"} : {borderColor:"#e5e7eb",color:"#374151"}}>
          {g}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-700">🤖 AI相談</div>
        <div className="text-xs text-gray-400">血液型×状況を読み取ったアドバイスを生成します</div>
      </div>

      {/* 血液型・性別選択 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
          <BloodSel val={myBlood} set={setMyBlood} label="あなたの血液型" />
          <GenderSel val={myGender} set={setMyGender} />
        </div>
        <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
          <BloodSel val={tgBlood} set={setTgBlood} label="相手の血液型" />
          <GenderSel val={tgGender} set={setTgGender} />
        </div>
      </div>

      {/* 状況入力 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-bold text-gray-600">今の状況を教えてください</div>
          <div className={`text-xs ${charCount >= MAX_CHARS ? "text-red-500" : "text-gray-400"}`}>{charCount}/{MAX_CHARS}</div>
        </div>
        <textarea
          value={situation}
          onChange={handleSituationChange}
          placeholder={"例：「昨日LINEを送ったのに既読スルーされた。いつもこのパターンで不安になる」\n「仕事でミスをして謝ったが相手の反応が薄い。どう対応すれば良いか」"}
          rows={4}
          className="w-full text-sm p-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none resize-none leading-relaxed"
        />
        <div className="text-xs text-gray-400 mt-1">※ 10文字以上入力してください</div>
      </div>

      {/* 送信ボタン */}
      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || loading}
        className="w-full py-3 rounded-xl font-bold text-sm transition-all"
        style={canAnalyze && !loading
          ? {background:"linear-gradient(135deg,#f43f5e,#a855f7)",color:"white",boxShadow:"0 4px 12px rgba(168,85,247,0.3)"}
          : {backgroundColor:"#e5e7eb",color:"#9ca3af"}}>
        {loading ? "🤖 AIが分析中..." : "✨ AIに相談する"}
      </button>

      {/* エラー */}
      {error && (
        <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-600">
          ⚠️ {error}
          {error.includes("ANTHROPIC_API_KEY") && (
            <div className="mt-1 text-gray-500">Supabase の Secrets に ANTHROPIC_API_KEY を設定してください。</div>
          )}
        </div>
      )}

      {/* AI回答 */}
      {result && (
        <div className="space-y-2">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                🤖 {myBlood}型{myGender} × {tgBlood}型{tgGender}
              </span>
            </div>
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>

          {/* フィードバック */}
          {helpful === null ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="text-xs text-gray-500">このアドバイスは役に立ちましたか？</div>
              <button onClick={() => sendFeedback(true)}
                className="px-3 py-1 rounded-lg text-xs bg-green-100 text-green-700 font-bold hover:bg-green-200">
                👍 役立った
              </button>
              <button onClick={() => sendFeedback(false)}
                className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-500 font-bold hover:bg-gray-200">
                👎 いまいち
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400">
              {helpful ? "✅ フィードバックありがとうございます！" : "📝 より良い回答を蓄積していきます"}
            </div>
          )}

          {/* 再相談ボタン */}
          <button onClick={() => { setResult(null); setSituation(""); setCharCount(0); }}
            className="w-full py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">
            別の状況を相談する
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// 人生プランデータ（住宅・保険・転職・資産）
// ─────────────────────────────────────────
function PlanView() {
  const [selCat, setSelCat] = useState(null);
  const [selBlood, setSelBlood] = useState(null);

  const catKeys = Object.keys(PLAN_DB);
  const cat = selCat ? PLAN_DB[selCat] : null;
  const tip = cat && selBlood ? cat.tips[selBlood] : null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-700">人生プランガイド</div>
        <div className="text-xs text-gray-400">血液型×意思決定スタイルで人生の選択を読み解く</div>
      </div>

      {/* カテゴリ選択（4×2グリッド） */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1.5">カテゴリを選ぶ</div>
        <div className="grid grid-cols-4 gap-1">
          {catKeys.map(k => {
            const c = PLAN_DB[k];
            return (
              <button key={k} onClick={() => setSelCat(k)}
                className={`py-2 px-1 rounded-xl border-2 transition-all flex flex-col items-center gap-0.5 ${selCat===k?"border-current text-white":"border-gray-200 text-gray-600 hover:border-gray-300"}`}
                style={selCat===k?{borderColor:c.color,backgroundColor:c.color}:{}}>
                <span className="text-lg">{c.icon}</span>
                <span className="font-bold text-center leading-tight" style={{fontSize:"9px"}}>{c.label}</span>
              </button>
            );
          })}
        </div>
        {/* 選択中カテゴリのサブタイトル */}
        {cat && (
          <div className="mt-1.5 text-xs text-center font-bold py-1 rounded-lg text-white" style={{backgroundColor:cat.color}}>
            {cat.icon} {cat.label} — {cat.subtitle}
          </div>
        )}
      </div>

      {cat && (
        <>
          {/* 血液型選択 */}
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">あなたの血液型</div>
            <div className="grid grid-cols-4 gap-1">
              {["O","A","B","AB"].map(b => (
                <button key={b} onClick={() => setSelBlood(b)}
                  className="py-2 rounded-lg text-sm font-bold border-2 transition-all"
                  style={selBlood===b?{backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>
                  {b}型
                </button>
              ))}
            </div>
          </div>

          {tip ? (
            <div className="space-y-2">
              {/* スタイルバッジ */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{backgroundColor:cat.color}}>{selBlood}型 × {cat.label}</span>
                <span className="text-xs text-gray-500 font-bold">{tip.style}</span>
              </div>

              {/* 3項目カード */}
              {[
                { label:"💡 意思決定のスタイル", key:"decision", bg:"bg-indigo-50", border:"border-indigo-200", text:"text-indigo-700" },
                { label:"⚠️ 注意したいこと",   key:"risk",     bg:"bg-amber-50",  border:"border-amber-200",  text:"text-amber-700"  },
                { label:"⏰ 動くタイミング",   key:"timing",   bg:"bg-green-50",  border:"border-green-200",  text:"text-green-700"  },
              ].map(({label,key,bg,border,text}) => (
                <div key={key} className={`p-3 ${bg} rounded-xl border ${border}`}>
                  <div className={`font-bold text-xs ${text} mb-1`}>{label}</div>
                  <div className="text-sm text-gray-800 leading-relaxed">{tip[key]}</div>
                </div>
              ))}

              {/* 専門家相談への導線 */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="text-xs font-bold text-gray-600">🤝 もっと詳しく知りたい場合</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  {selCat==="house" && "住宅ローンの試算・物件選びは、ファイナンシャルプランナーや不動産専門家への相談が、あなたのスタイルに合った最適解を見つける近道です。"}
                  {selCat==="insurance" && "保険は「いつ・何を・どれだけ」が個人の状況によって全く異なります。保険のプロに、あなたの血液型的な意思決定スタイルを伝えた上で相談することで、より納得感の高い設計ができます。"}
                  {selCat==="career" && "転職・キャリア形成は、あなたの強みと市場価値を客観的に知ることから始まります。キャリアアドバイザーとの相談で、自分では気づかなかった選択肢が見つかることがあります。"}
                  {selCat==="money" && "資産設計・老後計画は早く始めるほど選択肢が広がります。ファイナンシャルプランナーへの相談は無料のケースも多く、あなたのスタイルに合った方法を一緒に設計できます。"}
                  {selCat==="car" && "車の選択はライフスタイルの写し鏡です。試乗・見積もりを複数社で比較する際、あなたの血液型的な「決め手」を販売員に伝えると的確な提案を引き出せます。カーリースやサブスクという選択肢もぜひ検討を。"}
                  {selCat==="area" && "住む場所は人生の土台を決める選択です。移住相談窓口・地域おこし協力隊・不動産エージェントとの対話で、データだけでは見えない「その街の空気感」を確かめてから決断するのが賢明です。"}
                  {selCat==="health" && "健康は全ての人生設計の前提条件です。まずはかかりつけ医・健診結果をベースに自分の傾向を把握しましょう。パーソナルトレーナーや管理栄養士との相談で、あなたに合った継続できる仕組みづくりができます。"}
                  {selCat==="education" && "子育て・教育方針は夫婦で話し合うほど視野が広がります。教育相談員・学習塾カウンセラー・進路アドバイザーへの早めの相談が、お子さんの可能性を最大限に引き出す土台になります。"}
                  {selCat==="training" && "職業訓練・リスキリングはハローワークへの相談が出発点です。教育訓練給付金・求職者支援訓練など、条件次第で無料〜格安で受講できる制度が充実しています。まず窓口で自分の状況を話してみることが最短ルートです。"}
                  {selCat==="municipal" && "役所手続きは「わからなくて当然」です。住民課・年金課・福祉課など窓口ごとに担当が異なりますが、総合窓口や市区町村のコールセンターに「何が必要か教えてください」と聞くだけで道が開けます。マイナポータルのオンライン申請も活用を。"}
                  {selCat==="matching" && "マッチングアプリは「登録したら終わり」ではなく、プロフィールの磨き込み・写真の選び方・最初のメッセージの工夫が成果を左右します。血液型に合ったアプローチスタイルで、自分らしく出会いを楽しみましょう。"}
                </div>
              </div>

              {/* スポンサー or 検索結果リンク */}
              {cat.sponsors && cat.sponsors.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded text-white" style={{backgroundColor:"#6b7280",fontSize:"9px"}}>PR</span>
                    <span>このカテゴリのパートナー企業</span>
                  </div>
                  {cat.sponsors.map((sp, i) => (
                    <a key={i} href={sp.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border-2 transition-all hover:shadow-md block"
                      style={{borderColor: sp.color + "44", backgroundColor: sp.color + "08"}}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{backgroundColor: sp.color}}>
                        {sp.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-gray-800">{sp.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
                            style={{backgroundColor: sp.color, fontSize:"9px"}}>{sp.tag}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sp.catchcopy}</div>
                      </div>
                      <span className="text-gray-400 text-xs flex-shrink-0 self-center">›</span>
                    </a>
                  ))}
                </div>
              ) : cat.links && cat.links.length > 0 ? (
                <div className="space-y-0.5">
                  <div className="text-xs text-gray-400 mb-1.5">🔍 関連サービス・情報</div>
                  {cat.links.map((lk, i) => (
                    <a key={i} href={lk.url} target="_blank" rel="noopener noreferrer"
                      className="block py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-all group">
                      <div className="text-xs font-bold text-blue-600 group-hover:underline leading-tight">{lk.title}</div>
                      <div className="text-xs text-green-700 mt-0.5" style={{fontSize:"10px"}}>{lk.domain}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lk.desc}</div>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-xs py-4">血液型を選ぶとあなたのスタイルが表示されます</div>
          )}
        </>
      )}
      {!selCat && (
        <div className="text-center text-gray-400 text-xs py-4">カテゴリを選んでください</div>
      )}
    </div>
  );
}

