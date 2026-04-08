"use client";

import { X } from "lucide-react";
import type { DateRange } from "@/hooks/useCalendar";
import styles from "./RangeInfo.module.css";

type Props = {
  range: DateRange;
  count: number;
  onClear: () => void;
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function RangeInfo({ range, count, onClear }: Props) {
  if (!range.start) return null;

  const isSingleDay = !range.end;

  return (
    <div className={styles.bar}>
      <div className={styles.info}>
        <span className={styles.dot} />
        {isSingleDay ? (
          <span className={styles.text}>
            <strong>Start:</strong> {fmt(range.start)} — click another day to set end date
          </span>
        ) : (
          <span className={styles.text}>
            <strong>{fmt(range.start)}</strong>
            {" → "}
            <strong>{fmt(range.end!)}</strong>
            <span className={styles.count}>
              {count} {count === 1 ? "day" : "days"}
            </span>
          </span>
        )}
      </div>
      <button className={styles.clearBtn} onClick={onClear} aria-label="Clear selection">
        <X size={14} />
        Clear
      </button>
    </div>
  );
}
