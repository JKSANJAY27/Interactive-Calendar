"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroImage from "./HeroImage";
import CalendarHeader from "./CalendarHeader";
import MonthGrid from "./MonthGrid";
import RangeInfo from "./RangeInfo";
import NotesPanel from "./NotesPanel";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotes } from "@/hooks/useNotes";
import styles from "./Calendar.module.css";

type Direction = 1 | -1;

// 3D desk-calendar page flip
// Pages flip around the TOP edge (the binder/spine), like a real table calendar
const flipVariants = {
  enter: (dir: Direction) => ({
    rotateX: dir > 0 ? 72 : -72,
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: Direction) => ({
    rotateX: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.94,
  }),
};

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Calendar() {
  const cal = useCalendar();
  const notes = useNotes(cal.viewYear, cal.viewMonth);

  const [direction, setDirection] = useState<Direction>(1);
  const [animKey, setAnimKey] = useState(0);

  const goNext = useCallback(() => {
    setDirection(1);
    setAnimKey((k) => k + 1);
    cal.goNextMonth();
  }, [cal]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setAnimKey((k) => k + 1);
    cal.goPrevMonth();
  }, [cal]);

  // Build a map: "YYYY-MM-DD" → number of notes covering that date
  const notesCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const note of notes.notes) {
      if (!note.startDate) continue;
      const start = new Date(note.startDate);
      const end = note.endDate ? new Date(note.endDate) : new Date(note.startDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = toDateKey(cursor);
        map.set(key, (map.get(key) ?? 0) + 1);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [notes.notes]);

  const getNoteCount = useCallback(
    (date: Date) => notesCountMap.get(toDateKey(date)) ?? 0,
    [notesCountMap]
  );

  const cells = cal.buildGrid();

  return (
    <div className={styles.root} data-month={cal.viewMonth}>
      <div className={styles.card}>
        {/* ── Left panel: Hero image + Notes ── */}
        <aside className={styles.leftPanel}>
          <HeroImage month={cal.viewMonth} year={cal.viewYear} />
          <div className={styles.notesWrap}>
            <NotesPanel
              notes={notes.notes}
              draft={notes.draft}
              setDraft={notes.setDraft}
              onAdd={notes.addNote}
              onDelete={notes.deleteNote}
              onEdit={notes.editNote}
              range={cal.range}
            />
          </div>
        </aside>

        {/* ── Right panel: Calendar grid ── */}
        <main className={styles.rightPanel}>
          <CalendarHeader
            month={cal.viewMonth}
            year={cal.viewYear}
            onPrev={goPrev}
            onNext={goNext}
            onToday={cal.goToday}
          />

          {/* Range info bar */}
          <AnimatePresence>
            {cal.range.start && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <RangeInfo
                  range={cal.range}
                  count={cal.selectedDaysCount()}
                  onClear={cal.clearRange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D flipping month grid */}
          <div className={styles.gridContainer}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={animKey}
                custom={direction}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.38,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ transformOrigin: "top center" }}
              >
                <MonthGrid
                  cells={cells}
                  range={cal.range}
                  selState={cal.selState}
                  getDayState={cal.getDayState}
                  onDayClick={cal.handleDayClick}
                  onDayHover={cal.setHoverDate}
                  getNoteCount={getNoteCount}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer legend */}
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "var(--accent)" }} />
              Selected
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "var(--accent-light)", border: "1.5px solid var(--accent-mid)" }} />
              In range
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "var(--accent-light)" }} />
              Today
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "var(--accent)", borderRadius: "50%", width: "6px", height: "6px" }} />
              Holiday
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: "var(--accent)", borderRadius: "2px", width: "14px", height: "4px" }} />
              Note
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
