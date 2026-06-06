"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, CircleAlert, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildSeoSuggestions, suggestPrice } from "@/lib/premium-data";

type WizardData = {
  title: string;
  city: string;
  country: string;
  address: string;
  category: string;
  guests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  price: string;
  description: string;
  videoUrl: string;
  youtubeUrl: string;
  tour360Url: string;
  arrival: string;
  wifi: string;
  parking: string;
  accessCode: string;
};

const initialData: WizardData = {
  title: "",
  city: "",
  country: "",
  address: "",
  category: "Villa",
  guests: "2",
  bedrooms: "1",
  beds: "1",
  bathrooms: "1",
  price: "",
  description: "",
  videoUrl: "",
  youtubeUrl: "",
  tour360Url: "",
  arrival: "",
  wifi: "",
  parking: "",
  accessCode: ""
};

const steps = ["Base", "Description IA", "Tarification", "Visite", "Guide", "Aperçu"];

const requiredFields: Array<keyof WizardData> = ["title", "city", "country", "address", "guests", "bedrooms", "beds", "bathrooms", "price", "description"];

export function HostListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"draft" | "ready">("draft");
  const [data, setData] = useState<WizardData>(initialData);
  const [savedAt, setSavedAt] = useState<string>("");
  const [publishError, setPublishError] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("amkan.listingDraft");
    if (saved) {
      const parsed = JSON.parse(saved) as { step: number; mode: "draft" | "ready"; data: WizardData; savedAt: string };
      setStep(parsed.step);
      setMode(parsed.mode);
      setData({ ...initialData, ...parsed.data });
      setSavedAt(parsed.savedAt);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSavedAt = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      window.localStorage.setItem("amkan.listingDraft", JSON.stringify({ step, mode, data, savedAt: nextSavedAt }));
      setSavedAt(nextSavedAt);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [data, mode, step]);

  const missing = useMemo(() => requiredFields.filter((field) => !data[field]), [data]);
  const progress = Math.round(((steps.length - missing.length / 2) / steps.length) * 100);
  const smartPrice = suggestPrice({
    city: data.city || "Tipaza",
    season: "mid",
    guests: Number(data.guests || 2),
    category: data.category
  });
  const seoSuggestions = buildSeoSuggestions(data.title || data.category, data.city || "votre ville");

  function update(field: keyof WizardData, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function generateDescription() {
    const title = data.title || "Logement Amkan";
    const city = data.city || "la région";
    update(
      "description",
      `${title} à ${city} offre un séjour fluide et confortable avec espaces lumineux, arrivée simple, équipements essentiels et emplacement pratique pour découvrir les meilleures adresses locales.`
    );
  }

  function listingType() {
    const value = data.category.toLowerCase();
    if (value.includes("cabane")) return "CABIN";
    if (value.includes("appartement")) return "APARTMENT";
    if (value.includes("chalet")) return "CHALET";
    if (value.includes("chambre")) return "ROOM";
    if (value.includes("plage")) return "BEACH_HOUSE";
    return "VILLA";
  }

  async function publish() {
    setPublishError("");
    if (missing.length) {
      setPublishError("Complétez les champs obligatoires avant publication.");
      return;
    }
    setPublishing(true);
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
        pricePerNight: Number(data.price),
        type: listingType(),
        guests: Number(data.guests),
        bedrooms: Number(data.bedrooms),
        beds: Number(data.beds),
        bathrooms: Number(data.bathrooms)
      })
    });
    setPublishing(false);
    if (response.status === 401) {
      router.push("/login");
      return;
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setPublishError(body.error ?? "Publication impossible.");
      return;
    }
    const listing = await response.json();
    router.push(`/listing/${listing.id}`);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-md border border-ink/10 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Assistant hôte premium</h1>
            <p className="mt-1 text-sm text-ink/60">Brouillon autosauvegardé, validation en temps réel et aperçu instantané.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-mist px-3 py-2 text-sm">Sauvé {savedAt || "bientôt"}</span>
            <button type="button" onClick={() => setMode(mode === "draft" ? "ready" : "draft")} className="rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold">
              {mode === "draft" ? "Mode brouillon" : "Prêt à publier"}
            </button>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-palm transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${step === index ? "border-palm bg-mist text-palm" : "border-ink/10 text-ink/65"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <motion.div
          key={step}
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {step === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["title", "Titre"],
                ["address", "Adresse"],
                ["city", "Ville"],
                ["country", "Pays"],
                ["category", "Catégorie"],
                ["guests", "Capacité voyageurs"],
                ["bedrooms", "Chambres"],
                ["beds", "Lits"],
                ["bathrooms", "Salles de bain"]
              ].map(([field, label]) => (
                <label key={field} className="grid gap-2 text-sm font-medium">
                  {label}
                  <input value={data[field as keyof WizardData]} onChange={(event) => update(field as keyof WizardData, event.target.value)} className="min-h-11 rounded-md border border-ink/10 px-3 outline-none focus:border-palm" />
                </label>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Description IA et SEO</h2>
                <button type="button" onClick={generateDescription} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
                  <Wand2 className="h-4 w-4" />
                  Générer
                </button>
              </div>
              <textarea value={data.description} onChange={(event) => update("description", event.target.value)} rows={7} className="rounded-md border border-ink/10 p-3 outline-none focus:border-palm" />
              <div className="grid gap-2">
                {seoSuggestions.map((suggestion) => (
                  <span key={suggestion} className="rounded-md bg-mist px-3 py-2 text-sm text-ink/70">{suggestion}</span>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Prix par nuit
                <input value={data.price} onChange={(event) => update("price", event.target.value)} className="min-h-11 rounded-md border border-ink/10 px-3" />
              </label>
              <div className="rounded-md border border-palm/20 bg-mist p-4">
                <p className="text-sm font-medium text-palm">Prix conseillé</p>
                <p className="mt-2 text-3xl font-semibold">{smartPrice} EUR</p>
                <p className="mt-2 text-sm text-ink/60">Calculé selon ville, saison moyenne, capacité et catégorie.</p>
                <button type="button" onClick={() => update("price", String(smartPrice))} className="mt-4 rounded-md bg-palm px-4 py-2 text-sm font-semibold text-white">
                  Appliquer
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              {[
                ["videoUrl", "Upload vidéo / URL vidéo"],
                ["youtubeUrl", "Vidéo YouTube"],
                ["tour360Url", "Visite 360°"]
              ].map(([field, label]) => (
                <label key={field} className="grid gap-2 text-sm font-medium">
                  {label}
                  <input value={data[field as keyof WizardData]} onChange={(event) => update(field as keyof WizardData, event.target.value)} className="min-h-11 rounded-md border border-ink/10 px-3" />
                </label>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["arrival", "Instructions d'arrivée"],
                ["wifi", "Wi-Fi"],
                ["parking", "Parking"],
                ["accessCode", "Code d'accès"]
              ].map(([field, label]) => (
                <label key={field} className="grid gap-2 text-sm font-medium">
                  {label}
                  <textarea value={data[field as keyof WizardData]} onChange={(event) => update(field as keyof WizardData, event.target.value)} rows={4} className="rounded-md border border-ink/10 p-3" />
                </label>
              ))}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="rounded-md border border-ink/10 bg-mist p-5">
              <h2 className="text-2xl font-semibold">{data.title || "Titre du logement"}</h2>
              <p className="mt-2 text-ink/65">{data.city || "Ville"}, {data.country || "Pays"}</p>
              <p className="mt-4 leading-7">{data.description || "La description générée ou rédigée apparaîtra ici."}</p>
              <p className="mt-4 font-semibold">{data.price || smartPrice} EUR / nuit</p>
            </div>
          ) : null}
        </motion.div>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold disabled:opacity-40">
            Retour
          </button>
          <div className="flex items-center gap-2">
            {publishError ? <span className="text-sm text-red-700">{publishError}</span> : null}
            {step === steps.length - 1 ? (
              <button type="button" onClick={publish} disabled={publishing} className="rounded-md bg-clay px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {publishing ? "Publication..." : "Publier le logement"}
              </button>
            ) : (
              <button type="button" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className="rounded-md bg-palm px-4 py-2 text-sm font-semibold text-white">
                Continuer
              </button>
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-md border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Champs manquants</h2>
          <div className="mt-3 grid gap-2">
            {missing.length ? (
              missing.map((field) => (
                <span key={field} className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  <CircleAlert className="h-4 w-4" />
                  {field}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center gap-2 rounded-md bg-mist px-3 py-2 text-sm text-palm">
                <Check className="h-4 w-4" />
                Prêt pour publication
              </span>
            )}
          </div>
        </div>
        <div className="rounded-md border border-ink/10 bg-white p-5">
          <Sparkles className="mb-3 h-5 w-5 text-clay" />
          <h2 className="font-semibold">Aperçu instantané</h2>
          <p className="mt-2 text-sm text-ink/60">{data.title || "Votre annonce"} · {data.category}</p>
          <p className="mt-2 text-sm text-ink/60">{data.guests || 0} voyageurs · {data.price || smartPrice} EUR</p>
        </div>
      </aside>
    </div>
  );
}
