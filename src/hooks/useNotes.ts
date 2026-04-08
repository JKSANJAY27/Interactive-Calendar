import { useState, useEffect, useCallback } from "react";

export type Note = {
  id: string;
  text: string;
  rangeLabel: string;
  createdAt: string;
};

function storageKey(year: number, month: number) {
  return `cal-notes-${year}-${month}`;
}

export function useNotes(year: number, month: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");

  // Load from localStorage when month changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(year, month));
      setNotes(raw ? JSON.parse(raw) : []);
    } catch {
      setNotes([]);
    }
    setDraft("");
  }, [year, month]);

  const persist = useCallback(
    (updated: Note[]) => {
      setNotes(updated);
      try {
        localStorage.setItem(storageKey(year, month), JSON.stringify(updated));
      } catch {
        // storage full or SSR — silently ignore
      }
    },
    [year, month]
  );

  const addNote = useCallback(
    (text: string, rangeLabel: string) => {
      if (!text.trim()) return;
      const note: Note = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: text.trim(),
        rangeLabel,
        createdAt: new Date().toISOString(),
      };
      persist([...notes, note]);
      setDraft("");
    },
    [notes, persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      persist(notes.filter((n) => n.id !== id));
    },
    [notes, persist]
  );

  const editNote = useCallback(
    (id: string, newText: string) => {
      persist(notes.map((n) => (n.id === id ? { ...n, text: newText } : n)));
    },
    [notes, persist]
  );

  return { notes, draft, setDraft, addNote, deleteNote, editNote };
}
