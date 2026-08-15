export const LIMITS = { attendeeName: 80, brewery: 100, beerName: 120 };
export const STYLES = new Set(['marzen', 'festbier']);
export const PACKAGES = new Set(['six_pack_bottles', 'four_pack_cans']);

export function normalizeBeerPart(value) {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/\s+/gu, ' ');
}

function cleanText(value, label, maxLength, errors) {
  if (typeof value !== 'string') {
    errors[label] = `${label} is required.`;
    return '';
  }
  const clean = value.trim().replace(/\s+/gu, ' ');
  if (!clean) errors[label] = `${label} is required.`;
  else if (clean.length > maxLength) errors[label] = `${label} must be ${maxLength} characters or fewer.`;
  return clean;
}

export function validateSignup(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: { form: 'Please provide signup details.' } };
  }
  const value = {
    attendeeName: cleanText(input.attendeeName, 'attendeeName', LIMITS.attendeeName, errors),
    brewery: cleanText(input.brewery, 'brewery', LIMITS.brewery, errors),
    beerName: cleanText(input.beerName, 'beerName', LIMITS.beerName, errors),
    style: input.style,
    packageType: input.packageType,
  };
  if (!STYLES.has(value.style)) errors.style = 'Choose Märzen or Festbier.';
  if (!PACKAGES.has(value.packageType)) errors.packageType = 'Choose one of the available package sizes.';
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      ...value,
      normalizedBrewery: normalizeBeerPart(value.brewery),
      normalizedBeerName: normalizeBeerPart(value.beerName),
    },
  };
}
