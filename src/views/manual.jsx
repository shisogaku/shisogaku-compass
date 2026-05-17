import React, { useState } from 'react';
import { BC, GS, ALL_PROFILES } from '../data.js';

// ── この人が本当に求めていること・怖れていること ────
const NEEDS_DB = {
  'O型女性': {
    needs: [
      '頼られること・必要とされること（これが最大の喜び）',
      '一緒に過ごす時間と「そこにいてくれる」安心感',
      '感謝や労いの言葉・行動で示す愛情',
      '集団の中で「いてくれてよかった」と思われる存在感',
    ],
    fears: [
      '誠意のない・軽く扱われる関わり方',
      '必要とされなくなること・静かに放置されること',
      '蓄積した怒りが爆発して大切な関係を壊してしまうこと',
    ],
    recharge: [
      'みんなで楽しく盛り上がる時間',
      '誰かに本気で頼られ、役に立てたとき',
      '運動・飲み会・思い切り泣くこと',
    ],
    pattern: '不満を内側に溜め込んで表に出さない → ある日突然大爆発・関係リセット',
  },
  'O型男性': {
    needs: [
      '尊敬・リーダーとして認めてもらうこと（最重要）',
      '相談を持ちかけられること・頼られること',
      'チームや仲間の中で「あなたがいると心強い」という存在感',
      '感謝の言葉と必要とされ続ける関係',
    ],
    fears: [
      'プライドを公の場で傷つけられること',
      '必要とされない・放置されること',
      '誠意のない行動・信頼を裏切られること',
    ],
    recharge: [
      '誰かのために動いて感謝されたとき',
      'リーダーとして認められる場面・仲間からの称賛',
      'チームで成果を出したとき',
    ],
    pattern: 'プライドへの傷が内側に蓄積 → 限界で大爆発・その後は関係をリセット',
  },
  'A型女性': {
    needs: [
      '几帳面さ・気配りを具体的に認めてもらうこと（最重要）',
      '計画的で礼儀正しい・誠実な関わり方',
      '約束・時間・マナーを守られること',
      '「あなたがいると助かる」という継続的な評価',
    ],
    fears: [
      '公の場でのミスの指摘・恥をかかされること',
      '急な予定変更・マナー違反・準備不足な対応',
      '自分の完璧主義が崩れて「できない人」に見られること',
    ],
    recharge: [
      '自分の努力・気配りを具体的に褒めてもらえたとき',
      '計画通りに物事が進んだとき',
      '愚痴や悩みを誰かに聞いてもらって心のゴミを吐き出せたとき',
    ],
    pattern: '不満を言葉として足し算で蓄積 → ある日言葉で爆発（言い回しが鋭い）',
  },
  'A型男性': {
    needs: [
      '真面目さ・几帳面さを言葉で認めてもらうこと（最重要）',
      '準備・計画力への称賛と信頼',
      '論理的・理性的な対話と「あなたの言う通り」という納得感',
      '継続的に「頼りにしている」と感じさせる関係',
    ],
    fears: [
      'プライドを傷つける批判・ミスの公開',
      '約束破り・時間を守らない相手',
      '感情論だけで論理を無視した押しつけ',
    ],
    recharge: [
      '細かい気配りに気づいて褒めてもらえたとき',
      '自分の計画・準備が「さすが」と評価されたとき',
      '論理的な対話でしっかり理解し合えたとき',
    ],
    pattern: '不満を足し算で積み上げ → 言葉で反撃（言い回しが巧みで傷つくことがある）',
  },
  'B型女性': {
    needs: [
      '個性・自由をそのまま認めてもらうこと（最重要）',
      '束縛されずに自分らしくいられる空間と関係',
      '正直・本音ベースの対話',
      '一緒に楽しめる・盛り上がれる時間と空気',
    ],
    fears: [
      '型にはめられること・自由を制限されること',
      '個性を否定・批判されること',
      '感情を論理で否定・封じ込められること',
    ],
    recharge: [
      '自分が心底楽しいと思えることをしたとき',
      '個性や発想を「面白い！」と認めてもらえたとき',
      '制約なく自由に動けた・好きなことに没頭できた時間',
    ],
    pattern: '怒りはストレートに出す・後は引かない。ただし深く傷つくと孤独を一人で抱え込む',
  },
  'B型男性': {
    needs: [
      '独創性・センス・個性を認めてもらうこと（最重要）',
      '束縛されない・管理されない自由な関係',
      '本音の対話・正直な交流',
      '「あなたの発想は面白い」という肯定',
    ],
    fears: [
      '自由を制限・管理・監視されること',
      '集団ルールや形式への無理な強制',
      '個性・センスを否定されること',
    ],
    recharge: [
      '自分のやりたいことに思い切り熱中できたとき',
      '独自の発想・アイデアを「それいい！」と認められたとき',
      '制約なく本音で話せる・動ける時間',
    ],
    pattern: '怒りは直接出す・後は引かない。強がりの裏に意外な繊細さと孤独感がある',
  },
  'AB型女性': {
    needs: [
      '一人の時間・自分のペースを尊重されること（最重要）',
      '「理解している」を態度と言葉で示してくれる相手',
      '知的な対話・深い話題で繋がれる関係',
      '急かさず・焦らせず待ってもらえること',
    ],
    fears: [
      '一人の時間を邪魔・侵害されること',
      '感情的な押しつけや強制',
      '距離を詰めすぎられること（→ 心を完全に閉じる）',
    ],
    recharge: [
      '一人で過ごす静かで誰にも邪魔されない時間',
      '自分の世界観・考えを「なるほど」と理解してもらえたとき',
      '知的な対話で心が動いたとき',
    ],
    pattern: '不満を溜め込んで表に出さない → 限界で静かに去る（外から見ると突然消える）',
  },
  'AB型男性': {
    needs: [
      '論理的な対話と知的好奇心を刺激してくれる関係（最重要）',
      '一人の時間・自分のペースの確保',
      '独自の視点・世界観への理解と尊重',
      '焦らず時間をかけて信頼を積み上げてくれること',
    ],
    fears: [
      '感情的な圧力・論理なき要求',
      '過密スケジュール・一人の時間の侵害',
      '自分のペースや世界観を乱されること',
    ],
    recharge: [
      '一人でじっくり考える・深掘りできる時間',
      '知的な対話で「この人はわかってくれる」と感じたとき',
      '独自性を「面白い視点だ」と理解してもらえたとき',
    ],
    pattern: '感情をほぼ表に出さない → 蓄積して限界で静かに消える（怒っているか外から見えにくい）',
  },
};

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
            { id:'female', label:'女性', color:'#C4607A' },
            { id:'male',   label:'男性', color:'#6070A8' },
          ].map(g => {
            const on = gender === g.id;
            return (
              <button key={g.id} type="button" onClick={() => setGender(g.id)}
                className="py-4 rounded-2xl font-bold text-sm transition-all"
                style={on
                  ? { background: g.color, color: '#fff', boxShadow: `0 4px 16px ${g.color}35` }
                  : { background: '#FAF7F2', color: g.color, border: `1.5px solid ${g.color}50` }}>
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
          <div className="py-6" style={{ borderBottom: '1px solid #f0ede8' }}>
            <p className="text-base text-gray-700 leading-relaxed font-bold text-center px-2"
              style={{ letterSpacing: '0.01em' }}>
              "{CATCH[label]}"
            </p>
          </div>

          {/* 近づき方 */}
          <Sec label="近づき方" color={color} items={gsData.対応} max={4} />

          {/* NGリスト */}
          <Sec label="やめて" color="#ef4444" items={gsData.危険} max={4} />

          {/* 求めていること・怖れていること・充電・感情パターン */}
          {NEEDS_DB[label] && (
            <div className="py-5 space-y-3" style={{ borderTop: '1px solid #f0ede8' }}>
              <p className="text-[10px] font-bold tracking-widest uppercase text-center mb-4"
                style={{ color: '#B0A090' }}>Inner World</p>

              {/* 求めていること */}
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #EEE8E2', borderLeft: `3px solid ${color}` }}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color }}>
                    求めていること
                  </p>
                  <ul className="space-y-2 pb-3">
                    {NEEDS_DB[label].needs.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: color, minWidth: 4 }} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 怖れていること */}
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #EEE8E2', borderLeft: '3px solid #C87070' }}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color: '#C87070' }}>
                    怖れていること
                  </p>
                  <ul className="space-y-2 pb-3">
                    {NEEDS_DB[label].fears.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: '#C87070', minWidth: 4 }} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 感情の充電方法 */}
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #EEE8E2', borderLeft: '3px solid #7A9E7A' }}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color: '#7A9E7A' }}>
                    感情の充電方法
                  </p>
                  <ul className="space-y-2 pb-3">
                    {NEEDS_DB[label].recharge.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: '#7A9E7A', minWidth: 4 }} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 感情パターン */}
              <div className="rounded-xl px-4 py-3"
                style={{ background: '#FBF7F0', border: '1px solid #E8DDD0', borderLeft: '3px solid #C4A070' }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#C4A070' }}>
                  感情パターン
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{NEEDS_DB[label].pattern}</p>
              </div>
            </div>
          )}

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
