import api from "../../api/axios";
import { Grid, Collapse, Button } from "@mui/material";
import { useEffect, useState } from "react";

interface VisaStats {
  visaCount: Record<string, number>;
  deptCount: Record<string, number>;
  counCount: Record<string, number>;
  collCount: Record<string, number>;
}

export default function VisaStatsComponent() {
  const [stats, setStats] = useState<VisaStats | null>(null);
  const [visaOpen, setVisaOpen] = useState(true);
  const [deptOpen, setDeptOpen] = useState(false);
  const [collOpen, setCollOpen] = useState(false);
  const [counOpen, setCounOpen] = useState(false);
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
    <Grid >
      <Button onClick={() => setVisaOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"Visa Type"}
      </Button>
      <Button onClick={() => setDeptOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"Department"}
      </Button>
      <Button onClick={() => setCollOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"College"}
      </Button>
      <Button onClick={() => setCounOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"Country"}
      </Button>
      <Collapse in={visaOpen}>
        <h4 style={{ margin: "4px 0" }}>Visa Type</h4>
        <ul>
          {Object.entries(stats.visaCount).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>
      <Collapse in={deptOpen}>
        <h4 style={{ margin: "4px 0" }}>Department</h4>
        <ul>
          {Object.entries(stats?.deptCount||{}).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>
      <Collapse in={collOpen}>
        <h4 style={{ margin: "4px 0" }}>College</h4>
        <ul>
          {Object.entries(stats?.collCount||{}).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>
      <Collapse in={counOpen}>
        <h4 style={{ margin: "4px 0" }}>Country</h4>
        <ul>
          {Object.entries(stats?.counCount||{}).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>

    </Grid>
  );
}
