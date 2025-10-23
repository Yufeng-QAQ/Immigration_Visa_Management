import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b1b1b",
    },
    secondary: {
      main: "#fdb515",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#222222",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "8px 20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1rem",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
           backgroundImage: 'url(/img_src/bar_bkgr.png)',
           backgroundSize: 'auto 1500% !important',
           borderBottom: '3px solid #fdb515',
           boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fdb515",
        },
      },
    }
  },
});

export default theme;
