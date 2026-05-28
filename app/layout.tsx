import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Comsri Hardware E-commerce',
  description: 'Premium Refurbished Laptops and Desktops Online in India.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
