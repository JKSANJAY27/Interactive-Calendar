"use client";

import { useState } from "react";
import { Trash2, StickyNote, PenLine, Check, X } from "lucide-react";
import type { Note } from "@/hooks/useNotes";
import type { DateRange } from "@/hooks/useCalendar";
import styles from "./NotesPanel.module.css";

type Props = {
  notes: Note[];
  draft: string;
  setDraft: (v: string) => void;
  onAdd: (text: string, rangeLabel: string, start: Date | null, end: Date | null) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  range: DateRange;
};

function formatRange(range: DateRange): string {
  if (!range.start) return "General note";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const s = range.start.toLocaleDateString("en-IN", opts);
  if (!range.end) return s;
  const e = range.end.toLocaleDateString("en-IN", opts);
  if (s === e) return s;
  return `${s} → ${e}`;
}

export default function NotesPanel({
  notes,
  draft,
  setDraft,
  onAdd,
  onDelete,
  onEdit,
  range,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const rangeLabel = formatRange(range);
  const hasRange = Boolean(range.start);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (draft.trim()) {
      onAdd(draft, rangeLabel, range.start, range.end);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function saveEdit() {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <StickyNote size={15} />
        <span>Notes</span>
        {hasRange && (
          <span className={styles.rangePill}>{rangeLabel}</span>
        )}
      </div>

      {/* Textarea form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            hasRange
              ? `Add a note for ${rangeLabel}…`
              : "Jot down a note for this month…"
          }
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <button
          className={styles.addBtn}
          type="submit"
          disabled={!draft.trim()}
        >
          Add note
          <span className={styles.shortcut}>⌘ ↵</span>
        </button>
      </form>

      {/* Notes list */}
      {notes.length > 0 && (
        <ul className={styles.list}>
          {[...notes].reverse().map((note) => (
            <li key={note.id} className={styles.noteCard}>
              {editingId === note.id ? (
                <div className={styles.editWrap}>
                  <textarea
                    className={styles.editArea}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                    rows={2}
                  />
                  <div className={styles.editActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={saveEdit}
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={cancelEdit}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className={styles.noteText}>{note.text}</p>
                  <div className={styles.noteMeta}>
                    <span className={styles.noteRange}>{note.rangeLabel}</span>
                    <div className={styles.noteActions}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => startEdit(note)}
                        title="Edit"
                      >
                        <PenLine size={13} />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(note.id)}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {notes.length === 0 && (
        <p className={styles.empty}>No notes yet. Select dates and start typing!</p>
      )}
    </div>
  );
}
