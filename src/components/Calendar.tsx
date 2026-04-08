"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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

const variants = {
  enter: (dir: Direction) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: Direction) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

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

  const cells = cal.buildGrid();

  return (
    <div
      className={styles.root}
      data-month={cal.viewMonth}
    >
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

          {/* Animated month grid */}
          <div className={styles.gridContainer}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={animKey}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <MonthGrid
                  cells={cells}
                  range={cal.range}
                  selState={cal.selState}
                  getDayState={cal.getDayState}
                  onDayClick={cal.handleDayClick}
                  onDayHover={cal.setHoverDate}
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
          </div>
        </main>
      </div>
    </div>
  );
}
