'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'WOMEN',
    href: '/products',
    children: [
      { label: 'Summer Collection', href: '/products?category=SUMMER+COLLECTION' },
      { label: 'Co-ords', href: '/products?category=CO-ORDS' },
      { label: 'Ready to Wear', href: '/products?category=READY+TO+WEAR' },
      { label: 'Unstitched', href: '/products?category=UNSTITCHED' },
    ],
  },
  {
    label: 'MEN',
    href: '/products',
    children: [
      { label: 'Ready to Wear', href: '/products?category=READY+TO+WEAR' },
      { label: 'Formals', href: '/products?category=FORMALS' },
      { label: 'Co-ords', href: '/products?category=CO-ORDS' },
    ],
  },
  {
    label: 'FRAGRANCE & BEAUTY',
    href: '/products?category=ACCESSORIES',
    children: [
      { label: 'Fragrances', href: '/products?category=ACCESSORIES' },
      { label: 'Skincare', href: '/products?category=ACCESSORIES' },
    ],
  },
  {
    label: 'TEENS',
    href: '/products',
    children: [
      { label: 'Girls', href: '/products?category=SUMMER+COLLECTION' },
      { label: 'Boys', href: '/products?category=READY+TO+WEAR' },
    ],
  },
];

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Announcement Bar */}
      <div className="bg-[#111] text-white text-center py-2 px-4 text-xs overflow-hidden">
        <div className="announcement-marquee whitespace-nowrap inline-block">
          <span className="mx-8">Flat 20% OFF on Summer Collection | Use Code: SUMMER20</span>
          <span className="mx-8">Free Delivery on Orders Above PKR 5,000</span>
          <span className="mx-8">Flat 20% OFF on Summer Collection | Use Code: SUMMER20</span>
          <span className="mx-8">Free Delivery on Orders Above PKR 5,000</span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-9 text-xs text-[#666]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 cursor-pointer hover:text-black transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Pakistan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-black transition">Track Order</Link>
            <span className="text-neutral-200">|</span>
            <span className="hover:text-black cursor-pointer transition">Help</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-[72px]">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/assets/logo.svg" alt="J." className="h-8 lg:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mega-menu-trigger relative group">
                <Link
                  href={item.href}
                  className="text-[13px] font-semibold tracking-[0.05em] text-[#222] hover:text-[#666] transition py-2"
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="mega-menu-content absolute top-full left-1/2 -translate-x-1/2 bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 min-w-[200px] z-50">
                    <div className="space-y-2.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block text-sm text-[#666] hover:text-black transition"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-[#222] hover:text-[#666] transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* User */}
            <Link href="/admin" className="text-[#222] hover:text-[#666] transition hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/products" className="text-[#222] hover:text-[#666] transition relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-[#111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-neutral-100 py-4">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto shadow-[4px_0_20px_rgba(0,0,0,0.1)]">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <img src="/assets/logo.svg" alt="J." className="h-7" />
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#888] hover:text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="mb-4">
                  <Link
                    href={item.href}
                    className="font-semibold text-sm block py-2 text-[#222]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="text-sm text-[#666] block py-1 hover:text-black transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#111] text-white mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Contact */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">CONTACT</h4>
              <div className="space-y-3 text-sm text-white/60">
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  +92 2137 170 445
                </p>
                <p className="text-xs text-white/40">(MON - SAT: 9:30AM - 10:00PM)</p>
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  eshop@junaidjamshed.com
                </p>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">COMPANY</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition">ABOUT US</Link></li>
                <li><Link href="#" className="hover:text-white transition">CAREERS</Link></li>
                <li><Link href="#" className="hover:text-white transition">STORE LOCATOR</Link></li>
                <li><Link href="#" className="hover:text-white transition">CORPORATE</Link></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">CUSTOMER SUPPORT</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition">CONTACT US</Link></li>
                <li><Link href="#" className="hover:text-white transition">DELIVERY & ORDERS</Link></li>
                <li><Link href="#" className="hover:text-white transition">RETURNS & EXCHANGES</Link></li>
                <li><Link href="#" className="hover:text-white transition">TRACK MY ORDER</Link></li>
                <li><Link href="#" className="hover:text-white transition">PAYMENT GUIDE</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">CONNECT</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition">FACEBOOK</Link></li>
                <li><Link href="#" className="hover:text-white transition">INSTAGRAM</Link></li>
                <li><Link href="#" className="hover:text-white transition">YOUTUBE</Link></li>
                <li><Link href="#" className="hover:text-white transition">PINTEREST</Link></li>
                <li><Link href="#" className="hover:text-white transition">LINKEDIN</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">SIGN UP FOR NEWSLETTER</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="flex-1 bg-white/10 border border-white/20 px-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition"
                />
                <button className="bg-white text-[#111] px-4 py-2.5 hover:bg-white/90 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <img src="/assets/payments.svg" alt="Payment Methods" className="h-6 opacity-50" />
          </div>

          {/* Bottom */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} J. (Junaid Jamshed). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
