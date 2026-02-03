import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import en from './locales/en';
import fr from './locales/fr';

// -- Types -------------------------------------------------------------------
// We keep the locale type small and explicit to make it easy to extend later.
// Adding a language only requires updating this union and the dictionaries.
export type Locale = 'en' | 'fr';

// -- Internal registry --------------------------------------------------------
// Central registry for all dictionaries.
// When you add a new language (ex: it.ts), import it here and extend this map.
const dictionaries: Record<Locale, Record<string, string>> = {
	en,
	fr
};

const STORAGE_KEY = 'app.locale';
const AVAILABLE_LOCALES: Locale[] = ['en', 'fr'];

const isLocale = (value: string): value is Locale => {
	return AVAILABLE_LOCALES.includes(value as Locale);
};

// -- Store: current locale ----------------------------------------------------
// `writable` gives us a reactive value + a `.set()` API.
// Components can use `$locale` to access the current value in the template.
export const locale = writable<Locale>('en');

// -- Translation function ------------------------------------------------------
// `derived` creates a read-only store from another store.
// Here, `t` recalculates when `locale` changes and returns a function.
// Usage in Svelte:
//   import { t } from '$lib/i18n';
//   {$t('ui.home.heading')}
export const t = derived(locale, ($locale) => (key: string) => {
	const selected = dictionaries[$locale];

	// Fallback order: selected locale -> English -> visible missing marker.
	return selected[key] ?? dictionaries.en[key] ?? `[missing:${key}]`;
});

// -- Persistence (SSR-safe) ---------------------------------------------------
// We never touch localStorage on the server. The `browser` flag is false during
// SSR, so this guard prevents "localStorage is not defined" errors.
export const initLocaleFromStorage = (): void => {
	if (!browser) return;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isLocale(stored)) {
		locale.set(stored);
	}
};

// Each time the locale changes, persist it in localStorage (client only).
if (browser) {
	locale.subscribe((value) => {
		localStorage.setItem(STORAGE_KEY, value);
	});
}

// Small helper for components (keeps templates tidy).
export const setLocale = (next: Locale): void => {
	locale.set(next);
};
