"use client";
import { useState, useEffect } from "react";

export default function Clock() {
    const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

 const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="align-right">
      <div>{today}</div>
      <div>{now.toLocaleTimeString()}</div>
    </div>
  );
}