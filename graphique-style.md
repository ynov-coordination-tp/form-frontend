# Charte graphique — Hellenic Riders (MVP)

Objectif : reproduire l’esprit actuel du site (Grèce : **bleu nuit + blanc**), avec une UI simple, premium et lisible.
Stack front : **SvelteKit + Tailwind + variables CSS**.

---

## 1) Palette (tokens)

> Les couleurs sont définies via variables CSS dans `:root` et consommées dans Tailwind.

### Couleurs principales
- **Navy (cards / sections fortes)** : `#0A2A4F`
- **Navy Hover / relief** : `#0B3565`
- **Accent (CTA, focus, liens)** : `#2F6BFF`
- **Background page** : `#F3F7FF`
- **White** : `#FFFFFF`

### Couleurs texte
- **Texte principal** : `#0F172A`
- **Texte secondaire** : `#475569`

### UI neutre
- **Border / séparateurs** : `#D9E3F5`

### États
- **Succès** : `#16A34A`
- **Warning** : `#F59E0B`
- **Erreur** : `#DC2626`

---

## 2) Typographies

- **UI / texte** : Inter (lisible, moderne)
- **Titres “mythologie” (optionnel)** : Cinzel (pour un rendu proche des cartes Zeus/Poseidon/Athena)
- Fallback : `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`

Recommandations :
- H1 : 28–32px / 700
- H2 : 20–24px / 700
- Texte : 14–16px / 400–500
- Labels : 12–13px / 500

---

## 3) Variables CSS (à mettre dans `src/app.css`)

```css
:root{
  --c-bg: 243 247 255;        /* #F3F7FF */
  --c-card: 10 42 79;         /* #0A2A4F */
  --c-card-2: 11 53 101;      /* #0B3565 */
  --c-accent: 47 107 255;     /* #2F6BFF */
  --c-border: 217 227 245;    /* #D9E3F5 */
  --c-text: 15 23 42;         /* #0F172A */
  --c-text2: 71 85 105;       /* #475569 */

  --radius: 18px;
}
