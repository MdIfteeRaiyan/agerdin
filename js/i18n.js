const languageFiles = {
  bn: new URL("../data/i18n.bn.json", import.meta.url),
  en: new URL("../data/i18n.en.json", import.meta.url),
};
let translationsPromise;

export function getSavedLanguage(fallback = "bn") {
  try {
    const saved = localStorage.getItem("agerdin-language");
    return saved === "bn" || saved === "en" ? saved : fallback;
  } catch {
    return fallback;
  }
}

export function saveLanguage(language) {
  try { localStorage.setItem("agerdin-language", language); } catch { /* Storage can be disabled. */ }
}

export function loadI18n() {
  if (!translationsPromise) {
    translationsPromise = Promise.all(Object.entries(languageFiles).map(async ([language, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${language} text (${response.status})`);
      return [language, await response.json()];
    })).then((entries) => {
      const data = Object.fromEntries(entries);
      const pair = (key) => ({ bn: data.bn[key], en: data.en[key] });
      const cardIds = new Set([...Object.keys(data.bn.playableCardCopy), ...Object.keys(data.en.playableCardCopy)]);
      const playableCardCopy = Object.fromEntries([...cardIds].map((id) => [id, {
        bn: data.bn.playableCardCopy[id],
        en: data.en.playableCardCopy[id],
      }]));
      return {
        categoryNames: pair("categoryNames"),
        copy: pair("copy"),
        playCopy: pair("playCopy"),
        playableCardCopy,
        categoryDescriptions: pair("categoryDescriptions"),
        arcadeFilterNames: pair("arcadeFilterNames"),
        classicArcadeText: pair("classicArcadeText"),
      };
    });
  }
  return translationsPromise;
}
