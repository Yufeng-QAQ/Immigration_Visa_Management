import { 
    Box, 
    Container,
} from "@mui/material";
import TemporaryDrawer from "../components/Employee/Sidebar";
import VisaStatsComponent from "../components/Reports/visaSummary";



export default function Report() {
    return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
        <Box>
            <VisaStatsComponent />
        </Box>
        </Container>
    </Box>
    );
}

