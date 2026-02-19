const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 px-4 py-3 sm:py-4">
      {/* Mobile: 2-column layout */}
      <div className="flex sm:hidden justify-between items-start text-[10px] text-muted-foreground/60">
        <div className="flex flex-col gap-0.5">
          <span>RJF Investments</span>
          <span>2008 / 023862 / 23</span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span>M. +27 83 241 5947</span>
          <a
            href="mailto:randell@rjfinvestments.co.za"
            className="hover:text-primary transition-colors"
          >
            randell@rjfinvestments.co.za
          </a>
        </div>
      </div>
      <div className="mt-2 text-center text-[10px] text-muted-foreground/60 sm:hidden">
        © {currentYear} RJF Investments. All rights reserved.
      </div>

      {/* Desktop: single row */}
      <div className="hidden sm:flex items-center justify-between text-xs text-muted-foreground/60">
        <div className="flex items-center gap-3">
          <span>RJF Investments</span>
          <span className="text-muted-foreground/40">|</span>
          <span>2008 / 023862 / 23</span>
        </div>
        <div className="flex items-center gap-3">
          <span>M. +27 83 241 5947</span>
          <span className="text-muted-foreground/40">|</span>
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
