import { describe, expect, it, vi } from 'vitest';
import { handleApi } from '../worker/index.js';

function envWith({ results = [], insertError, changes = 1 } = {}) {
  const statement = {
    bind: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue({ results }),
    run: insertError
      ? vi.fn().mockRejectedValue(insertError)
      : vi.fn().mockResolvedValue({ meta: { last_row_id: 7, changes } }),
  };
  return { env: { DB: { prepare: vi.fn(() => statement) } }, statement };
}

describe('signup API', () => {
  it('lists signups', async () => {
    const { env } = envWith({ results: [{ id: 1, brewery: 'Ayinger' }] });
    const response = await handleApi(new Request('https://test/api/signups'), env);
    expect(response.status).toBe(200);
    expect((await response.json()).signups).toHaveLength(1);
  });

  it('creates a validated signup with a parameterized query', async () => {
    const { env, statement } = envWith();
    const response = await handleApi(
      new Request('https://test/api/signups', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          attendeeName: 'Anna',
          brewery: ' Ayinger ',
          beerName: 'Festbier ',
          style: 'festbier',
          packageType: 'four_pack_cans',
        }),
      }),
      env
    );
    expect(response.status).toBe(201);
    expect(statement.bind).toHaveBeenCalledWith(
      'Anna',
      'Ayinger',
      'Festbier',
      'ayinger',
      'festbier',
      'festbier',
      'four_pack_cans'
    );
  });

  it('returns 422 for invalid input on POST', async () => {
    const { env } = envWith();
    const response = await handleApi(new Request('https://test/api/signups', { method: 'POST', body: '{}' }), env);
    expect(response.status).toBe(422);
  });

  it('maps the database uniqueness constraint to a friendly conflict on POST', async () => {
    const { env } = envWith({ insertError: new Error('UNIQUE constraint failed: signups.normalized_brewery') });
    const response = await handleApi(
      new Request('https://test/api/signups', {
        method: 'POST',
        body: JSON.stringify({
          attendeeName: 'Anna',
          brewery: 'Ayinger',
          beerName: 'Festbier',
          style: 'festbier',
          packageType: 'four_pack_cans',
        }),
      }),
      env
    );
    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/already been claimed/i);
  });

  it('updates an existing signup via PUT', async () => {
    const { env, statement } = envWith({ changes: 1 });
    const response = await handleApi(
      new Request('https://test/api/signups/7', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          attendeeName: 'Anna Updated',
          brewery: 'Paulaner',
          beerName: 'Oktoberfest Bier',
          style: 'festbier',
          packageType: 'four_pack_cans',
        }),
      }),
      env
    );
    expect(response.status).toBe(200);
    expect(statement.bind).toHaveBeenCalledWith(
      'Anna Updated',
      'Paulaner',
      'Oktoberfest Bier',
      'paulaner',
      'oktoberfest bier',
      'festbier',
      'four_pack_cans',
      7
    );
    expect((await response.json()).message).toMatch(/updated successfully/i);
  });

  it('returns 404 on PUT if the signup does not exist', async () => {
    const { env } = envWith({ changes: 0 });
    const response = await handleApi(
      new Request('https://test/api/signups/999', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          attendeeName: 'Anna',
          brewery: 'Paulaner',
          beerName: 'Oktoberfest Bier',
          style: 'festbier',
          packageType: 'four_pack_cans',
        }),
      }),
      env
    );
    expect(response.status).toBe(404);
  });

  it('returns 409 on PUT if updating conflicts with an existing beer', async () => {
    const { env } = envWith({ insertError: new Error('UNIQUE constraint failed: signups.normalized_brewery') });
    const response = await handleApi(
      new Request('https://test/api/signups/7', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          attendeeName: 'Anna',
          brewery: 'Ayinger',
          beerName: 'Festbier',
          style: 'festbier',
          packageType: 'four_pack_cans',
        }),
      }),
      env
    );
    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/already been claimed/i);
  });

  it('deletes a signup via DELETE', async () => {
    const { env, statement } = envWith({ changes: 1 });
    const response = await handleApi(new Request('https://test/api/signups/7', { method: 'DELETE' }), env);
    expect(response.status).toBe(200);
    expect(statement.bind).toHaveBeenCalledWith(7);
    expect((await response.json()).message).toMatch(/removed/i);
  });

  it('returns 404 on DELETE if the signup does not exist', async () => {
    const { env } = envWith({ changes: 0 });
    const response = await handleApi(new Request('https://test/api/signups/999', { method: 'DELETE' }), env);
    expect(response.status).toBe(404);
  });
});
