// Lazy entry module for Cabinet Duel. The shared game runtime owns state and rendering.
export const id = "duel";
export const title = Object.freeze({ en: "Cabinet Duel", bn: "ক্যাবিনেট ডুয়েল" });
export const memory = "A local arcade bout";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
