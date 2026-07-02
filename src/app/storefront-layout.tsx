'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const NAV_ITEMS = [
  {
    label: 'WOMEN',
    href: '/products?gender=WOMEN',
    children: [
      { label: 'Summer Collection', href: '/products?gender=WOMEN&subcategory=summer-collection' },
      { label: 'Co-ords', href: '/products?gender=WOMEN&subcategory=co-ords' },
      { label: 'Ready to Wear', href: '/products?gender=WOMEN&subcategory=ready-to-wear' },
      { label: 'Unstitched', href: '/products?gender=WOMEN&subcategory=unstitched' },
      { label: 'Formals', href: '/products?gender=WOMEN&subcategory=formals' },
      { label: 'Accessories', href: '/products?gender=WOMEN&subcategory=accessories' },
    ],
  },
  {
    label: 'MEN',
    href: '/products?gender=MEN',
    children: [
      { label: 'Ready to Wear', href: '/products?gender=MEN&subcategory=ready-to-wear' },
      { label: 'Formals', href: '/products?gender=MEN&subcategory=formals' },
      { label: 'Co-ords', href: '/products?gender=MEN&subcategory=co-ords' },
      { label: 'Accessories', href: '/products?gender=MEN&subcategory=accessories' },
    ],
  },
  {
    label: 'ACCESSORIES',
    href: '/products?gender=WOMEN&subcategory=accessories',
    children: [
      { label: 'Women', href: '/products?gender=WOMEN&subcategory=accessories' },
      { label: 'Men', href: '/products?gender=MEN&subcategory=accessories' },
    ],
  },
  {
    label: 'TEENS',
    href: '/products?gender=TEENS',
    children: [
      { label: 'Girls', href: '/products?gender=TEENS&subcategory=summer-collection' },
      { label: 'Boys', href: '/products?gender=TEENS&subcategory=ready-to-wear' },
    ],
  },
];

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobile();
        setSearchOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.classList.add('drawer-open');
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.classList.remove('drawer-open');
    };
  }, [mobileMenuOpen, closeMobile]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Announcement Bar */}
      <div className="bg-sale text-white text-center py-2 px-4 text-[11px] overflow-hidden tracking-wide font-medium">
        <div className="announcement-marquee whitespace-nowrap inline-block">
          <span className="mx-8 font-bold">FLASH SALE: 70% OFF ENTIRE STORE</span>
          <span className="mx-8">Ends Tonight at Midnight!</span>
          <span className="mx-8 font-bold">FREE DELIVERY on orders above PKR 5,000</span>
          <span className="mx-8 font-bold">FLASH SALE: 70% OFF ENTIRE STORE</span>
          <span className="mx-8">Ends Tonight at Midnight!</span>
          <span className="mx-8 font-bold">FREE DELIVERY on orders above PKR 5,000</span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="hidden md:block border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-9 text-[11px] text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 cursor-pointer hover:text-text-primary transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Pakistan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-text-primary cursor-pointer transition">Track Order</span>
            <span className="text-border">|</span>
            <span className="hover:text-text-primary cursor-pointer transition">Help</span>
            <span className="text-border">|</span>
            <Link href="/admin" className="hover:text-text-primary transition font-medium">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-14 lg:h-16">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:bg-surface-overlay transition"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mega-menu-trigger relative group">
                <Link
                  href={item.href}
                  className="text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-primary transition py-2 inline-flex items-center gap-1"
                >
                  {item.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40 group-hover:opacity-100 transition">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="mega-menu-content absolute top-full left-1/2 -translate-x-1/2 bg-white border border-border shadow-lg p-3 min-w-[200px] z-50 rounded-xl mt-1">
                    <div className="space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block text-[13px] text-text-muted hover:text-text-primary hover:bg-surface-raised transition px-3 py-2 rounded-lg"
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
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-overlay transition"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            <Link
              href="/admin"
              className="hidden sm:flex w-10 h-10 rounded-lg items-center justify-center text-text-secondary hover:bg-surface-overlay transition"
              aria-label="Admin panel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            <Link
              href="/products"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-overlay transition relative"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`border-t border-border overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <form onSubmit={handleSearch} className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="toolbar-input"
                style={{ paddingLeft: '36px', width: '100%' }}
                autoFocus={searchOpen}
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-xl flex flex-col animate-slide-in-left">
            <div className="px-4 h-14 flex items-center border-b border-border gap-3">
              <Link href="/" className="flex items-center gap-2.5" onClick={closeMobile}>
                <img src="/assets/logo.svg" alt="J." className="h-7" />
              </Link>
              <button onClick={closeMobile} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-text-faint hover:bg-surface-overlay hover:text-text-secondary transition" aria-label="Close menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-border">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-surface-raised border border-border rounded-lg pl-9 pr-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </form>
            </div>

            <nav className="flex-1 overflow-y-auto py-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-border-light">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 font-bold text-[13px] px-5 py-3.5 text-text-primary tracking-wide"
                      onClick={closeMobile}
                    >
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-10 h-10 flex items-center justify-center text-text-faint"
                      aria-label={`Expand ${item.label}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {mobileExpanded === item.label && item.children && (
                    <div className="pl-8 pb-2 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="text-[13px] text-text-muted block py-2 px-3 hover:text-text-primary hover:bg-surface-raised rounded-lg transition"
                          onClick={closeMobile}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-3.5 text-[13px] text-text-muted hover:text-text-primary hover:bg-surface-raised transition"
                onClick={closeMobile}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Admin Panel
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-text-primary text-white mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <img src="/assets/logo.svg" alt="J." className="h-8 brightness-0 invert opacity-80" />
              </Link>
              <h4 className="font-bold text-[11px] mb-4 tracking-[0.12em] text-white/80">CONTACT</h4>
              <div className="space-y-3 text-[13px] text-white/60">
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  +92 2137 170 445
                </p>
                <p className="text-[11px] text-white/40">(MON - SAT: 9:30AM - 10:00PM)</p>
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  eshop@junaidjamshed.com
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4 tracking-[0.12em] text-white/80">COMPANY</h4>
              <ul className="space-y-2.5 text-[13px] text-white/60">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Store Locator</Link></li>
                <li><Link href="#" className="hover:text-white transition">Corporate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4 tracking-[0.12em] text-white/80">CUSTOMER SUPPORT</h4>
              <ul className="space-y-2.5 text-[13px] text-white/60">
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Delivery & Orders</Link></li>
                <li><Link href="#" className="hover:text-white transition">Returns & Exchanges</Link></li>
                <li><Link href="#" className="hover:text-white transition">Track My Order</Link></li>
                <li><Link href="#" className="hover:text-white transition">Payment Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4 tracking-[0.12em] text-white/80">CONNECT</h4>
              <ul className="space-y-2.5 text-[13px] text-white/60">
                <li><Link href="#" className="hover:text-white transition">Facebook</Link></li>
                <li><Link href="#" className="hover:text-white transition">Instagram</Link></li>
                <li><Link href="#" className="hover:text-white transition">YouTube</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pinterest</Link></li>
                <li><Link href="#" className="hover:text-white transition">LinkedIn</Link></li>
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-bold text-[11px] mb-4 tracking-[0.12em] text-white/80">NEWSLETTER</h4>
              <p className="text-[13px] text-white/50 mb-3">Subscribe for updates and offers.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 px-3 py-2.5 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition rounded-l-lg min-w-0"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2.5 hover:bg-primary-hover transition rounded-r-lg flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <img src="/assets/payments.svg" alt="Payment Methods" className="h-6 opacity-50" />
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
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
