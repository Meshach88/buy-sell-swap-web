/** All money is whole kobo (₦1 = 100 kobo), matching the API and Paystack. */
export function formatNaira(kobo) {
  const value = Number(kobo) / 100;
  const hasKobo = Number(kobo) % 100 !== 0;
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: hasKobo ? 2 : 0, maximumFractionDigits: 2 })}`;
}

export function nairaToKobo(naira) {
  return Math.round(Number(naira) * 100);
}
