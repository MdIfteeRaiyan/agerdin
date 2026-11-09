// Lazy entry module for Para Patrol. The shared game runtime owns state and rendering.
export const id = "rescue";
export const title = Object.freeze({ en: "Para Patrol", bn: "পাড়া টহল" });
export const memory = "Protect the neighborhood";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
