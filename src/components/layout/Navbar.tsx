"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import clsx from 'clsx';
import Button from '../ui/Button';

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          PORTFOLIO<span className="text-blue-500">.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>
            <Button variant="primary" className="px-5 py-2 text-sm shadow-none">
              Hire Me
            </Button>
          </a>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
            <Button variant="ghost" className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
            </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col space-y-4"
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { scrollToSection(e, link.href); setMobileOpen(false); }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={(e) => { scrollToSection(e, '#contact'); setMobileOpen(false); }}>
            <Button variant="primary" className="px-5 py-2 text-sm shadow-none w-full">
              Hire Me
            </Button>
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
