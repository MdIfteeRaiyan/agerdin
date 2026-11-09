const catalogUrl = new URL("../data/catalog.json", import.meta.url);
let catalogPromise;

export function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(catalogUrl).then((response) => {
      if (!response.ok) throw new Error(`Could not load game catalog (${response.status})`);
      return response.json();
    });
  }
  return catalogPromise;
}
