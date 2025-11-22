import { Link, LinkIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            TinyLink
          </span>
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
