import { validateSignup } from './signup.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export async function handleApi(request, env) {
  const url = new URL(request.url);
  const matchId = url.pathname.match(/^\/api\/signups\/(\d+)$/);
  const isBase = url.pathname === '/api/signups';

  if (!isBase && !matchId) return json({ error: 'Not found.' }, 404);

  if (isBase && request.method === 'GET') {
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

  if (isBase && request.method === 'POST') {
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
      return json({ id: result.meta.last_row_id, message: 'Your bier is claimed!' }, 201);
    } catch (error) {
      if (/unique constraint/i.test(String(error?.message ?? error))) {
        return json({ error: 'That bier has already been claimed by another attendee. Please choose a different one.' }, 409);
      }
      console.error('Unable to create signup', error);
      return json({ error: 'We could not save your signup. Please try again.' }, 500);
    }
  }

  if (matchId && request.method === 'PUT') {
    const id = parseInt(matchId[1], 10);
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
        UPDATE signups
        SET attendee_name = ?, brewery = ?, beer_name = ?, normalized_brewery = ?, normalized_beer_name = ?, style = ?, package_type = ?
        WHERE id = ?
      `).bind(v.attendeeName, v.brewery, v.beerName, v.normalizedBrewery, v.normalizedBeerName, v.style, v.packageType, id).run();
      if (!result.meta?.changes) {
        return json({ error: 'Bier not found.' }, 404);
      }
      return json({ message: 'Bier updated successfully!' }, 200);
    } catch (error) {
      if (/unique constraint/i.test(String(error?.message ?? error))) {
        return json({ error: 'That bier has already been claimed by another attendee. Please choose a different one.' }, 409);
      }
      console.error('Unable to update signup', error);
      return json({ error: 'We could not update your signup. Please try again.' }, 500);
    }
  }

  if (matchId && request.method === 'DELETE') {
    const id = parseInt(matchId[1], 10);
    try {
      const result = await env.DB.prepare(`
        DELETE FROM signups WHERE id = ?
      `).bind(id).run();
      if (!result.meta?.changes) {
        return json({ error: 'Bier not found.' }, 404);
      }
      return json({ message: 'Bier removed from the tasting table.' }, 200);
    } catch (error) {
      console.error('Unable to delete signup', error);
      return json({ error: 'We could not delete the signup. Please try again.' }, 500);
    }
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, POST, PUT, DELETE' } });
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname.startsWith('/api/')) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  },
};
