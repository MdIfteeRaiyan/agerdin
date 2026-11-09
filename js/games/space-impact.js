// Lazy entry module for Para to the Moon. The shared game runtime owns state and rendering.
export const id = "space";
export const title = Object.freeze({ en: "Para to the Moon", bn: "চাঁদের পথে" });
export const memory = "Dodge a rising alien fleet";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
