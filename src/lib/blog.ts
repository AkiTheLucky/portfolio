const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

export function postSlug(id: string): string {
  return id.replace(DATE_PREFIX, '');
}
