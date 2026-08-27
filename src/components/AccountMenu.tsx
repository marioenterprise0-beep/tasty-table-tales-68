import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

/** Header sign-in affordance. Reflects live session state. */
export function AccountMenu({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    onNavigate?.();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading) return null;

  if (!session) {
    return (
      <Link
        to="/auth"
        onClick={onNavigate}
        className={
          variant === "mobile"
            ? "block w-full rounded-full border border-gold/50 px-4 py-3 text-center display text-[11px] tracking-[0.14em] text-gold"
            : "hidden sm:inline-flex whitespace-nowrap rounded-full border border-gold/50 px-5 py-2.5 display text-[11px] tracking-[0.14em] text-gold hover:bg-gold/10"
        }
      >
        Sign In
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="grid gap-2">
        <Link
          to="/account"
          onClick={onNavigate}
          className="block w-full rounded-full border border-gold/50 px-4 py-3 text-center display text-[11px] tracking-[0.14em] text-gold"
        >
          My Account
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="w-full px-4 py-2 text-center text-[12px] text-nav-foreground/70 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold hover:bg-gold/10"
      >
        <UserRound className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-gold/30 bg-ink text-foreground">
        <DropdownMenuItem asChild>
          <Link to="/account">My Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
