export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  description: string;
  specs: { label: string; value: string }[];
  warranty: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Điện thoại', slug: 'dien-thoai', icon: '📱', productCount: 45 },
  { id: '2', name: 'Laptop', slug: 'laptop', icon: '💻', productCount: 32 },
  { id: '3', name: 'Máy tính bảng', slug: 'may-tinh-bang', icon: '📲', productCount: 18 },
  { id: '4', name: 'Phụ kiện', slug: 'phu-kien', icon: '🎧', productCount: 86 },
  { id: '5', name: 'Đồng hồ thông minh', slug: 'dong-ho-thong-minh', icon: '⌚', productCount: 24 },
  { id: '6', name: 'Tai nghe', slug: 'tai-nghe', icon: '🎧', productCount: 52 },
];

export const brands = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'OPPO',
  'Vivo',
  'Dell',
  'HP',
  'Asus',
  'Lenovo',
  'Sony',
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    price: 29990000,
    originalPrice: 34990000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
    ],
    category: 'dien-thoai',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 256,
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp, khung titan siêu nhẹ và bền bỉ. Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz.',
    specs: [
      { label: 'Màn hình', value: '6.7 inch Super Retina XDR' },
      { label: 'Chip', value: 'A17 Pro' },
      { label: 'RAM', value: '8GB' },
      { label: 'Bộ nhớ', value: '256GB' },
      { label: 'Camera sau', value: '48MP + 12MP + 12MP' },
      { label: 'Camera trước', value: '12MP' },
      { label: 'Pin', value: '4422mAh' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    price: 31990000,
    originalPrice: 36990000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop',
    ],
    category: 'dien-thoai',
    brand: 'Samsung',
    rating: 4.7,
    reviewCount: 189,
    description: 'Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP siêu nét, chip Snapdragon 8 Gen 3 và màn hình Dynamic AMOLED 2X.',
    specs: [
      { label: 'Màn hình', value: '6.8 inch Dynamic AMOLED 2X' },
      { label: 'Chip', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '12GB' },
      { label: 'Bộ nhớ', value: '512GB' },
      { label: 'Camera sau', value: '200MP + 50MP + 12MP + 10MP' },
      { label: 'Camera trước', value: '12MP' },
      { label: 'Pin', value: '5000mAh' },
    ],
    warranty: '12 tháng chính hãng Samsung',
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3 Pro',
    slug: 'macbook-pro-14-m3-pro',
    price: 49990000,
    originalPrice: 54990000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop',
    ],
    category: 'laptop',
    brand: 'Apple',
    rating: 4.9,
    reviewCount: 142,
    description: 'MacBook Pro 14 inch với chip M3 Pro, màn hình Liquid Retina XDR, hiệu năng vượt trội cho công việc chuyên nghiệp.',
    specs: [
      { label: 'Màn hình', value: '14.2 inch Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M3 Pro' },
      { label: 'RAM', value: '18GB' },
      { label: 'SSD', value: '512GB' },
      { label: 'Pin', value: 'Lên đến 17 giờ' },
      { label: 'Cổng kết nối', value: 'HDMI, SD, MagSafe 3, Thunderbolt 4' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '4',
    name: 'iPad Pro 12.9" M2 256GB WiFi',
    slug: 'ipad-pro-12-9-m2-256gb',
    price: 27990000,
    originalPrice: 31990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop',
    ],
    category: 'may-tinh-bang',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 98,
    description: 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR với ProMotion, hỗ trợ Apple Pencil thế hệ 2.',
    specs: [
      { label: 'Màn hình', value: '12.9 inch Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M2' },
      { label: 'RAM', value: '8GB' },
      { label: 'Bộ nhớ', value: '256GB' },
      { label: 'Camera sau', value: '12MP + 10MP' },
      { label: 'Camera trước', value: '12MP Ultra Wide' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra 512GB',
    slug: 'xiaomi-14-ultra-512gb',
    price: 23990000,
    originalPrice: 27990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
    ],
    category: 'dien-thoai',
    brand: 'Xiaomi',
    rating: 4.6,
    reviewCount: 76,
    description: 'Xiaomi 14 Ultra với hệ thống camera Leica chuyên nghiệp, chip Snapdragon 8 Gen 3 và sạc nhanh 90W.',
    specs: [
      { label: 'Màn hình', value: '6.73 inch AMOLED 2K' },
      { label: 'Chip', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '16GB' },
      { label: 'Bộ nhớ', value: '512GB' },
      { label: 'Camera sau', value: '50MP + 50MP + 50MP + 50MP' },
      { label: 'Camera trước', value: '32MP' },
      { label: 'Pin', value: '5000mAh' },
    ],
    warranty: '18 tháng chính hãng Xiaomi',
    inStock: true,
  },
  {
    id: '6',
    name: 'Dell XPS 15 Intel Core i7',
    slug: 'dell-xps-15-i7',
    price: 42990000,
    originalPrice: 47990000,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop',
    ],
    category: 'laptop',
    brand: 'Dell',
    rating: 4.5,
    reviewCount: 63,
    description: 'Dell XPS 15 với màn hình OLED 3.5K tuyệt đẹp, Intel Core i7 thế hệ 13, thiết kế mỏng nhẹ cao cấp.',
    specs: [
      { label: 'Màn hình', value: '15.6 inch OLED 3.5K' },
      { label: 'CPU', value: 'Intel Core i7-13700H' },
      { label: 'RAM', value: '16GB DDR5' },
      { label: 'SSD', value: '512GB NVMe' },
      { label: 'GPU', value: 'NVIDIA RTX 4050' },
      { label: 'Pin', value: 'Lên đến 13 giờ' },
    ],
    warranty: '24 tháng chính hãng Dell',
    inStock: true,
  },
  {
    id: '7',
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    price: 5990000,
    originalPrice: 6990000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop',
    ],
    category: 'tai-nghe',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 312,
    description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động gấp 2 lần, âm thanh không gian cá nhân hóa.',
    specs: [
      { label: 'Chip', value: 'Apple H2' },
      { label: 'Chống ồn', value: 'Active Noise Cancellation' },
      { label: 'Thời lượng pin', value: '6 giờ (30 giờ với hộp sạc)' },
      { label: 'Kết nối', value: 'Bluetooth 5.3' },
      { label: 'Chống nước', value: 'IPX4' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '8',
    name: 'Apple Watch Series 9 45mm',
    slug: 'apple-watch-series-9-45mm',
    price: 10990000,
    originalPrice: 12990000,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop',
    ],
    category: 'dong-ho-thong-minh',
    brand: 'Apple',
    rating: 4.7,
    reviewCount: 187,
    description: 'Apple Watch Series 9 với chip S9 SiP mạnh mẽ, màn hình always-on sáng hơn, cử chỉ Double Tap mới.',
    specs: [
      { label: 'Màn hình', value: '45mm LTPO OLED' },
      { label: 'Chip', value: 'Apple S9 SiP' },
      { label: 'Bộ nhớ', value: '64GB' },
      { label: 'Chống nước', value: '50m (WR50)' },
      { label: 'Pin', value: 'Lên đến 18 giờ' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '9',
    name: 'Samsung Galaxy Tab S9 Ultra',
    slug: 'samsung-galaxy-tab-s9-ultra',
    price: 27990000,
    originalPrice: 32990000,
    image: 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=800&h=800&fit=crop',
    ],
    category: 'may-tinh-bang',
    brand: 'Samsung',
    rating: 4.6,
    reviewCount: 54,
    description: 'Samsung Galaxy Tab S9 Ultra với màn hình Dynamic AMOLED 2X 14.6 inch, S Pen đi kèm, chip Snapdragon 8 Gen 2.',
    specs: [
      { label: 'Màn hình', value: '14.6 inch Dynamic AMOLED 2X' },
      { label: 'Chip', value: 'Snapdragon 8 Gen 2' },
      { label: 'RAM', value: '12GB' },
      { label: 'Bộ nhớ', value: '256GB' },
      { label: 'Camera sau', value: '13MP + 8MP' },
      { label: 'Pin', value: '11200mAh' },
    ],
    warranty: '12 tháng chính hãng Samsung',
    inStock: true,
  },
  {
    id: '10',
    name: 'OPPO Find X7 Ultra 256GB',
    slug: 'oppo-find-x7-ultra-256gb',
    price: 22990000,
    originalPrice: 25990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
    ],
    category: 'dien-thoai',
    brand: 'OPPO',
    rating: 4.5,
    reviewCount: 42,
    description: 'OPPO Find X7 Ultra với camera Hasselblad chuyên nghiệp, chip Snapdragon 8 Gen 3 và thiết kế cao cấp.',
    specs: [
      { label: 'Màn hình', value: '6.82 inch AMOLED 2K' },
      { label: 'Chip', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '16GB' },
      { label: 'Bộ nhớ', value: '256GB' },
      { label: 'Camera sau', value: '50MP + 50MP + 50MP + 50MP' },
      { label: 'Pin', value: '5000mAh' },
    ],
    warranty: '18 tháng chính hãng OPPO',
    inStock: true,
  },
  {
    id: '11',
    name: 'Sạc nhanh Apple 20W USB-C',
    slug: 'sac-nhanh-apple-20w',
    price: 490000,
    originalPrice: 590000,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
    ],
    category: 'phu-kien',
    brand: 'Apple',
    rating: 4.6,
    reviewCount: 428,
    description: 'Bộ sạc Apple 20W USB-C chính hãng, sạc nhanh cho iPhone và iPad.',
    specs: [
      { label: 'Công suất', value: '20W' },
      { label: 'Cổng', value: 'USB-C' },
      { label: 'Tương thích', value: 'iPhone 8 trở lên, iPad' },
    ],
    warranty: '12 tháng chính hãng Apple',
    inStock: true,
  },
  {
    id: '12',
    name: 'Ốp lưng iPhone 15 Pro Max MagSafe',
    slug: 'op-lung-iphone-15-pro-max-magsafe',
    price: 1290000,
    originalPrice: 1490000,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop',
    ],
    category: 'phu-kien',
    brand: 'Apple',
    rating: 4.4,
    reviewCount: 156,
    description: 'Ốp lưng silicone chính hãng Apple với MagSafe cho iPhone 15 Pro Max.',
    specs: [
      { label: 'Chất liệu', value: 'Silicone cao cấp' },
      { label: 'Tương thích', value: 'iPhone 15 Pro Max' },
      { label: 'MagSafe', value: 'Có' },
    ],
    warranty: '6 tháng chính hãng Apple',
    inStock: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    rating: 5,
    content: 'Sản phẩm tuyệt vời! Camera chụp rất đẹp, pin dùng cả ngày không lo hết. Khung titan cầm rất chắc tay. Rất hài lòng với sản phẩm này.',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Trần Thị B',
    rating: 4,
    content: 'Điện thoại đẹp, chạy mượt. Chỉ tiếc là giá hơi cao so với các dòng Android cùng phân khúc. Nhưng nhìn chung vẫn rất đáng mua.',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Lê Văn C',
    rating: 5,
    content: 'Galaxy S24 Ultra quá tuyệt vời! Camera 200MP chụp cực kỳ chi tiết, zoom xa vẫn nét. S Pen rất tiện lợi.',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    productId: '3',
    userId: 'user4',
    userName: 'Phạm Thị D',
    rating: 5,
    content: 'MacBook Pro M3 Pro render video cực nhanh, pin dùng cả ngày. Màn hình đẹp không tì vết. Worth every penny!',
    createdAt: '2024-02-10',
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export function filterProducts(
  categorySlug?: string,
  brand?: string,
  minPrice?: number,
  maxPrice?: number
): Product[] {
  return products.filter((p) => {
    if (categorySlug && p.category !== categorySlug) return false;
    if (brand && p.brand !== brand) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    return true;
  });
}

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
