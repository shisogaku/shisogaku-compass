import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL      = "https://nncwmltuwxbpwlgruvwn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY3dtbHR1d3hicHdsZ3J1dnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDcxMDgsImV4cCI6MjA5MTQyMzEwOH0._4tnMPtyFDmMr4gT2Ev3zQ-fSiyK34LZ6dsXCHlooMA";

export const EDGE_URL = `${SUPABASE_URL}/functions/v1/ai-analyze`;

export const _sb = (SUPABASE_URL !== "YOUR_SUPABASE_URL")
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

export const sbDb = {
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
  async getMyId(userId) {
    if (!_sb || !userId) return null;
    const { data } = await _sb.from("profiles").select("profile_id")
      .eq("user_id", userId).eq("is_me", true).maybeSingle();
    return data?.profile_id || null;
  },
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
  async updateMyId(userId, myId, profiles) {
    if (!_sb || !userId) return;
    for (const p of profiles) {
      await _sb.from("profiles").update({ is_me: p.id === myId })
        .eq("user_id", userId).eq("profile_id", p.id);
    }
  },
  async deleteProfile(userId, profileId) {
    if (!_sb || !userId) return;
    await _sb.from("profiles").delete()
      .eq("user_id", userId).eq("profile_id", profileId);
  },
  async getLevelChecks(userId, profileKey) {
    if (!_sb || !userId) return null;
    const { data } = await _sb.from("level_checks").select("checks")
      .eq("user_id", userId).eq("profile_key", profileKey).maybeSingle();
    return data?.checks || null;
  },
  async saveLevelChecks(userId, profileKey, checks) {
    if (!_sb || !userId) return;
    await _sb.from("level_checks").upsert({
      user_id: userId, profile_key: profileKey, checks,
    }, { onConflict: "user_id,profile_key" }).catch(() => {});
  },
  async log(userId, action, metadata = {}) {
    if (!_sb || !userId) return;
    await _sb.from("usage_logs").insert({ user_id: userId, action, metadata }).catch(() => {});
  },

  // ── ピア評価 ──────────────────────────────
  async createEvaluationRequest(userId, profileKey, requesterName) {
    if (!_sb || !userId) return null;
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const { data, error } = await _sb.from("evaluation_requests").insert({
      requester_id: userId, token, profile_key: profileKey, requester_name: requesterName,
    }).select("token").single();
    if (error) { console.warn("[SB] createEvaluationRequest:", error.message); return null; }
    return data.token;
  },
  async getEvaluationRequest(token) {
    if (!_sb || !token) return null;
    const { data } = await _sb.from("evaluation_requests").select("*")
      .eq("token", token).maybeSingle();
    return data;
  },
  async submitEvaluationResponse(requestId, evaluatorId, scores) {
    if (!_sb) return false;
    const { error } = await _sb.from("evaluation_responses").upsert({
      request_id: requestId, evaluator_id: evaluatorId, scores,
    }, { onConflict: "request_id,evaluator_id" });
    if (error) { console.warn("[SB] submitEvaluationResponse:", error.message); return false; }
    return true;
  },
  async getEvaluationResults(userId, profileKey) {
    if (!_sb || !userId) return null;
    // 自分のリクエストを取得
    const { data: req } = await _sb.from("evaluation_requests").select("id")
      .eq("requester_id", userId).eq("profile_key", profileKey)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!req) return null;
    // そのリクエストへの全回答を取得
    const { data: responses } = await _sb.from("evaluation_responses").select("scores, created_at")
      .eq("request_id", req.id);
    return responses || [];
  },
  async getMyEvaluationToken(userId, profileKey) {
    if (!_sb || !userId) return null;
    const { data } = await _sb.from("evaluation_requests").select("token")
      .eq("requester_id", userId).eq("profile_key", profileKey)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    return data?.token || null;
  },
};
