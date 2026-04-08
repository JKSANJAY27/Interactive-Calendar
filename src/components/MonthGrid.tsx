"use client";

import DayCell from "./DayCell";
import { DAY_NAMES } from "@/lib/calendarData";
import styles from "./MonthGrid.module.css";
import type { DateRange, SelectionState } from "@/hooks/useCalendar";

type Props = {
  cells: Array<{ date: Date; isCurrentMonth: boolean }>;
  range: DateRange;
  selState: SelectionState;
  getDayState: (d: Date) => {
    isToday: boolean;
    isStart: boolean;
    isEnd: boolean;
    inRange: boolean;
    isHover: boolean;
  };
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
};

export default function MonthGrid({
  cells,
  range,
  selState,
  getDayState,
  onDayClick,
  onDayHover,
}: Props) {
  return (
    <div className={styles.grid}>
      {/* Day headers */}
      {DAY_NAMES.map((name) => (
        <div key={name} className={styles.dayName}>
          {name}
        </div>
      ))}

      {/* Day cells */}
      {cells.map(({ date, isCurrentMonth }, idx) => {
        const state = getDayState(date);
        return (
          <DayCell
            key={idx}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isToday={state.isToday}
            isStart={state.isStart}
            isEnd={state.isEnd}
            inRange={state.inRange}
            isHover={state.isHover}
            selState={selState}
            onClick={() => onDayClick(date)}
            onMouseEnter={() => onDayHover(date)}
            onMouseLeave={() => onDayHover(null)}
          />
        );
      })}
    </div>
  );
}
