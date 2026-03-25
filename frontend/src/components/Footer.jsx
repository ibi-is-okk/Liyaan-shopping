import Logo from "./Logo";
import "../styles/Pages.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Logo color="#fff" />
        <p className="footer__brand">Complete your style with awesome clothes from us.</p>
        <div className="footer__socials">
          {["f", "in"].map((s) => <div key={s} className="footer__social">{s}</div>)}
        </div>
      </div>
      <div>
        <p className="footer__heading">Email</p>
        <p className="footer__info">meow@meow.com<br />liyan@gmail.com</p>
      </div>
      <div>
        <p className="footer__heading">Phone</p>
        <p className="footer__info">+92 32138912839<br />+92 94092049354</p>
      </div>
    </footer>
  );
}
