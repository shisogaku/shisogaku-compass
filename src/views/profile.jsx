import { useState, useEffect } from 'react';
import { BC, LEVELUP_TIPS, RADAR_AXES, RADAR_DATA, RADAR_DESC } from '../data.js';
import { sbDb } from '../lib/supabase.js';
import { LevelUpSection, RadarChart, RelationshipInsights, MARRIAGE_OPTIONS, KIDS_OPTIONS, LOVE_OPTIONS, DIVORCE_OPTIONS } from './life.jsx';
import { EvaluationPanel } from './evaluate.jsx';

export function ProfileHistoryFields({ marriage, setMarriage, kids, setKids, loveExp, setLoveExp, divorce, setDivorce }) {
  return (
    <div className="space-y-2.5 p-3 bg-white rounded-xl border border-gray-200">
      <div className="text-xs font-bold text-gray-600 flex items-center gap-1">📋 恋愛・婚姻歴（任意）</div>
      <div>
        <div className="text-xs text-gray-500 mb-1">結婚回数</div>
        <div className="flex gap-1">
          {MARRIAGE_OPTIONS.map(o => (
            <button key={o} onClick={() => setMarriage(marriage === o ? "" : o)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${marriage === o ? "bg-rose-500 text-white border-rose-500" : "border-gray-300 text-gray-600"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">離婚経験</div>
        <div className="flex gap-1">
          {DIVORCE_OPTIONS.map(o => (
            <button key={o} onClick={() => setDivorce(divorce === o ? "" : o)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${divorce === o ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-600"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">子どもの有無</div>
        <div className="flex gap-1">
          {KIDS_OPTIONS.map(o => (
            <button key={o} onClick={() => setKids(kids === o ? "" : o)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${kids === o ? "bg-green-500 text-white border-green-500" : "border-gray-300 text-gray-600"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">恋愛経験</div>
        <div className="flex gap-1">
          {LOVE_OPTIONS.map(o => (
            <button key={o} onClick={() => setLoveExp(loveExp === o ? "" : o)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${loveExp === o ? "bg-indigo-500 text-white border-indigo-500" : "border-gray-300 text-gray-600"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SelfForm({ blood, setBl, gender, setGe, name, setNa, age, setAg,
                    marriage, setMarriage, kids, setKids, loveExp, setLoveExp, divorce, setDivorce,
                    onSave, onCancel, isEdit }) {
  const AGES = ["10代","20代","30代","40代","50代","60代","70代"];
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs text-gray-500 mb-1 font-bold">ニックネーム</div>
        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          placeholder="例：自分、さちこ、など" value={name} onChange={e => setNa(e.target.value)} />
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1 font-bold">性別</div>
        <div className="flex gap-2">
          {[{id:"female",label:"👩 女性"},{id:"male",label:"👨 男性"}].map(g => (
            <button key={g.id} onClick={() => setGe(g.id)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${gender === g.id ? "border-indigo-500 bg-indigo-100 text-indigo-700" : "border-gray-200 text-gray-600"}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1 font-bold">血液型</div>
        <div className="grid grid-cols-4 gap-1">
          {["O","A","B","AB"].map(b => (
            <button key={b} onClick={() => setBl(b)} className="py-2 rounded-lg text-sm font-bold border-2 transition-all"
              style={blood === b ? {backgroundColor:BC[b].color,borderColor:BC[b].color,color:"white"} : {borderColor:"#e5e7eb",color:"#374151"}}>
              {b}型
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1 font-bold">年代（任意）</div>
        <div className="flex flex-wrap gap-1">
          {AGES.map(a => (
            <button key={a} onClick={() => setAg(age === a ? "" : a)}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${age === a ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      {/* 婚姻歴フィールド */}
      <ProfileHistoryFields
        marriage={marriage} setMarriage={setMarriage}
        kids={kids} setKids={setKids}
        loveExp={loveExp} setLoveExp={setLoveExp}
        divorce={divorce} setDivorce={setDivorce} />
      {/* プレビュー */}
      {blood && gender && (
        <div className="p-3 bg-white rounded-xl border border-indigo-100">
          <div className="text-xs font-bold text-indigo-600 text-center mb-2">
            📊 {blood}型{gender === "female" ? "女性" : "男性"} の強み・弱みプレビュー
          </div>
          <RadarChart blood={blood} gender={gender} color={BC[blood].color} />
        </div>
      )}
      <button onClick={onSave} disabled={!name.trim() || !blood || !gender}
        className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${name.trim() && blood && gender ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400"}`}>
        {isEdit ? "更新する" : "登録する"}
      </button>
      {isEdit && (
        <button onClick={onCancel} className="w-full py-1.5 rounded-lg text-xs text-gray-500 border border-gray-300">
          キャンセル
        </button>
      )}
    </div>
  );
}

export function TorokuView({ profiles, setProfiles, myId, setMyId, user, onLogin }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [blood, setBlood] = useState(null);
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [marriage, setMarriage] = useState("");
  const [kids, setKids] = useState("");
  const [loveExp, setLoveExp] = useState("");
  const [divorce, setDivorce] = useState("");
  const [levelChecks, setLevelChecks] = useState({});

  const me = profiles.find(p => p.id === myId);

  // ── Supabase からレベルチェックを初期ロード ──
  useEffect(() => {
    if (!user || !me) return;
    const pk = `${me.blood}${me.gender === "female" ? "女性" : "男性"}`;
    sbDb.getLevelChecks(user.id, pk).then(sbChecks => {
      if (sbChecks && Object.keys(sbChecks).length > 0) {
        setLevelChecks(sbChecks);
        // localStorageも更新
        localStorage.setItem(`shisogaku_levelup_${pk}`, JSON.stringify(sbChecks));
      }
    });
  }, [user?.id, me?.blood, me?.gender]);

  // ── レベルチェック変化時に Supabase へ同期 ──
  useEffect(() => {
    if (!user || !me || Object.keys(levelChecks).length === 0) return;
    const pk = `${me.blood}${me.gender === "female" ? "女性" : "男性"}`;
    sbDb.saveLevelChecks(user.id, pk, levelChecks);
  }, [levelChecks, user?.id]);

  // チェック状態からレーダーチャートの有効データを計算
  const effectiveRadarData = me ? (() => {
    const pk = `${me.blood}${me.gender === "female" ? "女性" : "男性"}`;
    const tipData = LEVELUP_TIPS[pk];
    const baseData = RADAR_DATA[pk];
    if (!baseData) return null;
    return Object.fromEntries(
      RADAR_AXES.map(ax => {
        const v = baseData[ax];
        const steps = tipData?.[ax]?.steps || [];
        const done = steps.filter((_, si) => levelChecks[`${ax}_${si}`]).length;
        return [ax, Math.min(v + done * 5, 95)];
      })
    );
  })() : null;

  const startEdit = () => {
    if (me) {
      setName(me.name); setBlood(me.blood); setGender(me.gender); setAge(me.age||"");
      setMarriage(me.marriage||""); setKids(me.kids||""); setLoveExp(me.loveExp||""); setDivorce(me.divorce||"");
    } else {
      setName(""); setBlood(null); setGender(null); setAge("");
      setMarriage(""); setKids(""); setLoveExp(""); setDivorce("");
    }
    setEditing(true);
  };

  const save = () => {
    if (!name.trim() || !blood || !gender) return;
    const newP = { id: me?.id || Date.now().toString(), name: name.trim(), blood, gender, age, marriage, kids, loveExp, divorce, relation: "自分", color: BC[blood].color };
    if (me) {
      setProfiles(prev => prev.map(p => p.id === me.id ? newP : p));
    } else {
      setProfiles(prev => [...prev, newP]);
      setMyId(newP.id);
    }
    // Supabase 同期
    if (user) {
      sbDb.saveProfile(user.id, newP, true);
      sbDb.log(user.id, "save_profile", { blood: newP.blood, gender: newP.gender });
    }
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-bold text-gray-700">自分のプロフィール</div>
      <div className="text-xs text-gray-500 text-center">まず自分の血液型・性別を登録してください</div>

      {!me && !editing && (
        !user ? (
          /* ── 未ログイン：Googleログインを促す ── */
          <div className="text-center py-10 space-y-4">
            <div className="text-5xl">🔐</div>
            <div className="text-base font-bold text-gray-700">プロフィール登録にはログインが必要です</div>
            <div className="text-xs text-gray-500">Googleアカウントで簡単にログインできます</div>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-white border-2 border-indigo-300 shadow text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-all">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Googleでログイン・登録
            </button>
            <div className="text-xs text-gray-400 pt-1">登録後、複数端末でデータが同期されます</div>
          </div>
        ) : (
          /* ── ログイン済み：通常の登録ボタン ── */
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl">👤</div>
            <div className="text-sm text-gray-500">まだ登録されていません</div>
            <button onClick={startEdit} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700">
              ＋ 自分を登録する
            </button>
          </div>
        )
      )}

      {editing && (
        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="font-bold text-sm text-indigo-700 mb-3">{me ? "✏️ プロフィールを編集" : "👤 自分を登録"}</div>
          <SelfForm blood={blood} setBl={setBlood} gender={gender} setGe={setGender}
            name={name} setNa={setName} age={age} setAg={setAge}
            marriage={marriage} setMarriage={setMarriage}
            kids={kids} setKids={setKids}
            loveExp={loveExp} setLoveExp={setLoveExp}
            divorce={divorce} setDivorce={setDivorce}
            onSave={save} onCancel={cancel} isEdit={!!me} />
        </div>
      )}

      {me && !editing && (
        <div className="space-y-3">
          {/* 自分カード */}
          <div className="p-4 rounded-xl border-2 border-indigo-400 bg-indigo-50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: me.color }}>{me.blood}型</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-lg text-gray-800">{me.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: me.color }}>{me.blood}型</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: me.color }}>自分 ★</span>
                </div>
                <div className="text-sm text-gray-600">
                  {me.blood}型 ・ {me.gender === "female" ? "女性" : "男性"}{me.age ? ` ・ ${me.age}` : ""}
                </div>
                {(me.marriage || me.divorce || me.kids || me.loveExp) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {me.marriage && <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">💍 結婚{me.marriage}</span>}
                    {me.divorce && me.divorce !== "なし" && <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">離婚{me.divorce}</span>}
                    {me.kids && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">👶 子ども{me.kids}</span>}
                    {me.loveExp && <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">恋愛経験{me.loveExp}</span>}
                  </div>
                )}
              </div>
              <button onClick={startEdit} className="px-3 py-1.5 rounded-lg text-xs border border-gray-300 text-gray-600 bg-white flex-shrink-0">
                編集
              </button>
            </div>
            <RelationshipInsights profile={me} />
            {/* レーダーチャート */}
            <div className="border-t border-indigo-200 pt-3">
              <div className="text-xs font-bold text-indigo-600 text-center mb-1">📊 強み・弱み分析</div>
              <RadarChart blood={me.blood} gender={me.gender} color={me.color} overrideData={effectiveRadarData} />
            </div>
            {/* レベルアップ */}
            <LevelUpSection blood={me.blood} gender={me.gender} onChecksChange={setLevelChecks} />
            {/* ピア評価 */}
            <EvaluationPanel
              user={user}
              profileKey={`${me.blood}${me.gender === "female" ? "女性" : "男性"}`}
              requesterName={me.name}
              selfChecks={levelChecks}
            />
            {/* カード出力 */}
            <div className="border-t border-indigo-200 pt-3">
              <button onClick={()=>{
                const key = `${me.blood}${me.gender==="female"?"女性":"男性"}`;
                const rd = RADAR_DATA[key];
                const bc = BC[me.blood];
                const sorted = RADAR_AXES.map(ax=>({ax,v:rd[ax]})).sort((a,b)=>b.v-a.v);
                const txt = [
                  `【支礎学 プロフィールカード】`,``,
                  `${me.name}（${me.blood}型 ${me.gender==="female"?"女性":"男性"}${me.age?" / "+me.age:""}）`,
                  `タイプ：${bc.type}`,``,
                  `▼ キーワード`,
                  bc.keywords.map(k=>`#${k}`).join("  "),``,
                  `▼ 強み TOP2`,
                  ...sorted.slice(0,2).map(({ax,v})=>`・${ax}（${v}）— ${RADAR_DESC[ax].high}`),``,
                  `▼ 弱み（注意点）`,
                  ...sorted.slice(-2).map(({ax,v})=>`・${ax}（${v}）— ${RADAR_DESC[ax].low}`),``,
                  `▼ 心理ポイント`,
                  ...bc.心理.slice(0,3).map(t=>`・${t}`),``,
                  `─ 支礎学コンパス より ─`,
                ].join("\n");
                navigator.clipboard?.writeText(txt);
              }}
                className="w-full py-2 rounded-xl text-xs font-bold border-2 border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all">
                📤 プロフィールカードをコピー（シェア用）
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center">相手の登録は「ペア」タブから行えます</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ペア分析ビュー
// ─────────────────────────────────────────
