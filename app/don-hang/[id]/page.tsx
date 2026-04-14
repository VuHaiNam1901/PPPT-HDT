'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Chờ thanh toán',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    step: 0,
  },
  paid: {
    label: 'Đã thanh toán',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800',
    step: 1,
  },
  shipping: {
    label: 'Đang giao',
    icon: Truck,
    color: 'bg-purple-100 text-purple-800',
    step: 2,
  },
  delivered: {
    label: 'Đã giao',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    step: 3,
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    step: -1,
  },
};

const orderSteps = [
  { label: 'Đặt hàng', icon: FileText },
  { label: 'Thanh toán', icon: CreditCard },
  { label: 'Đang giao', icon: Truck },
  { label: 'Hoàn thành', icon: CheckCircle },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, getOrderById, cancelOrder } = useStore();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const order = getOrderById(id);

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    }
  }, [user, router]);

  if (!user) return null;

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
        <Link href="/don-hang">
          <Button>Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const canCancel = order.status === 'pending' || order.status === 'paid';
  const currentStep = status.step;

  const handleCancelOrder = () => {
    cancelOrder(order.id);
    setShowCancelDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/don-hang" className="hover:text-primary">Đơn hàng</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">#{order.id}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Đơn hàng #{order.id}</h1>
          <p className="text-muted-foreground mt-1">
            Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge className={cn('font-normal text-sm px-4 py-2', status.color)}>
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(0, currentStep) * 33.33}%` }}
                />
              </div>

              {orderSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={index} className="flex flex-col items-center relative z-10">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                        isCurrent && 'ring-4 ring-primary/20'
                      )}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <p
                      className={cn(
                        'text-xs mt-2 text-center',
                        isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm đã đặt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-4 pb-4',
                    index !== order.items.length - 1 && 'border-b border-border'
                  )}
                >
                  <Link href={`/san-pham/${item.product.slug}`} className="shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/san-pham/${item.product.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.product.brand}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                      <span className="font-medium text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {order.paymentMethod === 'card' ? 'Thẻ tín dụng / Ghi nợ' : 'Ví điện tử'}
              </p>
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {canCancel && (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                Hủy đơn hàng
              </Button>
            )}
            {order.status === 'delivered' && (
              <Link href={`/don-hang/${order.id}/tra-hang`} className="block">
                <Button variant="outline" className="w-full">
                  Yêu cầu trả hàng
                </Button>
              </Link>
            )}
            <Link href="/don-hang" className="block">
              <Button variant="outline" className="w-full">
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{order.id}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
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
