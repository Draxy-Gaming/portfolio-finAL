import { mySocials } from "../constants";
const Footer = () => {
  return (
    <section className="flex flex-wrap items-center justify-between gap-5 pb-3 text-sm text-neutral-400 c-space">
      <div className="mb-4 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
      <div className="flex gap-2">
        <p>Terms & Conditions</p> 
        <p>|</p>
        <p>Privacy Policy</p>
      </div>
      <div className="flex gap-3">
        {mySocials.map((social, index) => (
          <a
            href={social.href}
            key={index}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit my ${social.name} profile`}
            className="rounded-sm hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <img src={social.icon} className="w-5 h-5" aria-hidden="true" alt="" />
          </a>
        ))}
      </div>
      <p>© 2026 ifTekhar. All rights reserved.</p>
    </section>
  );
};

export default Footer;
