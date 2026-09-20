import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sections = [
  ["Antipasti", "To begin", [["Focaccia di Casa", "Rosemary, Ligurian olive oil, sea salt", "12"], ["Crudo di Branzino", "Sea bass, blood orange, fennel, chilli", "19"], ["Burrata Pugliese", "Grilled peach, basil, aged balsamic", "18"]]],
  ["Pasta fatta a mano", "Made daily", [["Tagliolini al Limone", "Hand-cut pasta, Amalfi lemon, parmesan", "24"], ["Ravioli di Zucca", "Roast squash, sage butter, amaretti", "26"], ["Rigatoni alla Norma", "Eggplant, tomato, ricotta salata", "23"]]],
  ["Secondi", "From the fire", [["Pollo al Mattone", "Heritage chicken, salsa verde, charred lemon", "31"], ["Branzino Arrosto", "Roasted sea bass, braised greens, anchovy", "34"]]],
];

export default function MenuPage() {
  return <div className="inner-page"><Navbar active="menu" /><main><section className="page-hero menu-hero"><p className="eyebrow gold">La nostra cucina</p><h1>A menu made<br /><em>for lingering.</em></h1><p>Our menu follows the Italian seasons, changing often and always rooted in the very best produce.</p></section><section className="menu-section section-pad">{sections.map(([title, subtitle, dishes], index) => <div key={title}><div className={`menu-heading ${index ? "pasta-heading" : ""}`}><p className="eyebrow gold">{title}</p><p>{subtitle}</p></div><div className="menu-list">{dishes.map(([name, description, price]) => <article key={name}><div><h3>{name}</h3><p>{description}</p></div><b>{price}</b></article>)}</div></div>)}<p className="menu-note">Please let us know of any allergies or dietary requirements. A discretionary 20% service charge is added to parties of six or more.</p></section><section className="reserve-panel"><div><p className="eyebrow gold">A seat at the table</p><h2>Buon appetito.</h2></div><Link className="button button-light" href="/#reserve">Reserve now <span>→</span></Link></section></main><Footer /></div>;
}
