import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

const CategorySelect: React.FC = () => {
  const [category, setCategory] = useState("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="category-label">种类</InputLabel>
      <Select
        labelId="category-label"
        value={category}
        onChange={handleChange}
        label="种类"
      >
        <MenuItem value="fruit">水果</MenuItem>
        <MenuItem value="vegetable">蔬菜</MenuItem>
        <MenuItem value="meat">肉类</MenuItem>
        <MenuItem value="drink">饮料</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
