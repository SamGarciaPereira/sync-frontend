import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ProfileMenu } from "./ProfileMenu";

/** Top bar shown on mobile (below lg). */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-surface-border bg-cream/90 px-5 py-4 backdrop-blur lg:hidden">
      <Link to="/app" className="text-heading">
        <Logo size="md" />
      </Link>
      <ProfileMenu variant="mobile" />
    </header>
  );
}
