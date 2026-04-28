"use client";

import { useState, useRef, useEffect } from "react";
import { Building2, Search, ChevronDown, Check } from "lucide-react";
import { COMPANIES, Company } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CompanySelectProps {
  value: Company;
  onValueChange: (value: Company) => void;
}

export function CompanySelect({ value, onValueChange }: CompanySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMPANIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Ferme au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus sur l'input quand on ouvre
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (company: Company) => {
    onValueChange(company);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-dark-700 px-4 py-3 text-sm transition-all",
          open
            ? "border-edg-500/60 ring-2 ring-edg-500/20"
            : "border-dark-500 hover:border-dark-400"
        )}
      >
        <Building2 className="h-4 w-4 text-zinc-600 shrink-0" />
        <span className="flex-1 text-left text-zinc-100">{value}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-600 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-dark-500 bg-dark-800 shadow-xl shadow-black/40 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-dark-600 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une société..."
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
            />
          </div>

          {/* Liste */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-600">Aucun résultat</p>
            ) : (
              filtered.map((company) => {
                const isSelected = company === value;
                return (
                  <button
                    key={company}
                    type="button"
                    onClick={() => handleSelect(company)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors text-left",
                      isSelected
                        ? "bg-edg-500/10 text-edg-300"
                        : "text-zinc-300 hover:bg-dark-700"
                    )}
                  >
                    <Check className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-edg-400" : "invisible")} />
                    {company}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
