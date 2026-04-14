'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { useStore } from '@/lib/store';

export default function WishlistPage() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích trống</h1>
          <p className="text-muted-foreground mb-8">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Link href="/san-pham">
            <Button size="lg" className="gap-2">
              Khám phá sản phẩm <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Yêu thích</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">Sản phẩm yêu thích</h1>
        <p className="text-muted-foreground">{wishlist.length} sản phẩm</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
