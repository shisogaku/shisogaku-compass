import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BC, PLAN_DB, SCENE_DB } from '../data.js';
import { _sb, sbDb, SUPABASE_URL } from '../lib/supabase.js';

import { TorokuView } from './profile.jsx';
import { PairView } from './pair.jsx';
import { LifeView } from './life.jsx';
import { ChatView, AvatarUploader, getAvatar } from './chat.jsx';

const CompatView   = lazy(() => import('./social.jsx').then(m => ({ default: m.CompatView })));
const SceneView    = lazy(() => import('./social.jsx').then(m => ({ default: m.SceneView })));
const SimulateView = lazy(() => import('./social.jsx').then(m => ({ default: m.SimulateView })));
const PowerView    = lazy(() => import('./knowledge.jsx').then(m => ({ default: m.PowerView })));
const PlanView     = lazy(() => import('./plan.jsx').then(m => ({ default: m.PlanView })));
const EvaluationFormView = lazy(() => import('./evaluate.jsx').then(m => ({ default: m.EvaluationFormView })));
const ManualView         = lazy(() => import('./manual.jsx').then(m => ({ default: m.ManualView })));

const AI_TAB_ENABLED = false;

function ViewLoading() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-amber-800">
        <span className="inline-block w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" aria-hidden="true"/>
        <span>読み込み中…</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ロゴ
// ─────────────────────────────────────────
export function LogoIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <defs>
        <radialGradient id="lgBg" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f5ece4"/>
          <stop offset="100%" stopColor="#d9c4b0"/>
        </radialGradient>
        <linearGradient id="lgBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4A882"/>
          <stop offset="50%" stopColor="#9A7A60"/>
          <stop offset="100%" stopColor="#7A5C48"/>
        </linearGradient>
        <linearGradient id="lgNeedleUp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4607A"/>
          <stop offset="100%" stopColor="#D4849A"/>
        </linearGradient>
        <linearGradient id="lgNeedleDown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B0A0C0"/>
          <stop offset="100%" stopColor="#C8B8D8"/>
        </linearGradient>
        <filter id="lgShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#C4A882" floodOpacity="0.35"/>
        </filter>
        <filter id="lgGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#lgBg)" stroke="url(#lgBorder)" strokeWidth="3.5" filter="url(#lgShadow)"/>
      <circle cx="60" cy="60" r="6" fill="white" opacity="0.9"/>
      <circle cx="60" cy="60" r="3" fill="#9A7A60"/>
      <line x1="60" y1="54" x2="60" y2="12" stroke="url(#lgNeedleUp)" strokeWidth="5" strokeLinecap="round" filter="url(#lgGlow)"/>
      <line x1="60" y1="66" x2="60" y2="100" stroke="url(#lgNeedleDown)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="60" x2="95" y2="60" stroke="#DDD0C4" strokeWidth="3" strokeLinecap="round"/>
      <line x1="60" y1="60" x2="25" y2="60" stroke="#DDD0C4" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="60" cy="12" r="5" fill="#C4607A" filter="url(#lgGlow)"/>
      <text x="60" y="112" textAnchor="middle" fontSize="9" fill="#9A7A60" fontWeight="bold" letterSpacing="1">COMPASS</text>
    </svg>
  );
}

export function Icon({ name, size=20, color="currentColor", sw=1.5 }) {
  const P = (d, op) => <path strokeLinecap="round" strokeLinejoin="round" d={d} opacity={op||1}/>;
  const C = (cx,cy,r,f) => <circle cx={cx} cy={cy} r={r} fill={f||"none"}/>;
  const icons = {
    user:     <>{C(12,8,4)}{P("M4 20a8 8 0 0116 0")}</>,
    people:   <>{C(9,7,4)}{P("M3 21v-1a6 6 0 016-6h4a6 6 0 016 6v1",.65)}{P("M16 3.13a4 4 0 010 7.75",.45)}</>,
    heart:    <>{P("M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z")}</>,
    matrix:   <>{P("M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18")}</>,
    chat:     <>{P("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z")}{P("M8 10h8M8 13h5",.45)}</>,
    book:     <>{P("M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25")}</>,
    sparkle:  <>{P("M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z")}{P("M18 9.75l-.26-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259A3.375 3.375 0 0017.74 3.3L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 9.75z",.7)}</>,
    envelope: <>{P("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z")}{P("M22 6l-10 7L2 6")}</>,
    calender: <>{P("M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z")}{P("M16 1v4M8 1v4M3 9h18")}{P("M8 13h2M12 13h2M8 17h2",.55)}</>,
    journey:  <>{P("M3 17c2-5 4-2 6-4s4-8 6-6 4 6 6 2")}{C(3,17,1.5,color)}{C(9,13,1.5,color)}{C(15,7,1.5,color)}</>,
    robot:    <>{P("M9 3H7a2 2 0 00-2 2v2M15 3h2a2 2 0 012 2v2M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z")}{C(9,13,1.5)}{C(15,13,1.5)}{P("M9 17h6",.6)}</>,
    menu:     <>{P("M4 6h16M4 12h16M4 18h16")}</>,
    external: <>{P("M14 3h7v7")}{P("M10 14L21 3")}{P("M21 14v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6")}</>,
    plus:     <>{P("M12 5v14M5 12h14")}</>,
    x:        <>{P("M18 6L6 18M6 6l12 12")}</>,
    chevron:  <>{P("M19 9l-7 7-7-7")}</>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]||null}
    </svg>
  );
}

// ─────────────────────────────────────────
// オンボーディングモーダル
// ─────────────────────────────────────────
export function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0);
  const titleId = 'welcome-modal-title';
  const descId = 'welcome-modal-desc';
  const closeBtnRef = React.useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const steps = [
    {
      title: '支礎学コンパスへようこそ',
      body: (
        <>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-800">血液型コミュニケーション</span>の視点で、
            自分と周りの人との関わりかたを見つけるツールです。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            左パネルに相手を登録すると、相性・シーンTips・妄想チャットまで楽しめます。
          </p>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            ※ 血液型による性格論は娯楽目的の参考としてお楽しみください。
          </p>
        </>
      ),
    },
    {
      title: 'まず「自分」を登録',
      body: (
        <>
          <div className="flex justify-center gap-2 mb-4">
            {['O','A','B','AB'].map(b => (
              <div key={b}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow"
                style={{backgroundColor:BC[b].color}}>{b}</div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">
            左パネル上部の <span className="font-bold text-amber-700">「自分を登録」</span> から、
            名前と血液型を入力してください。
          </p>
        </>
      ),
    },
    {
      title: '相手を登録してチャット！',
      body: (
        <>
          <p className="text-gray-600 leading-relaxed">
            続けて <span className="font-bold text-amber-700">「＋ 相手を追加」</span> から、
            気になる人を登録。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            相手を選ぶと中央に<span className="font-bold">妄想チャット</span>が始まります。<br/>
            顔写真・声も設定できます。
          </p>
        </>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const cur = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)'}}
      onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{border:'1px solid rgba(150,118,88,0.15)'}}>
        <div className="px-6 pt-6 pb-3 flex items-start gap-3">
          <span aria-hidden="true" className="flex items-start"><LogoIcon size={40}/></span>
          <div className="flex-1">
            <h2 id={titleId} className="text-lg font-bold text-gray-800 leading-tight">{cur.title}</h2>
            <div className="text-xs text-gray-400 mt-0.5">ステップ {step+1} / {steps.length}</div>
          </div>
          <button ref={closeBtnRef} onClick={onClose} aria-label="閉じる" type="button"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1">×</button>
        </div>
        <div className="px-6 pb-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-colors"
                style={{background: i <= step ? 'linear-gradient(90deg,#C4A882,#8C7055)' : '#f3e8ff'}} />
            ))}
          </div>
        </div>
        <div id={descId} className="px-6 pb-5 min-h-[160px]">{cur.body}</div>
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button onClick={onClose} type="button" className="text-sm text-gray-500 font-medium px-2 py-2">スキップ</button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step-1)} type="button"
                className="text-sm text-gray-600 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg">戻る</button>
            )}
            <button onClick={() => isLast ? onClose() : setStep(step+1)} type="button"
              className="text-sm font-bold text-white px-5 py-2 rounded-lg shadow"
              style={{background:'#8C7055'}}>
              {isLast ? 'はじめる' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 相手登録フォーム（モーダル）
// ─────────────────────────────────────────
function PartnerFormModal({ initial, onSave, onClose, user }) {
  const [name, setName] = useState(initial?.name || '');
  const [blood, setBlood] = useState(initial?.blood || null);
  const [gender, setGender] = useState(initial?.gender || null);
  const [relation, setRelation] = useState(initial?.relation || '友人');

  const RELATIONS = ['恋人', '友人', '同僚', '家族', '上司', '部下', 'その他'];

  const handleSave = () => {
    if (!name.trim() || !blood || !gender) return;
    onSave({
      id: initial?.id || Date.now().toString(),
      name: name.trim(), blood, gender, relation,
      color: BC[blood].color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{background:'rgba(0,0,0,0.4)', backdropFilter:'blur(3px)'}}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="font-bold text-gray-800">{initial ? '相手を編集' : '相手を追加'}</div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="text-xs font-bold text-gray-500 mb-1">ニックネーム</div>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              placeholder="例：田中さん、好きな人、など"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 mb-1">性別</div>
            <div className="flex gap-2">
              {[{id:'female',label:'👩 女性'},{id:'male',label:'👨 男性'}].map(g => (
                <button key={g.id} type="button" onClick={() => setGender(g.id)}
                  className="flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                  style={gender === g.id
                    ? {borderColor:'#8C7055', background:'#FDF0E8', color:'#7A5C48'}
                    : {borderColor:'#e5e7eb', color:'#6b7280'}}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 mb-1">血液型</div>
            <div className="grid grid-cols-4 gap-1">
              {['O','A','B','AB'].map(b => (
                <button key={b} type="button" onClick={() => setBlood(b)}
                  className="py-2 rounded-xl text-sm font-bold border-2 transition-all"
                  style={blood === b
                    ? {backgroundColor:BC[b].color, borderColor:BC[b].color, color:'white'}
                    : {borderColor:'#e5e7eb', color:'#374151'}}>
                  {b}型
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 mb-1">関係性</div>
            <div className="flex flex-wrap gap-1">
              {RELATIONS.map(r => (
                <button key={r} type="button" onClick={() => setRelation(r)}
                  className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                  style={relation === r
                    ? {background:'#8C7055', borderColor:'#8C7055', color:'white'}
                    : {borderColor:'#e5e7eb', color:'#6b7280'}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 font-medium">
            キャンセル
          </button>
          <button type="button" onClick={handleSave}
            disabled={!name.trim() || !blood || !gender}
            className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{background: name.trim() && blood && gender ? '#8C7055' : '#d1c4b8'}}>
            {initial ? '更新する' : '追加する'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 左パネル
// ─────────────────────────────────────────
const FEATURE_TABS = [
  { id:'manual',   label:'取説',   icon:'sparkle'  },
  { id:'simulate', label:'伝え方', icon:'envelope' },
  { id:'compat',   label:'相性',   icon:'heart'    },
  { id:'scene',    label:'シーン', icon:'chat'     },
  { id:'life',     label:'ライフ', icon:'journey'  },
  { id:'power',    label:'知識',   icon:'book'     },
  { id:'plan',     label:'プラン', icon:'calender' },
];

function LeftPanel({
  profiles, setProfiles, myId, setMyId, user,
  selectedPartnerId, setSelectedPartnerId,
  featureTab, setFeatureTab,
  onLogin,
}) {
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showSelf, setShowSelf] = useState(false);
  const [avatarTick, setAvatarTick] = useState(0);

  const me = profiles.find(p => p.id === myId);
  const partners = profiles.filter(p => p.id !== myId);
  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  const handleSavePartner = (data) => {
    const isNew = !profiles.find(p => p.id === data.id);
    if (isNew) {
      setProfiles(prev => [...prev, data]);
      setSelectedPartnerId(data.id);
    } else {
      setProfiles(prev => prev.map(p => p.id === data.id ? data : p));
    }
    if (user) sbDb.saveProfile(user.id, data, false);
    setShowPartnerForm(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id) => {
    if (!window.confirm('この相手を削除しますか？')) return;
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (selectedPartnerId === id) setSelectedPartnerId(null);
    if (user) sbDb.deleteProfile(user.id, id);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#F7F3EE' }}>
      {/* ── 自分セクション ── */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(150,118,88,0.12)' }}>
        <div className="text-[10px] font-bold text-gray-400 mb-1.5 tracking-wider uppercase">自分</div>
        {me ? (
          <div className="flex items-center gap-2 cursor-pointer rounded-xl px-2 py-1.5 hover:bg-amber-50 transition-all"
            onClick={() => setShowSelf(s => !s)}>
            <AvatarUploader profile={me} user={user} size={32} onUpdate={() => setAvatarTick(t => t+1)}/>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-800 truncate">{me.name}</div>
              <div className="text-[10px] text-gray-400">{me.blood}型 · {me.gender === 'female' ? '女性' : '男性'}</div>
            </div>
            <span className="text-gray-400" style={{transform: showSelf ? 'rotate(180deg)' : '', transition:'transform 0.2s'}}>
              <Icon name="chevron" size={12} color="#999"/>
            </span>
          </div>
        ) : (
          <button type="button" onClick={() => setShowSelf(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed text-xs font-bold transition-all"
            style={{ borderColor: '#C4A882', color: '#8C7055', background: 'rgba(196,168,130,0.06)' }}>
            <Icon name="plus" size={14} color="#8C7055"/>
            自分を登録する
          </button>
        )}
        {showSelf && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-gray-100">
            <Suspense fallback={<ViewLoading/>}>
              <TorokuView profiles={profiles} setProfiles={setProfiles} myId={myId} setMyId={setMyId} user={user} onLogin={onLogin}/>
            </Suspense>
          </div>
        )}
      </div>

      {/* ── 相手リスト ── */}
      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(150,118,88,0.12)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">相手</div>
          <button type="button" onClick={() => { setEditingPartner(null); setShowPartnerForm(true); }}
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all"
            style={{ background: 'rgba(140,112,85,0.08)', color: '#8C7055' }}>
            <Icon name="plus" size={10} color="#8C7055"/> 追加
          </button>
        </div>

        {partners.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-3">
            まだ相手が登録されていません
          </div>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {partners.map(p => {
              const avatar = getAvatar(p.id);
              const isSelected = selectedPartnerId === p.id;
              return (
                <div key={p.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-all group"
                  style={isSelected
                    ? { background: p.color + '18', border: `1px solid ${p.color}44` }
                    : { border: '1px solid transparent' }}
                  onClick={() => setSelectedPartnerId(p.id)}>
                  <div className="rounded-full overflow-hidden flex-shrink-0"
                    style={{ width: 28, height: 28, background: p.color + '22', border: `1.5px solid ${p.color}` }}>
                    {avatar
                      ? <img src={avatar} alt="" className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-[10px] font-black" style={{color:p.color}}>{p.blood}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isSelected ? '#5C3A20' : '#374151' }}>{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.relation} · {p.blood}型</div>
                  </div>
                  <div className="hidden group-hover:flex gap-1">
                    <button type="button"
                      onClick={e => { e.stopPropagation(); setEditingPartner(p); setShowPartnerForm(true); }}
                      className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      ✏️
                    </button>
                    <button type="button"
                      onClick={e => { e.stopPropagation(); handleDeletePartner(p.id); }}
                      className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 機能タブ ── */}
      <div className="px-3 pt-2 pb-1 flex-shrink-0" style={{ borderBottom: '1px solid rgba(150,118,88,0.12)' }}>
        <div className="text-[10px] font-bold text-gray-400 mb-1.5 tracking-wider uppercase">機能</div>
        <div className="flex flex-wrap gap-1">
          {FEATURE_TABS.map(tab => (
            <button key={tab.id} type="button"
              onClick={() => setFeatureTab(tab.id)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all"
              style={featureTab === tab.id
                ? { background: '#8C7055', color: 'white' }
                : { background: 'rgba(140,112,85,0.06)', color: '#7A6048' }}>
              <Icon name={tab.icon} size={11} color={featureTab === tab.id ? 'white' : '#9A8060'}/>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 機能コンテンツ ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <Suspense fallback={<ViewLoading/>}>
          {featureTab === 'manual'   && <ManualView/>}
          {featureTab === 'simulate' && <SimulateView profiles={profiles} myId={myId}/>}
          {featureTab === 'compat'   && <CompatView profiles={profiles} myId={myId}/>}
          {featureTab === 'scene'    && <SceneView profiles={profiles} myId={myId}/>}
          {featureTab === 'life'     && <LifeView/>}
          {featureTab === 'power'    && <PowerView profiles={profiles}/>}
          {featureTab === 'plan'     && <PlanView/>}
        </Suspense>
      </div>

      {/* ── 認証 / PR ── */}
      <div className="flex-shrink-0 px-3 py-2 space-y-2" style={{ borderTop: '1px solid rgba(150,118,88,0.12)' }}>
        {/* PR */}
        <a href="https://px.a8.net/svt/ejp?a8mat=356JGK+AINTDM+2PEO+1BPGPE"
          rel="nofollow noopener noreferrer sponsored" target="_blank"
          className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl text-[10px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #9A7A60, #C4A882)' }}>
          <Icon name="external" size={10} color="white" sw={2.2}/>
          お悩み相談・カウンセリング
        </a>
        <img src="https://www13.a8.net/0.gif?a8mat=356JGK+AINTDM+2PEO+1BPGPE"
          alt="" width="1" height="1"
          style={{ border: 0, position: 'absolute', pointerEvents: 'none', width: 1, height: 1 }}/>
        {/* 認証 */}
        {SUPABASE_URL !== 'YOUR_SUPABASE_URL' && (
          user ? (
            <div className="flex items-center gap-2 px-1">
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="avatar"
                  className="w-6 h-6 rounded-full border border-green-400 flex-shrink-0"/>
              )}
              <div className="flex-1 min-w-0 text-[10px] text-gray-500 truncate">
                {user.user_metadata?.full_name || user.email}
              </div>
              <button onClick={async () => { await _sb.auth.signOut(); }}
                className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded bg-gray-100">
                ログアウト
              </button>
            </div>
          ) : (
            <button onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-[10px] font-bold transition-all"
              style={{ background: 'rgba(140,112,85,0.07)', border: '1px solid rgba(140,112,85,0.15)', color: '#8C7055' }}>
              🔑 Googleログイン
            </button>
          )
        )}
      </div>

      {/* 相手追加/編集モーダル */}
      {showPartnerForm && (
        <PartnerFormModal
          initial={editingPartner}
          onSave={handleSavePartner}
          onClose={() => { setShowPartnerForm(false); setEditingPartner(null); }}
          user={user}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// メイン
// ─────────────────────────────────────────
export function CommunicationCompass() {
  const evalToken = (() => {
    const hash = window.location.hash;
    const m = hash.match(/^#\/evaluate\/([a-f0-9]+)$/);
    return m ? m[1] : null;
  })();

  const [featureTab, setFeatureTab] = useState('manual');
  const [leftOpen, setLeftOpen] = useState(false); // mobile: left panel visible
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);

  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem('sg_onboarded'); } catch { return false; }
  });
  const closeWelcome = () => {
    try { localStorage.setItem('sg_onboarded', '1'); } catch {}
    setShowWelcome(false);
  };

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(!!_sb);

  const [profiles, setProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shisogaku_profiles')) || []; } catch { return []; }
  });
  const [myId, setMyId] = useState(() => {
    try { return localStorage.getItem('shisogaku_myId') || null; } catch { return null; }
  });

  useEffect(() => {
    try { localStorage.setItem('shisogaku_profiles', JSON.stringify(profiles)); } catch {}
  }, [profiles]);
  useEffect(() => {
    try {
      if (myId) localStorage.setItem('shisogaku_myId', myId);
      else localStorage.removeItem('shisogaku_myId');
    } catch {}
  }, [myId]);

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
        sbDb.log(u.id, 'login', { provider: session?.user?.app_metadata?.provider });
      } else {
        setProfiles([]);
        setMyId(null);
        try {
          localStorage.removeItem('shisogaku_profiles');
          localStorage.removeItem('shisogaku_myId');
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
    try { localProfiles = JSON.parse(localStorage.getItem('shisogaku_profiles')) || []; } catch {}
    try { localMyId = localStorage.getItem('shisogaku_myId') || null; } catch {}
    const sb = Array.isArray(sbProfiles) ? sbProfiles : [];
    const sbIds = new Set(sb.map(p => p.id));
    const onlyLocal = localProfiles.filter(p => !sbIds.has(p.id));
    const merged = [...sb, ...onlyLocal];
    if (merged.length > 0) {
      setProfiles(merged);
      try { localStorage.setItem('shisogaku_profiles', JSON.stringify(merged)); } catch {}
    }
    if (onlyLocal.length > 0) {
      const effectiveMyId = sbMyId || localMyId;
      for (const p of onlyLocal) await sbDb.saveProfile(userId, p, p.id === effectiveMyId);
    }
    if (sbMyId !== null) {
      setMyId(sbMyId);
      try { localStorage.setItem('shisogaku_myId', sbMyId); } catch {}
    } else if (localMyId) {
      setMyId(localMyId);
    }
  };

  const handleLogin = async () => {
    if (!_sb) return;
    await _sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
  };

  const me = profiles.find(p => p.id === myId);
  const selectedPartner = profiles.find(p => p.id === selectedPartnerId && p.id !== myId);

  // evaluate ルート
  if (evalToken) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: '#FAF7F2' }}>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 12px rgba(180,130,70,0.1)' }}>
            <Suspense fallback={<ViewLoading/>}>
              <EvaluationFormView token={evalToken} user={user}/>
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FAF7F2' }}>
      <a href="#main-content" className="skip-link">本文へスキップ</a>
      {showWelcome && <WelcomeModal onClose={closeWelcome}/>}

      {/* ── モバイル：左パネルオーバーレイ ── */}
      {leftOpen && (
        <button type="button"
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          aria-label="閉じる"
          onClick={() => setLeftOpen(false)}/>
      )}

      {/* ── 左パネル ── */}
      <aside
        aria-label="機能パネル"
        className={[
          'flex flex-col z-30 transition-transform duration-300 flex-shrink-0',
          'fixed md:static inset-y-0 left-0',
          'w-72 lg:w-80',
          leftOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        style={{ borderRight: '1px solid rgba(150,118,88,0.15)' }}>
        {/* 左パネルヘッダー：ロゴ */}
        <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
          style={{ background: '#F7F3EE', borderBottom: '1px solid rgba(150,118,88,0.12)' }}>
          <LogoIcon size={26}/>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black" style={{ color: '#7A5C48' }}>支礎学コンパス</div>
            <div className="text-[10px] text-gray-400">血液型 × 妄想チャット</div>
          </div>
          {/* リンク群（小） */}
          <div className="flex gap-1">
            {[
              { url: 'https://twitter.com/KunTekito', icon: '𝕏' },
              { url: 'https://www.youtube.com/c/tekitokun', icon: '▶' },
            ].map(l => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ background: '#8C7055' }}>
                {l.icon}
              </a>
            ))}
          </div>
        </div>
        <LeftPanel
          profiles={profiles}
          setProfiles={setProfiles}
          myId={myId}
          setMyId={setMyId}
          user={user}
          selectedPartnerId={selectedPartnerId}
          setSelectedPartnerId={(id) => { setSelectedPartnerId(id); setLeftOpen(false); }}
          featureTab={featureTab}
          setFeatureTab={setFeatureTab}
          onLogin={handleLogin}
        />
      </aside>

      {/* ── 中央：チャット ── */}
      <div id="main-content" className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* モバイルヘッダー */}
        <header className="md:hidden flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{ background: '#F7F3EE', borderBottom: '1px solid rgba(150,118,88,0.15)' }}>
          <button type="button"
            onClick={() => setLeftOpen(s => !s)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="機能パネルを開く">
            <Icon name="menu" size={18} color="#7A5C48"/>
          </button>
          <LogoIcon size={22}/>
          <span className="text-sm font-black flex-1" style={{ color: '#7A5C48' }}>支礎学コンパス</span>
          {selectedPartner && (
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: selectedPartner.color }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                style={{ background: selectedPartner.color }}>
                {selectedPartner.blood}
              </div>
              {selectedPartner.name}
            </div>
          )}
        </header>

        {/* モバイル下部タブ */}
        <nav aria-label="モバイルナビ" className="md:hidden flex items-center px-2 py-1.5 flex-shrink-0"
          style={{ background: '#2c1a0e', borderTop: '1px solid rgba(255,220,160,0.08)' }}>
          <button type="button"
            onClick={() => setLeftOpen(false)}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all"
            style={!leftOpen ? { background: '#8C7055' } : {}}>
            <Icon name="chat" size={18} color={!leftOpen ? '#fdf8f0' : 'rgba(253,248,240,0.4)'} sw={1.5}/>
            <span className="text-[10px] font-bold" style={{ color: !leftOpen ? '#fdf8f0' : 'rgba(253,248,240,0.4)' }}>チャット</span>
          </button>
          <button type="button"
            onClick={() => setLeftOpen(true)}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all"
            style={leftOpen ? { background: '#8C7055' } : {}}>
            <Icon name="sparkle" size={18} color={leftOpen ? '#fdf8f0' : 'rgba(253,248,240,0.4)'} sw={1.5}/>
            <span className="text-[10px] font-bold" style={{ color: leftOpen ? '#fdf8f0' : 'rgba(253,248,240,0.4)' }}>機能</span>
          </button>
        </nav>

        <ChatView partner={selectedPartner} me={me} user={user}/>
      </div>
    </div>
  );
}

export default CommunicationCompass;
