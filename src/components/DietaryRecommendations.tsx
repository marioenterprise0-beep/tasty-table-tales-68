import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Leaf, LoaderCircle, ArrowRight, AlertTriangle } from "lucide-react";
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
    <section aria-labelledby="dietary-title" className="mb-8 border-y border-gold/25 py-6">
      <div className="grid gap-5 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="dietary-title" className="display flex items-center gap-2 text-lg text-gold"><Leaf className="size-5" /> YOUR DIET, YOUR MENU</h2>
          <p className="mt-2 text-sm text-muted-foreground">Dietary needs &amp; preferences</p>
          <p className="mt-3 text-xs text-muted-foreground">AI-powered suggestions · Not medical advice</p>
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
        }} className="space-y-3">
          <label htmlFor="dietary-needs" className="text-sm text-foreground">What would you like us to consider?</label>
          <Textarea id="dietary-needs" value={needs} onChange={(event) => setNeeds(event.target.value)} maxLength={600} required minLength={3}
            placeholder="e.g. I'm vegetarian and prefer something not spicy" className="min-h-24 border-gold/30 bg-background text-foreground" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{needs.length}/600</span>
            <Button type="submit" disabled={loading || needs.trim().length < 3} className="bg-gold text-ink hover:bg-gold/90">
              {loading ? <LoaderCircle className="animate-spin" /> : <Leaf />}{loading ? "Checking the menu…" : "Find menu matches"}
            </Button>
          </div>
        </form>
      </div>
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
        Ingredients and kitchen cross-contact are not fully verified. For allergies or celiac disease, speak with our team before ordering.</p>
      <div aria-live="polite" aria-busy={loading}>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        {result && <div className="mt-5">
          <p className="text-sm text-foreground">{result.summary}</p>
          <ul className="mt-3 grid gap-4 md:grid-cols-3">
            {result.matches.map((match) => {
              const dish = dishes.find((item) => item.id === match.itemId);
              if (!dish) return null;
              return <li key={dish.id} className="flex flex-col border-l-2 border-gold pl-4">
                <h3 className="display text-sm text-foreground">{dish.name}</h3>
                <span className="mt-1 text-sm text-gold">{formatPrice(dish.price)}</span>
                <p className="mt-2 text-sm text-muted-foreground">{match.reason}</p>
                <p className="mt-2 text-xs text-muted-foreground">Confirm with our team: {match.checks}</p>
                <Button type="button" variant="link" className="mt-auto justify-start px-0 text-gold" onClick={() => onSelect(dish.id)}>View item <ArrowRight /></Button>
              </li>;
            })}
          </ul>
        </div>}
      </div>
    </section>
  );
}