import Link from "next/link";

export default function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Link className="logo" href="/">Italiano<span>.</span></Link><p>Slow food. Warm hearts.<br />Good company.</p><div className="footer-social"><a href="#">Instagram</a><a href="#">Facebook</a></div></div><div className="footer-bottom"><span>18 Via della Rosa, New York</span><span>Tue—Sun · 5pm—11pm</span><span>© 2026 Italiano</span></div></footer>;
}
