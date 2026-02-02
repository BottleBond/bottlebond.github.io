'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Episodes', href: '/episodes' },
  { label: 'About', href: '/about' },
  { label: 'The Glass Room', href: '/glass-room' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="main-nav" aria-label="Main navigation">
      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Navigation menu */}
      <ul
        id="main-menu"
        className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}
        role="menubar"
      >
        {navItems.map((item) => (
          <li key={item.href} role="none">
            <Link
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
