import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Button,
  Box,
  Drawer,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ArchiveIcon from '@mui/icons-material/Archive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SummarizeIcon from '@mui/icons-material/Summarize';

export default function TemporaryDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = [
    { text: 'Homepage', action: () => navigate("/home"), path: "/home", icon: HomeIcon },
    { text: 'Manage Employee', action: () => navigate("/manage"), path: "/manage", icon: PeopleIcon },
    { text: 'Archive', action: () => navigate("/archive"), path: "/archive", icon: ArchiveIcon },
    { text: 'Report', action: () => navigate("/report"), path: "/report", icon: SummarizeIcon},
    { text: 'Account', action: () => navigate("/account"), path: "/account", icon: AccountBoxIcon},
  ];

  const [open, setOpen] = useState(false);
  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Button onClick={toggleDrawer(true)}>
        <img src="/img_src/menu_icon.png" width={30} alt="menu" />
      </Button>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {menu.map((choice) => {
              const isActive = location.pathname === choice.path;
              const Icon = choice.icon;

              return (
                <ListItemButton
                  key={choice.text}
                  onClick={choice.action}
                  sx={{
                    backgroundColor: isActive ? "#555555" : "transparent",
                    "&:hover": {
                      backgroundColor: isActive ? "#555555" : "#2e2e2eff",
                    },
                  }}
                >
                  {Icon && (
                    <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                      <Icon />
                    </ListItemIcon>
                  )}

                  <ListItemText primary={choice.text} sx={{ color: "white" }} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
