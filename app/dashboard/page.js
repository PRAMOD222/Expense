"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSpent: 0,
    totalGiven: 0,
    totalBorrowed: 0,
    remainingBalance: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("You need to be logged in to see your stats.");
        return;
      }

      try {
        const response = await fetch("/api/expense/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStats(data); // Set the stats data
        } else {
          setErrorMessage(data.message || "Something went wrong.");
        }
      } catch (error) {
        setErrorMessage("Error fetching stats.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="mb-4">
        <h2 className="text-lg font-medium">Statistics for this Month</h2>
        <ul className="space-y-2 mt-4">
          <li>Total Earnings: ₹{stats.totalEarnings}</li>
          <li>Total Spent: ₹{stats.totalSpent}</li>
          <li>Total Given: ₹{stats.totalGiven}</li>
          <li>Total Borrowed: ₹{stats.totalBorrowed}</li>
          <li>
            Remaining Balance:{" "}
            <span className={stats.remainingBalance < 0 ? "text-red-500" : "text-green-500"}>
              ₹{stats.remainingBalance}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
