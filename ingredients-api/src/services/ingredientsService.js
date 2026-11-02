import * as Ingredient from '../entities/Ingredient.js';
import { fail, validateIngredient } from '../validation.js';

export function list() {
  return Ingredient.findAll();
}

export function get(id) {
  const ingredient = Ingredient.findById(id);
  if (!ingredient) fail(404, 'Ingrédient introuvable.');
  return ingredient;
}

export function create(body) {
  return Ingredient.create(validateIngredient(body));
}

export function update(id, body) {
  get(id);
  return Ingredient.update(id, validateIngredient(body));
}

export function remove(id) {
  if (!Ingredient.remove(id)) fail(404, 'Ingrédient introuvable.');
}
