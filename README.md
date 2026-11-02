# Foodtruck — Starter 5

Branche : `starter-5-docker`. Ce dossier est un point de départ à compléter, pas le corrigé.
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

Les deux microservices de l'étape 4 fonctionnent en local avec npm.
Les Dockerfile et compose.yaml sont volontairement incomplets. Les conteneurs ne démarrent pas encore les API.

1. Compléter chaque Dockerfile : copier les manifestes, installer avec npm ci, copier src, créer un dossier de données accessible à l'utilisateur node, choisir le port et démarrer le serveur.
2. Compléter compose.yaml : ports, PORT, DB_PATH et INGREDIENTS_API_URL.
3. Utiliser le nom DNS du service Ingrédients plutôt que localhost pour les échanges entre conteneurs.
4. Ajouter un volume nommé par base SQLite et déclarer les volumes dans Compose.
5. Ajouter un contrôle de santé `/health`, un ordre de démarrage adapté et une politique de redémarrage.
6. Produire le diagramme de déploiement : hôte, réseau, ports, conteneurs et volumes.

Le résultat doit démarrer avec :

```sh
docker compose up --build -d
```

Créer un ingrédient puis une pizza, exécuter `docker compose down`, puis `docker compose up -d`.
Les données doivent toujours exister. Ne pas utiliser `--volumes` pour ce test manuel.
`npm run test:api` vérifie les API locales ; `npm run test:docker` vérifie la communication et la persistance en conteneurs.
Le test Docker utilise un projet temporaire et supprime uniquement ses propres conteneurs et volumes.

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
