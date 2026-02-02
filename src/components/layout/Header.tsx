'use client';

import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <span className="logo-text">BottleBond</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
