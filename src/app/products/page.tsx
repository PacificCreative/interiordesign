import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getProducts, getProductCategories, getVendors } from '@/lib/actions/products';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; status?: string; vendor?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const params = await searchParams;
  const [products, categories, vendors] = await Promise.all([
    getProducts({
      search: params.search,
      category: params.category,
      status: params.status,
      vendorName: params.vendor,
    }),
    getProductCategories(),
    getVendors(),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Products</h1>
          <p className="text-slate-500">Source, specify, and track products for your projects.</p>
        </div>
        <Link href="/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Search & Filters */}
      <ProductsPageClient
        products={products.map((p) => ({
          ...p,
          retailPrice: p.retailPrice ? Number(p.retailPrice) : null,
          tradePrice: p.tradePrice ? Number(p.tradePrice) : null,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }))}
        categories={categories}
        vendors={vendors}
      />
    </div>
  );
}