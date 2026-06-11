import React, { useState } from "react";
import { Button, Typography, Card, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from "../../api/axios";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface reload{
  onValueChange: () => void
};

const UploadEmployee = ({onValueChange}:reload) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(e.target.files[0].name);
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
    onValueChange();
    console.log(res.data);
  } catch (err) {
    console.error(err);
    setStatus("Error uploading file.");
  }
};


  return (
    <Card sx={{ maxWidth: 320, p: 2, borderRadius: 2, boxShadow: 2, mt: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Upload Employee Excel
        </Typography>

        <Button
          component="label"
          variant="outlined"
          size="small"
          startIcon={<CloudUploadIcon fontSize="small" />}
        >
          Choose File
          <VisuallyHiddenInput
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleUpload}
          sx={{ ml: 1 }}
        >
          Import
        </Button>

        {status && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            {status}
          </Typography>
        )}
      </CardContent>
    </Card>

  );
};

export default UploadEmployee;

