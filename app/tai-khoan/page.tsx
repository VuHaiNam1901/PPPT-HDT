'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, wishlist } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    }
  }, [user, router]);

  if (!user) return null;

  const menuItems = [
    {
      icon: Package,
      label: 'Đơn hàng của tôi',
      description: `${orders.length} đơn hàng`,
      href: '/don-hang',
    },
    {
      icon: Heart,
      label: 'Sản phẩm yêu thích',
      description: `${wishlist.length} sản phẩm`,
      href: '/yeu-thich',
    },
    {
      icon: MapPin,
      label: 'Địa chỉ giao hàng',
      description: 'Quản lý địa chỉ',
      href: '/tai-khoan/dia-chi',
    },
    {
      icon: Settings,
      label: 'Cài đặt tài khoản',
      description: 'Thông tin & bảo mật',
      href: '/tai-khoan/cai-dat',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tài khoản</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">Tài khoản của tôi</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              )}
              <Link href="/tai-khoan/cai-dat" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Chỉnh sửa hồ sơ
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.href}>
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{orders.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Đơn hàng</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{wishlist.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Yêu thích</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">
                  {orders.filter((o) => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Hoàn thành</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
