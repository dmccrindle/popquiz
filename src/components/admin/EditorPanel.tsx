"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  emptyQuestion,
  fetchTrivia,
  formatDateKey,
  formatDisplay,
  saveTrivia,
  deleteTrivia,
  parseSwiftQuestions,
  QUESTION_TYPES,
  TriviaQuestion,
  dateFromKey,
} from "@/lib/trivia";
import { setDoc, doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { useToast } from "./Toast";

type Status = "loading" | "live-today" | "saved" | "empty";

function statusStyles(status: Status): string {
  switch (status) {
    case "live-today":
      return "bg-amber-500/90 text-black";
    case "saved":
      return "bg-emerald-500/90 text-white";
    case "empty":
      return "bg-white/10 text-white/50";
    case "loading":
      return "bg-white/5 text-white/40";
  }
}

function statusLabel(status: Status): string {
  switch (status) {
    case "live-today":
      return "Live Today";
    case "saved":
      return "Saved";
    case "empty":
      return "No questions";
    case "loading":
      return "Loading…";
  }
}

export default function EditorPanel() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialDate = (() => {
    const param = searchParams.get("date");
    if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) return dateFromKey(param);
    return new Date();
  })();
  const [date, setDate] = useState<Date>(initialDate);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([
    emptyQuestion(),
    emptyQuestion(),
    emptyQuestion(),
  ]);
  const [status, setStatus] = useState<Status>("loading");
  const [saving, setSaving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const loadDate = useCallback(
    async (d: Date) => {
      setStatus("loading");
      try {
        const data = await fetchTrivia(formatDateKey(d));
        if (data) {
          const qs = (data.questions || []).slice();
          while (qs.length < 3) qs.push(emptyQuestion());
          setQuestions(qs.slice(0, 3));
          const isToday = formatDateKey(d) === formatDateKey(new Date());
          setStatus(isToday ? "live-today" : "saved");
        } else {
          setQuestions([emptyQuestion(), emptyQuestion(), emptyQuestion()]);
          setStatus("empty");
        }
      } catch (e) {
        toast(`Load failed: ${e instanceof Error ? e.message : "unknown"}`, true);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadDate(date);
  }, [date, loadDate]);

  function updateQuestion(i: number, field: keyof TriviaQuestion, value: string) {
    setQuestions((curr) => curr.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
  }

  async function handleSave() {
    const incomplete = questions.some((q) => !q.question.trim() || !q.answer.trim());
    if (incomplete) {
      toast("Each question needs at least a question and answer.", true);
      return;
    }
    setSaving(true);
    try {
      await saveTrivia(date, questions);
      const isToday = formatDateKey(date) === formatDateKey(new Date());
      setStatus(isToday ? "live-today" : "saved");
      toast(`Saved ${formatDateKey(date)}`);
    } catch (e) {
      toast(`Save failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete all questions for ${formatDateKey(date)}?`)) return;
    try {
      await deleteTrivia(formatDateKey(date));
      setQuestions([emptyQuestion(), emptyQuestion(), emptyQuestion()]);
      setStatus("empty");
      toast(`Deleted ${formatDateKey(date)}`);
    } catch (e) {
      toast(`Delete failed: ${e instanceof Error ? e.message : "unknown"}`, true);
    }
  }

  function shiftDate(delta: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  }

  function goToday() {
    setDate(new Date());
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 max-w-4xl">
      {/* Date nav */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button onClick={() => shiftDate(-1)} className="nav-btn" aria-label="Previous day">
          ←
        </button>
        <input
          type="date"
          value={formatDateKey(date)}
          onChange={(e) => setDate(dateFromKey(e.target.value))}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-accent-pink/50 [color-scheme:dark]"
        />
        <button onClick={() => shiftDate(1)} className="nav-btn" aria-label="Next day">
          →
        </button>
        <button onClick={goToday} className="nav-btn" title="Today" aria-label="Today">
          ★
        </button>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles(status)}`}
        >
          {statusLabel(status)}
        </span>
        <span className="text-xs text-white/40 ml-auto hidden sm:inline">{formatDisplay(date)}</span>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-accent-pink uppercase tracking-wider">
                Question {i + 1}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Question Type">
                <select
                  value={q.questionType}
                  onChange={(e) => updateQuestion(i, "questionType", e.target.value)}
                  className="admin-input"
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Artist (Apple Music lookup)">
                <input
                  type="text"
                  value={q.artist}
                  onChange={(e) => updateQuestion(i, "artist", e.target.value)}
                  placeholder="e.g. Taylor Swift or N/A"
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Question">
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(i, "question", e.target.value)}
                placeholder="Write the trivia question…"
                rows={2}
                className="admin-input resize-y"
              />
            </Field>
            <Field label="Answer">
              <input
                type="text"
                value={q.answer}
                onChange={(e) => updateQuestion(i, "answer", e.target.value)}
                placeholder="The correct answer"
                className="admin-input"
              />
            </Field>
            <Field label="Fun Fact">
              <textarea
                value={q.funFact}
                onChange={(e) => updateQuestion(i, "funFact", e.target.value)}
                placeholder="Shown on the answer card…"
                rows={2}
                className="admin-input resize-y"
              />
            </Field>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Questions"}
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2.5 rounded-full bg-red-500/90 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
        >
          Delete Day
        </button>
        <button
          onClick={() => setImportOpen(true)}
          className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Import from App
        </button>
      </div>

      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImport={(parsed) => {
            const padded = parsed.slice(0, 3);
            while (padded.length < 3) padded.push(emptyQuestion());
            setQuestions(padded);
            setImportOpen(false);
            toast(`Imported ${parsed.length} question${parsed.length === 1 ? "" : "s"}`);
          }}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function ImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (parsed: TriviaQuestion[]) => void;
}) {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  function handleSingle() {
    const parsed = parseSwiftQuestions(text);
    if (parsed.length === 0) {
      toast("Could not parse any questions.", true);
      return;
    }
    onImport(
      parsed.map((p) => ({
        questionType: p.questionType,
        artist: p.artist,
        question: p.question,
        answer: p.answer,
        funFact: p.funFact,
      }))
    );
  }

  async function handleImportAll() {
    if (!text.trim()) {
      toast("Paste the full DailyTrivia.swift questions array first.", true);
      return;
    }
    const all = parseSwiftQuestions(text);
    if (all.length === 0) {
      toast("Could not parse any questions.", true);
      return;
    }
    const grouped: Record<string, TriviaQuestion[]> = {};
    for (const q of all) {
      if (!q.date) continue;
      if (!grouped[q.date]) grouped[q.date] = [];
      grouped[q.date].push({
        questionType: q.questionType,
        artist: q.artist,
        question: q.question,
        answer: q.answer,
        funFact: q.funFact,
      });
    }
    const dates = Object.keys(grouped);
    if (
      !confirm(
        `Found ${all.length} questions across ${dates.length} dates. Upload all to Firestore?`
      )
    )
      return;

    setBusy(true);
    const year = new Date().getFullYear();
    let saved = 0;
    let failed = 0;
    const db = getFirebaseDb();
    for (const [appDate, qs] of Object.entries(grouped)) {
      const parsed = new Date(`${appDate}, ${year}`);
      if (isNaN(parsed.getTime())) {
        failed++;
        continue;
      }
      const key = formatDateKey(parsed);
      try {
        await setDoc(doc(db, "dailyTrivia", key), {
          date: appDate,
          dateKey: key,
          questions: qs.slice(0, 3),
          updatedAt: new Date().toISOString(),
        });
        saved++;
      } catch {
        failed++;
      }
    }
    setBusy(false);
    toast(failed ? `Imported ${saved} days (${failed} failed)` : `Imported ${saved} days`, failed > 0);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f0f25] border border-white/10 rounded-3xl p-7 max-w-lg w-full">
        <h2 className="text-lg font-extrabold text-white mb-2">Import from App Data</h2>
        <p className="text-sm text-white/50 mb-4 leading-relaxed">
          Paste your existing <code className="text-accent-pink">TriviaQuestion(...)</code>{" "}
          Swift entries. Single import fills the current day; &quot;Import All&quot; uploads
          every parsed date.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='TriviaQuestion(date: "Apr 26", questionType: "On This Day", artist: "...", question: "...", answer: "...", funFact: "...")'
          className="w-full h-40 bg-black/40 border border-white/10 text-white text-xs font-mono rounded-xl p-3 mb-4 focus:outline-none focus:border-accent-pink/50 resize-y"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSingle}
            disabled={busy}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            Import to current day
          </button>
          <button
            onClick={handleImportAll}
            disabled={busy}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Import All App Data"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-white/60 text-sm font-semibold hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
