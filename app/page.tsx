import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/lib/data';

const featuredProducts = products.slice(0, 8);
const newProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 4);

const banners = [
  {
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titan. Mạnh mẽ. Đẳng cấp.',
    description: 'Giảm đến 5 triệu khi mua kèm phụ kiện',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=600&fit=crop',
    link: '/san-pham/iphone-15-pro-max-256gb',
  },
];

const benefits = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Cho đơn hàng từ 500K',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng',
    description: 'Lên đến 24 tháng',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Tư vấn nhiệt tình',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán linh hoạt',
    description: 'Nhiều phương thức',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-foreground to-foreground/90 text-background">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Khuyến mãi đặc biệt
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
                {banners[0].title}
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground">
                {banners[0].subtitle}
              </p>
              <p className="text-lg">{banners[0].description}</p>
              <Link href={banners[0].link}>
                <Button size="lg" className="gap-2">
                  Mua ngay <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              <Image
                src={banners[0].image}
                alt={banners[0].title}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">Danh mục sản phẩm</h2>
            <Link href="/san-pham" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/san-pham?category=${category.slug}`}>
                <Card className="hover:shadow-md hover:border-primary transition-all text-center h-full">
                  <CardContent className="p-4 lg:p-6">
                    <span className="text-4xl mb-3 block">{category.icon}</span>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{category.productCount} sản phẩm</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden group">
              <div className="relative aspect-[2/1]">
                <Image
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=400&fit=crop"
                  alt="MacBook Sale"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6 lg:p-8">
                  <div className="text-white">
                    <p className="text-sm font-medium mb-2">Laptop cao cấp</p>
                    <h3 className="text-2xl font-bold mb-2">MacBook Pro M3</h3>
                    <p className="text-sm opacity-80 mb-4">Giảm đến 10%</p>
                    <Link href="/san-pham?category=laptop">
                      <Button variant="secondary" size="sm">Khám phá ngay</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden group">
              <div className="relative aspect-[2/1]">
                <Image
                  src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=400&fit=crop"
                  alt="AirPods Sale"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6 lg:p-8">
                  <div className="text-white">
                    <p className="text-sm font-medium mb-2">Phụ kiện chính hãng</p>
                    <h3 className="text-2xl font-bold mb-2">AirPods Pro 2</h3>
                    <p className="text-sm opacity-80 mb-4">Giảm 1 triệu</p>
                    <Link href="/san-pham?category=tai-nghe">
                      <Button variant="secondary" size="sm">Mua ngay</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">Sản phẩm mới</h2>
            <Link href="/san-pham" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Đăng ký nhận tin khuyến mãi</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Nhận thông tin sản phẩm mới và ưu đãi độc quyền ngay trong hộp thư của bạn
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-foreground bg-card"
            />
            <Button variant="secondary" size="lg">
              Đăng ký
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
