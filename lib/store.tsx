'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Order, User, Review } from './data';

interface CartItem {
  product: Product;
  quantity: number;
}

interface ReturnRequest {
  orderId: string;
  reason: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface StoreContextType {
  // Auth
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Orders
  orders: Order[];
  createOrder: (shippingAddress: string, paymentMethod: string) => Order | null;
  cancelOrder: (orderId: string) => boolean;
  getOrderById: (orderId: string) => Order | undefined;
  
  // Returns
  returnRequests: ReturnRequest[];
  createReturnRequest: (orderId: string, reason: string, images: string[]) => boolean;
  
  // Reviews
  userReviews: Review[];
  addReview: (productId: string, rating: number, content: string) => boolean;
  
  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app would call API
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '',
      };
      setUser(mockUser);
      showToast('Đăng nhập thành công!');
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    if (name && email && phone && password.length >= 6) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name,
        email,
        phone,
      };
      setUser(newUser);
      showToast('Đăng ký thành công!');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    showToast('Đã đăng xuất');
  };

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    if (!wishlist.find((p) => p.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
      showToast(`Đã thêm ${product.name} vào yêu thích`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    showToast('Đã xóa khỏi danh sách yêu thích');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Order functions
  const createOrder = (shippingAddress: string, paymentMethod: string): Order | null => {
    if (!user || cart.length === 0) return null;

    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      userId: user.id,
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast('Đặt hàng thành công!');
    return newOrder;
  };

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === 'shipping' || order.status === 'delivered') {
      showToast('Không thể hủy đơn hàng này', 'error');
      return false;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
    );
    showToast('Đã hủy đơn hàng');
    return true;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Return functions
  const createReturnRequest = (orderId: string, reason: string, images: string[]): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'delivered') {
      showToast('Chỉ có thể trả hàng với đơn đã giao', 'error');
      return false;
    }

    const request: ReturnRequest = {
      orderId,
      reason,
      images,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReturnRequests((prev) => [...prev, request]);
    showToast('Đã gửi yêu cầu trả hàng');
    return true;
  };

  // Review functions
  const addReview = (productId: string, rating: number, content: string): boolean => {
    if (!user || content.length < 10 || content.length > 500) {
      showToast('Nội dung đánh giá phải từ 10-500 ký tự', 'error');
      return false;
    }

    const newReview: Review = {
      id: 'review-' + Date.now(),
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      content,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUserReviews((prev) => [...prev, newReview]);
    showToast('Đã gửi đánh giá của bạn');
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        orders,
        createOrder,
        cancelOrder,
        getOrderById,
        returnRequests,
        createReturnRequest,
        userReviews,
        addReview,
        showToast,
        toast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
