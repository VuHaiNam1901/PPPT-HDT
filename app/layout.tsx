import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { StoreProvider } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ToastNotification } from '@/components/toast-notification'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TechStore - Cửa hàng công nghệ hàng đầu Việt Nam',
  description: 'Mua sắm điện thoại, laptop, máy tính bảng và phụ kiện chính hãng với giá tốt nhất. Miễn phí vận chuyển, bảo hành chính hãng.',
  keywords: ['điện thoại', 'laptop', 'phụ kiện', 'công nghệ', 'Apple', 'Samsung', 'Xiaomi'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <StoreProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ToastNotification />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
