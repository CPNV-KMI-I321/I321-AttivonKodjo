import { fail } from '../validation.js';

const DEFAULT_API_URL = 'http://localhost:3002';
const DEFAULT_TIMEOUT_MS = 2000;
const MAX_TIMEOUT_MS = 2_147_483_647;

function unavailable() {
  fail(503, 'Le service Ingrédients est indisponible.');
}

function requestConfig() {
  const apiUrl = process.env.INGREDIENTS_API_URL || DEFAULT_API_URL;
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_TIMEOUT_MS) {
    unavailable();
  }

  try {
    const url = new URL(apiUrl);
    if (!['http:', 'https:'].includes(url.protocol)) unavailable();
    return { apiUrl: url, timeoutMs };
  } catch (error) {
    if (error.status) throw error;
    unavailable();
  }
}

export async function ensureExist(ids) {
  const { apiUrl, timeoutMs } = requestConfig();

  for (const id of ids) {
    let response;
    try {
      response = await fetch(
        new URL(`/api/ingredients/${id}`, apiUrl),
        { signal: AbortSignal.timeout(timeoutMs) }
      );
    } catch {
      unavailable();
    }

    if (response.status === 404) {
      fail(400, `Ingrédient ${id} introuvable.`);
    }
    if (!response.ok) unavailable();

    let ingredient;
    try {
      ingredient = await response.json();
    } catch {
      unavailable();
    }

    if (!ingredient || typeof ingredient !== 'object' ||
        Array.isArray(ingredient) || ingredient.id !== id) {
      unavailable();
    }
  }
}
