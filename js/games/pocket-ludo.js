// Lazy entry module for Pocket Ludo. The shared game runtime owns state and rendering.
export const id = "ludo";
export const title = Object.freeze({ en: "Pocket Ludo", bn: "পকেট লুডু" });
export const memory = "A full board race";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
