import api from "../../api/axios";
import { Grid, Collapse, Button } from "@mui/material";
import { useEffect, useState } from "react";
import type { EmployeeItem } from "../../api";

interface VisaStats {
  visaCount: Record<string, number>;
  deptCount: Record<string, number>;
  counCount: Record<string, number>;
  collCount: Record<string, number>;
  degrCount: Record<string, number>;
  statCount: Record<string, number>;
}

interface employeeFound {
  searchResult: EmployeeItem[];
  fromDate? : Date | null;
  toDate? : Date | null;
}

export default function VisaStatsDisplay({searchResult, fromDate, toDate}:employeeFound) {
  const [stats, setStats] = useState<VisaStats | null>(null);
  const [visaOpen, setVisaOpen] = useState(true);
  const [deptOpen, setDeptOpen] = useState(false);
  const [collOpen, setCollOpen] = useState(false);
  const [counOpen, setCounOpen] = useState(false);
  const [degrOpen, setDegrOpen] = useState(false);
  const [statOpen, setStatOpen] = useState(false);
  useEffect(() => {
    console.log(fromDate);
    console.log(toDate);
    const result : VisaStats ={
        visaCount: {},
        deptCount: {},
        counCount: {},
        collCount: {},
        degrCount: {},
        statCount: {"Expired":0, "Issued" :0},
    };
    const employees = searchResult;
    const departments = employees.map(emp => emp.departmentInfo.department).filter(Boolean);
    departments.forEach( dept => {
        result.deptCount[dept] = (result.deptCount[dept] || 0) + 1;
    });
    const colleges = employees.map(emp => emp.departmentInfo.college).filter(Boolean);
    colleges.forEach( coll => {
        result.collCount[coll] = (result.collCount[coll] || 0) + 1;
    });
    const countries = employees.map(emp => emp.countryOfBirth).filter(Boolean);
    countries.forEach( coun => {
        result.counCount[coun] = (result.counCount[coun] || 0) + 1;
    });
    const degrees = employees.map(emp => emp.highestDegree).filter(Boolean);
    degrees.forEach( degr => {
        result.degrCount[degr] = (result.degrCount[degr] || 0) + 1;
    });
    const visaList = employees.map(emp => emp.visaHistory).filter(Boolean);
    const visaTypes = visaList.map(emp => emp[0].visaType);
    visaTypes.forEach( visa => {
        result.visaCount[visa] = (result.visaCount[visa] || 0) + 1;
    });
    const visaExpire = visaList.map(emp => emp[0].expireDate);

    const inRange = (date: Date, from?: Date | null, to?: Date | null) => {
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    };

    visaExpire.forEach(visa => {
      if(!visa) return;
      const date = new Date(visa);
      if (inRange(date, fromDate, toDate)) {
        result.statCount["Expired"]++;
      }
    });
    
    const visaIssued = visaList.map(emp => emp[0].issueDate);
    visaIssued.forEach(visa => {
      if(!visa) return;
      const date = new Date(visa);
      if (inRange(date, fromDate, toDate)) {
        result.statCount["Issued"]++;
      }
    });

    setStats(result);


  }, [searchResult]);

  if (!stats) return <div>Loading...</div>;

  return (
    <Grid sx={{m:2}}>
      <Button onClick={() => setStatOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"Issue Type"}
      </Button>
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
      <Button onClick={() => setDegrOpen((prev) => !prev)} size="small" 
        sx={{backgroundColor: "white", border: "1px solid grey", mr: 1, m:{md: 0.5}}}>
        {"Degree"}
      </Button>
      <Collapse in={statOpen}>
        <h4 style={{ margin: "4px 0" }}>Issue Type</h4>
        <ul>
          {Object.entries(stats.statCount).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>
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
    <Collapse in={degrOpen}>
        <h4 style={{ margin: "4px 0" }}>Degree</h4>
        <ul>
          {Object.entries(stats?.degrCount||{}).map(([type, count]) => (
            <li key={type}>{type} : {count}</li>
          ))}
        </ul>
      </Collapse>

    </Grid>
  );
}