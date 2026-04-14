'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { formatPrice, type Order } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Chờ thanh toán',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
  },
  paid: {
    label: 'Đã thanh toán',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800',
  },
  shipping: {
    label: 'Đang giao',
    icon: Truck,
    color: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Đã giao',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, orders, cancelOrder } = useStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    }
  }, [user, router]);

  if (!user) return null;

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  const handleCancelOrder = () => {
    if (cancelOrderId) {
      cancelOrder(cancelOrderId);
      setCancelOrderId(null);
    }
  };

  const canCancel = (order: Order) => {
    return order.status === 'pending' || order.status === 'paid';
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Chưa có đơn hàng</h1>
          <p className="text-muted-foreground mb-8">
            Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Link href="/san-pham">
            <Button size="lg">Bắt đầu mua sắm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Đơn hàng của tôi</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Chờ thanh toán ({orders.filter((o) => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Đã thanh toán ({orders.filter((o) => o.status === 'paid').length})
          </TabsTrigger>
          <TabsTrigger value="shipping">
            Đang giao ({orders.filter((o) => o.status === 'shipping').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Đã giao ({orders.filter((o) => o.status === 'delivered').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy ({orders.filter((o) => o.status === 'cancelled').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Không có đơn hàng nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <Card key={order.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-base">Đơn hàng #{order.id}</CardTitle>
                          <Badge className={cn('font-normal', status.color)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Products */}
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                              <p className="text-sm text-primary font-medium">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            + {order.items.length - 2} sản phẩm khác
                          </p>
                        )}
                      </div>

                      {/* Total & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Tổng tiền</p>
                          <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/don-hang/${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              Chi tiết
                            </Button>
                          </Link>
                          {canCancel(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setCancelOrderId(order.id)}
                            >
                              Hủy đơn
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Link href={`/don-hang/${order.id}/tra-hang`}>
                              <Button variant="outline" size="sm">
                                Yêu cầu trả hàng
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelOrderId !== null} onOpenChange={() => setCancelOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelOrderId(null)}>
              Không, giữ lại
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
