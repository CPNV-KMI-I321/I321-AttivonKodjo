import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';

process.env.DB_PATH = ':memory:';
const { default: app } = await import('../pizzas-api/src/app.js');
const { db } = await import('../pizzas-api/src/config/database.js');
let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  db.close();
});
async function createPizza(name) {
  return fetch(`${base}/api/pizzas`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price: 12, ingredientIds: [1] }) });
}

test('Ingrédients arrêté : 503 et aucune pizza créée', async () => {
  process.env.INGREDIENTS_API_URL = 'http://127.0.0.1:1';
  assert.equal((await createPizza('Panne')).status, 503);
  assert.deepEqual(await (await fetch(`${base}/api/pizzas`)).json(), []);
});

test('timeout HTTP borné : 503 et aucune pizza créée', async () => {
  const slow = createServer(() => {});
  slow.listen(0, '127.0.0.1');
  await once(slow, 'listening');
  process.env.INGREDIENTS_API_URL = `http://127.0.0.1:${slow.address().port}`;
  process.env.HTTP_TIMEOUT_MS = '50';
  try {
    assert.equal((await createPizza('Timeout')).status, 503);
    assert.deepEqual(await (await fetch(`${base}/api/pizzas`)).json(), []);
  } finally {
    slow.closeAllConnections();
    await new Promise(resolve => slow.close(resolve));
    delete process.env.HTTP_TIMEOUT_MS;
  }
});

test('réponse interservice mal formée : 503', async () => {
  const broken = createServer((req, res) => res.end('pas du JSON'));
  broken.listen(0, '127.0.0.1');
  await once(broken, 'listening');
  process.env.INGREDIENTS_API_URL = `http://127.0.0.1:${broken.address().port}`;
  try {
    assert.equal((await createPizza('Mauvais JSON')).status, 503);
  } finally {
    await new Promise(resolve => broken.close(resolve));
  }
});
