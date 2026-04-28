"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Zap, Bot, ExternalLink } from "lucide-react";
import { EventCategory } from "@/lib/types";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: "padel", label: "🏓 Padel" },
  { value: "bureau", label: "💼 Bureau" },
  { value: "autre", label: "🎲 Autre" },
];

export function EventForm() {
  const router = useRouter();
  const { currentUser, createEvent } = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("padel");
  const [lockDate, setLockDate] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [options, setOptions] = useState(["", ""]);
  // Résolution automatique
  const [autoResolve, setAutoResolve] = useState(false);
  const [scheduledResultIndex, setScheduledResultIndex] = useState<number | null>(null);
  const [resultSource, setResultSource] = useState("");
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const removeOption = (i: number) => {
    if (options.length > 2) {
      if (scheduledResultIndex === i) setScheduledResultIndex(null);
      else if (scheduledResultIndex !== null && scheduledResultIndex > i)
        setScheduledResultIndex(scheduledResultIndex - 1);
      setOptions(options.filter((_, idx) => idx !== i));
    }
  };

  const updateOption = (i: number, val: string) => {
    const updated = [...options];
    updated[i] = val;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast({ title: "Titre requis", variant: "error" });
    if (!lockDate || !eventDate) return toast({ title: "Dates requises", variant: "error" });
    if (new Date(lockDate) >= new Date(eventDate))
      return toast({ title: "La date limite doit être avant l'événement", variant: "error" });
    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2)
      return toast({ title: "Au moins 2 options requises", variant: "error" });
    if (autoResolve && scheduledResultIndex === null)
      return toast({ title: "Sélectionne le résultat attendu", variant: "error" });

    setLoading(true);
    try {
      const ts = Date.now();
      const builtOptions = filledOptions.map((label, i) => ({
        id: `opt-${ts}-${i}`,
        label,
        totalBets: 0,
      }));

      let scheduledId: string | undefined;
      if (autoResolve && scheduledResultIndex !== null) {
        const filled = options.map((o, i) => ({ o, i })).filter(({ o }) => o.trim());
        const filledIdx = filled.findIndex(({ i }) => i === scheduledResultIndex);
        if (filledIdx !== -1) scheduledId = builtOptions[filledIdx]?.id;
      }

      const event = await createEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        lockDate: new Date(lockDate).toISOString(),
        eventDate: new Date(eventDate).toISOString(),
        options: builtOptions,
        creatorId: currentUser.id,
        scheduledResultOptionId: scheduledId,
        resultSource: resultSource.trim() || undefined,
      });
      toast({ title: "🎉 Événement créé !", description: event.title, variant: "success" });
      router.push(`/events/${event.id}`);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filledOptions = options.filter((o) => o.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Infos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">📝 Infos de l'événement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" placeholder="Ex: Padel — EDG Open #5" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Décris l'événement, les règles, l'ambiance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-xl border border-dark-500 bg-dark-700 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-edg-500/60 focus-visible:border-edg-500/60 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">📅 Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lockDate">🔒 Date limite de pari *</Label>
            <Input id="lockDate" type="datetime-local" value={lockDate} onChange={(e) => setLockDate(e.target.value)} className="[color-scheme:dark]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">🏁 Date de l'événement *</Label>
            <Input id="eventDate" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="[color-scheme:dark]" />
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">🎯 Options de pari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder={`Option ${i + 1}${i === 0 ? " (ex: Équipe A)" : i === 1 ? " (ex: Équipe B)" : ""}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                maxLength={50}
              />
              {options.length > 2 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(i)} className="shrink-0 text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {options.length < 5 && (
            <Button type="button" variant="outline" onClick={addOption} className="w-full">
              <Plus className="h-4 w-4" /> Ajouter une option
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Résolution automatique */}
      <Card className={autoResolve ? "border-edg-500/30" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-edg-400" />
              <CardTitle className="text-sm uppercase tracking-widest text-zinc-400">
                Résolution automatique
              </CardTitle>
            </div>
            {/* Toggle */}
            <button
              type="button"
              onClick={() => setAutoResolve(!autoResolve)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
                autoResolve ? "bg-edg-gradient" : "bg-dark-500"
              )}
            >
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform",
                autoResolve ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>
        </CardHeader>

        {autoResolve && (
          <CardContent className="space-y-4 pt-0">
            <div className="rounded-xl bg-edg-500/5 border border-edg-500/20 p-3">
              <p className="text-xs text-edg-300">
                <Bot className="h-3 w-3 inline mr-1" />
                Le résultat sera appliqué automatiquement dès que la date de l'événement est passée. Utile pour les matchs réels, résultats d'élections, etc.
              </p>
            </div>

            {/* Sélection du résultat attendu */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-zinc-500">Résultat attendu *</Label>
              {filledOptions.length >= 2 ? (
                <div className="grid gap-2">
                  {options.map((opt, i) => {
                    if (!opt.trim()) return null;
                    const isSelected = scheduledResultIndex === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setScheduledResultIndex(i)}
                        className={cn(
                          "w-full text-left rounded-xl border p-3 transition-all text-sm font-semibold",
                          isSelected
                            ? "border-edg-400/50 bg-edg-400/10 text-edg-300"
                            : "border-dark-500 bg-dark-700 text-zinc-400 hover:border-dark-400"
                        )}
                      >
                        {isSelected && "✓ "}{opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 italic">Remplis d'abord les options ci-dessus</p>
              )}
            </div>

            {/* Source du résultat */}
            <div className="space-y-2">
              <Label htmlFor="resultSource" className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500">
                <ExternalLink className="h-3 w-3" />
                Source du résultat (URL)
              </Label>
              <Input
                id="resultSource"
                placeholder="https://... (lien vers le résultat officiel)"
                value={resultSource}
                onChange={(e) => setResultSource(e.target.value)}
              />
              <p className="text-xs text-zinc-600">Optionnel — ex: lien FlashScore, L'Équipe, etc.</p>
            </div>
          </CardContent>
        )}
      </Card>

      <Button type="submit" disabled={loading} className="w-full h-12 text-sm">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Création...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Créer l'événement
          </span>
        )}
      </Button>
    </form>
  );
}
