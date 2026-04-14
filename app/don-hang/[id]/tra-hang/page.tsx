'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

const returnReasons = [
  'Sản phẩm bị lỗi/hỏng',
  'Sản phẩm không đúng mô tả',
  'Sản phẩm không đúng như hình',
  'Đổi ý không muốn mua nữa',
  'Nhận được sai sản phẩm',
  'Lý do khác',
];

export default function ReturnRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, getOrderById, createReturnRequest } = useStore();
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState('');

  const order = getOrderById(id);

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    }
  }, [user, router]);

  if (!user) return null;

  if (!order || order.status !== 'delivered') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không thể yêu cầu trả hàng</h1>
        <p className="text-muted-foreground mb-8">
          Đơn hàng không tồn tại hoặc chưa được giao thành công.
        </p>
        <Link href="/don-hang">
          <Button>Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages].slice(0, 5));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedReason) {
      setError('Vui lòng chọn lý do trả hàng');
      return;
    }

    const fullReason =
      additionalDetails.trim()
        ? `${selectedReason}: ${additionalDetails}`
        : selectedReason;

    const success = createReturnRequest(order.id, fullReason, images);
    if (success) {
      setShowSuccessDialog(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/don-hang" className="hover:text-primary">Đơn hàng</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/don-hang/${order.id}`} className="hover:text-primary">#{order.id}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Yêu cầu trả hàng</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">Yêu cầu trả hàng</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Return Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Lý do trả hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                  {returnReasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <RadioGroupItem value={reason} id={reason} />
                      <Label htmlFor={reason} className="flex-1 cursor-pointer">
                        {reason}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="details">Chi tiết bổ sung (tùy chọn)</Label>
                  <Textarea
                    id="details"
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={4}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Hình ảnh minh chứng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tải lên hình ảnh sản phẩm để hỗ trợ yêu cầu của bạn (tối đa 5 ảnh)
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                      <Image
                        src={image}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Tải ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Gửi yêu cầu trả hàng
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Đơn hàng #{order.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
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
                    <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between font-medium">
                  <span>Tổng tiền</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Yêu cầu đã được gửi</DialogTitle>
            <DialogDescription className="text-center">
              Chúng tôi sẽ xem xét yêu cầu trả hàng của bạn trong 1-2 ngày làm việc
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button className="w-full" onClick={() => router.push('/don-hang')}>
              Quay lại đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
