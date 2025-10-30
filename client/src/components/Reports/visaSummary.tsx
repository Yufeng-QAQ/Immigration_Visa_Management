import api from "../../api/axios";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

interface VisaStats {
  visaCount: Record<string, number>;
  urgent: {
    red: number;
    yellow: number;
    green: number;
  };
}

export default function VisaStatsComponent() {
  const [stats, setStats] = useState<VisaStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/employee/visaStats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <Grid>
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
        <li>Green (61-90 days): {stats.urgent.green}</li>
      </ul>
    </Grid>
  );
}
