/** Shared storage key for next-themes and the inline boot script. */
export const THEME_STORAGE_KEY = "shaadi-ai-theme";

export const THEME_OPTIONS = ["light", "dark", "system"] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

/** Inline script applied before paint to avoid incorrect-theme flash. */
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);var d=document.documentElement;var m=window.matchMedia("(prefers-color-scheme: dark)");if(t==="dark"||(t!=="light"&&m.matches)){d.classList.add("dark")}else{d.classList.remove("dark")}}catch(e){}})();`;
