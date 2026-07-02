'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

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

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobile();
        setSearchOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, closeMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Announcement Bar */}
      <div className="bg-[#111827] text-white text-center py-2 px-4 text-xs overflow-hidden">
        <div className="announcement-marquee whitespace-nowrap inline-block">
          <span className="mx-8">Flat 20% OFF on Summer Collection | Use Code: SUMMER20</span>
          <span className="mx-8">Free Delivery on Orders Above PKR 5,000</span>
          <span className="mx-8">Flat 20% OFF on Summer Collection | Use Code: SUMMER20</span>
          <span className="mx-8">Free Delivery on Orders Above PKR 5,000</span>
        </div>
      </div>

      {/* Top Bar - hidden on mobile */}
      <div className="hidden md:block border-b border-[#f3f4f6]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-9 text-xs text-[#6b7280]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#111827] transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Pakistan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#111827] cursor-pointer transition">Track Order</span>
            <span className="text-[#e5e7eb]">|</span>
            <span className="hover:text-[#111827] cursor-pointer transition">Help</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f3f4f6]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-14 lg:h-[64px]">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/assets/logo.svg" alt="J." className="h-7 lg:h-9" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mega-menu-trigger relative group">
                <Link
                  href={item.href}
                  className="text-[12px] font-semibold tracking-[0.08em] text-[#374151] hover:text-[#2563eb] transition py-2 inline-flex items-center gap-1"
                >
                  {item.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40 group-hover:opacity-100 transition">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="mega-menu-content absolute top-full left-1/2 -translate-x-1/2 bg-white border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-4 min-w-[200px] z-50 rounded-xl mt-1">
                    <div className="space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block text-sm text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] transition px-3 py-2 rounded-lg"
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
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart */}
            <Link href="/products" className="w-9 h-9 rounded-xl flex items-center justify-center text-[#374151] hover:bg-[#f3f4f6] transition-colors relative" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-[#2563eb] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`border-t border-[#f3f4f6] overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border border-[#d1d5db] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition"
                autoFocus={searchOpen}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] flex flex-col animate-slide-in-left">
            <div className="px-4 h-14 flex items-center border-b border-[#f3f4f6] gap-3">
              <Link href="/" className="flex items-center gap-2.5" onClick={closeMobile}>
                <img src="/assets/logo.svg" alt="J." className="h-7" />
              </Link>
              <button onClick={closeMobile} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-colors" aria-label="Close menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="mb-1">
                  <Link
                    href={item.href}
                    className="font-semibold text-sm block px-5 py-2.5 text-[#111827] hover:bg-[#f9fafb]"
                    onClick={closeMobile}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-8 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="text-sm text-[#6b7280] block py-2 px-3 hover:text-[#111827] hover:bg-[#f9fafb] rounded-lg transition"
                          onClick={closeMobile}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#111827] text-white mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
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
            <div>
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">COMPANY</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition">ABOUT US</Link></li>
                <li><Link href="#" className="hover:text-white transition">CAREERS</Link></li>
                <li><Link href="#" className="hover:text-white transition">STORE LOCATOR</Link></li>
                <li><Link href="#" className="hover:text-white transition">CORPORATE</Link></li>
              </ul>
            </div>
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
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-bold text-xs mb-4 tracking-[0.1em] text-white/80">NEWSLETTER</h4>
              <p className="text-sm text-white/50 mb-3">Subscribe for updates and offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 px-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition rounded-l-lg min-w-0"
                />
                <button className="bg-[#2563eb] text-white px-4 py-2.5 hover:bg-[#1d4ed8] transition rounded-r-lg flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <img src="/assets/payments.svg" alt="Payment Methods" className="h-6 opacity-50" />
          </div>
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
