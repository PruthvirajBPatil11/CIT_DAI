import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Upload', to: '/upload' },
    { label: 'About Us', to: '/about' }
  ];

  return (
    <header className="navbar">
      <h1 className="brand">DualityAI</h1>
      <nav>
        {links.map((link) => (
          <Link
            key={link.to}
            className={`nav-link ${pathname === link.to ? 'active' : ''}`}
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
