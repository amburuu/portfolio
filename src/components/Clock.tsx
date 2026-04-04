"use client";

import { div } from "three/tsl";

export default function Clock() {
    const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const time = new Date().toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

  return (
    <div>
      <div>{today}</div>
      <div>{time}</div>
    </div>
  );
}