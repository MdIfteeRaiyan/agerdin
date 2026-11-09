// Lazy entry module for Neighborhood Table Tennis. The shared game runtime owns state and rendering.
export const id = "table";
export const title = Object.freeze({ en: "Neighborhood Table Tennis", bn: "পাড়ার টেবিল টেনিস" });
export const memory = "Rally to eleven";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
