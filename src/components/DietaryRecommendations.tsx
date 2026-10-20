import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Leaf, LoaderCircle, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getDietaryRecommendations } from "@/lib/dietary.functions";
import type { DietaryOutput } from "@/lib/dietary.schemas";
import { formatPrice } from "@/lib/order";

type Item = { id: string; name: string; price: string };
export function DietaryRecommendations({ dishes, onSelect }: { dishes: Item[]; onSelect: (id: string) => void }) {
  const recommend = useServerFn(getDietaryRecommendations);
  const [needs, setNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DietaryOutput | null>(null);
  return (
    <section aria-labelledby="dietary-title" className="mb-10 border-y border-gold/30 py-8 sm:py-10">
      <div className="grid gap-7 lg:grid-cols-[0.85fr_1.4fr] lg:gap-14">
        <div className="min-w-0">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium text-gold"><Sparkles className="size-4" /> AI-powered menu suggestions</p>
          <h2 id="dietary-title" className="display text-2xl leading-tight text-foreground sm:text-3xl">YOUR DIET.<br /><span className="text-gold">YOUR MENU.</span></h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">Dietary needs, flavor preferences, and a meal that sounds like you.</p>
        </div>
        <form onSubmit={async (event) => {
          event.preventDefault();
          if (loading || needs.trim().length < 3) return;
          setLoading(true); setError(null); setResult(null);
          try {
            const response = await recommend({ data: { needs } });
            setResult(response.result); setError(response.error);
          } catch { setError("Recommendations are unavailable right now. Please ask our team."); }
          finally { setLoading(false); }
        }} className="min-w-0 space-y-3">
          <label htmlFor="dietary-needs" className="block text-sm font-medium text-foreground">What are you in the mood for?</label>
          <Textarea id="dietary-needs" value={needs} onChange={(event) => setNeeds(event.target.value)} maxLength={600} required minLength={3}
            placeholder="I'm vegetarian and prefer something not spicy…" className="min-h-28 resize-y rounded-md border-input bg-card p-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold" />
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Vegetarian", value: "I'm vegetarian." },
              { label: "Gluten-free", value: "I need gluten-free options." },
              { label: "Mild flavors", value: "I prefer mild flavors, nothing spicy." },
            ].map((option) => <Button key={option.label} type="button" variant="outline" size="sm" disabled={loading} onClick={() => { setNeeds(option.value); setResult(null); setError(null); }} className="rounded-full border-border bg-transparent px-4 text-muted-foreground hover:border-gold hover:bg-gold/10 hover:text-foreground">{option.label}</Button>)}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-muted-foreground">{needs.length} / 600</span>
            <Button type="submit" disabled={loading || needs.trim().length < 3} className="h-11 rounded-full px-6">
              {loading ? <LoaderCircle className="animate-spin" /> : <Leaf />}{loading ? "Checking the menu…" : "Find my matches"}<ArrowRight />
            </Button>
          </div>
        </form>
      </div>
      <p className="mt-6 flex max-w-3xl items-start gap-2 text-xs leading-relaxed text-muted-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
        Ingredients and kitchen cross-contact are not fully verified. For allergies or celiac disease, speak with our team before ordering. Suggestions are not medical advice.</p>
      <div aria-live="polite" aria-busy={loading}>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        {result && <div className="mt-7 border-t border-border pt-7">
          <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {result.matches.map((match) => {
              const dish = dishes.find((item) => item.id === match.itemId);
              if (!dish) return null;
              return <li key={dish.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="display text-sm leading-relaxed text-foreground">{dish.name}</h3>
                  <span className="shrink-0 text-sm font-semibold text-gold">{formatPrice(dish.price)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{match.reason}</p>
                <p className="mb-4 mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">Confirm with our team: {match.checks}</p>
                <Button type="button" variant="link" className="mt-auto justify-between px-0 text-gold" onClick={() => onSelect(dish.id)}>View item <ArrowRight /></Button>
              </li>;
            })}
          </ul>
        </div>}
      </div>
    </section>
  );
}