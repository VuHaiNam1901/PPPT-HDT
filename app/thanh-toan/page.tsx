'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, MapPin, ChevronRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, user, createOrder } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    note: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    } else if (cart.length === 0) {
      router.push('/gio-hang');
    }
  }, [user, cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^0\d{9}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.city.trim()) newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    if (!formData.district.trim()) newErrors.district = 'Vui lòng nhập quận/huyện';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setPaymentStatus('processing');

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock payment - 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const fullAddress = `${formData.address}, ${formData.district}, ${formData.city}`;
      const order = createOrder(fullAddress, paymentMethod);
      if (order) {
        setOrderId(order.id);
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } else {
      setPaymentStatus('failed');
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
  };

  const handleGoToOrders = () => {
    router.push('/don-hang');
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/gio-hang" className="hover:text-primary">Giỏ hàng</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Thanh toán</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="TP. Hồ Chí Minh"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Quận 1"
                    />
                    {errors.district && (
                      <p className="text-sm text-destructive">{errors.district}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường, phường/xã"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors mt-3">
                    <RadioGroupItem value="ewallet" id="ewallet" />
                    <Label htmlFor="ewallet" className="flex-1 cursor-pointer flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Ví điện tử</p>
                        <p className="text-sm text-muted-foreground">MoMo, ZaloPay, VNPay</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-primary font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Đặt hàng
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Bằng việc đặt hàng, bạn đồng ý với{' '}
                  <Link href="/chinh-sach/dieu-khoan" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Payment Status Dialog */}
      <Dialog open={paymentStatus !== 'idle'} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          {paymentStatus === 'processing' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Đang xử lý thanh toán</DialogTitle>
                <DialogDescription className="text-center">
                  Vui lòng đợi trong giây lát...
                </DialogDescription>
              </DialogHeader>
              <div className="py-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              </div>
            </>
          )}
          {paymentStatus === 'success' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Đặt hàng thành công!</DialogTitle>
                <DialogDescription className="text-center">
                  Cảm ơn bạn đã mua hàng tại TechStore
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Mã đơn hàng: {orderId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng
                </p>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full" onClick={handleGoToOrders}>
                  Xem đơn hàng
                </Button>
                <Link href="/san-pham" className="w-full">
                  <Button variant="outline" className="w-full">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </DialogFooter>
            </>
          )}
          {paymentStatus === 'failed' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Thanh toán thất bại</DialogTitle>
                <DialogDescription className="text-center">
                  Đã có lỗi xảy ra trong quá trình thanh toán
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Vui lòng kiểm tra lại thông tin và thử lại
                </p>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full" onClick={handleRetry}>
                  Thử lại
                </Button>
                <Link href="/gio-hang" className="w-full">
                  <Button variant="outline" className="w-full">
                    Quay lại giỏ hàng
                  </Button>
                </Link>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
