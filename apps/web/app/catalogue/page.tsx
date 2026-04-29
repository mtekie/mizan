import { CatalogueClient } from './CatalogueClient';
import { buildFindScreenDataContract, demoProducts } from '@mizan/shared';
import { isParityDemo } from '@/lib/parity-demo';
import { getFindScreenApiResponse } from '@/lib/server/find-contract';

export default async function Catalogue({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  if (await isParityDemo(searchParams)) {
    const find = buildFindScreenDataContract({ products: demoProducts });
    return <CatalogueClient products={demoProducts} find={find} />;
  }

  const payload = await getFindScreenApiResponse(undefined, 50);

  return <CatalogueClient products={payload.products} find={payload.find} />;
}
