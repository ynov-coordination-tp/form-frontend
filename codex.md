# Codex — Hellenic Riders — Devis Form (MVP)

Ce fichier est la **source de vérité** du projet front.
✅ **Règle obligatoire :** toute modification fonctionnelle, technique ou structurelle doit **mettre à jour `codex.md`** (et `graphique-style.md` si l’UI change).
✅ Codex doit **maintenir ce fichier à jour** au fil des développements.

---

## 0) Objectif MVP

Remplacer le Google Form existant par un **formulaire web** permettant de créer un **devis multi-participants** (multi-moto) et de l’envoyer au backend.

Le parcours est un **fil d’Ariane / stepper** en 5 étapes :

1) Tour
2) Participants
3) Formule
4) Formulaire
5) Envoi

Règles navigation :
- ✅ Retour arrière autorisé
- ✅ Avance uniquement si l’étape est **valide**
- ✅ Confirmation après réussite de l’API
- ❌ Pré-remplissage via query params : **V2**

---

## 1) Stack & contraintes

- Framework : **SvelteKit + TypeScript**
- UI : **Tailwind CSS**
- Thème : variables CSS dans `:root` (1 thème pour le moment)
- Validation : **sans zod** (validation TypeScript “maison”)
- Data / Mock : **JSONServer**
- Base URL API : via `.env` avec `PUBLIC_API_BASE_URL`
- Les routes consommées par le front sont **préfixées par `/api/...`**

---

## 2) Environnement

### Variables
- `.env.example` doit exister :
    - `PUBLIC_API_BASE_URL=http://localhost:3000`

Convention :
- `PUBLIC_API_BASE_URL` est l’origine de l’API (JSONServer en MVP).
- Si la variable est absente, fallback sur same-origin.

---

## 3) JSONServer — Rewrites (fournis)

Le JSONServer utilise les rewrites suivants :

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
