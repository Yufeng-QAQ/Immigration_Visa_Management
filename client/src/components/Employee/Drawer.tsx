import {useState } from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  Button,
  Box,
  Drawer
} from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function TemporaryDrawer() {
    const navigate = useNavigate();
    const menu = [
        { text: 'Homepage', action: () => navigate("/home") },
        { text: 'Manage Employee', action: () => navigate("/manage") },
        { text: 'Archive', action: () => navigate("/archive") },
    ];
    const [open, setOpen] = useState(false);
    const toggleDrawer = (state: boolean) => () => {
        setOpen(state);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button  onClick={toggleDrawer(true)}>
            <img src= "/img_src/menu_icon.png" width = {30}></img>
        </Button>

        <Drawer
            anchor="left" 
            open={open}
            onClose={toggleDrawer(false)} 
        >
            <Box sx={{ width: 250, p: 2 }}>
            <List>
                {menu.map((choice) => (
                <ListItemButton key={choice.text} onClick = {choice.action}>
                    <ListItemText primary={choice.text} />
                </ListItemButton>
                ))}
            </List>
            </Box>
        </Drawer>
        </Box>
    );
}