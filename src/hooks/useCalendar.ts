import { useState, useCallback } from "react";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type SelectionState = "idle" | "selecting";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, start: Date, end: Date) {
  const d = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  const lo = Math.min(s, e);
  const hi = Math.max(s, e);
  return d >= lo && d <= hi;
}

export function useCalendar() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selState, setSelState] = useState<SelectionState>("idle");

  const goNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const goPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goToday = useCallback(() => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    if (selState === "idle") {
      setRange({ start: date, end: null });
      setSelState("selecting");
    } else {
      // second click
      if (range.start && isSameDay(date, range.start)) {
        // clicking the same day — clear
        setRange({ start: null, end: null });
        setSelState("idle");
      } else {
        setRange((prev) => ({ ...prev, end: date }));
        setSelState("idle");
        setHoverDate(null);
      }
    }
  }, [selState, range.start]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setSelState("idle");
    setHoverDate(null);
  }, []);

  const getDayState = useCallback(
    (date: Date) => {
      const { start, end } = range;

      const isToday = isSameDay(date, now);

      if (!start) return { isToday, isStart: false, isEnd: false, inRange: false, isHover: false };

      const isStart = isSameDay(date, start);
      const isEnd = end ? isSameDay(date, end) : false;

      let inRange = false;
      if (start && end) {
        inRange = isInRange(date, start, end) && !isStart && !isEnd;
      } else if (start && hoverDate && selState === "selecting") {
        inRange = isInRange(date, start, hoverDate) && !isStart;
      }

      const isHover = hoverDate ? isSameDay(date, hoverDate) : false;

      return { isToday, isStart, isEnd, inRange, isHover };
    },
    [range, hoverDate, selState, now]
  );

  // Build the grid: 6 rows × 7 cols, week starts Monday
  const buildGrid = useCallback(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // 0=Sun…6=Sat → convert to Mon-based: Mon=0…Sun=6
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // Mon=0

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // prev month overflow
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, daysInPrev - i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), isCurrentMonth: true });
    }

    // next month overflow
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(viewYear, viewMonth + 1, d), isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const selectedDaysCount = useCallback(() => {
    if (!range.start || !range.end) return 0;
    const diff = Math.abs(range.end.getTime() - range.start.getTime());
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [range]);

  return {
    viewYear,
    viewMonth,
    range,
    hoverDate,
    selState,
    setHoverDate,
    goNextMonth,
    goPrevMonth,
    goToday,
    handleDayClick,
    clearRange,
    getDayState,
    buildGrid,
    selectedDaysCount,
    today: now,
  };
}
