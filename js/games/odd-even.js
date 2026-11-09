// Lazy entry module for Odd and Even. The shared game runtime owns state and rendering.
export const id = "odd-even";
export const title = Object.freeze({ en: "Odd and Even", bn: "জোড়-বিজোড়" });
export const memory = "Read a hand and call the sum";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
