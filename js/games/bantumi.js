// Lazy entry module for Bantumi. The shared game runtime owns state and rendering.
export const id = "bantumi";
export const title = Object.freeze({ en: "Bantumi", bn: "বান্তুমি" });
export const memory = "Sow seeds around the pits";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
