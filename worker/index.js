import { validateSignup } from './signup.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export async function handleApi(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/signups') return json({ error: 'Not found.' }, 404);

  if (request.method === 'GET') {
    try {
      const result = await env.DB.prepare(`
        SELECT id, attendee_name, brewery, beer_name, style, package_type, created_at
        FROM signups ORDER BY created_at ASC, id ASC
      `).all();
      return json({ signups: result.results });
    } catch (error) {
      console.error('Unable to list signups', error);
      return json({ error: 'The beer list is temporarily unavailable.' }, 500);
    }
  }

  if (request.method === 'POST') {
    let input;
    try {
      input = await request.json();
    } catch {
      return json({ error: 'Request body must be valid JSON.' }, 400);
    }
    const validation = validateSignup(input);
    if (!validation.ok) return json({ error: 'Please check the form.', fields: validation.errors }, 422);
    const v = validation.value;
    try {
      const result = await env.DB.prepare(`
        INSERT INTO signups
          (attendee_name, brewery, beer_name, normalized_brewery, normalized_beer_name, style, package_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(v.attendeeName, v.brewery, v.beerName, v.normalizedBrewery, v.normalizedBeerName, v.style, v.packageType).run();
      return json({ id: result.meta.last_row_id, message: 'Your beer is claimed!' }, 201);
    } catch (error) {
      if (/unique constraint/i.test(String(error?.message ?? error))) {
        return json({ error: 'That beer has already been claimed by another attendee. Please choose a different one.' }, 409);
      }
      console.error('Unable to create signup', error);
      return json({ error: 'We could not save your signup. Please try again.' }, 500);
    }
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname.startsWith('/api/')) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  },
};
