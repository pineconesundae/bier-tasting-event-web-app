import { describe, expect, it } from 'vitest';
import { normalizeBeerPart, validateSignup } from '../worker/signup.js';

const valid = { attendeeName: 'Anna', brewery: 'Ayinger', beerName: 'Oktober Fest-Märzen', style: 'marzen', packageType: 'six_pack_bottles' };

describe('normalizeBeerPart', () => {
  it('normalizes capitalization and whitespace', () => {
    expect(normalizeBeerPart('  AYINGER  ')).toBe('ayinger');
    expect(normalizeBeerPart('Oktober   Fest-Märzen ')).toBe('oktober fest-märzen');
  });
  it('normalizes equivalent unicode forms', () => {
    expect(normalizeBeerPart('Ma\u0308rzen')).toBe(normalizeBeerPart('Märzen'));
  });
});

describe('validateSignup', () => {
  it('cleans and accepts valid input', () => {
    const result = validateSignup({ ...valid, attendeeName: ' Anna  Schmidt ' });
    expect(result.ok).toBe(true);
    expect(result.value.attendeeName).toBe('Anna Schmidt');
  });
  it('rejects missing and invalid enum values', () => {
    const result = validateSignup({ ...valid, attendeeName: '', style: 'lager', packageType: 'keg' });
    expect(result.ok).toBe(false);
    expect(result.errors).toMatchObject({ attendeeName: expect.any(String), style: expect.any(String), packageType: expect.any(String) });
  });
  it('enforces maximum lengths', () => {
    expect(validateSignup({ ...valid, beerName: 'x'.repeat(121) }).errors.beerName).toMatch(/120/);
  });
});
