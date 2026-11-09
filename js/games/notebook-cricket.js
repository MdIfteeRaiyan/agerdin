// Lazy entry module for Notebook Cricket. The shared game runtime owns state and rendering.
export const id = "notebook-cricket";
export const title = Object.freeze({ en: "Notebook Cricket", bn: "খাতার ক্রিকেট" });
export const memory = "One-over number cricket";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
