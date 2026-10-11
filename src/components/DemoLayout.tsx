import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Layout for the original Vite-template demo pages (Home / Users / Status). */
export function DemoLayout() {
  return (
    <div className="demo-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
