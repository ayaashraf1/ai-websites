import "../styles.css";

export const metadata = {
  title: "Italiano — Modern Italian Dining",
  description: "Italiano — contemporary Italian dining in the heart of the city.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
