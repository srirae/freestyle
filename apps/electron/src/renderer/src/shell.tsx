import markDark from "@renderer/assets/mark-dark.svg";
import markLight from "@renderer/assets/mark-light.svg";
import { cn } from "@renderer/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Book,
  BookOpen,
  Clock,
  Cpu,
  FileText,
  Languages,
  Sliders,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  shortcut: string;
};

const STATIC_NAV = [
  { to: "/today", icon: BookOpen, shortcut: "1", labelKey: "shell.nav.today" },
  {
    to: "/settings/history",
    icon: Clock,
    shortcut: "2",
    labelKey: "shell.nav.history",
  },
  {
    to: "/settings/dictionary",
    icon: Book,
    shortcut: "3",
    labelKey: "shell.nav.dictionary",
  },
  {
    to: "/settings/vocabulary",
    icon: Languages,
    shortcut: "4",
    labelKey: "shell.nav.vocabulary",
  },
  {
    to: "/settings/formats",
    icon: FileText,
    shortcut: "5",
    labelKey: "shell.nav.formats",
  },
  {
    to: "/settings/models",
    icon: Cpu,
    shortcut: "6",
    labelKey: "shell.nav.models",
  },
  {
    to: "/settings",
    icon: Sliders,
    shortcut: "7",
    labelKey: "shell.nav.settings",
  },
];

export default function AppShell(): React.JSX.Element {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation();

  const navItems: NavItem[] = useMemo(
    () => STATIC_NAV.map((item) => ({ ...item, label: t(item.labelKey) })),
    [t],
  );

  // Cmd/Ctrl+1..9 jumps between sidebar items
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < STATIC_NAV.length) {
        e.preventDefault();
        navigate(STATIC_NAV[idx].to);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    return window.api?.onFullscreenChanged(setIsFullscreen);
  }, []);

  return (
    <div className="bg-background flex h-screen">
      <aside
        className="border-border bg-sidebar flex w-[220px] shrink-0 flex-col border-r"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {/* Brand row — top padding leaves space for macOS traffic lights */}
        <div
          className={cn(
            "flex items-center gap-2.5 px-3.5 pb-6",
            isFullscreen ? "pt-4" : "pt-[44px]",
          )}
        >
          <img
            src={markLight}
            alt="Freestyle"
            className="block h-7 w-7 dark:hidden"
          />
          <img
            src={markDark}
            alt="Freestyle"
            className="hidden h-7 w-7 dark:block"
          />
          <span className="serif text-foreground text-[19px] font-medium tracking-tight">
            Freestyle
          </span>
        </div>

        <nav
          className="flex flex-col gap-px px-3"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/settings"}
                className="block"
              >
                {({ isActive }) => (
                  <div
                    className={cn(
                      "flex items-center gap-2.5 rounded-[7px] border px-2.5 py-1.5 text-[13px] transition-colors",
                      isActive
                        ? "border-border bg-card text-foreground font-medium"
                        : "text-secondary-foreground/80 hover:bg-card/50 border-transparent font-normal",
                    )}
                  >
                    <Icon
                      size={14}
                      className={
                        isActive ? "text-primary" : "text-muted-foreground"
                      }
                    />
                    <span className="flex-1">{item.label}</span>
                    <span
                      className={cn(
                        "mono shrink-0 text-[9.5px] tabular-nums",
                        isActive
                          ? "text-muted-foreground/80"
                          : "text-muted-foreground/60",
                      )}
                    >
                      {"⌘"}
                      {item.shortcut}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
