'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/product-card';
import { useStore } from '@/lib/store';
import { products, getProductBySlug, getReviewsByProduct, formatPrice, type Review } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const product = getProductBySlug(slug);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user, addReview, userReviews } = useStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link href="/san-pham">
          <Button>Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const reviews = [...getReviewsByProduct(product.id), ...userReviews.filter(r => r.productId === product.id)];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/gio-hang');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = () => {
    if (!user) {
      router.push('/dang-nhap');
      return;
    }
    if (addReview(product.id, reviewRating, reviewContent)) {
      setReviewContent('');
      setReviewRating(5);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/san-pham" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Product Main */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                )}
              >
                <Image src={image} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-5 w-5',
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
                <span className="ml-2 font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{product.reviewCount} đánh giá</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <Label className="shrink-0">Số lượng:</Label>
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button size="lg" variant="secondary" className="flex-1" onClick={handleBuyNow}>
              Mua ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(inWishlist && 'text-primary')}
              onClick={handleWishlist}
            >
              <Heart className={cn('h-5 w-5', inWishlist && 'fill-current')} />
            </Button>
          </div>

          {/* Benefits */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Miễn phí vận chuyển cho đơn từ 500.000đ</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">{product.warranty}</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">Đổi trả trong 7 ngày</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Đánh giá ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specs">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {product.specs.map((spec, index) => (
                  <div
                    key={index}
                    className={cn(
                      'grid grid-cols-2 gap-4 py-3',
                      index !== product.specs.length - 1 && 'border-b border-border'
                    )}
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* Write Review */}
            <Card>
              <CardHeader>
                <CardTitle>Viết đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Đánh giá của bạn</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewRating(star)}>
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            star <= reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground hover:text-yellow-400'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-content" className="mb-2 block">
                    Nội dung (10-500 ký tự)
                  </Label>
                  <Textarea
                    id="review-content"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {reviewContent.length}/500 ký tự
                  </p>
                </div>
                <Button onClick={handleSubmitReview} disabled={reviewContent.length < 10}>
                  Gửi đánh giá
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
                {reviews.length > 3 && !showAllReviews && (
                  <Button variant="outline" className="w-full" onClick={() => setShowAllReviews(true)}>
                    Xem thêm đánh giá
                  </Button>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
