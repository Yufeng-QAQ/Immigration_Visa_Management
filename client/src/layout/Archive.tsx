import { Container } from "@mui/material";



import Display from "../components/Employee/Display";
import TemporaryDrawer from "../components/Employee/Drawer";


export default function ManageEmployee() {


  return (
    <Container>
      <TemporaryDrawer />
      <Display />
    </Container>
  );
}
