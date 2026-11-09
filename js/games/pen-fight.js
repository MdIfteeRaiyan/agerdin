// Lazy entry module for Pen Fight. The shared game runtime owns state and rendering.
export const id = "penfight";
export const title = Object.freeze({ en: "Pen Fight", bn: "কলম যুদ্ধ" });
export const memory = "Flick a pen across the desk";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
