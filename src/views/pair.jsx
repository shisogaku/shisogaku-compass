import { useState } from 'react';
import { BC, COMPAT, COMPAT_KEY, GS, MSG_TIPS, NENDAI, STAGES } from '../data.js';
import { ProfileHistoryFields } from './profile.jsx';
import { RadarChart, RelationshipInsights } from './life.jsx';

export function PairView({ profiles, setProfiles, myId }) {
  const [targetId, setTargetId] = useState(null);
  const [pairTab, setPairTab] = useState("overview");
  const [stageNum, setStageNum] = useState(null);
  const [copied, setCopied] = useState(false);

  // 相手管理
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [mName, setMName] = useState("");
  const [mBlood, setMBlood] = useState(null);
  const [mGender, setMGender] = useState(null);
  const [mAge, setMAge] = useState("");
  const [mRelation, setMRelation] = useState("友人");
  const [mMarriage, setMMarriage] = useState("");
  const [mKids, setMKids] = useState("");
  const [mLoveExp, setMLoveExp] = useState("");
  const [mDivorce, setMDivorce] = useState("");
  const [showRadarId, setShowRadarId] = useState(null);

  const MRELATIONS = ["恋人","配偶者","家族","友人","同僚","上司","部下","取引先","パトロン","その他"];
  const MAGES = ["10代","20代","30代","40代","50代","60代","70代"];

  const openAddForm = () => {
    setEditMemberId(null); setMName(""); setMBlood(null); setMGender(null); setMAge(""); setMRelation("友人");
    setMMarriage(""); setMKids(""); setMLoveExp(""); setMDivorce("");
    setShowMemberForm(true);
  };
  const openEditForm = (p) => {
    setEditMemberId(p.id); setMName(p.name); setMBlood(p.blood); setMGender(p.gender);
    setMAge(p.age||""); setMRelation(p.relation||"友人");
    setMMarriage(p.marriage||""); setMKids(p.kids||""); setMLoveExp(p.loveExp||""); setMDivorce(p.divorce||"");
    setShowMemberForm(true);
  };
  const saveMember = () => {
    if (!mName.trim() || !mBlood || !mGender) return;
    const newP = { id: editMemberId || Date.now().toString(), name: mName.trim(), blood: mBlood, gender: mGender, age: mAge, relation: mRelation, marriage: mMarriage, kids: mKids, loveExp: mLoveExp, divorce: mDivorce, color: BC[mBlood].color };
    if (editMemberId) {
      setProfiles(prev => prev.map(p => p.id === editMemberId ? newP : p));
      if (targetId === editMemberId) {}
    } else {
      setProfiles(prev => [...prev, newP]);
      setTargetId(newP.id);
    }
    setShowMemberForm(false);
  };
  const removeMember = (id) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (targetId === id) setTargetId(null);
  };

  const me = profiles.find(p => p.id === myId);
  const target = profiles.find(p => p.id === targetId);

  const compat = me && target ? COMPAT[COMPAT_KEY(me.blood, target.blood)] : null;
  const targetLabel = target ? `${target.blood}型${target.gender === "female" ? "女性" : "男性"}` : null;
  const meLabel = me ? `${me.blood}型${me.gender === "female" ? "女性" : "男性"}` : null;
  const targetGS = targetLabel ? GS[targetLabel] : null;
  const targetBC = target ? BC[target.blood] : null;
  const meBC = me ? BC[me.blood] : null;
  const tips = targetLabel ? MSG_TIPS[targetLabel] : null;
  const nendai = target?.age ? NENDAI[target.blood]?.[target.age] : null;

  const others = profiles.filter(p => p.id !== myId);

  const PAIR_TABS = [
    {id:"overview",  label:"概要",  icon:"👥"},
    {id:"approach",  label:"接し方",icon:"✅"},
    {id:"psychology",label:"心理",  icon:"🧠"},
    {id:"msg",       label:"変換",  icon:"✉️"},
    {id:"age",       label:"年代",  icon:"🎂"},
    {id:"face",      label:"表/裏", icon:"🎭"},
    {id:"stage",     label:"段階",  icon:"📈"},
  ];

  if (!me) return (
    <div className="text-center py-12 space-y-2">
      <div className="text-4xl">👤</div>
      <div className="font-bold text-gray-700">まず「登録」タブで自分を登録してください</div>
      <div className="text-xs text-gray-500">自分のプロフィールを「自分に★」に設定すると使えます</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 自分バッジ */}
      <div className="flex items-center gap-2 p-2 rounded-lg" style={{backgroundColor: meBC?.color + "22", border:`1px solid ${meBC?.color}44`}}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{backgroundColor: meBC?.color}}>{me.blood}</div>
        <div>
          <div className="text-xs text-gray-500">自分</div>
          <div className="font-bold text-sm text-gray-800">{me.name}（{meLabel}）</div>
        </div>
      </div>

      {/* 相手メンバー管理 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-bold">相手・メンバー（{others.length}人）</div>
          <button onClick={openAddForm}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">
            ＋ 追加
          </button>
        </div>

        {/* 追加・編集フォーム */}
        {showMemberForm && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <div className="font-bold text-sm text-gray-700">{editMemberId ? "✏️ 編集" : "＋ 相手を追加"}</div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">名前</div>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                placeholder="例：田中さん、山田くん" value={mName} onChange={e => setMName(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">関係性</div>
              <div className="flex flex-wrap gap-1">
                {MRELATIONS.map(r => (
                  <button key={r} onClick={() => setMRelation(r)}
                    className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${mRelation === r ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">性別</div>
              <div className="flex gap-2">
                {[{id:"female",label:"👩 女性"},{id:"male",label:"👨 男性"}].map(g => (
                  <button key={g.id} onClick={() => setMGender(g.id)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${mGender === g.id ? "border-indigo-500 bg-indigo-100 text-indigo-700" : "border-gray-200 text-gray-600"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">血液型</div>
              <div className="grid grid-cols-4 gap-1">
                {["O","A","B","AB"].map(b => (
                  <button key={b} onClick={() => setMBlood(b)} className="py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
                    style={mBlood === b ? {backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"} : {borderColor:"#e5e7eb",color:"#374151"}}>
                    {b}型
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">年代（任意）</div>
              <div className="flex flex-wrap gap-1">
                {MAGES.map(a => (
                  <button key={a} onClick={() => setMAge(mAge === a ? "" : a)}
                    className={`px-2 py-0.5 rounded text-xs font-bold border transition-all ${mAge === a ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <ProfileHistoryFields
              marriage={mMarriage} setMarriage={setMMarriage}
              kids={mKids} setKids={setMKids}
              loveExp={mLoveExp} setLoveExp={setMLoveExp}
              divorce={mDivorce} setDivorce={setMDivorce} />
            <div className="flex gap-2">
              <button onClick={saveMember} disabled={!mName.trim() || !mBlood || !mGender}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mName.trim() && mBlood && mGender ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                {editMemberId ? "更新" : "追加"}
              </button>
              <button onClick={() => setShowMemberForm(false)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600">
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* メンバー一覧 */}
        {others.length === 0 && !showMemberForm && (
          <div className="text-center py-4 text-gray-400 text-xs">
            「＋ 追加」から相手を登録してください
          </div>
        )}
        <div className="space-y-1">
          {others.map(p => {
            const pColor = BC[p.blood].color;
            const c = me ? COMPAT[COMPAT_KEY(me.blood, p.blood)] : null;
            return (
              <div key={p.id} className="rounded-xl border-2 overflow-hidden transition-all"
                style={targetId === p.id ? {borderColor: pColor, backgroundColor: pColor+"0d"} : {borderColor:"#e5e7eb"}}>
                <div className="flex items-center gap-2 p-2">
                  <button className="flex items-center gap-2 flex-1 text-left" onClick={() => { setTargetId(p.id); setPairTab("overview"); }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{backgroundColor: pColor}}>{p.blood}型</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.relation} ・ {p.gender==="female"?"女性":"男性"} ・ {p.blood}型{p.age?` ・ ${p.age}`:""}</div>
                      {(p.marriage || (p.divorce && p.divorce!=="なし") || p.kids || p.loveExp) && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {p.marriage && <span className="text-xs px-1 py-0 rounded bg-rose-100 text-rose-600 font-bold">💍{p.marriage}</span>}
                          {p.divorce && p.divorce!=="なし" && <span className="text-xs px-1 py-0 rounded bg-orange-100 text-orange-600 font-bold">離{p.divorce}</span>}
                          {p.kids && <span className="text-xs px-1 py-0 rounded bg-green-100 text-green-600 font-bold">👶{p.kids}</span>}
                          {p.loveExp && <span className="text-xs px-1 py-0 rounded bg-indigo-100 text-indigo-600 font-bold">恋{p.loveExp}</span>}
                        </div>
                      )}
                    </div>
                    {c && <div className="text-yellow-400 text-xs flex-shrink-0">{"★".repeat(c.stars)}</div>}
                  </button>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setShowRadarId(showRadarId === p.id ? null : p.id)}
                      className="px-1.5 py-1 rounded text-xs border border-gray-200 text-gray-500">
                      📊
                    </button>
                    <button onClick={() => openEditForm(p)}
                      className="px-1.5 py-1 rounded text-xs border border-gray-200 text-gray-500">
                      ✏️
                    </button>
                    <button onClick={() => removeMember(p.id)}
                      className="px-1.5 py-1 rounded text-xs border border-red-100 text-red-400">
                      ✕
                    </button>
                  </div>
                </div>
                {showRadarId === p.id && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <div className="text-xs font-bold text-center pt-2 pb-1" style={{ color: pColor }}>
                      📊 {p.name} の強み・弱み
                    </div>
                    <RadarChart blood={p.blood} gender={p.gender} color={pColor} />
                    <RelationshipInsights profile={p} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ペア分析コンテンツ */}
      {target && compat && (
        <div className="space-y-3">
          {/* ペアヘッダー */}
          <div className="p-3 rounded-xl text-center"
            style={{background:`linear-gradient(135deg,${meBC?.color}22,${targetBC?.color}22)`,border:`1px solid ${meBC?.color}44`}}>
            <div className="text-sm text-gray-500">{me.name} × {target.name}</div>
            <div className="text-yellow-400 text-xl">{"★".repeat(compat.stars)}{"☆".repeat(5-compat.stars)}</div>
            <div className="font-black text-lg text-gray-800">{compat.label}</div>
            <div className="text-sm text-gray-600">{compat.summary}</div>
          </div>

          {/* サブタブ */}
          <div className="flex gap-0.5 overflow-x-auto bg-gray-100 rounded-lg p-0.5" style={{scrollbarWidth:"none"}}>
            {PAIR_TABS.map(t => (
              <button key={t.id} onClick={() => setPairTab(t.id)}
                className={`py-1.5 px-2 rounded text-xs font-bold flex flex-col items-center gap-0.5 transition-all flex-shrink-0 ${pairTab===t.id?"bg-white shadow text-indigo-600":"text-gray-500"}`}>
                <span>{t.icon}</span><span style={{fontSize:"8px"}}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* 概要タブ */}
          {pairTab==="overview" && (
            <div className="space-y-2">
              <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="font-bold text-green-700 text-xs mb-1">✅ うまくいくポイント</div>
                {compat.good.map((g,i) => <div key={i} className="text-xs text-green-800 mb-0.5">・{g}</div>)}
              </div>
              <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                <div className="font-bold text-red-700 text-xs mb-1">⚠️ 注意が必要なポイント</div>
                {compat.care.map((c,i) => <div key={i} className="text-xs text-red-800 mb-0.5">・{c}</div>)}
              </div>
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-700 text-xs mb-1">💡 関係をうまくいかせるコツ</div>
                <div className="text-xs text-blue-800">{compat.tip}</div>
              </div>
              {/* 怒り方の違い */}
              <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                <div className="font-bold text-purple-700 text-xs mb-1">⚡ 怒り方の組み合わせ</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-center p-1 bg-white rounded">
                    <div className="font-bold" style={{color:meBC?.color}}>{me.name}</div>
                    <div className="text-gray-600">{["O","AB"].includes(me.blood)?"掛け算式（蓄積→大爆発）":"足し算式（言葉で即出す）"}</div>
                  </div>
                  <div className="text-center p-1 bg-white rounded">
                    <div className="font-bold" style={{color:targetBC?.color}}>{target.name}</div>
                    <div className="text-gray-600">{["O","AB"].includes(target.blood)?"掛け算式（蓄積→大爆発）":"足し算式（言葉で即出す）"}</div>
                  </div>
                </div>
              </div>
              {/* テキストエクスポート */}
              <button
                onClick={()=>{
                  const anger = (blood) => ["O","AB"].includes(blood)?"掛け算式（蓄積→大爆発）":"足し算式（言葉で即出す）";
                  const txt = [
                    `【支礎学 ペア分析レポート】`,
                    ``,
                    `▼ 組み合わせ`,
                    `${me.name}（${meLabel}）× ${target.name}（${targetLabel}）`,
                    ``,
                    `▼ 相性評価`,
                    `${"★".repeat(compat.stars)}${"☆".repeat(5-compat.stars)}　${compat.label}`,
                    compat.summary,
                    ``,
                    `▼ うまくいくポイント`,
                    ...compat.good.map(g=>`・${g}`),
                    ``,
                    `▼ 注意が必要なポイント`,
                    ...compat.care.map(c=>`・${c}`),
                    ``,
                    `▼ 関係をうまくいかせるコツ`,
                    compat.tip,
                    ``,
                    `▼ 怒り方パターン`,
                    `${me.name}：${anger(me.blood)}`,
                    `${target.name}：${anger(target.blood)}`,
                    ``,
                    `─ 支礎学コンパス より出力 ─`,
                  ].join("\n");
                  navigator.clipboard?.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
                }}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all border-2 ${copied?"bg-green-500 text-white border-green-500":"bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"}`}
              >
                {copied ? "✅ コピーしました！" : "📋 この分析をテキストでコピー"}
              </button>
            </div>
          )}

          {/* 接し方タブ */}
          {pairTab==="approach" && targetGS && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-bold">{target.name}（{targetLabel}）への接し方</div>
              <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="font-bold text-green-700 text-xs mb-1">✅ 距離が縮まること</div>
                {targetGS.対応.map((d,i) => <div key={i} className="text-xs text-green-800 mb-0.5">・{d}</div>)}
              </div>
              <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                <div className="font-bold text-red-700 text-xs mb-1">⚠️ 絶対NGな行動</div>
                {targetGS.危険.map((d,i) => <div key={i} className="text-xs text-red-800 mb-0.5">・{d}</div>)}
              </div>
              <div className="p-2 bg-pink-50 rounded-lg border border-pink-200">
                <div className="font-bold text-pink-700 text-xs mb-1">💍 {target.name}の恋愛・結婚スタイル</div>
                {targetBC?.恋愛結婚?.map((d,i) => <div key={i} className="text-xs text-pink-800 mb-0.5">・{d}</div>)}
              </div>
            </div>
          )}

          {/* 心理タブ */}
          {pairTab==="psychology" && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-bold">{target.name}の深層心理</div>
              {targetBC?.心理?.map((d,i) => (
                <div key={i} className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg text-xs text-blue-800">{d}</div>
              ))}
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700 text-xs mb-1">🔋 愛情バッテリーの充電方法</div>
                <div className="text-xs text-gray-700">
                  {target.blood==="O"?"みんなに必要とされること・一緒に過ごす時間":target.blood==="A"?"認められること・褒められること":target.blood==="B"?"自分が楽しいことをすること":"一人の時間・自分の世界に浸ること"}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700 text-xs mb-1">🗑️ 心のゴミ処理パターン</div>
                <div className="text-xs text-gray-700">
                  {target.blood==="O"?"自己処理できるが限界あり。飲み会・運動・泣くことで発散":target.blood==="A"?"ゴミが多い。愚痴・相談で他者に処理させる。溜まると体調不良":target.blood==="B"?"ゴミが少ない。甘えて即処理。すぐ切り替わる":"一人で完全自己処理。でも限界で大爆発"}
                </div>
              </div>
            </div>
          )}

          {/* メッセージ変換タブ */}
          {pairTab==="msg" && tips && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 font-bold">{target.name}向け メッセージ変換</div>
              <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-xs space-y-1">
                <div><span className="font-bold text-yellow-800">スタイル：</span><span className="text-yellow-700">{tips.style}</span></div>
                <div><span className="font-bold text-red-700">避ける言葉：</span><span className="text-red-600">{tips.avoid}</span></div>
              </div>
              <MsgConverter tips={tips} targetLabel={target.name} />
            </div>
          )}

          {/* 年代タブ */}
          {pairTab==="age" && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-bold">{target.name} の年代別特性</div>
              {nendai ? (
                <>
                  <div className="p-3 rounded-lg text-white" style={{backgroundColor:targetBC?.color}}>
                    <div className="font-bold">{target.blood}型 {target.age}：{nendai.title}</div>
                  </div>
                  {nendai.traits.map((t,i) => <div key={i} className="p-2 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg text-xs text-gray-700">{t}</div>)}
                  <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="font-bold text-indigo-700 text-xs mb-1">💡 この年代の{target.name}への接し方</div>
                    <div className="text-xs text-indigo-800">{nendai.approach}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  年代が登録されていません<br/>
                  <span className="text-xs">「登録」タブで年代を設定してください</span>
                </div>
              )}
              {/* 全年代一覧 */}
              <div className="mt-2">
                <div className="text-xs font-bold text-gray-500 mb-1">{target.blood}型 全年代まとめ</div>
                {["10代","20代","30代","40代","50代","60代","70代"].map(a => {
                  const d = NENDAI[target.blood]?.[a];
                  return <div key={a} className={`flex items-center gap-2 p-1.5 rounded mb-1 text-xs ${target.age===a?"bg-indigo-50 border border-indigo-200":"bg-gray-50"}`}>
                    <span className="font-bold text-white px-1.5 py-0.5 rounded text-xs flex-shrink-0" style={{backgroundColor:targetBC?.color}}>{a}</span>
                    <span className="text-gray-700 font-bold">{d?.title}</span>
                  </div>;
                })}
              </div>
            </div>
          )}

          {/* 表/裏タブ */}
          {pairTab==="face" && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 font-bold">{target.name}の表の面 と 裏の面</div>
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                距離感によって出やすい面が変わります。<strong>表の面</strong>は距離がある時、<strong>裏の面</strong>は距離が近い・信頼関係がある時に出やすい特性です。
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-700 mb-2">😊 表の面（距離あり・初対面〜普通の関係）</div>
                {targetBC?.表の面?.map((f,i) => <div key={i} className="text-sm text-amber-800 mb-1">・{f}</div>)}
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="font-bold text-purple-700 mb-2">🌙 裏の面（距離近い・信頼関係あり）</div>
                {targetBC?.裏の面?.map((f,i) => <div key={i} className="text-sm text-purple-800 mb-1">・{f}</div>)}
              </div>
              {/* 今の関係性での距離感アドバイス */}
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-700 text-xs mb-1">📏 現在の関係性（{target.relation}）での距離感</div>
                <div className="text-xs text-blue-800">
                  {["恋人","配偶者","家族"].includes(target.relation)
                    ? `裏の面が出やすい距離感です。${target.name}の本音・弱さを理解した関わり方を意識してください。`
                    : ["友人"].includes(target.relation)
                    ? "表と裏の中間。仲良くなるにつれ裏の面が出てきます。変化に気づいて受け入れることが大切です。"
                    : "まだ表の面が出やすい距離感です。裏の面を引き出すには信頼の積み重ねが必要です。"}
                </div>
              </div>
            </div>
          )}

          {/* 段階トラッカータブ */}
          {pairTab==="stage" && (
            <div className="space-y-3">
              {target.gender !== "female" ? (
                <div className="p-4 bg-gray-50 rounded-xl text-center space-y-2">
                  <div className="text-2xl">👨</div>
                  <div className="text-sm font-bold text-gray-600">段階トラッカーは女性相手の場合に使用します</div>
                  <div className="text-xs text-gray-400">女性の心理6段階（支礎学）に基づく関係進捗の確認ツールです</div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-gray-500"><strong>{target.name}</strong>との現在の段階を選択してください</div>
                  <div className="space-y-1.5">
                    {STAGES.map(s => (
                      <button key={s.id} onClick={() => setStageNum(stageNum===s.id?null:s.id)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${stageNum===s.id?"border-current":"border-gray-200 hover:border-gray-300"}`}
                        style={stageNum===s.id?{borderColor:s.color,backgroundColor:s.color+"15"}:{}}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{s.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm" style={{color:stageNum===s.id?s.color:"#374151"}}>{s.id}. {s.label}</span>
                              {stageNum===s.id && <span className="text-xs text-white px-1.5 py-0.5 rounded-full font-bold" style={{backgroundColor:s.color}}>現在</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {stageNum && (() => {
                    const s = STAGES.find(x => x.id===stageNum);
                    const next = STAGES.find(x => x.id===stageNum+1);
                    return (
                      <div className="space-y-2 mt-1">
                        <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                          <div className="font-bold text-green-700 text-xs mb-1">✅ 次の段階へ進むには</div>
                          <div className="text-sm text-green-800">{s.next}</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                          <div className="font-bold text-red-700 text-xs mb-1">⚠️ やってはいけないこと</div>
                          <div className="text-sm text-red-800">{s.avoid}</div>
                        </div>
                        {next ? (
                          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center gap-2">
                            <span className="text-base">{next.emoji}</span>
                            <div className="text-xs text-indigo-700"><strong>次の目標：{next.label}</strong> — {next.desc}</div>
                          </div>
                        ) : (
                          <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 text-center">
                            <div className="text-xs text-purple-700 font-bold">💝 最終段階・本母性ライン到達</div>
                            <div className="text-xs text-purple-600 mt-0.5">この関係を大切に維持し続けてください</div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// シンプルなメッセージ変換コンポーネント（ペアビュー内用）
export function MsgConverter({ tips, targetLabel }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="space-y-2">
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
        rows={3}
        placeholder="伝えたい内容を入力..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        onClick={() => setResult(tips.pattern(input.trim()))}
        disabled={!input.trim()}
        className={`w-full py-2 rounded-lg font-bold text-sm ${input.trim()?"bg-indigo-600 text-white":"bg-gray-200 text-gray-400"}`}>
        {targetLabel}向けに変換 →
      </button>
      {result && (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-900 leading-relaxed">{result}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ロゴアイコン
// ─────────────────────────────────────────
