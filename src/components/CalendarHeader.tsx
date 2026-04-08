"use client";

import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from "lucide-react";
import { MONTH_NAMES } from "@/lib/calendarData";
import styles from "./CalendarHeader.module.css";

type Props = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarHeader({
  month,
  year,
  onPrev,
  onNext,
  onToday,
}: Props) {
  const now = new Date();
  const isCurrentMonth =
    month === now.getMonth() && year === now.getFullYear();

  return (
    <div className={styles.header}>
      <button
        className={styles.navBtn}
        onClick={onPrev}
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>

      <div className={styles.center}>
        <span className={styles.monthName}>{MONTH_NAMES[month]}</span>
        <span className={styles.year}>{year}</span>
      </div>

      <div className={styles.rightGroup}>
        {!isCurrentMonth && (
          <button
            className={styles.todayBtn}
            onClick={onToday}
            aria-label="Go to today"
            title="Back to today"
          >
            <RotateCcw size={13} />
            Today
          </button>
        )}
        <button
          className={styles.navBtn}
          onClick={onNext}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
