import { useState } from 'react';
import { ALL_PROFILES, BC, CATS, FEMALE_STAGES, GS, MSG_TIPS, NENDAI } from '../data.js';

export function NendaiView() {
  const [selBlood, setSelBlood] = useState("O");
  const [selAge, setSelAge] = useState("20代");
  const ages = ["10代","20代","30代","40代","50代","60代","70代"];
  const data = NENDAI[selBlood]?.[selAge];
  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-bold text-gray-700">年代別 行動・性格特性</div>
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">血液型</div>
        <div className="grid grid-cols-4 gap-1">
          {["O","A","B","AB"].map(b=><button key={b} onClick={()=>setSelBlood(b)} className="py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
            style={selBlood===b?{backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>{b}型</button>)}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">年代</div>
        <div className="flex gap-1">
          {ages.map(a=><button key={a} onClick={()=>setSelAge(a)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${selAge===a?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-200 text-gray-600"}`}>{a}</button>)}
        </div>
      </div>
      {data&&<div className="space-y-3">
        <div className="p-3 rounded-lg text-white" style={{backgroundColor:BC[selBlood].color}}>
          <div className="font-bold text-lg">{selBlood}型 {selAge}</div>
          <div className="text-sm opacity-90">{data.title}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-bold text-sm text-gray-700 mb-2">この時期の特徴</div>
          {data.traits.map((t,i)=><div key={i} className="text-sm text-gray-700 mb-1 flex items-start gap-1"><span className="text-gray-400 flex-shrink-0">•</span><span>{t}</span></div>)}
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="font-bold text-sm text-indigo-700 mb-1">💡 このフェーズへの接し方</div>
          <div className="text-sm text-indigo-800">{data.approach}</div>
        </div>
      </div>}
      {/* 全年代比較 */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">{selBlood}型 全年代タイトル一覧</div>
        <div className="space-y-1">
          {ages.map(a=>{const d=NENDAI[selBlood]?.[a]; return(
            <div key={a} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selAge===a?"bg-indigo-100":"bg-gray-50 hover:bg-gray-100"}`} onClick={()=>setSelAge(a)}>
              <span className="text-xs font-bold w-10 text-center rounded px-1 py-0.5 text-white" style={{backgroundColor:BC[selBlood].color}}>{a}</span>
              <span className="text-sm font-bold text-gray-700">{d?.title}</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// メッセージ変換ビュー
// ─────────────────────────────────────────
export function HenkanView() {
  const [targetKey, setTargetKey] = useState(null);
  const [inputMsg, setInputMsg] = useState("");
  const [result, setResult] = useState("");

  const target = ALL_PROFILES.find(p=>p.key===targetKey);
  const tips = target ? MSG_TIPS[target.label] : null;

  const convert = () => {
    if (!tips || !inputMsg.trim()) return;
    setResult(tips.pattern(inputMsg.trim()));
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-bold text-gray-700">メッセージ変換ツール</div>
      <div className="text-xs text-gray-500 text-center">送りたい内容を入力→相手の血液型×性別に合わせて変換</div>
      {/* 相手選択 */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">相手の血液型×性別</div>
        <div className="grid grid-cols-4 gap-1">
          {ALL_PROFILES.map(p=><button key={p.key} onClick={()=>{setTargetKey(p.key);setResult("");}} className="py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
            style={targetKey===p.key?{backgroundColor:p.color,borderColor:p.color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>{p.short}</button>)}
        </div>
      </div>
      {/* ガイダンス */}
      {tips&&<div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-xs space-y-1">
        <div><span className="font-bold text-yellow-800">スタイル：</span><span className="text-yellow-700">{tips.style}</span></div>
        <div><span className="font-bold text-red-700">避ける言葉：</span><span className="text-red-600">{tips.avoid}</span></div>
      </div>}
      {/* 入力 */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">伝えたい内容（元のメッセージ）</div>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
          rows={4}
          placeholder="例：明日の資料を準備しておいてください"
          value={inputMsg}
          onChange={e=>setInputMsg(e.target.value)}
        />
      </div>
      <button
        onClick={convert}
        disabled={!targetKey||!inputMsg.trim()}
        className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${targetKey&&inputMsg.trim()?"bg-indigo-600 text-white hover:bg-indigo-700":"bg-gray-200 text-gray-400"}`}
      >
        変換する →
      </button>
      {/* 結果 */}
      {result&&<div>
        <div className="text-xs text-gray-500 font-bold mb-1">変換後メッセージ（{target?.label}向け）</div>
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-900 leading-relaxed">{result}</div>
        <button onClick={()=>navigator.clipboard?.writeText(result)} className="mt-1 text-xs text-indigo-500 hover:text-indigo-700">📋 コピー</button>
      </div>}
      {/* 各タイプの変換ポイント早見表 */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">全タイプ 変換ポイント早見表</div>
        <div className="space-y-1">
          {ALL_PROFILES.map(p=>{const t=MSG_TIPS[p.label]; return(
            <div key={p.key} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg text-xs">
              <span className="font-bold text-white text-center px-1 py-0.5 rounded flex-shrink-0 w-10" style={{backgroundColor:p.color}}>{p.short}</span>
              <span className="text-gray-700">{t?.style}</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// XYマップビュー
// ─────────────────────────────────────────
export function MapView({blood,gender,setBlood,setView}) {
  const svgW=340,svgH=300,cx=170,cy=150,sc=1.15;
  const bloods=["O","A","B","AB"];
  return (
    <div className="w-full">
      <div className="text-center text-sm font-bold text-gray-700 mb-1">支礎学 XY軸マップ</div>
      <div className="text-center text-xs text-gray-400 mb-2">X：攻撃性(左)↔消極性(右)　Y：自己主張性(下)↔社会従属性(上)</div>
      <svg width={svgW} height={svgH} className="mx-auto border rounded-lg bg-gray-50">
        <rect x={cx} y={0} width={cx} height={cy} fill="#FFE4E1" opacity="0.3"/>
        <rect x={0} y={0} width={cx} height={cy} fill="#E3F2FD" opacity="0.3"/>
        <rect x={cx} y={cy} width={cx} height={cy} fill="#F3E5F5" opacity="0.3"/>
        <rect x={0} y={cy} width={cx} height={cy} fill="#FFF8E1" opacity="0.3"/>
        <line x1={cx} y1={8} x2={cx} y2={svgH-8} stroke="#bbb" strokeWidth="1"/>
        <line x1={8} y1={cy} x2={svgW-8} y2={cy} stroke="#bbb" strokeWidth="1"/>
        <text x={cx+4} y={18} fontSize="9" fill="#888">消極性</text>
        <text x={8} y={18} fontSize="9" fill="#888">攻撃性</text>
        <text x={cx+4} y={svgH-4} fontSize="9" fill="#888">自己主張性▼</text>
        <text x={cx+4} y={cy-4} fontSize="9" fill="#888">社会従属性▲</text>
        {bloods.map(b=>{
          const d=BC[b];
          const xy=gender==="female"?d.xy_f:d.xy_m;
          const px=cx+(xy.x*sc), py=cy-(xy.y*sc);
          const sel=blood===b;
          return <g key={b} onClick={()=>{setBlood(b);setView("detail");}} style={{cursor:"pointer"}}>
            <circle cx={px} cy={py} r={sel?19:14} fill={d.color} opacity={sel?1:0.65} stroke={sel?"#333":"none"} strokeWidth="2"/>
            <text x={px} y={py+4} textAnchor="middle" fontSize={sel?12:10} fontWeight="bold" fill="white">{b}</text>
          </g>;
        })}
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        {[["A型（左上）","攻撃的・社会従属性高","#3F51B5"],["O型（右上）","消極的・社会従属性高","#E91E8C"],["B型（左下）","攻撃的・自己主張性高","#FF9800"],["AB型（右下）","消極的・自己主張性高","#9C27B0"]].map(([t,s,c])=>(
          <div key={t} className="flex items-start gap-1"><div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{backgroundColor:c}}/><div><div className="font-bold text-gray-700">{t}</div><div className="text-gray-500">{s}</div></div></div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
        <strong>女性の心理段階：</strong>信頼→気になる→心配→ドキドキ→独占欲→本母性（制約=愛情）
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 力関係ビュー
// ─────────────────────────────────────────
export function PowerView({ profiles = [] }) {
  const [timerBlood, setTimerBlood] = useState(null);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const COOL = { O:{label:"O型",sec:172800,desc:"蓄積型爆発。最低2日の冷却期間が必要",color:"#E91E8C"}, A:{label:"A型",sec:14400,desc:"言語化型。数時間〜半日で落ち着く",color:"#3F51B5"}, B:{label:"B型",sec:3600,desc:"即爆発・即忘れ。1〜2時間で収束",color:"#FF9800"}, AB:{label:"AB型",sec:86400,desc:"内側で処理。無言期間が1〜2日続く",color:"#9C27B0"} };
  const startTimer = (b) => { setTimerBlood(b); setTimerSec(COOL[b].sec); setTimerRunning(true); };
  const fmtTime = s => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60; return h>0?`${h}時間${m}分`:`${m}分${ss}秒`; };
  useState(() => { if(!timerRunning) return; const id=setInterval(()=>setTimerSec(p=>{if(p<=1){setTimerRunning(false);return 0;}return p-1;}),1000); return ()=>clearInterval(id); });

  // XYマップ用データ
  const W=300,H=260,CX=W/2,CY=H/2,R=110;
  const toSvg = (xy) => ({ sx: CX + (xy.x/100)*R, sy: CY - (xy.y/100)*R });
  const plotProfiles = profiles.map(p => {
    const bc = BC[p.blood];
    const xy = p.gender==="female" ? bc.xy_f : bc.xy_m;
    const {sx,sy} = toSvg(xy);
    return {...p, sx, sy, color: bc.color};
  });
  // 血液型デフォルト点
  const defaultPoints = ["O","A","B","AB"].flatMap(b=>[
    {key:`${b}f`,label:`${b}♀`,sx:toSvg(BC[b].xy_f).sx,sy:toSvg(BC[b].xy_f).sy,color:BC[b].color,dim:true},
    {key:`${b}m`,label:`${b}♂`,sx:toSvg(BC[b].xy_m).sx,sy:toSvg(BC[b].xy_m).sy,color:BC[b].color,dim:true},
  ]);

  return (
    <div className="w-full space-y-4">
      <div className="text-center font-bold text-gray-700">4者の力関係 ＋ 深層情報</div>

      {/* XYマップ */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-1">🗺️ XYポジションマップ</div>
        <div className="text-xs text-gray-400 mb-2">X軸：攻撃性（左）↔ 消極性（右）　Y軸：社会従属性（上）↔ 自己主張性（下）</div>
        <svg width={W} height={H} className="mx-auto block bg-gray-50 rounded-xl border border-gray-200">
          {/* グリッド */}
          <line x1={CX} y1={8} x2={CX} y2={H-8} stroke="#e5e7eb" strokeWidth="1"/>
          <line x1={8} y1={CY} x2={W-8} y2={CY} stroke="#e5e7eb" strokeWidth="1"/>
          {/* 象限ラベル */}
          <text x={18} y={22} fontSize="8" fill="#94a3b8">攻撃的・社会従属</text>
          <text x={W-18} y={22} fontSize="8" fill="#94a3b8" textAnchor="end">消極的・社会従属</text>
          <text x={18} y={H-10} fontSize="8" fill="#94a3b8">攻撃的・自己主張</text>
          <text x={W-18} y={H-10} fontSize="8" fill="#94a3b8" textAnchor="end">消極的・自己主張</text>
          {/* 軸ラベル */}
          <text x={CX} y={14} fontSize="8" fill="#6b7280" textAnchor="middle">社会従属性↑</text>
          <text x={CX} y={H-2} fontSize="8" fill="#6b7280" textAnchor="middle">↓自己主張性</text>
          <text x={12} y={CY+4} fontSize="8" fill="#6b7280">←攻撃性</text>
          <text x={W-10} y={CY+4} fontSize="8" fill="#6b7280" textAnchor="end">消極性→</text>
          {/* デフォルト点（薄い） */}
          {defaultPoints.map(p=>(
            <g key={p.key}>
              <circle cx={p.sx} cy={p.sy} r={5} fill={p.color} opacity={0.18}/>
              <text x={p.sx} y={p.sy-7} fontSize="7" fill={p.color} textAnchor="middle" opacity={0.5}>{p.label}</text>
            </g>
          ))}
          {/* 登録プロフィール */}
          {plotProfiles.map((p,i)=>(
            <g key={p.id||i}>
              <circle cx={p.sx} cy={p.sy} r={9} fill={p.color} stroke="white" strokeWidth="1.5" opacity={0.9}/>
              <text x={p.sx} y={p.sy+3} fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">{p.name?.charAt(0)||"?"}</text>
              <text x={p.sx} y={p.sy+18} fontSize="7" fill={p.color} textAnchor="middle" fontWeight="bold">{p.name}</text>
            </g>
          ))}
          {plotProfiles.length===0&&(
            <text x={CX} y={CY+4} fontSize="10" fill="#d1d5db" textAnchor="middle">プロフィールを登録するとここに表示されます</text>
          )}
        </svg>
        <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
          {["O","A","B","AB"].map(b=>(
            <span key={b} className="text-xs px-2 py-0.5 rounded-full text-white font-bold" style={{backgroundColor:BC[b].color}}>{b}型</span>
          ))}
        </div>
      </div>

      {/* 心のゴミ冷却タイマー */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-1">⏱️ 怒り冷却タイマー</div>
        <div className="text-xs text-gray-400 mb-2">爆発した血液型を選ぶと「話しかけて大丈夫になるまで」のカウントダウンを開始</div>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {["O","A","B","AB"].map(b=>(
            <button key={b} onClick={()=>startTimer(b)}
              className="py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{backgroundColor: timerBlood===b?"opacity-100":BC[b].color, opacity: timerBlood && timerBlood!==b?0.5:1, backgroundColor:BC[b].color}}>
              {b}型
            </button>
          ))}
        </div>
        {timerBlood && (()=>{
          const total = COOL[timerBlood].sec;
          const progress = total > 0 ? timerSec / total : 0;
          const col = COOL[timerBlood].color;
          const RC = 52, circ = 2*Math.PI*RC;
          const done = timerSec === 0;
          // フェーズ判定
          const phase = done
            ? { emoji:"😊", label:"話しかけてOK！", color:"#22c55e" }
            : progress > 0.7
            ? { emoji:"🔥", label:"まだ冷却中",       color:"#ef4444" }
            : progress > 0.4
            ? { emoji:"😠", label:"少し落ち着いてきた", color:"#f97316" }
            : { emoji:"😐", label:"そろそろ話せる",    color:"#eab308" };
          return (
            <div className="p-4 rounded-2xl border-2 text-center" style={{borderColor:col,backgroundColor:col+"0d"}}>
              <div className="text-xs font-bold mb-2" style={{color:col}}>{COOL[timerBlood].label} — {COOL[timerBlood].desc}</div>
              {/* 円形プログレス */}
              <div className="flex justify-center mb-2">
                <svg width={130} height={130}>
                  {/* 背景円 */}
                  <circle cx={65} cy={65} r={RC} fill="none" stroke="#e5e7eb" strokeWidth={8}/>
                  {/* プログレス円（反時計回りで減っていく） */}
                  {!done && <circle cx={65} cy={65} r={RC} fill="none" stroke={col} strokeWidth={8}
                    strokeDasharray={circ} strokeDashoffset={circ*(1-progress)}
                    strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"65px 65px",transition:"stroke-dashoffset 0.5s"}}/>}
                  {done && <circle cx={65} cy={65} r={RC} fill="none" stroke="#22c55e" strokeWidth={8}/>}
                  {/* 中央テキスト */}
                  <text x={65} y={52} textAnchor="middle" fontSize={22} fontWeight="bold" fill={done?"#22c55e":col}
                    fontFamily="monospace">{done?"✅":phase.emoji}</text>
                  <text x={65} y={74} textAnchor="middle" fontSize={11} fontWeight="bold" fill={done?"#22c55e":col}>
                    {done ? "完了！" : fmtTime(timerSec)}
                  </text>
                  <text x={65} y={90} textAnchor="middle" fontSize={9} fill="#9ca3af">
                    {done ? "" : `残 ${Math.round(progress*100)}%`}
                  </text>
                </svg>
              </div>
              {/* フェーズバー */}
              <div className="flex justify-center gap-1 mb-2">
                {[
                  { emoji:"🔥", label:"冷却中", threshold:0.7 },
                  { emoji:"😠", label:"落ち着き", threshold:0.4 },
                  { emoji:"😐", label:"もう少し", threshold:0 },
                  { emoji:"😊", label:"OK！", threshold:-1 },
                ].map((p,i)=>{
                  const active = done ? i===3 : i===0 ? progress>0.7 : i===1 ? (progress>0.4&&progress<=0.7) : i===2 ? (progress>0&&progress<=0.4) : false;
                  return (
                    <div key={i} className={`flex flex-col items-center px-2 py-1 rounded-lg text-xs transition-all ${active?"text-white font-bold":"text-gray-400 bg-gray-100"}`}
                      style={active?{backgroundColor:phase.color}:{}}>
                      <span>{p.emoji}</span>
                      <span style={{fontSize:"9px"}}>{p.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs font-bold mb-2" style={{color:phase.color}}>{phase.label}</div>
              <div className="flex gap-2 justify-center">
                <button onClick={()=>setTimerRunning(r=>!r)} disabled={done}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold text-white disabled:opacity-40" style={{backgroundColor:col}}>
                  {timerRunning?"⏸ 停止":"▶ 再開"}
                </button>
                <button onClick={()=>{setTimerBlood(null);setTimerRunning(false);setTimerSec(0);}}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold bg-gray-200 text-gray-600">
                  ✕ リセット
                </button>
              </div>
            </div>
          );
        })()}
      </div>
      <svg width={380} height={220} className="mx-auto">
        <defs><marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#666"/></marker></defs>
        <line x1={155} y1={80} x2={220} y2={80} stroke="#3F51B5" strokeWidth="2" markerEnd="url(#arr)"/>
        <text x={185} y={72} textAnchor="middle" fontSize="9" fill="#3F51B5">利用・盾</text>
        <line x1={248} y1={100} x2={235} y2={150} stroke="#9C27B0" strokeWidth="2" markerEnd="url(#arr)"/>
        <text x={258} y={130} fontSize="9" fill="#9C27B0">盾→攻撃</text>
        <line x1={130} y1={100} x2={185} y2={150} stroke="#3F51B5" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arr)"/>
        <text x={138} y={138} fontSize="9" fill="#3F51B5">間接</text>
        <line x1={97} y1={165} x2={170} y2={172} stroke="#FF9800" strokeWidth="2" markerEnd="url(#arr)"/>
        <text x={133} y={158} fontSize="9" fill="#FF9800">直接攻撃</text>
        {[{l:"A型",x:100,y:75,c:"#3F51B5",s:"攻撃者"},{l:"AB型",x:245,y:75,c:"#9C27B0",s:"盾にされる"},{l:"O型",x:195,y:170,c:"#E91E8C",s:"ターゲット"},{l:"B型",x:60,y:165,c:"#FF9800",s:"直接攻撃"}].map(n=>(
          <g key={n.l}><circle cx={n.x} cy={n.y} r={27} fill={n.c} opacity={0.85}/><text x={n.x} y={n.y-4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{n.l}</text><text x={n.x} y={n.y+10} textAnchor="middle" fontSize="9" fill="white">{n.s}</text></g>
        ))}
      </svg>
      {/* 古代人類の男女分業と能力の分化 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">🏹 古代人類の男女分業と能力の分化</div>
        <div className="text-xs text-gray-500 mb-2 leading-relaxed">
          数十万年にわたる分業の結果、男女の脳・感覚器の得意領域が分かれた。これが現代の「男女のすれ違い」の根本原因でもある。
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="font-bold text-blue-800 mb-1.5">👨 男性 ＝ 目（視覚）が発達</div>
            <div className="text-gray-700 leading-relaxed mb-1.5">狩猟担当として、遠距離の獲物を正確に捉える空間認識・動体視力・距離感が鍛えられた。</div>
            <div className="space-y-0.5 text-gray-600">
              <div>・遠くの「点」を追う能力に優れる</div>
              <div>・空間把握・地図・方向感覚が得意</div>
              <div>・動くものへの集中力が高い</div>
              <div>・一点集中型（狩りの間は無言）</div>
              <div>・「今何をしているか」に没頭する</div>
            </div>
          </div>
          <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
            <div className="font-bold text-pink-800 mb-1.5">👩 女性 ＝ 耳（聴覚・言語）が発達</div>
            <div className="text-gray-700 leading-relaxed mb-1.5">子育て・集落での協力担当として、音の変化・感情の声色・複数の情報を同時処理する能力が鍛えられた。</div>
            <div className="space-y-0.5 text-gray-600">
              <div>・声のトーン・感情の変化を敏感に察知</div>
              <div>・複数の音・会話を同時に処理できる</div>
              <div>・言語処理・共感・感情読み取りが得意</div>
              <div>・「言葉にしないと伝わらない」に敏感</div>
              <div>・子供の泣き声の種類を聞き分ける能力</div>
            </div>
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          {[
            { title:"「話を聞いていない」問題の正体", body:"男性が狩りに集中する間は「無言・没頭」が正しい姿だった。女性が「ちゃんと聞いてる？」と感じるのは、耳で関係性を確認してきた古代からの本能的反応。", color:"bg-amber-50 border-amber-200" },
            { title:"「察してほしい」問題の正体", body:"女性は声のトーン・間・表情の変化から感情を読み取ることが得意なため、「言わなくてもわかるはず」という感覚が生まれやすい。男性は視覚優位のため「言葉で明確に言われないと気づかない」のが通常状態。", color:"bg-purple-50 border-purple-200" },
            { title:"「地図が読めない」「道を聞けない」問題", body:"女性の方向感覚が弱いのではなく、女性は「人に聞く」という音声コミュニケーションで解決する方法が自然。男性は「自分の空間認識で解決する」という本能が強い。どちらも正しい適応策。", color:"bg-green-50 border-green-200" },
            { title:"「共感してほしいだけ」問題", body:"女性が悩みを話す時、解決策より「聞いてもらうこと」を求める場合が多い。これは集落で感情を共有・処理することで生存してきた女性の本能。男性は「問題→解決」という狩猟モードで応答しがちなため、ズレが生じる。", color:"bg-rose-50 border-rose-200" },
          ].map(item => (
            <div key={item.title} className={`p-2 rounded-lg border ${item.color}`}>
              <div className="font-bold text-gray-800 mb-0.5">💡 {item.title}</div>
              <div className="text-gray-700 leading-relaxed">{item.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200 text-xs text-indigo-800 leading-relaxed">
          <strong>支礎学との接続：</strong>この男女の根本的な能力分化の上に、血液型ごとの特性が重なる。例えば「察する」能力はA型女性で最大化され、「没頭・無言」はAB型男性で最も顕著に現れる。
        </div>
      </div>

      {/* 怒りパターン */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">怒り方パターン比較</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[{t:"足し算式（A型・B型）",d:"言葉で出す。比較的軽め。後を引くが関係消去まではしにくい",c:"bg-yellow-50 border-yellow-300"},{t:"掛け算式（O型・AB型）",d:"蓄積型。限界で大爆発→関係リセット・消去。突然に見える",c:"bg-red-50 border-red-300"}].map(i=>(
            <div key={i.t} className={`p-2 rounded-lg border ${i.c}`}><div className="font-bold mb-1">{i.t}</div><div className="text-gray-600">{i.d}</div></div>
          ))}
        </div>
      </div>
      {/* 女性の心理段階 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">女性の心の動きと上昇パターン</div>
        <div className="space-y-1">
          {FEMALE_STAGES.map(s=>(
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <div className="w-18 text-right font-bold text-gray-600 flex-shrink-0 w-20">{s.name}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full" style={{width:`${s.level*10}%`,backgroundColor:"#E91E8C"}}/></div>
              <div className={`w-4 text-center font-bold flex-shrink-0 ${s.ok==="○"?"text-green-600":s.ok==="△"?"text-yellow-600":"text-red-500"}`}>{s.ok}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">○=告白OK　△=まだ早い　×=NG（本母性ラインで告白すると約100%OK）</div>
      </div>
      {/* 直感への道 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">直感への道（真理）感情力→直感力</div>
        {[{z:"感情力",r:"0-40",d:"感情タグに支配されている。感情10：直感0",c:"bg-red-50"},{z:"学習域",r:"40-55",d:"スピリチュアル・占い等に頼る時期。混乱期",c:"bg-orange-50"},{z:"進化点",r:"55-60",d:"感情が薄れ客観視できる転換点",c:"bg-yellow-50"},{z:"停滞域",r:"60-75",d:"学びを実践で検証する期間。ここで留まりやすい",c:"bg-green-50"},{z:"直感力",r:"75-100",d:"感情0：直感10。人間目線で見られる神の領域",c:"bg-blue-50"}].map(p=>(
          <div key={p.z} className={`flex gap-2 text-xs mb-1 p-1.5 rounded ${p.c}`}>
            <span className="font-bold text-gray-700 w-14 flex-shrink-0">{p.z}</span>
            <span className="text-gray-600">{p.d}</span>
          </div>
        ))}
        <div className="mt-2 p-2 bg-indigo-50 rounded text-xs text-indigo-800">
          <strong>人間目線の価値：</strong>男性・女性目線ではなく「人間」として相手を見ることで偏りのない判断ができる。性別は後から付加されたオプション。素体＝人間で判断すること。
        </div>
      </div>
      {/* 心のゴミ処理 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">心のゴミ処理パターン</div>
        <div className="space-y-1 text-xs">
          {[{b:"A型",d:"ゴミが多い。愚痴・相談で他者に処理させる。溜まると体調不良",c:"#3F51B5"},{b:"O型",d:"自己処理できるが限界あり。飲み会・運動・泣くことで発散",c:"#E91E8C"},{b:"B型",d:"ゴミが少ない。甘えて即処理させる。長引かない",c:"#FF9800"},{b:"AB型",d:"一人で完全自己処理。でも処理しきれないと大爆発",c:"#9C27B0"}].map(x=>(
            <div key={x.b} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <span className="font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0 text-xs" style={{backgroundColor:x.c}}>{x.b}</span>
              <span className="text-gray-700">{x.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 家族構成・兄弟姉妹と血液型 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">👨‍👩‍👧‍👦 家族構成×血液型の傾向</div>
        <div className="text-xs text-gray-500 mb-2 leading-relaxed">生まれ順・兄弟構成は血液型の特性を増幅・緩和させる。同じO型でも長子と末っ子では振る舞いが異なる。</div>
        <div className="space-y-2 text-xs">
          {[
            { role:"長子・一人っ子", icon:"👑", desc:"責任感が強まる。O型はリーダー性がさらに強化。A型は完璧主義が極致に。B型でも「しっかりしなければ」意識が生まれる。AB型は自立性がより高まる。"},
            { role:"末っ子", icon:"🌱", desc:"甘え上手・可愛がられる能力が高い。B型の末っ子は最強の愛され体質。O型の末っ子は兄弟に守られつつリーダー性も持つ二面性が出やすい。"},
            { role:"中間子", icon:"🔄", desc:"上下の板挟みで空気を読む能力が高くなる。A型中間子はストレスを溜めやすい。AB型中間子は最も独自路線に進みやすい。"},
            { role:"一人っ子", icon:"🌟", desc:"自己完結能力が高まる。AB型の一人っ子は最も独自の世界観を持ちやすい。O型の一人っ子はコミュニティへの渇望が強い。A型は完璧主義に拍車がかかる。"},
          ].map(r => (
            <div key={r.role} className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="font-bold text-blue-800 mb-0.5">{r.icon} {r.role}</div>
              <div className="text-gray-700 leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 兄弟姉妹間の血液型相性 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">👫 兄弟姉妹間の関係パターン</div>
        <div className="space-y-1 text-xs">
          {[
            {combo:"O＋O", tag:"競争と連帯", desc:"似た者同士で競い合いながらも深い絆を持つ。どちらもリーダー気質なのでぶつかることも多いが、困った時に一番頼り合える", c:"#E91E8C"},
            {combo:"O＋A", tag:"保護者と補佐", desc:"O型が引っ張りA型が支える理想的な補完関係。A型がO型の暴走を止める役割を担うことが多い", c:"#3F51B5"},
            {combo:"O＋B", tag:"カオスと自由", desc:"O型が仕切ろうとするがB型が言うことを聞かない。ぶつかりやすいが互いに刺激し合う活発な関係", c:"#FF9800"},
            {combo:"O＋AB", tag:"リーダーと参謀", desc:"O型がトップ、AB型が裏で戦略を立てる形になりやすい。AB型はO型を誘導することもある", c:"#9C27B0"},
            {combo:"A＋A", tag:"完璧主義の連鎖", desc:"同じルールで動くため安定するが、どちらもストレスを溜めやすい。互いに期待しすぎてぶつかることも", c:"#3F51B5"},
            {combo:"A＋B", tag:"最大の対立軸", desc:"A型の「規則通りに」とB型の「感情・気分で」が根本的にぶつかる。理解し合えた時は最高の補完関係になる", c:"#FF9800"},
            {combo:"A＋AB", tag:"知性の共鳴", desc:"共に論理的思考を持ち、深い話ができる関係。A型の几帳面さとAB型の独自性が噛み合うと非常に強い", c:"#9C27B0"},
            {combo:"B＋B", tag:"自由と混乱", desc:"ルールがなく自由奔放な関係。深く傷つけ合うことは少ないが、まとまりのない関係になりやすい", c:"#FF9800"},
            {combo:"B＋AB", tag:"個性の尊重", desc:"互いに干渉しない独自路線。B型の直感とAB型の論理が時にすれ違うが、個性を尊重し合える関係", c:"#9C27B0"},
            {combo:"AB＋AB", tag:"孤独な共鳴", desc:"最も理解し合える組み合わせだが、どちらも一人を好むため距離ができやすい。深く語り合える時は唯一無二の関係", c:"#9C27B0"},
          ].map(x => (
            <div key={x.combo} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0 text-xs whitespace-nowrap" style={{backgroundColor:x.c}}>{x.combo}</span>
              <div>
                <span className="font-bold text-gray-700">{x.tag}　</span>
                <span className="text-gray-600">{x.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 家族内の役割分担パターン */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">🏠 家族内の役割パターン</div>
        <div className="space-y-1 text-xs">
          {[
            {b:"O型",role:"仕切り役・まとめ役",desc:"家族の行事・集まりを企画・主導する。いなくなると家族がばらばらになりやすい。縁の下の力持ちでもある",c:"#E91E8C"},
            {b:"A型",role:"管理役・世話役",desc:"スケジュール管理・家族の悩みを聞く役割を担う。完璧に家族を支えようとして疲弊しやすい。感謝を言葉で伝えることが大切",c:"#3F51B5"},
            {b:"B型",role:"ムードメーカー・自由人",desc:"家族の雰囲気を明るくするが、ルールや約束を守らないことで摩擦を生む。自由を認めてもらえると家族への貢献度が上がる",c:"#FF9800"},
            {b:"AB型",role:"参謀・独立者",desc:"家族内で一定の距離を保つ。困った時の知恵袋・相談役になることが多い。干渉されると距離を置く",c:"#9C27B0"},
          ].map(x=>(
            <div key={x.b} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <span className="font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0 text-xs" style={{backgroundColor:x.c}}>{x.b}</span>
              <div><span className="font-bold text-gray-700">{x.role}　</span><span className="text-gray-600">{x.desc}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* 支礎学 基礎理論 */}
      <div>
        <div className="font-bold text-sm text-gray-700 mb-2">📖 支礎学とは何か — 基礎理論</div>
        <div className="space-y-2 text-xs">
          {[
            { title:"支礎学の定義", color:"bg-indigo-50 border-indigo-200", body:"支礎学（しそがく）とは、血液型を「性格の型」として捉え、人間関係・コミュニケーション・人生設計を科学的・体系的に読み解くフレームワーク。占いでも医学でもなく「行動特性のパターン学」として活用する。" },
            { title:"なぜ血液型で違いが生まれるのか", color:"bg-blue-50 border-blue-200", body:"血液型は赤血球の表面抗原（ABO式）の違い。この違いが免疫系・神経伝達物質・ストレス反応のパターンに影響を与えるという研究が存在する。支礎学ではこれを「行動の傾向パターン」として活用し、予測・対応に使う。" },
            { title:"XY軸の仕組み", color:"bg-violet-50 border-violet-200", body:"X軸は「攻撃性（左）↔ 消極性（右）」、Y軸は「社会従属性（上）↔ 自己主張性（下）」で構成される。4象限にそれぞれの血液型が位置し、男女でも微妙に座標が異なる。この座標が「相手との力学・ぶつかり方」を決める。" },
            { title:"感情タグと心のゴミ", color:"bg-amber-50 border-amber-200", body:"人間は生まれた瞬間から「感情タグ（喜怒哀楽のラベル）」を経験に貼り続ける。この感情タグの蓄積が「心のゴミ」であり、適切に処理しないと爆発・関係リセットを引き起こす。血液型によって処理パターンが全く異なる。" },
            { title:"感情力から直感力への進化", color:"bg-green-50 border-green-200", body:"感情スコアが低いほど直感力が高くなる。感情タグに支配されている状態（感情10：直感0）から、感情が薄れ客観視できる状態（感情0：直感10）へ進化することが支礎学が目指す「人間目線」の境地。AB型がこの方向に進みやすい。" },
            { title:"女性の心理6段階", color:"bg-pink-50 border-pink-200", body:"女性の対人心理は「友達→親友→前母性→恋心→支配欲→本母性」の6段階で深まる。各段階には必要な行動・避けるべき行動が存在し、段階を飛ばすと関係が崩壊する。本母性ライン（6段階目）は最も安定した関係性で告白成功率約100%。" },
            { title:"4者の力関係（支礎学コア理論）", color:"bg-red-50 border-red-200", body:"A型が攻撃者、AB型がA型に盾として利用され、A型がO型を間接攻撃し、B型がO型を直接攻撃するという構造が「4者の力関係」。これは集団・職場・家族内で繰り返されるパターンであり、支礎学の核心理論の一つ。" },
            { title:"支礎学の活用3原則", color:"bg-gray-50 border-gray-200", body:"①決めつけに使わない（傾向の参考として使う）②相手を変えようとせず自分の対応を変える ③血液型は「説明のツール」であり「言い訳のツール」ではない。この3原則を守ることで支礎学は最大の効果を発揮する。" },
          ].map(item=>(
            <div key={item.title} className={`p-2.5 rounded-xl border ${item.color}`}>
              <div className="font-bold text-gray-800 mb-0.5 text-xs">■ {item.title}</div>
              <div className="text-gray-600 leading-relaxed">{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 詳細ビュー
// ─────────────────────────────────────────
export function DetailView({blood,setBlood,gender,setGender}) {
  const [category,setCategory] = useState(null);
  const bloods=["O","A","B","AB"];
  const genders=[{id:"female",label:"女性",icon:"👩"},{id:"male",label:"男性",icon:"👨"}];
  const profileKey = blood&&gender?`${blood}型${gender==="female"?"女性":"男性"}`:null;
  const cd = blood?BC[blood]:null;
  const sd = profileKey?GS[profileKey]:null;
  const getContent = () => {
    if (!category||!cd) return [];
    if (category==="対応"||category==="危険") return sd?sd[category]:[];
    return cd[category]||[];
  };
  const catColor = id => id==="危険"?"bg-red-50 border-red-400 text-red-800":id==="対応"?"bg-green-50 border-green-400 text-green-800":id==="心理"?"bg-blue-50 border-blue-400 text-blue-800":id==="表の面"?"bg-yellow-50 border-yellow-400 text-yellow-800":id==="裏の面"?"bg-purple-50 border-purple-400 text-purple-800":id==="恋愛結婚"?"bg-pink-50 border-pink-400 text-pink-800":"bg-gray-50 border-gray-300 text-gray-700";

  return (
    <div className="space-y-4">
      {/* 性別 */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1">STEP 1 — 性別</div>
        <div className="flex gap-2">
          {genders.map(g=><button key={g.id} onClick={()=>{setGender(g.id);setBlood(null);setCategory(null);}} className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${gender===g.id?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-gray-200 bg-white text-gray-600"}`}>{g.icon} {g.label}</button>)}
        </div>
      </div>
      {/* 血液型 */}
      {gender&&<div>
        <div className="text-xs text-gray-500 font-bold mb-1">STEP 2 — 血液型</div>
        <div className="grid grid-cols-4 gap-1">
          {bloods.map(b=><button key={b} onClick={()=>{setBlood(b);setCategory(null);}} className="py-2 rounded-lg text-sm font-bold border-2 transition-all"
            style={blood===b?{backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"}:{borderColor:"#e5e7eb",color:"#374151"}}>{b}型</button>)}
        </div>
      </div>}
      {/* プロフィールバッジ */}
      {blood&&gender&&cd&&<div className="p-3 rounded-lg text-white" style={{backgroundColor:cd.color}}>
        <div className="font-bold text-lg">{profileKey}</div>
        <div className="text-sm opacity-90">{cd.type} ｜ {cd.keywords.join("・")}</div>
        <div className="text-xs mt-1 opacity-80">XY: ({gender==="female"?cd.xy_f.x:cd.xy_m.x}, {gender==="female"?cd.xy_f.y:cd.xy_m.y}) ｜ エネルギー量: {blood==="B"?"最大":blood==="A"&&gender==="female"?"最小":blood==="AB"?"波あり":"中"}</div>
      </div>}
      {/* カテゴリ */}
      {blood&&gender&&<div>
        <div className="text-xs text-gray-500 font-bold mb-1">STEP 3 — カテゴリ</div>
        <div className="grid grid-cols-5 gap-1">
          {CATS.map(c=><button key={c.id} onClick={()=>setCategory(c.id)} className={`py-1.5 rounded-lg text-xs font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${category===c.id?"border-gray-800 bg-gray-800 text-white":"border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            <span>{c.icon}</span><span>{c.id}</span>
          </button>)}
        </div>
      </div>}
      {/* コンテンツ */}
      {category&&blood&&gender&&<div>
        <div className="text-xs text-gray-500 font-bold mb-2">{CATS.find(c=>c.id===category)?.icon} {profileKey} の{CATS.find(c=>c.id===category)?.label}</div>
        <div className="space-y-2">
          {getContent().length>0?getContent().map((item,i)=>(
            <div key={i} className={`p-2.5 rounded-lg text-sm border-l-4 ${catColor(category)}`}>{item}</div>
          )):<div className="text-gray-400 text-sm text-center p-4">データなし</div>}
        </div>
      </div>}
      {/* 怒りパターン早見（初期表示） */}
      {!blood&&<div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="font-bold text-sm text-gray-700 mb-2">怒りパターン早見表</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-yellow-50 p-2 rounded"><div className="font-bold text-yellow-700">足し算式（A型・B型）</div><div className="text-gray-600">言葉で出す。後を引くが関係消去まではしにくい</div></div>
          <div className="bg-red-50 p-2 rounded"><div className="font-bold text-red-700">掛け算式（O型・AB型）</div><div className="text-gray-600">蓄積型。限界で爆発→関係リセット・消去</div></div>
        </div>
      </div>}
    </div>
  );
}

// ─────────────────────────────────────────
// シーン別ガイド データ + 段階データ + SceneView
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// ライフアーク データ（出会い〜幸せな終わり）
// ─────────────────────────────────────────
