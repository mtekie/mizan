type SearchParamsReader = {
  get: (name: string) => string | null;
};

export function getParityQuery(searchParams: SearchParamsReader | null | undefined) {
  if (!searchParams) return '';
  if (searchParams.get('demo') === '1') return 'demo=1';
  if (searchParams.get('parity') === '1') return 'parity=1';
  return '';
}

export function appendParityQuery(href: string, searchParams: SearchParamsReader | null | undefined) {
  const parityQuery = getParityQuery(searchParams);
  if (!parityQuery || !href.startsWith('/')) return href;

  const [pathAndQuery, hash] = href.split('#');
  const separator = pathAndQuery.includes('?') ? '&' : '?';
  return `${pathAndQuery}${separator}${parityQuery}${hash ? `#${hash}` : ''}`;
}
