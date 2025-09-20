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

interface VisaRecord {
  type: string;
  addedAt: Date;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  layer1?: string;
  layer2?: string;
  visa: VisaRecord[];
}
export default function Employee() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [layer1, setLayer1] = useState<string>("");
  const [layer2, setLayer2] = useState<string>("");

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  const showEmployee = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/employee/getEmployee");
    setEmployeeList(res.data); 
  } catch (err) {
    console.error("获取员工失败:", err);
  }
  };

  //筛选出拥有h1签证的员工Array
  const h1Employees = employeeList.filter(emp => {
    if (emp.visa.length === 0) return false;
        const lastVisa = emp.visa[emp.visa.length - 1];
        return lastVisa.type.toLowerCase() === "h1"; // 不区分大小写
  });


  useEffect (() => {
    showEmployee();
  }, [])


  // 初始化签证数组，默认一个输入框
  const [visa, setVisa] = useState<VisaRecord[]>([
    { type: "", addedAt: new Date() }
  ]);

  // 修改某个签证的值
  const handleVisaChange = (index: number, value: string) => {
    setVisa((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, type: value, addedAt: new Date() } : v
      )
    );
  };

  // 增加一个输入框
  const addVisaField = () => {
    setVisa((prev) => [...prev, { type: "", addedAt: new Date() }]);
  };

  // 删除一个输入框
  const removeVisaField = (index: number) => {
    setVisa((prev) => prev.filter((_, i) => i !== index));
  };

  // 提交
  const addEmployee = async () => {
    try {
      await axios.post("http://localhost:8000/api/employee/createEmployee", {
        firstName,
        lastName,
        email,
        layer1,
        layer2,
        visa: visa.filter((v) => v.type.trim() !== "") // 过滤掉空的
      });

      console.log("员工添加成功");
      await showEmployee();

      // 清空
      setFirstName("");
      setLastName("");
      setEmail("");
      setLayer1("");
      setLayer2("");
      setVisa([{ type: "", addedAt: new Date() }]);
    } catch (err) {
      console.error("添加员工失败:", err);
    }
  };

  return (
    <Container>
      <TextField
        label="FirstName"
        variant="outlined"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        sx={{ mr: 2 }}
      />

      <TextField
        label="LastName"
        variant="outlined"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        sx={{ mr: 2 }}
      />

      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mr: 2 }}
      />

      <TextField
        label="Layer1"
        variant="outlined"
        value={layer1}
        onChange={(e) => setLayer1(e.target.value)}
        sx={{ mr: 2 }}
      />

      <TextField
        label="Layer2"
        variant="outlined"
        value={layer2}
        onChange={(e) => setLayer2(e.target.value)}
        sx={{ mr: 2 }}
      />



      <div style={{ marginTop: 16 }}>
        {visa.map((v, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <TextField
              label={`Visa ${index + 1}`}
              variant="outlined"
              value={v.type}
              onChange={(e) => handleVisaChange(index, e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeVisaField(index)}
            >
              删除
            </Button>
          </div>
        ))}
        <Button variant="outlined" onClick={addVisaField}>
          添加签证输入框
        </Button>
      </div>

      <Button variant="contained" onClick={addEmployee} sx={{ mt: 2 }}>
        添加员工
      </Button>

        {/*显示数据库中的员工*/}
      <List>
          {employeeList.map((employee) => (
          <ListItem key={employee._id} sx={{ mb: 1, border: "1px solid #ccc", borderRadius: 1, p: 1 }}>
            <ListItemText
              primary={
                <div>
                  <div>
                    姓名: {employee.firstName} {employee.lastName}
                  </div>
                  <div>Email: {employee.email}</div>
                      {employee.layer1 && <div>Layer1: {employee.layer1}</div>}
                      {employee.layer2 && <div>Layer2: {employee.layer2}</div>}
                      {employee.visa.length > 0 && (
                  <div>
                Visa: {employee.visa.map((v) => v.type).join(", ")}
              </div>
            )}
                </div>
        }
      />
          </ListItem>
      ))}
      </List>

    {/*筛选出拥有H1签证的人数量和名字 */}
    <Typography variant="h6">
    H1签证员工数量: {h1Employees.length}
    </Typography>

    <List>
    {h1Employees.map((emp) => (
    <ListItem key={emp._id}>
      <ListItemText
        primary={`${emp.firstName} ${emp.lastName}`}
        secondary={`Email: ${emp.email}, Layer1: ${emp.layer1 || "-"}, Layer2: ${emp.layer2 || "-"}`}
      />
    </ListItem>
    ))}
    </List>

    </Container>
  );
}
