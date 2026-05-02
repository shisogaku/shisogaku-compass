// このファイルは src/data/ 以下の各テーマ別ファイルへの後方互換バレル。
// 既存の `import { ... } from '../data.js'` を壊さずに使い続けるため残してある。
// 新規ファイルでは src/data/<theme>.js から直接 import するのも可。
export * from "./data/profiles.js";
export * from "./data/compat.js";
export * from "./data/messages.js";
export * from "./data/scenes.js";
export * from "./data/reactions.js";
export * from "./data/life.js";
export * from "./data/plans.js";
export * from "./data/radar.js";
