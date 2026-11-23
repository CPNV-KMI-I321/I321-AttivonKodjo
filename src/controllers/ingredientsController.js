import * as IngredientsService from '../services/ingredientsService.js';

export function list(req, res) {
  res.json(IngredientsService.list());
}

export function get(req, res) {
  res.json(IngredientsService.get(req.params.id));
}

export function create(req, res) {
  const ingredient = IngredientsService.create(req.body);
  res.location(`/api/ingredients/${ingredient.id}`).status(201).json(ingredient);
}

export function update(req, res) {
  res.json(IngredientsService.update(req.params.id, req.body));
}

export function remove(req, res) {
  IngredientsService.remove(req.params.id);
  res.sendStatus(204);
}
