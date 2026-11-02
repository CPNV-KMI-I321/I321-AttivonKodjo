import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const project = `foodtruck-test-${process.pid}`;
const env = { ...process.env, PIZZAS_PORT: '0', INGREDIENTS_PORT: '0' };
const cwd = fileURLToPath(new URL('..', import.meta.url));
function compose(args, capture = false) {
  return execFileSync('docker', ['compose', '-p', project, ...args], {
    cwd, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit'
  });
}
function base(service, port) {
  const address = compose(['port', service, String(port)], true).trim();
  return `http://127.0.0.1:${address.split(':').at(-1)}`;
}
async function request(url, method = 'GET', body) {
  return fetch(url, { method, headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}

try {
  compose(['up', '--build', '-d', '--wait', '--wait-timeout', '120']);
  let ingredients = base('ingredients-api', 3002);
  let pizzas = base('pizzas-api', 3001);
  let response = await request(`${ingredients}/api/ingredients`, 'POST', { name: 'Tomate', price: 1 });
  assert.equal(response.status, 201);
  const ingredient = await response.json();
  response = await request(`${pizzas}/api/pizzas`, 'POST', {
    name: 'Persistance', price: 12, ingredientIds: [ingredient.id]
  });
  assert.equal(response.status, 201);
  const pizza = await response.json();
  compose(['down']);
  compose(['up', '-d', '--wait', '--wait-timeout', '120']);
  ingredients = base('ingredients-api', 3002);
  pizzas = base('pizzas-api', 3001);
  assert.equal((await request(`${ingredients}/api/ingredients/${ingredient.id}`)).status, 200);
  assert.deepEqual(await (await request(`${pizzas}/api/pizzas/${pizza.id}`)).json(), pizza);
  console.log('OK : communication interservices et données conservées après recréation.');
} finally {
  compose(['down', '--volumes', '--remove-orphans']);
}
