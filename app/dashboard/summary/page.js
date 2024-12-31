// app/dashboard/summary/page.js
"use client";
import { useEffect, useState } from "react";

export default function Summary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/expense/summary", {
        headers: { userId: "123" }, // Replace with actual user ID
      });
      const data = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  return (
    <div>
      <h1>Summary</h1>
      <ul>
        {summary.map((item) => (
          <li key={item._id}>
            {item._id}: {item.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
