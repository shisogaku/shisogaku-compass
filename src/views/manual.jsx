import React, { useState } from 'react';
import { BC, GS, ALL_PROFILES } from '../data.js';

// ── セクションカード ──────────────────
function Section({ title, emoji, color, children }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ border: `1.5px solid ${color}30` }}>
      <div className="px-4 py-2.5 flex items-center gap-2"
        style={{ background: `linear-gradient(135deg, ${color}16, ${color}08)` }}>
        <span className="text-base">{emoji}</span>
        <h3 className="font-bold text-sm" style={{ color }}>{title}</h3>
      </div>
      <div className="px-4 py-3 bg-white">{children}</div>
    </div>
  );
}

// ── 箇条書きアイテム ──────────────────
function Bullet({ text, icon }) {
  return (
    <div className="flex items-start gap-2 py-1.5 text-sm text-gray-700 leading-relaxed">
      <span className="flex-shrink-0 mt-0.5 text-base">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// ── タイプ別キャッチコピー ──────────────────
const CATCH = {
  'O型女性':  '「頼られると燃える」タイプ。でも蓄積すると突然爆発するから要注意 🔥',
  'O型男性':  '「頼れるリーダー」。感謝をきちんと伝えれば、どこまでも動いてくれる 💪',
  'A型女性':  '「几帳面なデキる女」。心のゴミが溜まると言葉で爆発するので気をつけて 💥',
  'A型男性':  '「真面目で信頼できる存在」。褒めれば伸び、批判すると一気に壁を作る 🧱',
  'B型女性':  '「自由を愛する個性派」。縛らず個性を認めると一気に懐に入れる ✨',
  'B型男性':  '「エネルギーの塊」。独創性を認めることが最速の攻略ルート 🎯',
  'AB型女性': '「謎めいた二面性」。急がず待つのが正解。焦ると消える 🌙',
  'AB型男性': '「論理と感情の天才」。知的な対話から信頼が生まれる 💡',
};

// ── メインビュー ──────────────────────────────
export function ManualView() {
  const [blood, setBlood]   = useState(null);
  const [gender, setGender] = useState(null);

  const label    = blood && gender
    ? ALL_PROFILES.find(p => p.blood === blood && p.gender === gender)?.label
    : null;
  const bcData   = blood ? BC[blood] : null;
  const gsData   = label ? GS[label] : null;
  const color    = bcData?.color || '#a855f7';
  const gLabel   = gender === 'female' ? '女性' : '男性';
  const gEmoji   = gender === 'female' ? '👩' : '👨';

  return (
    <div>
      {/* ── ヘッダー ── */}
      <div className="mb-6 text-center">
        <div className="text-3xl mb-1">📖</div>
        <h1 className="text-xl font-black text-gray-800 mb-1">取扱説明書</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          気になるあの人のトリセツで、<br/>コミュニケーションの正解が見えてくる
        </p>
      </div>

      {/* ── STEP 1：血液型選択 ── */}
      <div className="mb-4">
        <p className="text-xs font-bold text-center text-gray-400 tracking-widest mb-2">
          STEP 1 ・ 血液型を選んでね
        </p>
        <div className="grid grid-cols-4 gap-2">
          {['O','A','B','AB'].map(b => {
            const c = BC[b].color;
            const active = blood === b;
            return (
              <button key={b} type="button" onClick={() => setBlood(b)}
                className="py-3 rounded-2xl text-sm font-black transition-all"
                style={active
                  ? { background: `linear-gradient(135deg,${c},${c}cc)`, color:'white', boxShadow:`0 4px 16px ${c}55`, transform:'scale(1.05)' }
                  : { background:`${c}12`, color:c, border:`2px solid ${c}44` }}>
                <div className="text-base">{b}型</div>
                <div className="text-[10px] opacity-70 mt-0.5">{BC[b].type}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 2：性別選択 ── */}
      <div className="mb-6">
        <p className="text-xs font-bold text-center text-gray-400 tracking-widest mb-2">
          STEP 2 ・ 性別を選んでね
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id:'female', label:'女性', emoji:'👩', color:'#ec4899' },
            { id:'male',   label:'男性', emoji:'👨', color:'#6366f1' },
          ].map(g => {
            const active = gender === g.id;
            return (
              <button key={g.id} type="button" onClick={() => setGender(g.id)}
                className="py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                style={active
                  ? { background:`linear-gradient(135deg,${g.color},${g.color}cc)`, color:'white', boxShadow:`0 4px 16px ${g.color}44` }
                  : { background:`${g.color}10`, color:g.color, border:`2px solid ${g.color}33` }}>
                <span className="text-xl">{g.emoji}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 取説本体 ── */}
      {label && bcData && gsData ? (
        <div>
          {/* 表紙カード */}
          <div className="rounded-3xl p-5 mb-4 text-center relative overflow-hidden"
            style={{ background:`linear-gradient(160deg,${color}22,${color}08)`, border:`2px solid ${color}44` }}>
            <div className="text-5xl mb-2">{gEmoji}</div>
            <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color:`${color}99` }}>
              BLOOD TYPE MANUAL
            </p>
            <h2 className="text-3xl font-black mb-2" style={{ color }}>
              {blood}型{gLabel}
            </h2>
            <span className="inline-block text-xs px-3 py-1 rounded-full font-bold mb-3 text-white"
              style={{ background: color }}>
              {bcData.type}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {bcData.keywords.map(k => (
                <span key={k} className="text-xs px-3 py-1 rounded-full font-bold bg-white"
                  style={{ color, border:`1px solid ${color}44` }}>
                  #{k}
                </span>
              ))}
            </div>
          </div>

          {/* キャッチコピー */}
          <div className="mb-4 px-1">
            <div className="rounded-2xl px-4 py-3 text-sm text-gray-700 leading-relaxed text-center font-medium"
              style={{ background:`linear-gradient(135deg,#fdf4e8,#fef9f5)`, border:'1px solid rgba(180,130,70,0.18)' }}>
              {CATCH[label]}
            </div>
          </div>

          {/* 表の面・裏の面 */}
          <Section title="表の顔 ／ 裏の顔" emoji="🎭" color={color}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1">
                  <span>😊</span> 良いところ
                </p>
                {bcData.表の面.map(t => (
                  <div key={t} className="flex items-start gap-1.5 text-xs text-gray-700 mb-2 leading-relaxed">
                    <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-rose-500 mb-2 flex items-center gap-1">
                  <span>🌙</span> 気をつけて
                </p>
                {bcData.裏の面.map(t => (
                  <div key={t} className="flex items-start gap-1.5 text-xs text-gray-700 mb-2 leading-relaxed">
                    <span className="text-rose-400 flex-shrink-0 mt-0.5">!</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 攻略ポイント */}
          <Section title="距離を縮めるコツ" emoji="💡" color="#10b981">
            {gsData.対応.map((t, i) => (
              <Bullet key={i} text={t} icon="✅" />
            ))}
          </Section>

          {/* NGリスト */}
          <Section title="絶対やめて！ NGリスト" emoji="🚫" color="#ef4444">
            {gsData.危険.map((t, i) => (
              <Bullet key={i} text={t} icon="❌" />
            ))}
          </Section>

          {/* 愛情表現 */}
          <Section title="愛情の見せ方・受け取り方" emoji="💕" color="#ec4899">
            {bcData.愛情.map((t, i) => (
              <Bullet key={i} text={t} icon="💗" />
            ))}
          </Section>

          {/* 恋愛・結婚ヒント */}
          <Section title="恋愛・結婚のリアルなヒント" emoji="💍" color="#a855f7">
            {bcData.恋愛結婚.map((t, i) => (
              <Bullet key={i} text={t} icon="🌸" />
            ))}
          </Section>

          {/* 怒らせたら */}
          <Section title="怒らせてしまったら…" emoji="⚡" color="#f59e0b">
            {bcData.攻撃性.map((t, i) => (
              <Bullet key={i} text={t} icon="⚠️" />
            ))}
          </Section>

          {/* 距離感 */}
          <Section title="心の距離の縮まり方" emoji="📏" color="#6366f1">
            {bcData.距離.map((t, i) => (
              <Bullet key={i} text={t} icon="💫" />
            ))}
          </Section>

          {/* シェアボタン */}
          <div className="mt-6">
            <button type="button"
              onClick={() => {
                const text = `${blood}型${gLabel}の取扱説明書を読んだ！\n血液型コミュニケーションを学ぶなら支礎学コンパス💕\nhttps://shisogaku.github.io/shisogaku-compass/`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 mb-2"
              style={{ background:'linear-gradient(135deg,#1da1f2,#1a8cd8)' }}>
              <span className="font-black">𝕏</span>
              <span>{blood}型{gLabel}の取説をシェアする</span>
            </button>
            <button type="button"
              onClick={() => { setBlood(null); setGender(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all font-medium">
              別のタイプを見る
            </button>
          </div>
        </div>
      ) : (
        /* ── 未選択状態 ── */
        <div className="text-center py-6">
          <div className="text-4xl mb-3">📖</div>
          <p className="text-sm font-medium text-gray-600 mb-1">血液型と性別を選ぶと</p>
          <p className="text-sm font-bold text-gray-800 mb-5">「取扱説明書」が表示されます</p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs">
            {[
              '彼氏の取説が見たい 💕',
              '好きな人を攻略したい 💭',
              '職場の人と仲良くなりたい 💼',
              '友達ともっと仲良くなりたい 🤝',
            ].map(t => (
              <div key={t} className="rounded-xl py-2.5 px-3 font-medium text-pink-600"
                style={{ background:'#fdf2f8', border:'1px solid #f9a8d455' }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManualView;
