# Codex — Hellenic Riders — Devis Form (MVP)

Ce fichier est la **source de vérité** du projet front.
✅ **Règle obligatoire :** toute modification fonctionnelle, technique ou structurelle doit **mettre à jour `codex.md`** (et `graphique-style.md` si l’UI change).
✅ Codex doit **maintenir ce fichier à jour** au fil des développements.

---

## 0) Objectif MVP

Créer un **formulaire web** (SvelteKit) pour générer une **demande de devis** multi-participants (multi-moto) pour Hellenic Riders.

Parcours en **fil d’Ariane / stepper** en 5 étapes :

1) Tour
2) Participants
3) Formule
4) Formulaire
5) Envoi

Navigation :
- ✅ Navigation libre (clic possible sur n’importe quelle étape)
- ✅ Validation live (erreurs visibles au fil de l’eau)
- ✅ Blocage seulement au moment de l’envoi (step 5)
- ✅ Confirmation après succès (offline ou future API)

---

## 1) Stack & contraintes

- Framework : **SvelteKit + TypeScript**
- UI : **Tailwind CSS**
- Thème : variables CSS `:root` (1 seul thème actuellement)
- Validation : **sans zod** (validation TS “maison”)
- Données : lecture seule (API optionnelle + fallback offline)
- Route principale : **`/quote`** (le wizard est sur une seule page)

---

## 2) Données & Offline

### Catalog
Le catalog est chargé via un service dédié :
- `src/lib/services/catalogService.ts`
- Stratégie :
  - si `PUBLIC_API_BASE_URL` est présent et l’API répond → on consomme l’API
  - sinon fallback **automatique** vers `static/mock/catalog.json`

### Offline
- Le MVP fonctionne entièrement **sans API**.
- En mode offline, l’envoi produit un **console.log** structuré du devis.

---

## 3) Architecture des services

### `catalogService`
- Charge les circuits, formules et options.
- Retourne la source (`api` ou `mock`) pour afficher un indicateur UI.

### `quoteWizard`
- `src/lib/services/quoteWizard.ts`
- Service instancié **dans `/quote` uniquement** (pas un store global partagé).
- Encapsule :
  - state réactif (`writable`)
  - derived (`derived`)
  - actions (setCircuit, setFormula, setParticipantsCount, updateLeadField, setDateDepart, toggleOption, goToStep, submit)

---

## 4) Validation & UX

- Validation live (affichage des erreurs dès qu’un champ est touché).
- Les statuts d’étape (breadcrumb) sont visibles :
  - gris = incomplet
  - rouge = erreurs
  - vert = valide
- L’envoi bloque si erreurs, reste sur l’étape 5, et affiche un message.

---

## 5) UI & charte

- Palette et tokens : `graphique-style.md`
- Variables CSS : `src/app.css`
- Polices : Inter + Cinzel (option mythologie)

---

## 6) Mock — Structure JSON

`static/mock/catalog.json` contient :
- `circuits`: { id, nom, duree_jours, distance_km, formules }
- `formules`: { id, code, nom, prix_base, options, startDate?, endDate?, maxParticipant?, currParticipant? }
- `options`: { id, name, price, type, idObjet }

---

## 7) État actuel

✅ Tailwind + thème CSS variables installés.
✅ Route `/quote` avec wizard en 5 étapes.
✅ Breadcrumb cliquable, statuts live.
✅ Fallback offline vers `static/mock/catalog.json`.
✅ Soumission offline avec console.log structuré.
