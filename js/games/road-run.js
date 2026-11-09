// Lazy entry module for Road Run. The shared game runtime owns state and rendering.
export const id = "racer";
export const title = Object.freeze({ en: "Road Run", bn: "রোড রান" });
export const memory = "Dodge traffic on the para road";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
