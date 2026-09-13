/** Normalize PostgREST to-one embeds, which may be typed as an object or one-item array. */
export function oneRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
