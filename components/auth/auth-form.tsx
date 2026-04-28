"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Building2, Lock, Linkedin } from "lucide-react";
import { COMPANIES, Company } from "@/lib/types";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AuthForm() {
  const router = useRouter();
  const { login, register } = useStore();

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState<Company>("EDG HQ");
  const [avatar, setAvatar] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [password, setPassword] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      toast({ title: "🌙 Bienvenue !", variant: "success" });
      router.push("/dashboard");
    } else {
      toast({ title: "Erreur", description: result.error, variant: "error" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast({ title: "Remplis tous les champs obligatoires", variant: "error" });
      return;
    }
    if (!linkedin) {
      toast({ title: "LinkedIn requis", description: "Ajoute ton profil LinkedIn pour que tes collègues te retrouvent.", variant: "error" });
      return;
    }
    setLoading(true);
    const result = await register({ firstName, lastName, email, phone, company, avatar, linkedin, password });
    setLoading(false);
    if (result.success) {
      toast({ title: "🎉 Compte créé ! Tu démarres avec 500 Moons 🌙", variant: "success" });
      router.push("/dashboard");
    } else {
      toast({ title: "Erreur", description: result.error, variant: "error" });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">Inscription</TabsTrigger>
        </TabsList>

        {/* LOGIN */}
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="l-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input id="l-email" type="email" placeholder="ton@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="l-password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input id="l-password" type={showLoginPwd ? "text" : "password"} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-9 pr-10" />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                  {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading
                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : "Se connecter →"}
            </Button>
          </form>
        </TabsContent>

        {/* REGISTER */}
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input id="firstName" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input id="r-email" type="email" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input id="phone" placeholder="+33 6 ..." value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Société *</Label>
              <Select value={company} onValueChange={(v) => setCompany(v as Company)}>
                <SelectTrigger>
                  <Building2 className="h-4 w-4 text-zinc-600 mr-2 shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LinkedIn — obligatoire */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                Profil LinkedIn *
              </Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2]" />
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/ton-profil"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-zinc-600">Permet à tes collègues de te retrouver en 1 clic</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Photo de profil (URL)</Label>
              <Input id="avatar" placeholder="https://... (optionnel)" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              <p className="text-xs text-zinc-600">Laisse vide → avatar généré automatiquement 🎨</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-password">Mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input id="r-password" type={showRegPwd ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10" />
                <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                  {showRegPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-edg-500/5 border border-edg-500/20 p-3">
              <p className="text-xs text-edg-300">🌙 Tu démarres avec <strong>500 Moons</strong> offerts + 100 Moons chaque semaine automatiquement !</p>
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading
                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : "Créer mon compte →"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
