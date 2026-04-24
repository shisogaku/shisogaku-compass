import { useState } from 'react';
import { ALL_PROFILES, BC, COMPAT, COMPAT_KEY, SCENE_CATS, SCENE_DB, TONE_OPTIONS, classifyMsg, getReaction, improveMsg } from '../data.js';

export function CompatView({ profiles = [], myId = null }) {
  const [compatMode, setCompatMode] = useState("pair"); // "pair" | "group"
  const [myP, setMyP] = useState(null);
  const [tarP, setTarP] = useState(null);
  const [groupSelected, setGroupSelected] = useState([]);
  const [groupFocus, setGroupFocus] = useState(null); // {a, b} pair to show detail
  const compat = myP&&tarP ? COMPAT[COMPAT_KEY(myP.blood,tarP.blood)] : null;
  const bloods = ["O","A","B","AB"];
  const starBg = s => s>=5?"#D4EDDA":s===4?"#D0E8FF":s===3?"#FFF9C4":s===2?"#FFE0B2":"#FFCDD2";

  // group helpers
  const toggleGroup = (id) => setGroupSelected(prev =>
    prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
  );
  const groupProfiles = profiles.filter(p => groupSelected.includes(p.id));
  const groupPairs = [];
  for (let i=0;i<groupProfiles.length;i++) for (let j=i+1;j<groupProfiles.length;j++) {
    groupPairs.push([groupProfiles[i], groupProfiles[j]]);
  }
  const focusCompat = groupFocus ? COMPAT[COMPAT_KEY(groupFocus.a.blood, groupFocus.b.blood)] : null;
  const avgStars = groupPairs.length > 0
    ? (groupPairs.reduce((s,[a,b])=>s+COMPAT[COMPAT_KEY(a.blood,b.blood)].stars,0)/groupPairs.length).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      {/* モード切替 */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
        {[["pair","👥 ペア相性"],["group","🔷 グループ分析"]].map(([m,l])=>(
          <button key={m} onClick={()=>{setCompatMode(m);setGroupFocus(null);}}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${compatMode===m?"bg-white shadow text-indigo-600":"text-gray-500"}`}>{l}</button>
        ))}
      </div>

      {compatMode==="pair" && <>
        <div className="text-center text-sm font-bold text-gray-700">男女×血液型 全組み合わせ相性</div>
        {/* 4×4マトリクス */}
        <div>
          <div className="text-xs text-gray-500 mb-1 font-bold">血液型ベース相性マップ（タップで詳細）</div>
          <div className="grid grid-cols-5 gap-0.5 text-xs">
            <div/>
            {bloods.map(b=><div key={b} className="text-center font-bold py-1" style={{color:BC[b].color}}>{b}</div>)}
            {bloods.map(b1=>[
              <div key={b1+"h"} className="font-bold flex items-center justify-center" style={{color:BC[b1].color}}>{b1}</div>,
              ...bloods.map(b2=>{
                const k=COMPAT_KEY(b1,b2); const c=COMPAT[k];
                return <div key={b1+b2} className="h-12 cursor-pointer rounded flex flex-col items-center justify-center text-center p-0.5"
                  style={{backgroundColor:starBg(c.stars)}}
                  onClick={()=>{const p1=ALL_PROFILES.find(p=>p.blood===b1&&p.gender==="female");const p2=ALL_PROFILES.find(p=>p.blood===b2&&p.gender===(b1===b2?"male":"female"));setMyP(p1);setTarP(p2);}}>
                  <div className="text-xs font-bold">{"★".repeat(c.stars)}</div>
                  <div className="text-xs leading-tight" style={{fontSize:"9px"}}>{c.label}</div>
                </div>;
              })
            ])}
          </div>
          <div className="flex gap-2 mt-1 text-xs flex-wrap">
            {[["★★★★★","#D4EDDA","最高"],["★★★★","#D0E8FF","良好"],["★★★","#FFF9C4","普通"],["★★","#FFE0B2","注意"],["★","#FFCDD2","困難"]].map(([s,c,l])=>(
              <div key={s} className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:c}}/><span className="text-gray-500">{l}</span></div>
            ))}
          </div>
        </div>
        {/* 自分 */}
        <div>
          <div className="text-xs text-gray-500 font-bold mb-1">自分のプロフィール</div>
          <div className="grid grid-cols-4 gap-1">
            {ALL_PROFILES.map(p=><button key={p.key} onClick={()=>{setMyP(p);setTarP(null);}} className="py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
              style={myP?.key===p.key?{backgroundColor:p.color,borderColor:p.color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>{p.short}</button>)}
          </div>
        </div>
        {/* 相手 */}
        {myP&&<div>
          <div className="text-xs text-gray-500 font-bold mb-1">相手のプロフィール</div>
          <div className="grid grid-cols-4 gap-1">
            {ALL_PROFILES.filter(p=>p.key!==myP.key).map(p=><button key={p.key} onClick={()=>setTarP(p)} className="py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
              style={tarP?.key===p.key?{backgroundColor:p.color,borderColor:p.color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>{p.short}</button>)}
          </div>
        </div>}
        {/* 相性詳細 */}
        {compat&&myP&&tarP&&<div className="space-y-2">
          <div className="p-3 rounded-xl text-center" style={{background:`linear-gradient(135deg,${myP.color}22,${tarP.color}22)`,border:`1px solid ${myP.color}44`}}>
            <div className="text-sm font-bold text-gray-700">{myP.label} × {tarP.label}</div>
            <div className="text-yellow-400 text-lg">{"★".repeat(compat.stars)}{"☆".repeat(5-compat.stars)}</div>
            <div className="font-black text-lg text-gray-800">{compat.label}</div>
            <div className="text-sm text-gray-600">{compat.summary}</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="font-bold text-green-700 text-xs mb-1">✅ うまくいくポイント</div>
            {compat.good.map((g,i)=><div key={i} className="text-xs text-green-800 mb-0.5">・{g}</div>)}
          </div>
          <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="font-bold text-red-700 text-xs mb-1">⚠️ 注意が必要なポイント</div>
            {compat.care.map((c,i)=><div key={i} className="text-xs text-red-800 mb-0.5">・{c}</div>)}
          </div>
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-bold text-blue-700 text-xs mb-1">💡 関係をうまくいかせるコツ</div>
            <div className="text-xs text-blue-800">{compat.tip}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 mb-1">{myP.label} から見た全相性ランキング</div>
            {ALL_PROFILES.filter(p=>p.key!==myP.key).map(p=>({p,c:COMPAT[COMPAT_KEY(myP.blood,p.blood)]})).sort((a,b)=>b.c.stars-a.c.stars).map(({p,c})=>(
              <div key={p.key} className="flex items-center gap-2 py-1 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded" onClick={()=>setTarP(p)}>
                <div className="w-12 text-xs font-bold text-center px-1 py-0.5 rounded text-white flex-shrink-0" style={{backgroundColor:p.color}}>{p.short}</div>
                <div className="text-yellow-400 text-xs">{"★".repeat(c.stars)}</div>
                <div className="text-xs text-gray-600">{c.label}</div>
              </div>
            ))}
          </div>
        </div>}
      </>}

      {compatMode==="group" && <>
        <div className="text-center text-sm font-bold text-gray-700">グループ相性分析</div>
        <div className="text-xs text-gray-500 text-center">登録済みプロフィールから複数選択 → 全ペアの相性を分析</div>

        {profiles.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">「登録」タブでプロフィールを追加してください</div>
        ) : <>
          {/* メンバー選択 */}
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">メンバーを選択（2人以上）</div>
            <div className="space-y-1">
              {profiles.map(p=>{
                const sel = groupSelected.includes(p.id);
                const pColor = BC[p.blood].color;
                return (
                  <button key={p.id} onClick={()=>{toggleGroup(p.id);setGroupFocus(null);}}
                    className="w-full flex items-center gap-2 p-2 rounded-xl border-2 transition-all text-left"
                    style={sel?{borderColor:pColor,backgroundColor:pColor+"18"}:{borderColor:"#e5e7eb"}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{backgroundColor:pColor}}>{p.blood}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.blood}型 {p.gender==="female"?"女性":"男性"}{p.age?` ・${p.age}`:""}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel?"border-current text-white":"border-gray-300"}`}
                      style={sel?{backgroundColor:pColor,borderColor:pColor}:{}}>
                      {sel&&<span style={{fontSize:"10px"}}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {groupProfiles.length >= 2 && <>
            {/* スコアサマリー */}
            <div className="p-3 rounded-xl text-center bg-indigo-50 border border-indigo-200">
              <div className="text-xs text-indigo-500 font-bold mb-1">グループ相性スコア</div>
              <div className="text-2xl font-black text-indigo-700">⭐ {avgStars}</div>
              <div className="text-xs text-indigo-500">{groupProfiles.length}人 ・ {groupPairs.length}ペア分析</div>
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {groupProfiles.map(p=>(
                  <span key={p.id} className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                    style={{backgroundColor:BC[p.blood].color}}>{p.name}</span>
                ))}
              </div>
            </div>

            {/* 全ペア一覧 */}
            <div>
              <div className="text-xs text-gray-500 font-bold mb-1">全ペア相性（タップで詳細）</div>
              <div className="space-y-1">
                {groupPairs.map(([a,b],idx)=>{
                  const c=COMPAT[COMPAT_KEY(a.blood,b.blood)];
                  const focused = groupFocus && groupFocus.a.id===a.id && groupFocus.b.id===b.id;
                  return (
                    <div key={idx}>
                      <div onClick={()=>setGroupFocus(focused?null:{a,b})}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all"
                        style={{backgroundColor:starBg(c.stars), borderColor: focused?"#6366f1":"transparent"}}>
                        <div className="flex items-center gap-1 flex-1">
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{backgroundColor:BC[a.blood].color}}>{a.name}</span>
                          <span className="text-xs text-gray-400">×</span>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{backgroundColor:BC[b.blood].color}}>{b.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-yellow-500 text-xs">{"★".repeat(c.stars)}</span>
                          <span className="text-xs text-gray-600 font-bold">{c.label}</span>
                        </div>
                      </div>
                      {focused && focusCompat && (
                        <div className="ml-2 mt-1 space-y-1 pb-1">
                          <div className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-indigo-100">{focusCompat.summary}</div>
                          <div className="text-xs text-green-700 bg-green-50 rounded-lg p-2 border border-green-200">
                            <span className="font-bold">✅ Good: </span>{focusCompat.good[0]}
                          </div>
                          <div className="text-xs text-red-700 bg-red-50 rounded-lg p-2 border border-red-200">
                            <span className="font-bold">⚠️ Care: </span>{focusCompat.care[0]}
                          </div>
                          <div className="text-xs text-blue-700 bg-blue-50 rounded-lg p-2 border border-blue-200">
                            <span className="font-bold">💡 </span>{focusCompat.tip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 最高・最低ペア */}
            {groupPairs.length >= 2 && (()=>{
              const sorted = [...groupPairs].map(([a,b])=>({a,b,c:COMPAT[COMPAT_KEY(a.blood,b.blood)]})).sort((x,y)=>y.c.stars-x.c.stars);
              const best=sorted[0]; const worst=sorted[sorted.length-1];
              return (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-green-50 rounded-lg border border-green-300 text-center">
                    <div className="text-xs font-bold text-green-700 mb-1">🏆 最高相性ペア</div>
                    <div className="text-xs font-bold text-gray-700">{best.a.name}×{best.b.name}</div>
                    <div className="text-yellow-400 text-sm">{"★".repeat(best.c.stars)}</div>
                    <div className="text-xs text-green-600">{best.c.label}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg border border-red-300 text-center">
                    <div className="text-xs font-bold text-red-700 mb-1">⚡ 要注意ペア</div>
                    <div className="text-xs font-bold text-gray-700">{worst.a.name}×{worst.b.name}</div>
                    <div className="text-yellow-400 text-sm">{"★".repeat(worst.c.stars)}</div>
                    <div className="text-xs text-red-600">{worst.c.label}</div>
                  </div>
                </div>
              );
            })()}
          </>}
        </>}
      </>}
    </div>
  );
}

// ─────────────────────────────────────────
// 年代別ビュー
// ─────────────────────────────────────────
export function SceneView({ profiles = [], myId = null }) {
  const [selScene, setSelScene] = useState(null);
  const [selBlood, setSelBlood] = useState(null);
  const [selGender, setSelGender] = useState(null);
  const [cat, setCat] = useState("all");

  const allKeys = Object.keys(SCENE_DB);
  const filteredKeys = SCENE_CATS[cat].keys
    ? allKeys.filter(k => SCENE_CATS[cat].keys.includes(k))
    : allKeys;

  const currentScene = selScene ? SCENE_DB[selScene] : null;
  const genderLock = currentScene?.genderLock || null;
  const effectiveGender = genderLock || selGender;
  const targetKey = selBlood && effectiveGender ? `${selBlood}型${effectiveGender==="female"?"女性":"男性"}` : null;
  const tip = selScene && targetKey ? SCENE_DB[selScene]?.tips[targetKey] : null;

  // 登録済み相手（自分以外）
  const others = profiles.filter(p => p.id !== myId);
  const selectProfile = (p) => { setSelBlood(p.blood); setSelGender(p.gender); };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-700">シーン別コミュニケーション術</div>
        <div className="text-xs text-gray-400">場面×血液型で最適なアプローチを確認</div>
      </div>

      {/* 登録済み相手クイック選択 */}
      {others.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 font-bold mb-1">📋 登録済みの相手から選ぶ</div>
          <div className="flex flex-wrap gap-1">
            {others.map(p => {
              const active = selBlood===p.blood && selGender===p.gender;
              return (
                <button key={p.id} onClick={() => selectProfile(p)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border-2 transition-all"
                  style={active ? {backgroundColor:BC[p.blood].color,borderColor:BC[p.blood].color,color:"white"} : {borderColor:"#e5e7eb",color:"#374151"}}>
                  <span className="w-4 h-4 rounded-full inline-block flex-shrink-0" style={{backgroundColor:BC[p.blood].color}}/>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* カテゴリタブ */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">カテゴリ</div>
        <div className="flex gap-1 overflow-x-auto pb-0.5" style={{scrollbarWidth:"none"}}>
          {Object.entries(SCENE_CATS).map(([k,v]) => (
            <button key={k} onClick={() => { setCat(k); setSelScene(null); }}
              className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-bold border-2 transition-all ${cat===k?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-200 text-gray-600"}`}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* シーン一覧 */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">シーンを選ぶ（{filteredKeys.length}件）</div>
        <div className="grid grid-cols-4 gap-1">
          {filteredKeys.map(k => (
            <button key={k} onClick={() => setSelScene(k)}
              className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${selScene===k?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              <span className="text-base">{SCENE_DB[k].icon}</span>
              <span style={{fontSize:"9px"}} className="text-center leading-tight">{SCENE_DB[k].label.length > 6 ? SCENE_DB[k].label.slice(0,6)+"…" : SCENE_DB[k].label}</span>
            </button>
          ))}
        </div>
      </div>

      {selScene && (
        <>
          <div className="text-xs text-center text-indigo-600 font-bold bg-indigo-50 py-1.5 rounded-lg">
            {SCENE_DB[selScene].icon} {SCENE_DB[selScene].label}
          </div>
          {/* 手動選択 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-500 font-bold mb-1">
                相手の性別{genderLock && <span className="ml-1 text-indigo-500">（このシーンは{genderLock==="female"?"女性":"男性"}固定）</span>}
              </div>
              <div className="flex gap-1">
                {[{id:"female",label:"👩女性"},{id:"male",label:"👨男性"}]
                  .filter(g => !genderLock || g.id === genderLock)
                  .map(g => {
                    const isActive = effectiveGender === g.id;
                    return (
                      <button key={g.id} onClick={() => !genderLock && setSelGender(g.id)}
                        disabled={!!genderLock}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${isActive?"border-indigo-500 bg-indigo-100 text-indigo-700":"border-gray-200 text-gray-600"} ${genderLock?"cursor-default":""}`}>
                        {g.label}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold mb-1">相手の血液型</div>
              <div className="grid grid-cols-4 gap-0.5">
                {["O","A","B","AB"].map(b => (
                  <button key={b} onClick={() => setSelBlood(b)}
                    className="py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                    style={selBlood===b?{backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {tip ? (
            <div className="space-y-3">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-700 text-sm">{targetKey}への「{SCENE_DB[selScene].label}」のコツ</div>
                <div className="text-sm text-gray-800 leading-relaxed">{tip.text}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200 space-y-2">
                <div className="text-xs font-bold text-green-700">💬 例文</div>
                <div className="text-sm text-gray-800 italic bg-white rounded p-2 border border-green-200">"{tip.example}"</div>
                <button onClick={() => navigator.clipboard?.writeText(tip.example)}
                  className="w-full py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700">
                  📋 例文をコピー
                </button>
              </div>
            </div>
          ) : !selBlood || !effectiveGender ? (
            <div className="text-center text-gray-400 text-xs py-4">
              {genderLock ? "血液型を選ぶとガイドが表示されます" : "性別と血液型を選ぶとガイドが表示されます"}
            </div>
          ) : null}
        </>
      )}
      {!selScene && <div className="text-center text-gray-400 text-xs py-4">シーンを選んでください</div>}
    </div>
  );
}

// ─────────────────────────────────────────
// メッセージ反応シミュレーター データ
// ─────────────────────────────────────────

// メッセージの意図を分類するキーワード
// 血液型×性別×関係性×メッセージタイプ → 反応データ
// ─────────────────────────────────────────
// 反応シミュレーターメインビュー
// ─────────────────────────────────────────
export function SimulateView({ profiles, myId }) {
  const [simTab, setSimTab] = useState("simulate");
  const [targetId, setTargetId] = useState(null);
  const [inputMsg, setInputMsg] = useState("");
  const [tone, setTone] = useState("普通");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const me = profiles.find(p => p.id === myId);
  const target = profiles.find(p => p.id === targetId);
  const others = profiles.filter(p => p.id !== myId);

  const simulate = () => {
    if (!target || !inputMsg.trim()) return;
    const targetLabel = `${target.blood}型${target.gender === "female" ? "女性" : "男性"}`;
    const msgType = classifyMsg(inputMsg);
    const reaction = getReaction(targetLabel, msgType, target.relation);
    const improved = improveMsg(inputMsg, targetLabel, msgType, tone);
    const res = { msgType, reaction, improved, targetLabel, tone };
    setResult(res);
    setHistory(prev => [{ ...res, original: inputMsg, targetName: target.name, blood: target.blood, ts: new Date().toLocaleTimeString("ja-JP") }, ...prev.slice(0, 19)]);
  };

  const tendency = (() => {
    if (history.length < 2) return null;
    const byBlood = {};
    history.forEach(h => {
      if (!byBlood[h.blood]) byBlood[h.blood] = { total: 0, count: 0 };
      byBlood[h.blood].total += h.reaction.score;
      byBlood[h.blood].count += 1;
    });
    return Object.entries(byBlood).map(([b, v]) => ({ blood: b, avg: Math.round(v.total / v.count), count: v.count })).sort((a, b) => b.avg - a.avg);
  })();

  const msgFreq = (() => {
    if (history.length < 2) return null;
    const freq = {};
    history.forEach(h => { freq[h.msgType] = (freq[h.msgType] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  })();

  const SIM_TABS = [
    { id: "simulate", label: "シミュ", icon: "🎯" },
    { id: "history",  label: "履歴",  icon: "📝" },
    { id: "tendency", label: "傾向",  icon: "📊" },
  ];

  const ScoreBar = ({ score, label }) => {
    const color = score >= 80 ? "#22c55e" : score >= 55 ? "#eab308" : score >= 30 ? "#f97316" : "#ef4444";
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{label}</span>
          <span className="font-bold" style={{color}}>{score}点</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-500" style={{width:`${score}%`, backgroundColor:color}}/>
        </div>
      </div>
    );
  };

  if (!me) return (
    <div className="text-center py-12 space-y-2">
      <div className="text-4xl">👤</div>
      <div className="font-bold text-gray-700">「登録」タブで自分を登録してください</div>
    </div>
  );

  if (others.length === 0) return (
    <div className="text-center py-12 space-y-2">
      <div className="text-4xl">👥</div>
      <div className="font-bold text-gray-700">「登録」タブで相手を追加してください</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-700">送る前に反応をシミュレート</div>
        <div className="text-xs text-gray-400 mt-0.5">メッセージを入力→相手の反応を体験してから送る</div>
      </div>

      {/* サブタブ */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-100 rounded-lg p-0.5">
        {SIM_TABS.map(t => (
          <button key={t.id} onClick={() => setSimTab(t.id)}
            className={`py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all ${simTab===t.id?"bg-white shadow text-indigo-600":"text-gray-500"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
            {t.id==="history" && history.length > 0 && (
              <span className="bg-indigo-500 text-white rounded-full px-1" style={{fontSize:"9px"}}>{history.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── シミュタブ ── */}
      {simTab==="simulate" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">相手を選ぶ</div>
            <div className="flex flex-wrap gap-1">
              {others.map(p => {
                const bc = BC[p.blood];
                return (
                  <button key={p.id} onClick={() => { setTargetId(p.id); setResult(null); }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all"
                    style={targetId===p.id?{backgroundColor:bc.color,borderColor:bc.color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>
                    <span>{p.name}</span>
                    <span className="opacity-75">{p.blood}型{p.gender==="female"?"♀":"♂"}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">送りたいメッセージ（そのまま入力）</div>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-indigo-400 transition-colors"
              rows={3}
              placeholder={"例：あなたとデートしたい\n例：明日の資料お願いできる？\n例：いつも頼りにしてます"}
              value={inputMsg}
              onChange={e => { setInputMsg(e.target.value); setResult(null); }}
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">送り方のトーン</div>
            <div className="grid grid-cols-3 gap-1.5">
              {TONE_OPTIONS.map(t => (
                <button key={t.id} onClick={() => { setTone(t.id); setResult(null); }}
                  className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl border-2 text-xs font-bold transition-all ${tone===t.id?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-200 text-gray-500 bg-white"}`}>
                  <span className="text-base">{t.icon}</span>
                  <span>{t.label}</span>
                  <span className="text-gray-400 font-normal" style={{fontSize:"9px"}}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={simulate} disabled={!targetId||!inputMsg.trim()}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${targetId&&inputMsg.trim()?"bg-indigo-600 text-white hover:bg-indigo-700 shadow-md":"bg-gray-200 text-gray-400"}`}>
            {target?`${target.name}の反応をシミュレート →`:"相手を選んでください"}
          </button>
          {result && target && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">分類：<strong>{result.msgType}</strong></span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">関係：<strong>{target.relation}</strong></span>
              </div>
              <div className="p-4 rounded-2xl border-2 space-y-3"
                style={{background:result.reaction.score>=70?"#f0fdf4":result.reaction.score>=40?"#fffbeb":"#fef2f2",
                        borderColor:result.reaction.score>=70?"#86efac":result.reaction.score>=40?"#fde68a":"#fca5a5"}}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{result.reaction.emoji}</span>
                  <div>
                    <div className="font-bold text-sm text-gray-800">{target.name}の予測反応</div>
                    <div className="text-xs text-gray-500">（{result.targetLabel} / {target.relation}）</div>
                  </div>
                </div>
                <div className="text-sm text-gray-800 font-medium bg-white rounded-lg p-2 border border-gray-200">"{result.reaction.react}"</div>
                <ScoreBar score={result.reaction.score} label="このまま送った場合の効果" />
                {result.reaction.warn && (
                  <div className="flex items-center gap-1.5 p-2 bg-red-50 rounded-lg border border-red-200">
                    <span>⚠️</span><span className="text-xs text-red-700 font-bold">{result.reaction.warn}</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="font-bold text-blue-700 text-xs mb-1">💭 なぜそう反応するか（支礎学の理由）</div>
                <div className="text-sm text-blue-800">{result.reaction.why}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-green-700 text-sm">✨ {target.name}に響く改善版</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{background: result.tone==="フランク"?"#fef9c3":result.tone==="丁寧"?"#ede9fe":"#e0f2fe",
                            color:    result.tone==="フランク"?"#a16207":result.tone==="丁寧"?"#6d28d9":"#0369a1"}}>
                    {TONE_OPTIONS.find(t=>t.id===result.tone)?.icon} {result.tone}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200 text-sm text-gray-800 leading-relaxed">{result.improved.converted}</div>
                <ScoreBar score={Math.min(result.reaction.score+35,98)} label="改善版の推定効果" />
                {result.improved.hint && (
                  <div className="text-xs text-green-700 bg-green-100 p-2 rounded-lg">💡 <strong>さらに響かせるコツ：</strong>{result.improved.hint}</div>
                )}
                <button onClick={() => navigator.clipboard?.writeText(result.improved.converted)}
                  className="w-full py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700">
                  📋 改善版をコピー
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                  <div className="text-gray-500">そのまま送ると</div>
                  <div className="font-bold text-lg" style={{color:result.reaction.score>=70?"#22c55e":result.reaction.score>=40?"#eab308":"#ef4444"}}>{result.reaction.score}点</div>
                  <div className="text-gray-400">{result.reaction.score>=70?"良好":result.reaction.score>=40?"注意":"リスクあり"}</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-center border border-green-200">
                  <div className="text-gray-500">改善版なら</div>
                  <div className="font-bold text-lg text-green-600">{Math.min(result.reaction.score+35,98)}点</div>
                  <div className="text-green-500">効果アップ</div>
                </div>
              </div>
              {others.length > 1 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1">同じメッセージを他の人に送ると…</div>
                  {others.filter(p=>p.id!==target.id).map(p => {
                    const pl=`${p.blood}型${p.gender==="female"?"女性":"男性"}`;
                    const r=getReaction(pl,result.msgType,p.relation);
                    if(!r) return null;
                    return (
                      <div key={p.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{backgroundColor:BC[p.blood].color}}>{p.blood}</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-gray-700">{p.name}</div>
                          <div className="text-xs text-gray-500">{r.emoji} {r.react.substring(0,25)}…</div>
                        </div>
                        <div className="text-xs font-bold" style={{color:r.score>=70?"#22c55e":r.score>=40?"#eab308":"#ef4444"}}>{r.score}点</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 履歴タブ ── */}
      {simTab==="history" && (
        <div className="space-y-2">
          {history.length===0 ? (
            <div className="text-center text-gray-400 text-sm py-8">シミュレートすると履歴が記録されます</div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-gray-600">過去のシミュレーション（{history.length}件）</div>
                <button onClick={() => setHistory([])} className="text-xs text-red-400 border border-red-200 px-2 py-0.5 rounded">クリア</button>
              </div>
              {history.map((h,i) => (
                <div key={i} className="p-3 rounded-xl border border-gray-200 space-y-1.5"
                  style={{borderLeft:`3px solid ${BC[h.blood]?.color||"#94a3b8"}`}}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs" style={{color:BC[h.blood]?.color}}>{h.targetName}</span>
                      <span className="text-xs text-gray-400">{h.msgType}</span>
                    </div>
                    <span className="text-xs text-gray-400">{h.ts}</span>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded p-1.5 italic">"{h.original}"</div>
                  <div className="flex gap-3 text-xs">
                    <span>{h.reaction.emoji} {h.reaction.score}点</span>
                    <span className="text-green-600">→ 改善: {Math.min(h.reaction.score+35,98)}点</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── 傾向タブ ── */}
      {simTab==="tendency" && (
        <div className="space-y-3">
          {history.length < 2 ? (
            <div className="text-center text-gray-400 text-sm py-8">2件以上シミュレートすると傾向が分析されます</div>
          ) : (
            <>
              <div className="text-xs font-bold text-gray-600 text-center">あなたのコミュニケーション傾向</div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-600">血液型別 平均スコア（高い＝伝わりやすい）</div>
                {tendency?.map(({blood,avg,count}) => {
                  const col=avg>=70?"#22c55e":avg>=50?"#eab308":"#ef4444";
                  return (
                    <div key={blood} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold" style={{color:BC[blood]?.color}}>{blood}型（{count}回）</span>
                        <span className="font-bold" style={{color:col}}>{avg}点</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{width:`${avg}%`,backgroundColor:col}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              {msgFreq && (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1.5">
                  <div className="text-xs font-bold text-indigo-700">よく使うメッセージパターン</div>
                  {msgFreq.map(([type,count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="text-gray-700">{type}</span>
                      <span className="text-gray-500">{count}回</span>
                    </div>
                  ))}
                </div>
              )}
              {tendency && (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="text-xs font-bold text-yellow-700 mb-1">💡 あなたへのアドバイス</div>
                  <div className="text-xs text-gray-700">
                    {tendency[0] && `${tendency[0].blood}型への伝わりやすさが高い（平均${tendency[0].avg}点）。`}
                    {tendency[tendency.length-1]?.avg<50 && ` ${tendency[tendency.length-1].blood}型へのコミュニケーションはさらに工夫が必要かもしれません。`}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// レーダーチャート データ & コンポーネント
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// レベルアップ ノウハウ（弱点軸ごとの改善メソッド）
// ─────────────────────────────────────────

