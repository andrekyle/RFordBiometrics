const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 px-4 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground/60">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span>RJF Investments</span>
          <span className="hidden sm:inline text-muted-foreground/40">|</span>
          <span>2008 / 023862 / 23</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span>M. +27 83 241 5947</span>
          <span className="hidden sm:inline text-muted-foreground/40">|</span>
          <a
            href="mailto:randell@rjfinvestments.co.za"
            className="hover:text-primary transition-colors"
          >
            randell@rjfinvestments.co.za
          </a>
        </div>
        <span>
          © {currentYear} RJF Investments. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
