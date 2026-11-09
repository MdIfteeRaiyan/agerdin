// Lazy entry module for Hand Cricket. The shared game runtime owns state and rendering.
export const id = "hand";
export const title = Object.freeze({ en: "Hand Cricket", bn: "हাত ক্রিকেট" });
export const memory = "6-gesture hand cricket";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
