import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import api from "../../api/axios";


const UploadEmployee = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!file) {
    setStatus("Please select a file first.");
    return;
  }

  setStatus("Uploading...");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(`/employee/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    setStatus("Upload successful!");
    console.log(res.data);
  } catch (err) {
    console.error(err);
    setStatus("Error uploading file.");
  }
};


  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h6">Upload Employee Excel</Typography>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <br /><br />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Start Import
      </Button>
      <Typography style={{ marginTop: 10 }}>{status}</Typography>
    </div>
  );
};

export default UploadEmployee;

