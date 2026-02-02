# Codex — Hellenic Riders — Devis Form (MVP)

Ce fichier est la **source de vérité** du projet front.
✅ **Règle obligatoire :** toute modification fonctionnelle, technique ou structurelle doit **mettre à jour `codex.md`** (et `graphique-style.md` si l’UI change).
✅ Codex doit **maintenir ce fichier à jour** au fil des développements.

---

## 0) Objectif MVP

Créer un **formulaire web** (SvelteKit) pour générer une **demande de devis multi-participants** (multi-moto) et l’envoyer à l’API mockée (JSONServer).

Parcours en **fil d’Ariane / stepper** en 5 étapes :

1) Tour
2) Participants
3) Formule
4) Formulaire
5) Envoi

Navigation :
- ✅ Retour arrière autorisé
- ✅ Avance uniquement si étape **valide**
- ✅ Confirmation après succès API
- ❌ Pré-remplissage via query params : **V2**

---

## 1) Stack & contraintes

- Framework : **SvelteKit + TypeScript**
- UI : **Tailwind CSS**
- Thème : variables CSS `:root` (1 seul thème actuellement)
- Validation : **sans zod** (validation TS “maison”)
- Mock API : **JSONServer**
- Base URL : `.env` (`PUBLIC_API_BASE_URL`)
- Toutes les routes consommées sont préfixées `/api/...`

---

## 2) Environnement

### Variables
- `.env.example` :
  - `PUBLIC_API_BASE_URL=http://localhost:3000`

Convention :
- `PUBLIC_API_BASE_URL` = origine JSONServer en MVP
- Si absent => fallback same-origin

---

## 3) JSONServer — Schéma des données (db.json)

Le mock JSONServer contient notamment :
- `clients`
- `devis`
- `devis_lignes`
- `circuits`
- `formules`
- `circuit_formules`
- `motos`
- `options`
- `formule_options`
- `devis_ligne_options`
- `pays`, `villes`
- `sessions_zeus`

But MVP : **créer un devis** (et idéalement ses lignes) à partir d’une saisie utilisateur.

---

## 4) JSONServer — Rewrites (fournis)

```json
{
  "/api/*": "/$1",
  "/devis/:id/lignes": "/devis_lignes?id_devis=:id",
  "/devis/:id/detail": "/devis/:id?_embed=devis_lignes",
  "/circuits/:id/formules_disponibles": "/circuit_formules?id_circuit=:id&_expand=formule",
  "/circuits/:id/sessions": "/sessions_zeus?id_circuit_formule=:id",
  "/formules/:id/options": "/formule_options?id_formule=:id&_expand=option",
  "/lignes/:id/options": "/devis_ligne_options?id_devis_ligne=:id&_expand=option"
}
