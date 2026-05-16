import React, { useState } from 'react';
import { BC, GS, ALL_PROFILES } from '../data.js';

const CATCH = {
  'O型女性':  '頼られると燃えるタイプ。でも溜めすぎると突然爆発する',
  'O型男性':  '頼れるリーダー。感謝を伝え続ければどこまでも動いてくれる',
  'A型女性':  'デキる几帳面な女。心のゴミが溜まると言葉で爆発する',
  'A型男性':  '真面目で信頼できる存在。褒めれば伸び、批判すると壁を作る',
  'B型女性':  '自由を愛する個性派。縛らず認めると一気に懐に入れる',
  'B型男性':  'エネルギーの塊。独創性を認めることが最速の攻略ルート',
  'AB型女性': '謎めいた二面性。急がず待つのが正解。焦ると消える',
  'AB型男性': '論理と感情の天才。知的な対話から信頼が生まれる',
};

// ── 区切りつきセクション ──────────────────────
function Sec({ label, color, items, max }) {
  const list = max ? items.slice(0, max) : items;
  return (
    <div className="py-5" style={{ borderTop: '1px solid #f0ede8' }}>
      <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
        style={{ color }}>
        {label}
      </p>
      <ul className="space-y-2.5">
        {list.map((t, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
            <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
              style={{ background: color, minWidth: 4 }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManualView() {
  const [blood, setBlood]   = useState(null);
  const [gender, setGender] = useState(null);

  const profile = (blood && gender)
    ? ALL_PROFILES.find(p => p.blood === blood && p.gender === gender)
    : null;
  const label  = profile?.label;
  const bcData = blood  ? BC[blood] : null;
  const gsData = label  ? GS[label] : null;
  const color  = bcData?.color || '#a78bfa';
  const gLabel = gender === 'female' ? '女性' : '男性';

  return (
    <div className="max-w-sm mx-auto">

      {/* ── タイトル ── */}
      <div className="text-center mb-8 pt-2">
        <h1 className="text-lg font-black tracking-tight text-gray-800">取扱説明書</h1>
        <p className="text-xs text-gray-400 mt-1">気になるあの人のトリセツ</p>
      </div>

      {/* ── 血液型選択 ── */}
      <div className="mb-5">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2.5 text-center">
          血液型
        </p>
        <div className="grid grid-cols-4 gap-2">
          {['O','A','B','AB'].map(b => {
            const c = BC[b].color;
            const on = blood === b;
            return (
              <button key={b} type="button" onClick={() => setBlood(b)}
                className="py-4 rounded-2xl font-black text-base transition-all"
                style={on
                  ? { background: c, color: '#fff', boxShadow: `0 4px 20px ${c}50` }
                  : { background: '#faf9f7', color: c, border: `1.5px solid ${c}40` }}>
                {b}型
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 性別選択 ── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2.5 text-center">
          性別
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id:'female', label:'女性', color:'#ec4899' },
            { id:'male',   label:'男性', color:'#6366f1' },
          ].map(g => {
            const on = gender === g.id;
            return (
              <button key={g.id} type="button" onClick={() => setGender(g.id)}
                className="py-4 rounded-2xl font-bold text-sm transition-all"
                style={on
                  ? { background: g.color, color: '#fff', boxShadow: `0 4px 20px ${g.color}45` }
                  : { background: '#faf9f7', color: g.color, border: `1.5px solid ${g.color}40` }}>
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 取説本体 ── */}
      {label && bcData && gsData ? (
        <div>
          {/* ヘッダー */}
          <div className="text-center pb-6" style={{ borderBottom: '1px solid #f0ede8' }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: `${color}99` }}>
              Blood Type Manual
            </p>
            <h2 className="text-4xl font-black mb-1" style={{ color }}>
              {blood}型{gLabel}
            </h2>
            <p className="text-xs text-gray-400 mb-4">{bcData.type}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {bcData.keywords.map(k => (
                <span key={k} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: `${color}12`, color }}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* キャッチ */}
          <div className="py-5 text-center" style={{ borderBottom: '1px solid #f0ede8' }}>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {CATCH[label]}
            </p>
          </div>

          {/* 近づき方 */}
          <Sec label="近づき方" color={color} items={gsData.対応} max={4} />

          {/* NGリスト */}
          <Sec label="やめて" color="#ef4444" items={gsData.危険} max={4} />

          {/* 恋愛ヒント */}
          <Sec
            label="恋愛のヒント"
            color={color}
            items={[...bcData.愛情.slice(0,2), ...bcData.恋愛結婚]}
          />

          {/* シェアボタン */}
          <div className="pt-8 pb-2 space-y-2">
            <button type="button"
              onClick={() => {
                const text = `${blood}型${gLabel}の取扱説明書を読んだ！\n支礎学コンパスで血液型コミュニケーションを学ぼう\nhttps://shisogaku.github.io/shisogaku-compass/`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all"
              style={{ background: '#000' }}>
              𝕏 でシェアする
            </button>
            <button type="button"
              onClick={() => {
                setBlood(null);
                setGender(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-2xl text-sm font-medium text-gray-400 transition-all hover:bg-gray-50">
              別のタイプを見る
            </button>
          </div>
        </div>
      ) : (
        /* 未選択 */
        <div className="text-center py-12 text-gray-300">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-sm text-gray-400">上から順に選んでください</p>
        </div>
      )}
    </div>
  );
}

export default ManualView;
