export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 TinyLink. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
