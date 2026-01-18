import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
