import axios from "axios";
import { useEffect, useState } from "react";

interface VisaStats {
  visaCount: Record<string, number>;
  urgent: {
    red: number;
    yellow: number;
    blue: number;
  };
}

export default function VisaStatsComponent() {
  const [stats, setStats] = useState<VisaStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/employee/visaStats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h3>Visa Counts</h3>
      <ul>
        {Object.entries(stats.visaCount).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>

      <h3>Urgent Visas</h3>
      <ul>
        <li>Red (30 days): {stats.urgent.red}</li>
        <li>Yellow (31-60 days): {stats.urgent.yellow}</li>
        <li>Blue (61-90 days): {stats.urgent.blue}</li>
      </ul>
    </div>
  );
}
