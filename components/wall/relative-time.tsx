"use client";

import { useEffect, useState } from "react";

export function formatRelativeTime(date: string, now = Date.now()): string {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) {
    return "";
  }
  const seconds = Math.round((timestamp - now) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, length] of units) {
    if (Math.abs(seconds) >= length || unit === "second") {
      return formatter.format(Math.round(seconds / length), unit);
    }
  }
  return "";
}

export function RelativeTime({ date }: { date: string }) {
  const [label, setLabel] = useState("just now");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLabel(formatRelativeTime(date));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [date]);

  return <time dateTime={date}>{label}</time>;
}
