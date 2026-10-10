"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

interface Defaults {
  artist: string;
  title: string;
  categories: CategoryId[];
  songSlug?: string;
}

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; title: string } | { kind: "error"; message: string };

export function SubmitForm({ defaults }: { defaults: Defaults }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      artist: String(fd.get("artist") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      bar: String(fd.get("bar") ?? "").trim(),
      timestamp: String(fd.get("timestamp") ?? "").trim(),
      categories: fd.getAll("categories").map(String),
      whyItsFunny: String(fd.get("whyItsFunny") ?? "").trim(),
      submitterName: String(fd.get("submitterName") ?? "").trim(),
      submitterEmail: String(fd.get("submitterEmail") ?? "").trim(),
      songSlug: defaults.songSlug,
      website: String(fd.get("website") ?? ""), // honeypot
    };
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState({ kind: "error", message: data.error ?? "Something went wrong. Try again." });
        return;
      }
      setState({ kind: "sent", title: payload.title });
      form.reset();
    } catch {
      setState({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="max-w-prose">
        <p className="text-2xl font-bold">
          Got it. <span className="bar-highlight">&ldquo;{state.title}&rdquo;</span> is in the review queue.
        </p>
        <p className="mt-3 text-mute">We read every submission. If it checks out, it goes up with your name on the annotation.</p>
        <button type="button" onClick={() => setState({ kind: "idle" })} className="mt-6 bg-ink px-4 py-2 font-semibold text-paper hover:bg-stain-deep">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Artist" name="artist" required defaultValue={defaults.artist} autoComplete="off" />
        <Field label="Song" name="title" required defaultValue={defaults.title} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="bar" className="block font-semibold">
          The bar
        </label>
        <p className="mb-1.5 text-sm text-mute">Just the line or two that mentions it. Two lines max.</p>
        <textarea id="bar" name="bar" required rows={2} maxLength={240} className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Timestamp" name="timestamp" placeholder="1:42" hint="Where the bar lands in the track" pattern="\\d{1,2}:\\d{2}" />
      </div>

      <fieldset>
        <legend className="font-semibold">What does it mention?</legend>
        <p className="mb-2 text-sm text-mute">Pick everything that applies.</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold has-[:checked]:bg-ink has-[:checked]:text-paper">
              <input type="checkbox" name="categories" value={c.id} defaultChecked={defaults.categories.includes(c.id)} className="sr-only" />
              <span aria-hidden="true">{c.emoji}</span>
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="whyItsFunny" className="block font-semibold">
          Why it&rsquo;s funny
        </label>
        <p className="mb-1.5 text-sm text-mute">Context, the setup, what makes it land. This becomes the annotation.</p>
        <textarea id="whyItsFunny" name="whyItsFunny" rows={4} maxLength={2000} className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name (optional)" name="submitterName" hint="For credit on the annotation" />
        <Field label="Email (optional)" name="submitterEmail" type="email" hint="Only if you want to hear back" />
      </div>

      {/* Honeypot: real people never see this. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.kind === "error" && (
        <p role="alert" className="border-l-4 border-stain-deep pl-3 font-semibold">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={state.kind === "sending"} className="bg-ink px-5 py-3 font-semibold text-paper hover:bg-stain-deep disabled:opacity-50">
        {state.kind === "sending" ? "Sending…" : "Send it in"}
      </button>
    </form>
  );
}

const inputClass = "w-full border-2 border-ink bg-paper px-3 py-2 placeholder:text-mute";

function Field({
  label,
  name,
  hint,
  type = "text",
  ...rest
}: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block font-semibold">
        {label}
      </label>
      {hint && <p className="mb-1.5 text-sm text-mute">{hint}</p>}
      <input id={name} name={name} type={type} className={inputClass} {...rest} />
    </div>
  );
}
