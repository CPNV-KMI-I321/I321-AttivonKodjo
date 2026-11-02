import * as Pizza from '../entities/Pizza.js';
import * as Composition from '../entities/PizzaComposition.js';
import * as ingredientsClient from '../clients/ingredientsClient.js';
import { transaction } from '../config/database.js';
import { fail, validatePizza, validateIngredientIds } from '../validation.js';

function withComposition(pizza) {
  return { ...pizza, ingredientIds: Composition.ingredientIds(pizza.id) };
}

export function list() {
  return Pizza.findAll().map(withComposition);
}

export function get(id) {
  const pizza = Pizza.findById(id);
  if (!pizza) fail(404, 'Pizza introuvable.');
  return withComposition(pizza);
}

function ensureUniqueName(name, id) {
  const existing = Pizza.findByName(name);
  if (existing && existing.id !== id) fail(409, 'Ce nom de pizza existe déjà.');
}

export async function create(body) {
  const data = validatePizza(body);
  const ids = validateIngredientIds(body.ingredientIds);
  await ingredientsClient.ensureExist(ids);
  return transaction(() => {
    ensureUniqueName(data.name);
    const pizza = Pizza.create(data);
    Composition.replace(pizza.id, ids);
    return withComposition(pizza);
  });
}

export async function update(id, body) {
  const data = validatePizza(body);
  const ids = validateIngredientIds(body.ingredientIds);
  get(id);
  await ingredientsClient.ensureExist(ids);
  return transaction(() => {
    get(id);
    ensureUniqueName(data.name, id);
    Pizza.update(id, data);
    Composition.replace(id, ids);
    return get(id);
  });
}

export function remove(id) {
  if (!Pizza.remove(id)) fail(404, 'Pizza introuvable.');
}
