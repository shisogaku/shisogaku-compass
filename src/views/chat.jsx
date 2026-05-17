import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BC } from '../data/profiles.js';
import { classifyMsg, MSG_TIPS } from '../data/messages.js';
import { REACTION_DB } from '../data/reactions.js';
import { _sb, SUPABASE_URL } from '../lib/supabase.js';
import { Icon } from './app.jsx';

// ─────────────────────────────────────────────────────
// ペルソナ応答テンプレート（血液型 × msgType 別）
// ─────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PERSONA = {
  "O型女性": {
    誘い:  () => pick(["一緒に行こう！いつがいい？","嬉しい！ちゃんと考えてくれてたんだね","行く行く！楽しみ！","え、行っていいの？やった！"]),
    依頼:  () => pick(["任せて！何すればいい？","もちろん！いつでも言ってね","やるよ！頑張る！","役に立てるなら嬉しい"]),
    承認:  () => pick(["やだ、そんなこと言われると照れるじゃない笑","え、ありがとう...なんか嬉しいな","そう思ってくれてたんだ...ありがとね","えへへ、ありがとう"]),
    批判:  () => pick(["...",  "...そっか。","うん...","（しばらく黙っている）"]),
    告白:  () => pick(["え...うん。私も、好きだよ。","なんか...ドキドキする笑","...そうなんだ。ちょっと考えてもいい？","えっ...ありがとう"]),
    連絡:  () => pick(["お疲れ！どうしたの？","ちょうどよかった！私もなんか話したかった","うん！何？","ね、今何してるの？"]),
    感謝:  () => pick(["えー！当たり前だから気にしないでよ","やってよかった！","ありがとうって言ってくれると嬉しいな","そんな、大したことしてないよ"]),
    謝罪:  () => pick(["うん、わかった。ありがとね","いいよ、気にしないで","...うん","大丈夫だよ"]),
    その他:() => pick(["うんうん、そうなんだ","へえ！そういうこともあるんだね","なるほどね〜","そっか〜"]),
  },
  "O型男性": {
    誘い:  () => pick(["おう、いいぞ！いつにする？","わかった、楽しみにしてるよ","いいな！行こうぜ","おう、任せとけ"]),
    依頼:  () => pick(["任せとけ！","俺に任せろ！何すればいい？","わかった、やっておくよ","頼っていいぞ"]),
    承認:  () => pick(["そうか...ありがとな","照れるな笑　でもありがとう","そう思ってくれてたのか","...嬉しいな、ありがとな"]),
    批判:  () => pick(["...","そうか。","...うん","（沈黙）"]),
    告白:  () => pick(["...そうか。俺も嫌いじゃないよ","照れるな笑　ありがとな","...え、マジで？","...俺も、気になってた"]),
    連絡:  () => pick(["おう、どうした？","なんかあったか？","ちょうどよかった","おう、聞いてるよ"]),
    感謝:  () => pick(["当たり前のことだ、気にするな","やった甲斐があったな","ありがとう、そう言ってくれると助かる","いいって、困ったときはお互い様だ"]),
    謝罪:  () => pick(["わかった。次から気をつけよう","いいよ、気にするな","...うん、まあ","大丈夫だ"]),
    その他:() => pick(["なるほどな","そうか、そういうことか","ふーん、そうか","まあそうだよな"]),
  },
  "A型女性": {
    誘い:  () => pick(["いつ、どこで、何するか教えてもらえると助かるな","少し考えてみるね","計画を教えてもらえたら返事できるかも","スケジュール確認してみる"]),
    依頼:  () => pick(["わかった。どんな感じでやればいい？","うん、やってみる。でも確認したいことがあって","なるほど。整理してから返すね","わかった、ちゃんとやる"]),
    承認:  () => pick(["ありがとう...ちゃんと見ててくれてたんだね","そう言ってもらえると励みになる","えっ、うれしい。ありがとう","...照れるな笑"]),
    批判:  () => pick(["...それはどういう意味？","ちゃんと説明してほしいな","...わかった。考えてみる","（言葉を選んでいる）"]),
    告白:  () => pick(["...少し考える時間もらってもいい？","え...うん。私も気になってた","そっか...えっと...","...嬉しいな"]),
    連絡:  () => pick(["うん！何かあった？","お疲れ様。どうしたの？","ちょうどよかった、確認したいことがあって","うん、聞いてる"]),
    感謝:  () => pick(["あ、ありがとう。やってよかった","そう言ってもらえると嬉しい","うん、また何かあったら言ってね","こちらこそ、ありがとう"]),
    謝罪:  () => pick(["わかった。次はどうするか、ちゃんと考えてね","...うん。気をつけてくれると嬉しいな","わかった","うん、大丈夫"]),
    その他:() => pick(["そうなんだ。なるほど","うんうん、どういう状況か教えて？","へえ、初めて知った","なるほどね"]),
  },
  "A型男性": {
    誘い:  () => pick(["計画教えてくれれば考えるよ","いつにする？先に確認したい","わかった、スケジュール合わせてみる","いいよ、詳細教えて"]),
    依頼:  () => pick(["わかった。どうすればいい？","うん、やる。ちゃんとやるよ","了解。任せて","わかった、確認しながら進める"]),
    承認:  () => pick(["そう言ってもらえると嬉しい","ありがとう、頑張った甲斐があるな","照れるけど...ありがとう","...そうか、よかった"]),
    批判:  () => pick(["...それはどういうことだ？","ちゃんと説明してほしい","...(言葉を選んで)...","...わかった"]),
    告白:  () => pick(["...少し時間をくれ","え...そうか。俺も...気になってた","...ちゃんと返事する時間をくれ","...ありがとう"]),
    連絡:  () => pick(["おう、どうした？","何かあったか？","うん、聞いてるよ","何？"]),
    感謝:  () => pick(["ありがとう。やってよかった","そう言ってもらえると励みになる","うん、また何かあれば","こちらこそ"]),
    謝罪:  () => pick(["わかった。次はちゃんとする","...気をつけてくれ","了解","うん、大丈夫だ"]),
    その他:() => pick(["なるほどね","そうか、整理してみると...","うん、なんとなくわかった","そうだな"]),
  },
  "B型女性": {
    誘い:  () => pick(["え！面白そう！行く行く！","やった！楽しそう！","いいね！どこいくの？！","まじで？！絶対行く！"]),
    依頼:  () => pick(["え、いいよ！やる！","うん！どうすればいい？","面白そうならやる笑","任せて！"]),
    承認:  () => pick(["え！そんなこと思ってたの？！嬉しい笑","まじ？！ありがとう！","えーーそれ嬉しすぎる笑","やだ笑　ありがとう！"]),
    批判:  () => pick(["は？それ違くない？","えっ、そう思う？なんで？","ちょっと待って、意味わかんない","え？！"]),
    告白:  () => pick(["えっ！まじで？！...うん、私も好き！","え、そうなの？笑　ありがとう","えー！突然すぎるんだけど笑　でも嬉しい！","まじで？！やばい笑"]),
    連絡:  () => pick(["え、何？何？！","どうしたの？！","うん！ちょうどいい、私も話したかった笑","なに！？"]),
    感謝:  () => pick(["え、いいよそんな！笑","当たり前じゃん！","そんなこと言われると照れるじゃん笑","えーそんな！やってよかった！"]),
    謝罪:  () => pick(["いーよいーよ！気にしないで","まあいっか笑","うん、わかった！もう大丈夫","全然大丈夫！"]),
    その他:() => pick(["え、ほんと？！","へえ〜！そうなんだ！","おもしろ笑","えー！それ初めて聞いた！"]),
  },
  "B型男性": {
    誘い:  () => pick(["楽しそうならいく","面白そうじゃん！OK","まあ、いいよ","いいな！行こうぜ"]),
    依頼:  () => pick(["あ、いいよ。任せて","やってもいいけど...どんな感じ？","まあやるよ","了解"]),
    承認:  () => pick(["え、そう？笑　ありがとう","まあ、まあね笑","そう思う？嬉しいじゃん","...照れるな笑"]),
    批判:  () => pick(["は？それ違うわ","え、そうかな？","いや、それは違くない？","...そうは思わないけど"]),
    告白:  () => pick(["え、マジ？...俺も嫌いじゃないよ","そうなの？笑　ありがとう","まじか笑　嬉しいじゃん","...俺も、気になってた"]),
    連絡:  () => pick(["お、どうした？","何？","うん、聞いてる","なんか用？"]),
    感謝:  () => pick(["いや別に笑","当たり前じゃん","まあいいよ、気にしないで","そんな大したことしてないし"]),
    謝罪:  () => pick(["まあいいよ","うん、わかった","気にしてないから大丈夫","いいって"]),
    その他:() => pick(["へえ","まあそうだよな","そっか笑","なるほどな"]),
  },
  "AB型女性": {
    誘い:  () => pick(["...考えてみるね","うーん、その日は少し難しいかも。別の日はどう？","一人の時間も確保できる感じ？それなら行けるかも","...少し待ってください"]),
    依頼:  () => pick(["...わかった、考えてみる","うーん、理由を教えてもらえる？","わかった。でもどういう形でやればいい？","...整理してから返す"]),
    承認:  () => pick(["...そう言ってもらえるとちょっと嬉しいかもしれない","ありがとう（静かに）","...まあ、そうかもね","...嬉しいな"]),
    批判:  () => pick(["...（長い沈黙）...","そっか","...うん","..."]),
    告白:  () => pick(["...一度考えてみる","うーん...急には答えられないかも","...そっか。少し時間をください","...ありがとう"]),
    連絡:  () => pick(["...うん、どうしたの？","あ、こんにちは","...何かあった？","うん"]),
    感謝:  () => pick(["...ありがとう","そう言ってもらえると...うん、よかった","...どういたしまして","うん、またね"]),
    謝罪:  () => pick(["...わかった","うん...","...そっか","（静かに受け取る）"]),
    その他:() => pick(["...なるほど","そういう見方もあるかもしれない","...うん、そうかもね","...面白いね"]),
  },
  "AB型男性": {
    誘い:  () => pick(["...考えてみる","一人の時間もあるなら行けるかもしれない","論理的に考えると、メリットがあれば","...少し待ってください"]),
    依頼:  () => pick(["...なぜ私に？","論理的な理由があれば動ける","わかった。整理してから返す","...考えてみる"]),
    承認:  () => pick(["...そうか","ありがとう（静かに）","理解してくれているなら、それは嬉しい","...うん"]),
    批判:  () => pick(["...（無言）...","そうか","...理解した","..."]),
    告白:  () => pick(["...一度考えてみる","急には答えられない","...そういうことか","...時間をくれ"]),
    連絡:  () => pick(["...うん","何かあったか？","...どうした","うん"]),
    感謝:  () => pick(["...どういたしまして","うん","...それは良かった","（静かにうなずく）"]),
    謝罪:  () => pick(["...わかった","うん","...そうか","（沈黙）"]),
    その他:() => pick(["...なるほど","そうかもしれない","...興味深い","...うん"]),
  },
};

export function generatePersonaReply(userMsg, targetProfile) {
  if (!targetProfile?.blood || !targetProfile?.gender) return "...";
  const { blood, gender } = targetProfile;
  const label = `${blood}型${gender === 'female' ? '女性' : '男性'}`;
  const msgType = classifyMsg(userMsg);
  const persona = PERSONA[label];
  if (!persona) return "...";
  const fn = persona[msgType] || persona['その他'];
  return fn ? fn() : "...";
}

export function getPersonaReaction(targetProfile, userMsg) {
  if (!targetProfile?.blood || !targetProfile?.gender) return null;
  const { blood, gender } = targetProfile;
  const label = `${blood}型${gender === 'female' ? '女性' : '男性'}`;
  const msgType = classifyMsg(userMsg);
  return REACTION_DB[label]?.[msgType]?.default || null;
}

// ─────────────────────────────────────────────────────
// アバター管理（localStorage + Supabase Storage）
// ─────────────────────────────────────────────────────
export function getAvatar(profileId) {
  try { return localStorage.getItem(`sg_avatar_${profileId}`) || null; } catch { return null; }
}
export function setAvatarLocal(profileId, dataUrl) {
  try { localStorage.setItem(`sg_avatar_${profileId}`, dataUrl); } catch {}
}

async function uploadAvatarToStorage(userId, profileId, file) {
  if (!_sb || !userId) return null;
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `avatars/${userId}/${profileId}.${ext}`;
    const { error } = await _sb.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) { console.warn('[SB] avatar upload:', error.message); return null; }
    const { data } = _sb.storage.from('avatars').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────
// 顔写真アップローダー
// ─────────────────────────────────────────────────────
export function AvatarUploader({ profile, user, onUpdate, size = 64 }) {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const avatar = getAvatar(profile?.id);
  const color = profile?.blood ? BC[profile.blood]?.color : '#999';
  const initials = profile?.blood || '?';

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setAvatarLocal(profile.id, dataUrl);
      // Supabase Storage にも試みる
      if (user && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        const publicUrl = await uploadAvatarToStorage(user.id, profile.id, file);
        if (publicUrl) setAvatarLocal(profile.id, publicUrl);
      }
      setLoading(false);
      onUpdate?.();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="relative inline-block">
      <div
        className="rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ width: size, height: size, background: color + '22', border: `2px solid ${color}`, flexShrink: 0 }}
        onClick={() => fileRef.current?.click()}
        title="顔写真を登録">
        {avatar
          ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          : <span className="font-black text-sm" style={{ color }}>{initials}</span>}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          </div>
        )}
      </div>
      {/* カメラアイコン */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
        style={{ background: color }}
        title="写真を変更">
        📷
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 声選択コンポーネント
// ─────────────────────────────────────────────────────
export function VoiceSelector({ profileId, onSelect }) {
  const [voices, setVoices] = useState([]);
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem(`sg_voice_${profileId}`) || ''; } catch { return ''; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis?.getVoices() || [];
      const ja = all.filter(v => v.lang.startsWith('ja'));
      setVoices(ja.length > 0 ? ja : all.slice(0, 6));
    };
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  const handleSelect = (voiceURI) => {
    setSelected(voiceURI);
    try { localStorage.setItem(`sg_voice_${profileId}`, voiceURI); } catch {}
    onSelect?.(voices.find(v => v.voiceURI === voiceURI));
    setOpen(false);
  };

  const selectedVoice = voices.find(v => v.voiceURI === selected);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
        style={{ background: 'rgba(140,112,85,0.08)', color: '#8C7055' }}
        title="声を選ぶ">
        🔊 {selectedVoice ? selectedVoice.name.slice(0, 8) : '声を選ぶ'}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg z-30 overflow-hidden">
          <div className="px-3 py-2 text-xs font-bold text-gray-500 border-b">声を選択</div>
          {voices.length === 0
            ? <div className="px-3 py-3 text-xs text-gray-400">利用可能な声が見つかりません</div>
            : voices.map(v => (
              <button key={v.voiceURI} type="button"
                onClick={() => handleSelect(v.voiceURI)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 transition-colors"
                style={selected === v.voiceURI ? { color: '#8C7055', fontWeight: 700 } : { color: '#555' }}>
                {selected === v.voiceURI ? '✓ ' : ''}{v.name}
              </button>
            ))}
          <button type="button" onClick={() => handleSelect('')}
            className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 border-t">
            声なし
          </button>
        </div>
      )}
    </div>
  );
}

function speak(text, voiceURI) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const v = window.speechSynthesis.getVoices().find(v => v.voiceURI === voiceURI);
  if (v) utt.voice = v;
  utt.lang = 'ja-JP';
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
}

// ─────────────────────────────────────────────────────
// チャットバブル
// ─────────────────────────────────────────────────────
function ChatBubble({ msg, partner, me }) {
  const isUser = msg.role === 'user';
  const color = isUser
    ? (me?.blood ? BC[me.blood]?.color : '#8C7055')
    : (partner?.blood ? BC[partner.blood]?.color : '#999');
  const avatar = isUser ? getAvatar(me?.id) : getAvatar(partner?.id);
  const initials = isUser ? (me?.blood || '自') : (partner?.blood || '?');

  return (
    <div className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* アバター */}
      <div className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ width: 32, height: 32, background: color + '22', border: `1.5px solid ${color}` }}>
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="text-[10px] font-black" style={{ color }}>{initials}</span>}
      </div>
      {/* バブル */}
      <div className="max-w-[75%]">
        <div
          className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
          style={isUser
            ? { background: color, color: 'white', borderBottomRightRadius: 4 }
            : { background: 'white', color: '#333', border: '1px solid #F0EDE8', borderBottomLeftRadius: 4 }}>
          {msg.content}
        </div>
        <div className={`text-[10px] text-gray-400 mt-0.5 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(msg.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// タイピングインジケーター
// ─────────────────────────────────────────────────────
function TypingIndicator({ partner }) {
  const color = partner?.blood ? BC[partner.blood]?.color : '#999';
  const avatar = getAvatar(partner?.id);
  const initials = partner?.blood || '?';
  return (
    <div className="flex gap-2 items-end">
      <div className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ width: 32, height: 32, background: color + '22', border: `1.5px solid ${color}` }}>
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <span className="text-[10px] font-black" style={{ color }}>{initials}</span>}
      </div>
      <div className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200" style={{ borderBottomLeftRadius: 4 }}>
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// チャットビュー（メイン）
// ─────────────────────────────────────────────────────
const CHAT_HISTORY_KEY = (id) => `sg_chat_${id}`;
const MAX_HISTORY = 200;

export function ChatView({ partner, me, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [voiceURI, setVoiceURI] = useState('');
  const [avatarTick, setAvatarTick] = useState(0);
  const bottomRef = useRef();
  const inputRef = useRef();

  // 相手が変わったらチャット履歴をロード
  useEffect(() => {
    if (!partner?.id) { setMessages([]); return; }
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY(partner.id))) || [];
      setMessages(saved);
    } catch { setMessages([]); }
    // 声の設定もロード
    try {
      setVoiceURI(localStorage.getItem(`sg_voice_${partner.id}`) || '');
    } catch {}
  }, [partner?.id]);

  // メッセージを保存
  useEffect(() => {
    if (!partner?.id || messages.length === 0) return;
    try {
      localStorage.setItem(CHAT_HISTORY_KEY(partner.id), JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {}
  }, [messages, partner?.id]);

  // 一番下へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !partner || typing) return;
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    const userInput = input.trim();
    setInput('');
    setMessages(prev => [...prev, userMsg]);

    // タイピング演出（血液型で遅延を変える）
    const delays = { O: 1400, A: 1800, B: 900, AB: 2200 };
    const delay = (delays[partner.blood] || 1500) + Math.random() * 800;

    setTyping(true);
    setTimeout(() => {
      const reply = generatePersonaReply(userInput, partner);
      const personaMsg = {
        id: Date.now() + 1,
        role: 'persona',
        content: reply,
        timestamp: Date.now(),
      };
      setTyping(false);
      setMessages(prev => [...prev, personaMsg]);
      // 声で読む
      if (voiceURI) speak(reply, voiceURI);
    }, delay);
  }, [input, partner, typing, voiceURI]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    if (!partner?.id) return;
    if (!window.confirm('チャット履歴を全て削除しますか？')) return;
    setMessages([]);
    try { localStorage.removeItem(CHAT_HISTORY_KEY(partner.id)); } catch {}
  };

  const color = partner?.blood ? BC[partner.blood]?.color : '#999';
  const label = partner ? `${partner.blood}型${partner.gender === 'female' ? '女性' : '男性'}` : '';

  // 相手未選択
  if (!partner) {
    return (
      <div className="flex flex-col h-full items-center justify-center" style={{ background: '#FAF7F2' }}>
        <div className="text-5xl mb-4">💬</div>
        <div className="text-base font-bold text-gray-600 mb-2">左のパネルから相手を選んでください</div>
        <div className="text-sm text-gray-400">相手を選ぶと妄想チャットが始まります</div>
      </div>
    );
  }

  const avatar = getAvatar(partner.id);

  return (
    <div className="flex flex-col h-full" style={{ background: '#FAF7F2' }}>
      {/* チャットヘッダー */}
      <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{ background: '#F7F3EE', borderBottom: '1px solid rgba(150,118,88,0.15)' }}>
        <div className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ width: 36, height: 36, background: color + '22', border: `2px solid ${color}` }}>
          {avatar
            ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            : <span className="text-xs font-black" style={{ color }}>{partner.blood}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-800">{partner.name}</div>
          <div className="text-xs text-gray-400">{label} ・ 妄想チャット中</div>
        </div>
        <VoiceSelector
          profileId={partner.id}
          onSelect={(v) => setVoiceURI(v?.voiceURI || '')}
        />
        <button type="button" onClick={clearHistory}
          className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100"
          title="履歴を削除">
          🗑️
        </button>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">{partner.blood === 'O' ? '🐕' : partner.blood === 'A' ? '🐈' : partner.blood === 'B' ? '🦊' : '🦅'}</div>
            <div className="text-sm font-bold text-gray-600 mb-1">{partner.name}と妄想チャット開始！</div>
            <div className="text-xs text-gray-400 mb-4">
              {partner.name}は{label}です。<br/>メッセージを送ると{label}らしい返事が来ます。
            </div>
            {/* 最初のメッセージ候補 */}
            <div className="space-y-2">
              {['今日どうだった？', 'ちょっと相談がある', 'ありがとうって言いたかった'].map(s => (
                <button key={s} type="button"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="block w-full max-w-xs mx-auto px-4 py-2 rounded-full text-xs font-medium bg-white border hover:border-amber-300 hover:bg-amber-50 transition-all"
                  style={{ borderColor: color + '44', color }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map(msg => (
          <ChatBubble key={msg.id} msg={msg} partner={partner} me={me} />
        ))}
        {typing && <TypingIndicator partner={partner} />}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: '#F7F3EE', borderTop: '1px solid rgba(150,118,88,0.15)' }}>
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${partner.name}にメッセージを送る…`}
            rows={1}
            className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
            style={{
              background: 'white',
              border: '1px solid rgba(150,118,88,0.2)',
              maxHeight: 120,
              lineHeight: '1.5',
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !typing ? color : '#E0D8D0',
              color: 'white',
            }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="text-[10px] text-gray-400 mt-1.5 text-center">
          Enter で送信 · Shift+Enter で改行 · ※これは娯楽目的の妄想チャットです
        </div>
      </div>
    </div>
  );
}

export default ChatView;
