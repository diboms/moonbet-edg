"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Camera, User, Mail, Phone, Building2,
  Linkedin, Moon, Save, LogOut, CheckCircle2
} from "lucide-react";
import { useStore } from "@/lib/store";
import { COMPANIES, Company } from "@/lib/types";
import { formatMoons, getInitials } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, updateUser, logout, bets, events } = useStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState<Company>("EDG HQ");
  const [avatar, setAvatar] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) { router.replace("/"); return; }
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setPhone(currentUser.phone ?? "");
    setCompany(currentUser.company);
    setAvatar(currentUser.avatar ?? "");
    setLinkedin(currentUser.linkedin ?? "");
    setAvatarPreview(currentUser.avatar ?? "");
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Stats
  const userBets = bets.filter((b) => b.userId === currentUser.id);
  const resolvedBets = userBets.filter((b) => {
    const ev = events.find((e) => e.id === b.eventId);
    return ev?.status === "resolved";
  });
  const totalWon = resolvedBets.reduce((s, b) => s + (b.payout ?? 0), 0);
  const wins = resolvedBets.filter((b) => (b.payout ?? 0) > 0).length;
  const eventsCreated = events.filter((e) => e.creatorId === currentUser.id).length;

  const handleAvatarUrlChange = (url: string) => {
    setAvatar(url);
    setAvatarPreview(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop lourd", description: "Max 5 Mo.", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: "Prénom et nom requis", variant: "error" });
      return;
    }
    setSaving(true);
    const result = await updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      company,
      avatar: avatar.trim() ||
        `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}&backgroundColor=b6e3f4`,
      linkedin: linkedin.trim(),
    });
    setSaving(false);
    if ((result as any)?.success !== false) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast({ title: "✅ Profil mis à jour !", variant: "success" });
    } else {
      toast({ title: "Erreur", description: (result as any)?.error || "Une erreur est survenue", variant: "error" });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Mon compte</p>
          <h1 className="text-xl font-black text-zinc-100">Profil</h1>
        </div>
      </div>

      {/* Avatar hero */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-edg-gradient opacity-5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-edg-gradient" />
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            {/* Avatar avec overlay caméra — cliquable */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative shrink-0 group"
            >
              <Avatar className="h-20 w-20 border-2 border-edg-500/30 ring-2 ring-edg-500/10 shadow-xl">
                <AvatarImage src={avatarPreview} key={avatarPreview} />
                <AvatarFallback className="bg-edg-gradient text-white text-xl font-black">
                  {getInitials(firstName || currentUser.firstName, lastName || currentUser.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-edg-gradient shadow-lg border-2 border-dark-800">
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            </button>

            {/* Infos rapides */}
            <div className="flex-1 min-w-0">
              <p className="font-black text-zinc-100 text-lg truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-sm text-zinc-500 truncate">{currentUser.company}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Moon className="h-3.5 w-3.5 text-moon-400" />
                <span className="text-sm font-black text-moon-400">{formatMoons(currentUser.balance)} Moons</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-dark-600">
            {[
              { label: "Paris", value: userBets.length, color: "text-edg-400" },
              { label: "Victoires", value: wins, color: "text-emerald-400" },
              { label: "Créés", value: eventsCreated, color: "text-moon-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`text-xl font-black ${color}`}>{value}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire */}
      <form onSubmit={handleSave} className="space-y-5">

        {/* Identité */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <User className="h-3.5 w-3.5 inline mr-1.5" />Identité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="h-3.5 w-3.5 inline mr-1.5 text-zinc-600" />Téléphone
              </Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 ..." />
            </div>

            <div className="space-y-2">
              <Label>
                <Building2 className="h-3.5 w-3.5 inline mr-1.5 text-zinc-600" />Société
              </Label>
              <Select value={company} onValueChange={(v) => setCompany(v as Company)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Photo & réseaux */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <Camera className="h-3.5 w-3.5 inline mr-1.5" />Photo & Réseaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload photo */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Zone de prévisualisation + bouton */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-edg-500/30 ring-2 ring-edg-500/10 shadow-lg shrink-0">
                  <AvatarImage src={avatarPreview} key={avatarPreview} />
                  <AvatarFallback className="bg-edg-gradient text-white text-xl font-black">
                    {getInitials(firstName || currentUser.firstName, lastName || currentUser.lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-2 flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 text-sm gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
                  </Button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => { setAvatar(""); setAvatarPreview(""); }}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Supprimer la photo
                    </button>
                  )}
                  <p className="text-xs text-zinc-600">JPG, PNG, GIF — max 5 Mo</p>
                </div>
              </div>

              {/* Avatars générés */}
              <div>
                <p className="text-xs text-zinc-600 mb-2">Ou choisis un avatar généré :</p>
                <div className="flex gap-2 flex-wrap">
                  {["adventurer", "avataaars", "bottts", "fun-emoji", "lorelei"].map((style) => {
                    const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${firstName || "user"}&backgroundColor=b6e3f4,ffd5dc,c0aede`;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleAvatarUrlChange(url)}
                        className={`rounded-full border-2 transition-all ${
                          avatar === url ? "border-edg-400 scale-110" : "border-dark-500 hover:border-dark-400"
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={url} />
                          <AvatarFallback className="text-xs">?</AvatarFallback>
                        </Avatar>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                Profil LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/ton-profil"
              />
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#0A66C2] hover:underline"
                >
                  <Linkedin className="h-3 w-3" />
                  Vérifier le lien
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email (lecture seule) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <Mail className="h-3.5 w-3.5 inline mr-1.5" />Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl bg-dark-700/60 border border-dark-500 px-4 py-3">
              <Mail className="h-4 w-4 text-zinc-600 shrink-0" />
              <span className="text-sm text-zinc-400 font-mono">{currentUser.email}</span>
              <Badge variant="secondary" className="ml-auto text-xs">Non modifiable</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bouton save */}
        <Button
          type="submit"
          disabled={saving}
          variant={saved ? "success" : "default"}
          className="w-full h-12 text-sm"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Enregistrement...
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Profil mis à jour !
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </span>
          )}
        </Button>
      </form>

      {/* Déconnexion */}
      <div className="pt-2 pb-6">
        <Button variant="ghost" onClick={handleLogout} className="w-full h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
