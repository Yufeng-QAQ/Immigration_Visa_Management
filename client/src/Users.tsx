import { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Container,
  Typography,
} from "@mui/material";
import CategorySelect from "./Select";


export default function Users() {
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Get User
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users/getUsers");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const addUser = async () => {
    if (!name) return;
    await axios.post("http://localhost:8000/api/users/createUser", { name, email });
    console.log("Trigger");
    
    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <Container>
      <CategorySelect></CategorySelect>
      <Typography variant="h4" gutterBottom>
        用户列表
      </Typography>

      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>

      <TextField
        label="用户名"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mr: 2 }}
      />
      <TextField
        label="邮件"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          mr: 2,
        }}
      />
      <Button variant="contained" onClick={addUser}>
        添加用户
      </Button>
      
    </Container>
  );
}
