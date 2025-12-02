import { 
    Box, 
    Grid,
} from "@mui/material";
import TemporaryDrawer from "../components/Employee/Sidebar";
import VisaStatsComponent from "../components/Reports/visaSummary";



export default function Report() {
    return (
    <Grid container spacing={2} p={3}>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
        <Box>
            <VisaStatsComponent />
        </Box>
    </Grid>
    );
}

