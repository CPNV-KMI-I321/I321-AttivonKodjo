import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';

process.env.DB_PATH = ':memory:';
const { default: pizzaApp } = await import('../pizzas-api/src/app.js');
const { default: ingredientApp } = await import('../ingredients-api/src/app.js');
const { db: pizzaDb } = await import('../pizzas-api/src/config/database.js');
const { db: ingredientDb } = await import('../ingredients-api/src/config/database.js');
const servers = [];
let pizzas;
let ingredients;
async function listen(app) {
  const server = app.listen(0, '127.0.0.1');
  servers.push(server);
  await once(server, 'listening');
  return `http://127.0.0.1:${server.address().port}`;
}
before(async () => {
  ingredients = await listen(ingredientApp);
  pizzas = await listen(pizzaApp);
  process.env.INGREDIENTS_API_URL = ingredients;
});
after(async () => {
  for (const server of servers) await new Promise(resolve => server.close(resolve));
  pizzaDb.close();
  ingredientDb.close();
});
function request(base, path, method = 'GET', body) {
  return fetch(base + path, { method, headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}

test('les deux API démarrent avec leur propre Swagger et leur propre base', async () => {
  for (const base of [pizzas, ingredients]) {
    assert.deepEqual(await (await request(base, '/health')).json(), { status: 'ok' });
    assert.equal((await request(base, '/docs/')).status, 200);
    assert.equal((await request(base, '/openapi.json')).status, 200);
  }
  const response = await request(ingredients, '/api/ingredients', 'POST', { name: 'Tomate', price: 1 });
  assert.equal(response.status, 201);
  const ingredient = await response.json();
  assert.equal((await request(ingredients, `/api/ingredients/${ingredient.id}`)).status, 200);
});
