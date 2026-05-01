import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  back?: string;
  right?: ReactNode;
  showLogo?: boolean;
  bare?: boolean;
};

export function AppShell({
  children,
  title,
  back,
  right,
  showLogo = false,
  bare = false,
}: Props) {
  return (
    <div className="min-h-[100dvh] w-full">
      <div className="mx-auto w-full max-w-[430px] min-h-[100dvh] flex flex-col">
        {!bare && (
          <header className="sticky top-0 z-30 px-4 pt-4 pb-3 backdrop-blur bg-bg/70 border-b border-white/[0.04]">
            <div className="flex items-center gap-3 h-10">
              {back ? (
                <Link
                  href={back}
                  aria-label="Back"
                  className="h-9 w-9 grid place-items-center rounded-full bg-soft/60 text-ink-secondary hover:text-ink-primary transition no-tap-highlight"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 6l-6 6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : showLogo ? (
                <Link href="/" className="flex items-center gap-2">
                  <Logo />
                  <span className="font-display font-semibold text-ink-primary">
                    UdhariClub
                  </span>
                </Link>
              ) : (
                <span className="w-9" />
              )}

              <div className="flex-1 min-w-0 text-center">
                {title && (
                  <h1 className="font-display font-semibold text-ink-primary truncate text-[15px]">
                    {title}
                  </h1>
                )}
              </div>

              <div className="min-w-[36px] flex justify-end">{right}</div>
            </div>
          </header>
        )}

        <main className="flex-1 px-4 pt-4 pb-28 animate-rise">{children}</main>
      </div>
    </div>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="relative inline-block"
    >
      <span
        className="absolute inset-0 rounded-[10px]"
        style={{
          background:
            "conic-gradient(from 220deg at 50% 50%, #22C55E 0deg, #FACC15 180deg, #22C55E 360deg)",
          filter: "blur(0.5px)",
        }}
      />
      <span className="absolute inset-[2px] rounded-[8px] bg-bg grid place-items-center font-display font-bold text-mint text-[14px]">
        ₹
      </span>
    </span>
  );
}
