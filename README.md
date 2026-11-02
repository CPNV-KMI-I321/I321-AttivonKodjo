# Foodtruck — Starter 4

Branche : `starter-4-microservices`. Ce dossier est un point de départ à compléter, pas le corrigé.
Installer Node.js **24 LTS** et Git. Le cours et les consignes restent en français.

## Démarrer

```sh
npm run setup
```

Puis, dans deux terminaux :

```sh
npm run start:ingredients
```

```sh
npm run start:pizzas
```

Swagger Ingrédients : http://localhost:3002/docs ; Swagger Pizzas : http://localhost:3001/docs.

Les routes et leur JSON attendu sont décrits dans Swagger. Les bases SQLite sont créées automatiquement.
Pour personnaliser la configuration, copier le `.env.example` de chaque application vers `.env` dans le même dossier.
Les chemins de base sont relatifs au dossier de l'application. Ne pas reprendre une base ou un `.env` d'une autre étape.

## À réaliser

La structure des deux API et les transactions locales sont fournies, à partir du comportement de l'étape 3.
Le seul appel interservices est à compléter dans `pizzas-api/src/clients/ingredientsClient.js`.
Sans cet appel, créer ou modifier une pizza répond **501** ; les lectures et le CRUD Ingrédients fonctionnent.

1. Pour chaque identifiant, appeler `GET /api/ingredients/:id` avec `fetch`.
2. Lire l'URL depuis `INGREDIENTS_API_URL` (par défaut http://localhost:3002).
3. Appliquer `HTTP_TIMEOUT_MS` (par défaut 2000) avec AbortSignal.timeout.
4. Transformer 404 en erreur métier 400, et une panne, un timeout ou une réponse invalide en 503.
5. Vérifier que le JSON reçu contient l'identifiant demandé.
6. Ne jamais accéder à la base Ingrédients depuis Pizzas, ni garder une transaction SQL ouverte pendant un appel HTTP.
7. Dessiner les composants et la séquence avec la frontière réseau et les erreurs.

Commencer par lire `pizzas-api/src/services/pizzasService.js` pour voir où le client est appelé.
Créer d'abord un ingrédient (`{"name":"Tomate","price":1}`), puis une pizza :

```json
{"name":"Margherita","price":14.5,"ingredientIds":[1]}
```

Tester aussi une création quand seul Pizzas est démarré : le résultat final attendu est 503.
La suppression distribuée des ingrédients n'est pas traitée dans ce laboratoire.

## Vérifier son travail

```sh
npm test
npm run test:acceptance
```

`npm test` vérifie uniquement que le point de départ et les fonctionnalités précédemment acquises fonctionnent.
Ces tests ne valident pas la nouvelle étape.
`npm run test:acceptance` vérifie le résultat à atteindre : ses échecs sont attendus avant de terminer les TODO.
Ne pas modifier les assertions pour les faire passer. Avancer fonctionnalité par fonctionnalité et tester aussi avec Swagger.
À l'étape 5, les tests d'acceptation nécessitent Docker démarré.

Le diagramme demandé peut être produit dans `docs/a-completer.puml`.
Ce starter possède un historique indépendant du corrigé. Le corrigé sera publié par l'enseignant en fin de séance.
