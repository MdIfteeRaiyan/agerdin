// Lazy entry module for Tiffin Bounce. The shared game runtime owns state and rendering.
export const id = "rapid";
export const title = Object.freeze({ en: "Tiffin Bounce", bn: "টিফিনবেলার বাউন্স" });
export const memory = "Keep descending past the platforms";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
