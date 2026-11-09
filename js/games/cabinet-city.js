// Lazy entry module for Neighborhood Delivery. The shared game runtime owns state and rendering.
export const id = "city";
export const title = Object.freeze({ en: "Neighborhood Delivery", bn: "পাড়ার ডেলিভারি" });
export const memory = "Carry a parcel through traffic";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
