import { fail } from '../validation.js';

export async function ensureExist(ids) {
  const base = process.env.INGREDIENTS_API_URL || 'http://localhost:3002';
  for (const id of ids) {
    let response;
    let ingredient;
    try {
      response = await fetch(`${base}/api/ingredients/${id}`, {
        signal: AbortSignal.timeout(Number(process.env.HTTP_TIMEOUT_MS || 2000))
      });
      if (response.ok) ingredient = await response.json();
    } catch {
      fail(503, 'Le service Ingrédients est indisponible ou trop lent.');
    }
    if (response.status === 404) fail(400, `Ingrédient ${id} inexistant.`);
    if (!response.ok || ingredient?.id !== id) fail(503, 'Réponse invalide du service Ingrédients.');
  }
}
