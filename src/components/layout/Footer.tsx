import Link from 'next/link';

const socialLinks = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@BottleBond',
    icon: 'youtube',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/bottlebond',
    icon: 'instagram',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/bottlebond',
    icon: 'twitter',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              BottleBond
            </Link>
            <p className="footer-tagline">
              Premium bourbon and whiskey education
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-nav">
              <li>
                <Link href="/episodes">Episodes</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/glass-room">The Glass Room</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} BottleBond. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
