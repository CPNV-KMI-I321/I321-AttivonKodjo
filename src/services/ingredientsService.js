import * as Ingredient from '../entities/Ingredient.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import { fail, validateId, validateIngredient } from '../validation.js';

export function list() {
  return Ingredient.findAll();
}

export function get(id) {
  const ingredient = Ingredient.findById(validateId(id));
  if (!ingredient) fail(404, 'Ingredient introuvable.');
  return ingredient;
}

export function create(body) {
  return Ingredient.create(validateIngredient(body));
}

export function update(id, body) {
  const ingredientId = validateId(id);
  if (!Ingredient.findById(ingredientId)) fail(404, 'Ingredient introuvable.');
  return Ingredient.update(ingredientId, validateIngredient(body));
}

export function remove(id) {
  const ingredientId = validateId(id);
  if (!Ingredient.findById(ingredientId)) fail(404, 'Ingredient introuvable.');
  if (PizzaComposition.isUsed(ingredientId)) {
    fail(409, 'Cet ingrédient est utilisé par une ou plusieurs pizzas.');
  }
  if (!Ingredient.remove(ingredientId)) fail(404, 'Ingredient introuvable.');
}

export function ensureExist(ids) {
  for (const id of ids) {
    if (!Ingredient.findById(id)) fail(400, `Ingrédient ${id} introuvable.`);
  }
}
