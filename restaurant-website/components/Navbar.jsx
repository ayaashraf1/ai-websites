"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Link className="logo" href="/" aria-label="Italiano home">Italiano<span>.</span></Link>
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button>
    <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
      <Link className={active === "home" ? "active" : ""} href="/" onClick={() => setOpen(false)}>Home</Link>
      <Link className={active === "menu" ? "active" : ""} href="/menu" onClick={() => setOpen(false)}>Menu</Link>
      <Link className={active === "about" ? "active" : ""} href="/about" onClick={() => setOpen(false)}>Our Story</Link>
    </nav>
    <Link className="reserve reserve-top" href="/#reserve">Reserve a table <b>↗</b></Link>
  </header>;
}
