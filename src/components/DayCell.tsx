"use client";

import { getHoliday } from "@/lib/calendarData";
import styles from "./DayCell.module.css";

type Props = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHover: boolean;
  selState: "idle" | "selecting";
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  inRange,
  isHover,
  selState,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const day = date.getDate();
  const holiday = getHoliday(date);

  const isWeekend =
    date.getDay() === 0 || date.getDay() === 6;

  const isEndpoint = isStart || isEnd;

  return (
    <button
      className={[
        styles.cell,
        !isCurrentMonth && styles.other,
        isToday && !isEndpoint && styles.today,
        isStart && styles.start,
        isEnd && styles.end,
        inRange && styles.inRange,
        isHover && selState === "selecting" && styles.hovered,
        isWeekend && isCurrentMonth && !isEndpoint && styles.weekend,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`${date.toDateString()}${holiday ? `, ${holiday}` : ""}`}
      aria-pressed={isStart || isEnd}
    >
      <span className={styles.number}>{day}</span>

      {/* Holiday dot */}
      {holiday && isCurrentMonth && (
        <span className={styles.holidayDot} title={holiday} />
      )}
    </button>
  );
}
