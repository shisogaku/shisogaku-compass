import { useState, useEffect } from 'react';
import { AXIS_COLORS, AXIS_ICONS, BC, LEVELUP_TIPS, LEVEL_STAGES, LIFE_PHASES, RADAR_AXES, RADAR_DATA, RADAR_DESC } from '../data.js';

export function LifeView() {
  const [lifeTab, setLifeTab] = useState("phase"); // "phase" | "temp"
  const [selPhase, setSelPhase] = useState(null);
  const [selBlood, setSelBlood] = useState(null);
  const [selGender, setSelGender] = useState(null);
  const [eduOpen, setEduOpen] = useState(false);

  const isDiff = selPhase === "difference";
  const targetKey = selBlood && (selGender || isDiff)
    ? isDiff
      ? `${selBlood}型${selGender==="female"?"女性":selGender==="male"?"男性":"女性"}`
      : `${selBlood}型${selGender==="female"?"女性":"男性"}`
    : null;
  const phase = selPhase ? LIFE_PHASES.find(p=>p.id===selPhase) : null;
  // 特性・障害は性別なしで血液型だけでもtipを出す（女性デフォルト）
  const diffTipKey = isDiff && selBlood
    ? (selGender ? `${selBlood}型${selGender==="female"?"女性":"男性"}` : `${selBlood}型女性`)
    : null;
  const tip = phase && (targetKey || diffTipKey)
    ? phase.tips[targetKey || diffTipKey]
    : null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-700">ライフアーク</div>
        <div className="text-xs text-gray-400">出会い〜幸せな終わりまでの血液型別ガイド</div>
      </div>

      {/* タブ切替 */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
        {[["phase","📈 フェーズ"],["temp","🌡️ 温度変化"]].map(([t,l])=>(
          <button key={t} onClick={()=>setLifeTab(t)}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${lifeTab===t?"bg-white shadow text-indigo-600":"text-gray-500"}`}>{l}</button>
        ))}
      </div>

      {/* ─── 温度変化タブ ─── */}
      {lifeTab==="temp" && (
        <div className="space-y-5">

          {/* 女性の温度グラフ */}
          <div className="rounded-2xl border-2 border-pink-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-2">
              <div className="font-black text-white text-sm">👩 女性の感情温度グラフ</div>
              <div className="text-xs text-pink-100">「上がり続けるか、永遠に終わるか」の二択</div>
            </div>
            <div className="p-3 bg-white">
              {/* SVGグラフ */}
              <svg width="100%" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
                {/* 背景グリッド */}
                {[30,60,90].map(y=>(
                  <line key={y} x1={10} y1={y} x2={310} y2={y} stroke="#f3f4f6" strokeWidth={1}/>
                ))}
                {/* 軸 */}
                <line x1={10} y1={110} x2={310} y2={110} stroke="#e5e7eb" strokeWidth={1}/>
                <line x1={10} y1={10} x2={10} y2={110} stroke="#e5e7eb" strokeWidth={1}/>
                {/* ラベル */}
                <text x={8} y={18} fontSize={7} fill="#9ca3af" textAnchor="end">高</text>
                <text x={8} y={113} fontSize={7} fill="#9ca3af" textAnchor="end">低</text>
                <text x={10} y={118} fontSize={7} fill="#9ca3af">出会い</text>
                <text x={155} y={118} fontSize={7} fill="#9ca3af" textAnchor="middle">交際期間→</text>
                {/* 「熱が維持されたルート」- 右肩上がり曲線 */}
                <path d="M 10,100 C 50,90 80,75 110,60 C 140,45 170,30 200,20 C 220,15 240,14 270,13 C 285,12 295,12 310,12"
                  fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5,3" opacity={0.5}/>
                {/* 「冷めたルート」 - 上がってから急落・平坦 */}
                <path d="M 10,100 C 50,90 80,75 110,60 C 140,45 160,38 180,35"
                  fill="none" stroke="#f43f5e" strokeWidth={2.5}/>
                {/* 冷める瞬間 */}
                <path d="M 180,35 C 185,36 188,55 195,85 C 200,95 205,100 220,100"
                  fill="none" stroke="#94a3b8" strokeWidth={2.5}/>
                <path d="M 220,100 L 310,100"
                  fill="none" stroke="#94a3b8" strokeWidth={2.5}/>
                {/* 冷める点マーカー */}
                <circle cx={180} cy={35} r={5} fill="#f43f5e" stroke="white" strokeWidth={1.5}/>
                <circle cx={220} cy={100} r={4} fill="#94a3b8" stroke="white" strokeWidth={1.5}/>
                {/* 注釈 */}
                <text x={115} y={32} fontSize={7} fill="#f43f5e" fontWeight="bold">「もういいや」の瞬間</text>
                <text x={175} y={27} fontSize={7} fill="#f43f5e">↙</text>
                <text x={230} y={96} fontSize={7} fill="#94a3b8">完全に終了</text>
                {/* 点線ルート説明 */}
                <text x={285} y={10} fontSize={6} fill="#f43f5e" opacity={0.7} textAnchor="end">維持できたルート</text>
                {/* 上昇矢印 */}
                <text x={75} y={72} fontSize={7} fill="#f43f5e" fontWeight="bold">↗ 右肩上がり</text>
              </svg>

              {/* 解説 */}
              <div className="space-y-2 mt-1">
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                  <div className="font-bold text-rose-700 text-xs mb-1.5">🔑 女性の感情の本質</div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                    <div>・女性の感情は「<span className="font-bold text-rose-600">右肩上がりか、完全に終わるか</span>」の二択。中間がない。</div>
                    <div>・一度「もういいや」と思った瞬間、熱は急速に冷め、元には戻らない。</div>
                    <div>・だから<span className="font-bold">「熱をいかに維持・持続させ続けるか」</span>がすべての鍵になる。</div>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-700 text-xs mb-1.5">❄️ なぜ冷めるのか（原因）</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {[
                      ["期待を裏切られ続けた","「この人は変わらない」と悟った時"],
                      ["感謝・承認の消滅","頑張りを当たり前にされ続けた結果"],
                      ["成長の停止","自分は成長するのに相手が止まっている"],
                      ["感情の無視","「どうせ言っても伝わらない」の積み重ね"],
                    ].map(([t,d])=>(
                      <div key={t} className="p-1.5 bg-white rounded-lg border border-gray-200">
                        <div className="font-bold text-gray-700 mb-0.5">{t}</div>
                        <div className="text-gray-500 leading-tight">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-green-50 rounded-xl border border-green-200">
                  <div className="font-bold text-green-700 text-xs mb-1.5">🔥 熱を維持する方法（血液型別）</div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      ["O型女性","#E91E8C","必要とされ続ける状態を作る。「あなたがいないと困る」という存在であり続ける"],
                      ["A型女性","#3F51B5","努力・成長・誠実さを見せ続ける。約束を守り、言葉に責任を持つ姿勢が命"],
                      ["B型女性","#FF9800","新鮮さとドキドキを提供し続ける。マンネリは天敵。予想外のサプライズが効く"],
                      ["AB型女性","#9C27B0","自分の世界・価値観を尊重し続ける。干渉しすぎず、でも必要な時に寄り添う"],
                    ].map(([bl,col,desc])=>(
                      <div key={bl} className="flex gap-2 items-start">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0" style={{backgroundColor:col}}>{bl}</span>
                        <span className="text-gray-700 leading-tight">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 男性の温度グラフ */}
          <div className="rounded-2xl border-2 border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-400 px-4 py-2">
              <div className="font-black text-white text-sm">👨 男性の感情温度グラフ</div>
              <div className="text-xs text-blue-100">「波形」を繰り返す周期的サイクル</div>
            </div>
            <div className="p-3 bg-white">
              {/* SVGグラフ */}
              <svg width="100%" viewBox="0 0 320 130" preserveAspectRatio="xMidYMid meet">
                {/* 背景グリッド */}
                {[35,70,100].map(y=>(
                  <line key={y} x1={10} y1={y} x2={310} y2={y} stroke="#f3f4f6" strokeWidth={1}/>
                ))}
                <line x1={10} y1={120} x2={310} y2={120} stroke="#e5e7eb" strokeWidth={1}/>
                <line x1={10} y1={10} x2={10} y2={120} stroke="#e5e7eb" strokeWidth={1}/>
                <text x={8} y={18} fontSize={7} fill="#9ca3af" textAnchor="end">高</text>
                <text x={8} y={123} fontSize={7} fill="#9ca3af" textAnchor="end">低</text>
                {/* 波形曲線（男性の感情サイクル） */}
                <path d="M 10,100 C 25,95 35,20 55,18 C 65,17 70,40 80,65 C 88,82 90,95 100,100 C 108,104 115,95 125,72 C 133,55 138,40 148,38 C 158,36 162,58 172,78 C 180,92 183,103 193,105 C 200,106 207,95 215,68 C 222,48 227,35 237,33 C 247,31 252,50 262,72 C 270,88 275,102 285,105 C 293,107 302,95 310,75"
                  fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round"/>
                {/* ピーク点（熱い瞬間） */}
                {[[55,18],[148,38],[237,33]].map(([x,y],i)=>(
                  <g key={i}>
                    <circle cx={x} cy={y} r={4} fill="#3b82f6" stroke="white" strokeWidth={1.5}/>
                  </g>
                ))}
                {/* 谷点（冷めた瞬間） */}
                {[[100,100],[193,105]].map(([x,y],i)=>(
                  <circle key={i} cx={x} cy={y} r={3.5} fill="#94a3b8" stroke="white" strokeWidth={1.5}/>
                ))}
                {/* ラベル */}
                <text x={48} y={12} fontSize={6.5} fill="#3b82f6" fontWeight="bold" textAnchor="middle">追いかけ期</text>
                <text x={100} y={115} fontSize={6} fill="#94a3b8" textAnchor="middle">慣れ・冷め</text>
                <text x={148} y={32} fontSize={6.5} fill="#3b82f6" fontWeight="bold" textAnchor="middle">他所を見る</text>
                <text x={193} y={118} fontSize={6} fill="#94a3b8" textAnchor="middle">失敗・戻る</text>
                <text x={237} y={27} fontSize={6.5} fill="#3b82f6" fontWeight="bold" textAnchor="middle">また熱を帯びる</text>
                <text x={285} y={118} fontSize={6} fill="#94a3b8" textAnchor="middle">また冷め…</text>
              </svg>

              {/* サイクル解説 */}
              <div className="space-y-2 mt-1">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="font-bold text-blue-700 text-xs mb-1.5">🔑 男性の感情の本質</div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                    <div>・男性の感情は「<span className="font-bold text-blue-600">波形の繰り返し</span>」。上がって下がって、を周期的に繰り返す。</div>
                    <div>・これは<span className="font-bold">悪意でも飽き性でもなく、本能的なサイクル</span>。</div>
                    <div>・波が低い時に「冷めた」と判断して終わらせると機会損失になることも多い。</div>
                  </div>
                </div>

                {/* サイクルステップ */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-700 text-xs mb-2">🔄 男性の感情サイクル（繰り返しパターン）</div>
                  <div className="space-y-1.5">
                    {[
                      ["🔥","①追いかけ期","強烈な興味・熱。「この人しかいない」と感じる瞬間","#3b82f6"],
                      ["😌","②慣れ・安心期","関係が安定してくると熱が落ち着く。「当たり前」になる","#94a3b8"],
                      ["👀","③外へ目が向く","新鮮さや刺激を無意識に求め始める。浮気衝動・比較が起きやすい","#f97316"],
                      ["😔","④失敗・反省","うまくいかない・罪悪感が生まれ、元の関係の良さを再評価","#ef4444"],
                      ["🏠","⑤元の鞘に戻る","安心・温かさを再認識して戻る。また熱を帯び始める","#22c55e"],
                      ["🔁","⑥繰り返し","①〜⑤を周期的に繰り返す。これが男性の基本サイクル","#8b5cf6"],
                    ].map(([em,step,desc,col])=>(
                      <div key={step} className="flex gap-2 items-start text-xs">
                        <span className="text-base flex-shrink-0">{em}</span>
                        <div>
                          <span className="font-bold" style={{color:col}}>{step}：</span>
                          <span className="text-gray-700">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200">
                  <div className="font-bold text-indigo-700 text-xs mb-1.5">💡 男性サイクルへの対応策（女性向け）</div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div>・波が低い時期は<span className="font-bold">「引き寄せ」より「安心感の提供」</span>が効果的</div>
                    <div>・熱が下がった時に責めたり詰めたりすると逃げたくなる。距離を置くことが逆効果になる局面も</div>
                    <div>・<span className="font-bold">「安定の中に新鮮さ」</span>を作り続けることで、外へ向かうエネルギーを内側に留められる</div>
                    <div>・男性が自分から戻ってきた時は「また始まり」のサイン。温かく受け入れる余裕が関係を長続きさせる</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 男女比較まとめ */}
          <div className="p-3 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl border border-gray-200">
            <div className="font-bold text-gray-700 text-sm text-center mb-3">⚡ 男女の温まり方・冷め方の違い</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { icon:"👩", label:"女性", col:"#f43f5e", items:[
                  "ゆっくり温まる",
                  "右肩上がりか完全終了か",
                  "一度冷めたら元には戻らない",
                  "熱の維持・持続が最重要",
                  "裏切り・無視の蓄積で急冷",
                ]},
                { icon:"👨", label:"男性", col:"#3b82f6", items:[
                  "一気に熱くなる",
                  "波形を繰り返す周期的変動",
                  "冷めてもまた戻ってくる",
                  "新鮮さと安心感の両立が鍵",
                  "安定すると外へ目が向く",
                ]},
              ].map(({icon,label,col,items})=>(
                <div key={label} className="p-2 bg-white rounded-xl border" style={{borderColor:col+"44"}}>
                  <div className="font-bold text-center mb-1.5" style={{color:col}}>{icon} {label}</div>
                  {items.map((t,i)=>(
                    <div key={i} className="flex items-start gap-1 mb-0.5">
                      <span className="flex-shrink-0 font-bold" style={{color:col}}>・</span>
                      <span className="text-gray-700 leading-tight">{t}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ─── フェーズタブ ─── */}
      {lifeTab==="phase" && <>
      {/* フェーズ選択 */}
      <div>
        <div className="text-xs text-gray-500 font-bold mb-1.5">人生のフェーズを選ぶ</div>
        {/* 通常8フェーズ（4×2グリッド） */}
        <div className="grid grid-cols-4 gap-1">
          {LIFE_PHASES.filter(p=>p.id!=="difference").map(p => (
            <button key={p.id} onClick={() => { setSelPhase(p.id); setEduOpen(false); }}
              className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${selPhase===p.id?"border-current text-white":"border-gray-200 text-gray-600 hover:border-gray-300"}`}
              style={selPhase===p.id?{borderColor:p.color,backgroundColor:p.color}:{}}>
              <span className="text-base">{p.icon}</span>
              <span style={{fontSize:"9px"}}>{p.label}</span>
            </button>
          ))}
        </div>
        {/* 特性・障害（全幅・特別ボタン） */}
        {(() => {
          const dp = LIFE_PHASES.find(p=>p.id==="difference");
          return (
            <button onClick={() => { setSelPhase("difference"); setEduOpen(true); }}
              className={`mt-1.5 w-full py-2.5 px-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selPhase==="difference"?"text-white":"border-gray-200 hover:border-cyan-300"}`}
              style={selPhase==="difference"?{borderColor:dp.color,backgroundColor:dp.color}:{borderColor:"#a5f3fc"}}>
              <span className="text-xl">{dp.icon}</span>
              <div className="text-left">
                <div className={`font-bold text-sm ${selPhase==="difference"?"text-white":"text-cyan-700"}`}>{dp.label}</div>
                <div className={`text-xs ${selPhase==="difference"?"text-white opacity-80":"text-cyan-500"}`}>{dp.desc}</div>
              </div>
            </button>
          );
        })()}
      </div>

      {phase && (
        <>
          <div className="text-center py-1 rounded-lg text-xs font-bold text-white" style={{backgroundColor:phase.color}}>
            {phase.icon} {phase.label} — {phase.desc}
          </div>

          {/* 教育コンテンツ（親密性フェーズのみ） */}
          {phase.edu && (
            <div className="rounded-xl border-2 border-purple-300 overflow-hidden">
              <button onClick={() => setEduOpen(!eduOpen)}
                className="w-full p-3 bg-purple-50 flex items-center justify-between text-left">
                <div>
                  <div className="font-bold text-purple-700 text-xs">{phase.edu.title}</div>
                  <div className="text-xs text-purple-500 mt-0.5">タップして学習コンテンツを開く</div>
                </div>
                <span className="text-purple-400 text-lg">{eduOpen?"▲":"▼"}</span>
              </button>
              {eduOpen && (
                <div className="p-3 bg-white space-y-2">
                  <div className="text-xs text-gray-700 leading-relaxed">{phase.edu.body}</div>
                  <div className="space-y-1">
                    {phase.edu.points.map((pt,i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-purple-500 font-bold flex-shrink-0">✦</span>
                        <span className="text-gray-700">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* プロフィール選択 */}
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">
              {isDiff ? "自分の性別（任意・血液型だけでも表示されます）" : "相手（または自分）の性別"}
            </div>
            <div className="flex gap-2">
              {[{id:"female",label:"👩 女性"},{id:"male",label:"👨 男性"}].map(g => (
                <button key={g.id} onClick={() => setSelGender(selGender===g.id&&isDiff?null:g.id)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${selGender===g.id?"border-indigo-500 bg-indigo-100 text-indigo-700":"border-gray-200 text-gray-600"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">血液型</div>
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

          {/* ガイド表示 */}
          {tip ? (
            <div className="space-y-2">
              <div className="p-4 rounded-2xl border space-y-2"
                style={{backgroundColor:phase.color+"10", borderColor:phase.color+"44"}}>
                <div className="font-bold text-sm" style={{color:phase.color}}>
                  {targetKey} × {phase.label}
                </div>
                <div className="text-xs font-bold text-gray-500 mt-1">💡 この段階の心理</div>
                <div className="text-sm text-gray-800 leading-relaxed">{tip.point}</div>
                <div className="text-xs font-bold text-gray-500 mt-2">✅ 具体的なアクション</div>
                <div className="text-sm text-gray-800 leading-relaxed bg-white rounded-lg p-2 border" style={{borderColor:phase.color+"44"}}>
                  {tip.action}
                </div>
              </div>
              {/* 前後フェーズへのナビ */}
              <div className="flex gap-2">
                {LIFE_PHASES.findIndex(p=>p.id===selPhase) > 0 && (
                  <button
                    onClick={() => { setSelPhase(LIFE_PHASES[LIFE_PHASES.findIndex(p=>p.id===selPhase)-1].id); setEduOpen(false); }}
                    className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
                    ← {LIFE_PHASES[LIFE_PHASES.findIndex(p=>p.id===selPhase)-1].icon} 前のフェーズ
                  </button>
                )}
                {LIFE_PHASES.findIndex(p=>p.id===selPhase) < LIFE_PHASES.length-1 && (
                  <button
                    onClick={() => { setSelPhase(LIFE_PHASES[LIFE_PHASES.findIndex(p=>p.id===selPhase)+1].id); setEduOpen(false); }}
                    className="flex-1 py-1.5 rounded-lg text-xs text-white font-bold hover:opacity-90"
                    style={{backgroundColor:phase.color}}>
                    次のフェーズ {LIFE_PHASES[LIFE_PHASES.findIndex(p=>p.id===selPhase)+1].icon} →
                  </button>
                )}
              </div>
            </div>
          ) : selBlood && selGender ? null : (
            <div className="text-center text-gray-400 text-xs py-4">性別と血液型を選ぶとガイドが表示されます</div>
          )}
        </>
      )}
      {!selPhase && (
        <div className="text-center text-gray-400 text-xs py-4">フェーズを選んでください</div>
      )}
      </>}
    </div>
  );
}

// ─────────────────────────────────────────
// AI相談ビュー
// ─────────────────────────────────────────

export function LevelUpSection({ blood, gender, onChecksChange }) {
  const profileKey = `${blood}${gender === "female" ? "女性" : "男性"}`;
  const storageKey = `shisogaku_levelup_${profileKey}`;

  const [openIdx, setOpenIdx] = useState(null);
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(checks)); } catch {}
    if (onChecksChange) onChecksChange(checks);
  }, [checks, storageKey]);

  // 初回マウント時にも親へ通知
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
      if (onChecksChange) onChecksChange(saved);
    } catch {}
  }, [storageKey]);

  const radarData = RADAR_DATA[profileKey];
  const tipData   = LEVELUP_TIPS[profileKey];
  if (!radarData || !tipData) return null;

  const weakAxes = RADAR_AXES
    .map(ax => ({ ax, v: radarData[ax] }))
    .sort((a, b) => a.v - b.v)
    .filter(({ ax }) => tipData[ax]);

  const getStageIdx = (ax, score) => {
    const stages = LEVEL_STAGES[ax];
    let idx = 0;
    stages.forEach((s, i) => { if (score >= s.min) idx = i; });
    return idx;
  };

  const checkedCount = (ax) =>
    (tipData[ax]?.steps || []).filter((_, si) => checks[`${ax}_${si}`]).length;

  const toggleCheck = (ax, si) => {
    setChecks(prev => ({ ...prev, [`${ax}_${si}`]: !prev[`${ax}_${si}`] }));
  };

  return (
    <div className="border-t border-indigo-200 pt-3 space-y-2">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base">🚀</span>
        <span className="text-xs font-black text-indigo-700">レベルアップ ロードマップ</span>
        <span className="text-xs text-gray-400">アクションをチェックするとレベルが上がります</span>
      </div>
      {weakAxes.map(({ ax, v }, i) => {
        const axColor       = AXIS_COLORS[ax];
        const stages        = LEVEL_STAGES[ax];
        const done          = checkedCount(ax);
        const total         = tipData[ax]?.steps?.length || 0;
        const effectiveScore = Math.min(v + done * 5, 95);
        const baseStageIdx  = getStageIdx(ax, v);
        const effStageIdx   = getStageIdx(ax, effectiveScore); // ← チェックで動く
        const effStage      = stages[effStageIdx];
        const nextStage     = stages[effStageIdx + 1];
        const leveledUp     = effStageIdx > baseStageIdx;
        const isMax         = effStageIdx === stages.length - 1;
        const isOpen        = openIdx === i;

        // 次のステージまであと何チェック必要か
        const checksToNext = nextStage
          ? Math.ceil(Math.max(nextStage.min - effectiveScore, 0) / 5)
          : 0;

        return (
          <div key={ax} className="rounded-xl border-2 overflow-hidden transition-all"
            style={{ borderColor: isOpen ? axColor : leveledUp ? axColor + "80" : "#e5e7eb" }}>

            {/* ヘッダー */}
            <button className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
              style={{ background: isOpen ? axColor + "10" : leveledUp ? axColor + "08" : "white" }}
              onClick={() => setOpenIdx(isOpen ? null : i)}>
              <span className="text-lg flex-shrink-0">{AXIS_ICONS[ax]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-sm text-gray-800">{ax}</span>
                  {/* 現在の有効ステージバッジ（チェックで変わる） */}
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold text-white transition-all"
                    style={{ backgroundColor: axColor }}>{effStage.icon} Lv.{effStageIdx+1} {effStage.name}</span>
                  {leveledUp && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-black bg-green-100 text-green-700">⬆️ レベルアップ！</span>
                  )}
                </div>
                {/* 進捗バー：ベース(solid) + ボーナス(lighter) */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                    <div className="h-2 rounded-full absolute left-0 transition-all duration-700 opacity-40"
                      style={{ width: `${effectiveScore}%`, backgroundColor: axColor }} />
                    <div className="h-2 rounded-full absolute left-0 transition-all duration-700"
                      style={{ width: `${v}%`, backgroundColor: axColor }} />
                    {/* ステージ境界線 */}
                    {stages.slice(1).map(s => (
                      <div key={s.min} className="absolute top-0 bottom-0 w-px bg-white opacity-60"
                        style={{ left: `${s.min}%` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: axColor }}>
                    {v}{done > 0 && <span className="text-green-600">+{done*5}</span>}点
                  </span>
                </div>
                {/* 次のレベルまであと何チェック */}
                {!isMax && (
                  <div className="text-xs mt-0.5" style={{ color: checksToNext === 0 ? "#22c55e" : "#9ca3af" }}>
                    {checksToNext === 0
                      ? `✅ Lv.${effStageIdx+2}に到達中！`
                      : `あと${checksToNext}個のアクションで Lv.${effStageIdx+2}「${nextStage.name}」へ`}
                  </div>
                )}
                {isMax && <div className="text-xs mt-0.5 text-yellow-600 font-bold">⭐ 最高レベル達成！</div>}
              </div>
              <span className="text-gray-400 text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="px-3 pb-3 space-y-3" style={{ background: axColor + "06" }}>

                {/* ── 4段階ロードマップ ── */}
                <div className="pt-2">
                  <div className="text-xs font-black text-gray-500 mb-2 flex items-center gap-1">
                    <span>📍</span><span>成長ロードマップ</span>
                    {leveledUp && <span className="ml-auto text-green-600 font-black text-xs">⬆️ アクションでレベルアップ中！</span>}
                  </div>
                  <div className="space-y-1">
                    {stages.map((stage, si) => {
                      const isNow    = si === effStageIdx;   // ← チェックで動く NOW
                      const isBase   = si === baseStageIdx && baseStageIdx !== effStageIdx;
                      const isPast   = si < effStageIdx;
                      const isFuture = si > effStageIdx;
                      return (
                        <div key={si} className="flex gap-2 items-start">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2 font-bold transition-all duration-500"
                              style={
                                isNow
                                  ? { backgroundColor: axColor, borderColor: axColor, color:"white", boxShadow:`0 0 10px ${axColor}80` }
                                  : isPast
                                    ? { backgroundColor: axColor+"25", borderColor: axColor, color: axColor }
                                    : { backgroundColor:"white", borderColor:"#d1d5db", color:"#9ca3af" }
                              }>
                              {stage.icon}
                            </div>
                            {si < stages.length - 1 && (
                              <div className="w-0.5 h-4 transition-all duration-500"
                                style={{ backgroundColor: si < effStageIdx ? axColor : "#e5e7eb" }} />
                            )}
                          </div>
                          <div className={`flex-1 rounded-xl px-2.5 py-2 text-xs mb-1 transition-all duration-500
                            ${isNow ? "bg-white border-2 shadow-sm" : isPast ? "bg-transparent" : "bg-transparent"}`}
                            style={isNow ? { borderColor: axColor } : {}}>
                            <div className="flex items-center gap-1 flex-wrap mb-0.5">
                              <span className="font-black transition-all"
                                style={{ color: isNow ? axColor : isPast ? "#9ca3af" : "#d1d5db" }}>
                                Lv.{si+1} {stage.name}
                              </span>
                              {isNow && (
                                <span className="text-white font-black rounded px-1"
                                  style={{ backgroundColor: axColor, fontSize:"9px" }}>
                                  {leveledUp ? "⬆️ NOW" : "NOW"}
                                </span>
                              )}
                              {isBase && (
                                <span className="text-gray-400 rounded px-1 border border-gray-300 font-bold" style={{ fontSize:"9px" }}>
                                  出発点
                                </span>
                              )}
                              {isFuture && si === effStageIdx + 1 && (
                                <span className="rounded px-1 font-bold" style={{ backgroundColor: axColor+"20", color: axColor, fontSize:"9px" }}>
                                  NEXT
                                </span>
                              )}
                            </div>
                            <div className={`leading-relaxed transition-all ${isNow ? "text-gray-700" : isPast ? "text-gray-400" : "text-gray-300"}`}>
                              {stage.desc}
                            </div>
                            {/* NOWステージ：次のレベルへの道 */}
                            {isNow && stage.next && (
                              <div className="mt-1.5 p-1.5 rounded-lg border flex items-start gap-1"
                                style={{ backgroundColor: axColor+"12", borderColor: axColor+"40" }}>
                                <span className="flex-shrink-0 text-xs">👉</span>
                                <span className="text-xs leading-relaxed font-medium" style={{ color: axColor }}>
                                  次のステージへ：{stage.next}
                                </span>
                              </div>
                            )}
                            {/* NEXT ステージ：何点で到達するか */}
                            {isFuture && si === effStageIdx + 1 && (
                              <div className="mt-0.5 text-xs text-gray-400">
                                → {stage.min}点以上で到達
                                {checksToNext > 0 && <span className="ml-1 font-bold" style={{ color: axColor }}>（あと{checksToNext}アクション）</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* なぜ弱いか */}
                <div className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-gray-100 leading-relaxed">
                  <span className="font-bold text-gray-700">なぜ弱くなりやすいか：</span>{tipData[ax].root}
                </div>

                {/* ── チェック式アクション ── */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-gray-700">✅ アクションをチェックしてレベルを上げよう</div>
                    <div className="text-xs font-bold" style={{ color: done > 0 ? axColor : "#9ca3af" }}>{done}/{total}</div>
                  </div>
                  {/* チェック進捗バー */}
                  <div className="bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: total > 0 ? `${(done/total)*100}%` : "0%", backgroundColor: axColor }} />
                  </div>
                  {tipData[ax].steps.map((step, si) => {
                    const ck = checks[`${ax}_${si}`];
                    return (
                      <button key={si} onClick={() => toggleCheck(ax, si)}
                        className="w-full flex items-start gap-2 rounded-xl p-2.5 border-2 text-left transition-all duration-300"
                        style={ck
                          ? { borderColor: axColor, backgroundColor: axColor + "10" }
                          : { borderColor: "#e5e7eb", backgroundColor: "white" }}>
                        <span className="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                          style={ck ? { backgroundColor: axColor, borderColor: axColor } : { borderColor: "#d1d5db" }}>
                          {ck && <span className="text-white font-black" style={{ fontSize:"10px" }}>✓</span>}
                        </span>
                        <span className={`text-xs leading-relaxed flex-1 ${ck ? "line-through text-gray-400" : "text-gray-700"}`}>
                          {step}
                        </span>
                        <span className="flex-shrink-0 text-xs font-black rounded px-1.5 py-0.5"
                          style={ck
                            ? { backgroundColor: axColor+"20", color: axColor }
                            : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}>
                          +5点
                        </span>
                      </button>
                    );
                  })}
                  {/* 次のレベルまでのカウンター */}
                  {!isMax && (
                    <div className="rounded-xl p-2 text-center text-xs font-bold transition-all"
                      style={{ backgroundColor: axColor+"15", color: axColor }}>
                      {checksToNext === 0
                        ? `🎉 Lv.${effStageIdx+2}「${nextStage.name}」に到達しました！`
                        : `あと ${checksToNext} 個チェックすると Lv.${effStageIdx+2}「${nextStage.name}」へ ⬆️`}
                    </div>
                  )}
                  {isMax && (
                    <div className="rounded-xl p-2 text-center text-xs font-black"
                      style={{ backgroundColor: axColor+"20", color: axColor }}>
                      ⭐ 最高レベル「{effStage.name}」達成！ この調子で継続しよう
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RadarChart({ blood, gender, color, overrideData }) {
  const key = `${blood}${gender === "female" ? "女性" : "男性"}`;
  const baseData = RADAR_DATA[key];
  const data = overrideData || baseData;
  if (!data) return null;

  const W = 210, H = 190, CX = W / 2, CY = H / 2 + 6, R = 68;
  const N = RADAR_AXES.length;

  const toXY = (i, v) => {
    const angle = -Math.PI / 2 + (2 * Math.PI / N) * i;
    return { x: CX + (v / 100) * R * Math.cos(angle), y: CY + (v / 100) * R * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];
  const dataPts = RADAR_AXES.map((ax, i) => { const {x,y}=toXY(i,data[ax]); return `${x},${y}`; }).join(" ");

  const labelPad = 16;
  const labels = RADAR_AXES.map((ax, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI / N) * i;
    return { ax, val: data[ax], x: CX + (R + labelPad) * Math.cos(angle), y: CY + (R + labelPad) * Math.sin(angle) };
  });

  // 強み・弱みトップ2
  const sorted = [...RADAR_AXES].map(ax => ({ ax, v: data[ax] })).sort((a, b) => b.v - a.v);
  const strengths = sorted.slice(0, 2);
  const weaknesses = sorted.slice(-2).reverse();

  return (
    <div>
      <svg width={W} height={H} style={{ overflow: "visible", display: "block", margin: "0 auto" }}>
        {/* グリッドポリゴン */}
        {gridLevels.map(v => (
          <polygon key={v}
            points={RADAR_AXES.map((_, i) => { const {x,y}=toXY(i,v); return `${x},${y}`; }).join(" ")}
            fill="none" stroke={v === 100 ? "#d1d5db" : "#e5e7eb"} strokeWidth={v === 100 ? 1 : 0.5} />
        ))}
        {/* 軸線 */}
        {RADAR_AXES.map((_, i) => {
          const {x,y} = toXY(i, 100);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#e5e7eb" strokeWidth={0.8} />;
        })}
        {/* データポリゴン */}
        <polygon points={dataPts} fill={color + "33"} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {/* 頂点ドット */}
        {RADAR_AXES.map((ax, i) => {
          const {x,y} = toXY(i, data[ax]);
          return <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke="white" strokeWidth={1} />;
        })}
        {/* ラベル */}
        {labels.map(({ ax, val, x, y }) => (
          <g key={ax}>
            <text x={x} y={y - 5} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#6b7280" fontWeight="600">{ax}</text>
            <text x={x} y={y + 5} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={color} fontWeight="700">{val}</text>
          </g>
        ))}
        {/* 中心点 */}
        <circle cx={CX} cy={CY} r={2} fill={color} opacity={0.5} />
      </svg>
      {/* 強み・弱み */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="p-2 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xs font-bold text-green-700 mb-1">💪 強み</div>
          {strengths.map(({ ax, v }) => (
            <div key={ax} className="mb-0.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-green-800">{ax}</span>
                <span className="text-green-600 font-bold">{v}</span>
              </div>
              <div className="text-xs text-green-700 leading-tight">{RADAR_DESC[ax].high}</div>
            </div>
          ))}
        </div>
        <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xs font-bold text-orange-700 mb-1">⚠️ 弱み</div>
          {weaknesses.map(({ ax, v }) => (
            <div key={ax} className="mb-0.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-orange-800">{ax}</span>
                <span className="text-orange-600 font-bold">{v}</span>
              </div>
              <div className="text-xs text-orange-700 leading-tight">{RADAR_DESC[ax].low}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// プロフィール登録ビュー
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// 恋愛・婚姻歴インサイト
// ─────────────────────────────────────────
function getRelationshipInsights(profile) {
  const { marriage, divorce, loveExp } = profile || {};
  const insights = [];

  // ── 離婚経験による注意喚起 ──
  if (divorce === "2回以上") {
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: "自分自身のパターンを振り返るヒント",
      text: "複数回の離婚経験がある場合、相手だけでなく自分側の行動パターンが影響している可能性があります。これは責めではなく、次の関係をより良くするための気づきです。",
      details: [
        "パートナー以外への関心・新鮮さへの欲求が強い（飽き性・浮気衝動）",
        "家庭・相手より自分の欲求や時間を優先しがちなパターン",
        "感情が爆発しやすく、関係をリセットする傾向がある",
        "相手への要求水準が高く、満足しにくい（理想と現実のギャップ）",
        "依存・束縛が強すぎて、相手を息苦しくさせてしまうパターン",
        "家庭を顧みない、家事・育児・コミュニケーションを後回しにしがち",
      ],
      color: "#f97316",
      bg: "#fff7ed",
      border: "#fed7aa",
    });
  } else if (divorce === "1回") {
    insights.push({
      type: "note",
      icon: "💡",
      title: "離婚経験からの学び",
      text: "離婚は失敗ではなく、関係を深く学んだ経験です。何が自分側の課題だったかを客観的に振り返ることが、次の関係をより豊かにします。",
      details: [],
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    });
  }

  // ── 結婚回数による洞察 ──
  if (marriage === "3回以上") {
    insights.push({
      type: "info",
      icon: "📖",
      title: "多くの長期関係を経験",
      text: "複数回の婚姻経験から、パートナーシップの形・距離感・生活リズムの合わせ方を深く体感しています。その経験値は強みですが、「また同じパターンを繰り返していないか」の視点も大切です。",
      details: [],
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    });
  } else if (marriage === "2回") {
    insights.push({
      type: "info",
      icon: "📖",
      title: "パートナーシップの深い経験",
      text: "2度の婚姻経験から、長期関係の維持・距離感の調整を知っています。1度目と2度目の違いに気づいていることが、次の関係への財産になります。",
      details: [],
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    });
  } else if (marriage === "1回") {
    insights.push({
      type: "positive",
      icon: "✨",
      title: "長期パートナーシップの経験あり",
      text: "1度の婚姻経験から、相手との生活・感情の波・長期の関係維持を体感として知っています。この経験は「距離感のリアル」を知る大きな強みです。",
      details: [],
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    });
  }

  // ── 恋愛経験による洞察 ──
  if (loveExp === "豊富") {
    insights.push({
      type: "positive",
      icon: "💪",
      title: "距離感・リードの経験値が高い",
      text: "恋愛経験が豊富なため、相手の感情の機微・距離感の縮め方・リードの仕方を感覚として掴んでいます。「ライフ」の温度グラフで学ぶ内容を、すでに体感している部分も多いはずです。",
      details: ["ただし「慣れすぎ」や「相手を軽く見る」パターンには注意。経験が多いほど油断が生まれやすい。"],
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    });
  } else if (loveExp === "少ない") {
    insights.push({
      type: "learn",
      icon: "📚",
      title: "これから伸びる余地が大きい",
      text: "恋愛経験が少ない分、「ライフ」タブの温度グラフや段階別ガイドが特に役立ちます。焦らずに段階を踏む姿勢が、相手の心を開く最大のカギです。",
      details: [],
      color: "#6366f1",
      bg: "#eef2ff",
      border: "#c7d2fe",
    });
  }

  return insights;
}

export function RelationshipInsights({ profile }) {
  const [open, setOpen] = useState({});
  const insights = getRelationshipInsights(profile);
  if (insights.length === 0) return null;
  return (
    <div className="space-y-1.5 mt-2">
      {insights.map((ins, i) => (
        <div key={i} className="rounded-xl border overflow-hidden" style={{borderColor: ins.border, backgroundColor: ins.bg}}>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-left" onClick={() => setOpen(p => ({...p, [i]: !p[i]}))}>
            <span className="text-sm flex-shrink-0">{ins.icon}</span>
            <span className="text-xs font-bold flex-1" style={{color: ins.color}}>{ins.title}</span>
            <span className="text-xs flex-shrink-0" style={{color: ins.color}}>{open[i] ? "▲" : "▼"}</span>
          </button>
          {open[i] && (
            <div className="px-3 pb-2.5 space-y-1.5">
              <div className="text-xs text-gray-700 leading-relaxed">{ins.text}</div>
              {ins.details.length > 0 && (
                <div className="space-y-0.5">
                  {ins.details.map((d, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="flex-shrink-0 mt-0.5" style={{color: ins.color}}>•</span>
                      <span className="leading-tight">{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const MARRIAGE_OPTIONS = ["未婚","1回","2回","3回以上"];
export const KIDS_OPTIONS     = ["なし","あり"];
export const LOVE_OPTIONS     = ["少ない","普通","豊富"];
export const DIVORCE_OPTIONS  = ["なし","1回","2回以上"];

