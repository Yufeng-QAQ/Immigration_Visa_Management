import { Card, Grid, Box, Typography } from "@mui/material";

interface VisaComment {
  content: string;
  date: string | Date;
}

interface CommentType {
  _id?: string;         
  record: string;        
  content: string;       
  date: string;          
}

interface HistoryVisa {
  visaId: string;
  visaType: string;
  status: string;
  comments: CommentType[];
}

interface VisaHistoryInfoProps {
  historyVisaComments: HistoryVisa[];
}

export const VisaHistoryInfo: React.FC<VisaHistoryInfoProps> = ({ historyVisaComments }) => {
  return (
    <Card elevation={2} sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
        <Grid size={{ xs: 18 }}>
          {historyVisaComments.map((h, idx) => (
            <Box key={idx} sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {h.visaType} {h.status ? `(${h.status})` : ""}
              </Typography>

              {(h.comments || []).map((c, cidx) => (
                <Box
                  key={cidx}
                  sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
                >
                  <Typography variant="body2">{c.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(c.date).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};