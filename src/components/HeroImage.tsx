"use client";

import Image from "next/image";
import { MONTH_IMAGES, MONTH_NAMES } from "@/lib/calendarData";
import styles from "./HeroImage.module.css";

type Props = {
  month: number;
  year: number;
};

export default function HeroImage({ month, year }: Props) {
  const img = MONTH_IMAGES[month];

  return (
    <div className={styles.hero}>
      <div className={styles.imgWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={img.credit}
          className={styles.img}
          loading="lazy"
        />
        <div className={styles.overlay} />
        <div className={styles.clip} />
      </div>

      {/* Spiral rings decoration */}
      <div className={styles.rings} aria-hidden="true">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className={styles.ring} />
        ))}
      </div>

      {/* Month badge */}
      <div className={styles.badge}>
        <span className={styles.badgeYear}>{year}</span>
        <span className={styles.badgeMonth}>{MONTH_NAMES[month].toUpperCase()}</span>
      </div>
    </div>
  );
}
