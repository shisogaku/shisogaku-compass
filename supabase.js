// ─────────────────────────────────────────
// Supabase 設定（supabase.com で取得した値に書き換えてください）
// ─────────────────────────────────────────
const SUPABASE_URL      = "https://nncwmltuwxbpwlgruvwn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY3dtbHR1d3hicHdsZ3J1dnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDcxMDgsImV4cCI6MjA5MTQyMzEwOH0._4tnMPtyFDmMr4gT2Ev3zQ-fSiyK34LZ6dsXCHlooMA";

// Supabase クライアント（CDN から読み込み。未設定時は null）
const _sb = (typeof window !== "undefined" && window.supabase &&
  SUPABASE_URL !== "YOUR_SUPABASE_URL")
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

// ─────────────────────────────────────────
// Supabase データ操作ユーティリティ
// ─────────────────────────────────────────
const sbDb = {
  // プロフィール一覧取得
  async getProfiles(userId) {
    if (!_sb || !userId) return null;
    const { data, error } = await _sb.from("profiles").select("*").eq("user_id", userId);
    if (error) { console.warn("[SB] getProfiles:", error.message); return null; }
    return data.map(r => ({
      id: r.profile_id, name: r.name, blood: r.blood, gender: r.gender,
      age: r.age, marriage: r.marriage, divorce: r.divorce, kids: r.kids,
      loveExp: r.love_exp, color: r.color,
    }));
  },
  // myId 取得（is_me = true なプロフィールのprofile_id）
  async getMyId(userId) {
    if (!_sb || !userId) return null;
    const { data } = await _sb.from("profiles").select("profile_id")
      .eq("user_id", userId).eq("is_me", true).maybeSingle();
    return data?.profile_id || null;
  },
  // プロフィール保存（upsert）
  async saveProfile(userId, profile, isMe) {
    if (!_sb || !userId) return;
    const { error } = await _sb.from("profiles").upsert({
      user_id: userId, profile_id: profile.id,
      name: profile.name, blood: profile.blood, gender: profile.gender,
      age: profile.age || "", marriage: profile.marriage || "",
      divorce: profile.divorce || "", kids: profile.kids || "",
      love_exp: profile.loveExp || "", color: profile.color || "",
      is_me: !!isMe,
    }, { onConflict: "user_id,profile_id" });
    if (error) console.warn("[SB] saveProfile:", error.message);
  },
  // プロフィール is_me フラグ一括更新
  async updateMyId(userId, myId, profiles) {
    if (!_sb || !userId) return;
    for (const p of profiles) {
      await _sb.from("profiles").update({ is_me: p.id === myId })
        .eq("user_id", userId).eq("profile_id", p.id);
    }
  },
  // プロフィール削除
  async deleteProfile(userId, profileId) {
    if (!_sb || !userId) return;
    await _sb.from("profiles").delete()
      .eq("user_id", userId).eq("profile_id", profileId);
  },
  // レベルチェック取得
  async getLevelChecks(userId, profileKey) {
    if (!_sb || !userId) return null;
    const { data } = await _sb.from("level_checks").select("checks")
      .eq("user_id", userId).eq("profile_key", profileKey).maybeSingle();
    return data?.checks || null;
  },
  // レベルチェック保存（upsert）
  async saveLevelChecks(userId, profileKey, checks) {
    if (!_sb || !userId) return;
    await _sb.from("level_checks").upsert({
      user_id: userId, profile_key: profileKey, checks,
    }, { onConflict: "user_id,profile_key" }).catch(() => {});
  },
  // 利用ログ記録
  async log(userId, action, metadata = {}) {
    if (!_sb || !userId) return;
    await _sb.from("usage_logs").insert({ user_id: userId, action, metadata }).catch(() => {});
  },
};
