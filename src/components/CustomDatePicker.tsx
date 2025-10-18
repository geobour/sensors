import React from "react";
import { TextField } from "@mui/material";

// @ts-ignore
const CustomDatePicker = ({ label, value, onChange }) => {
    return (
        <TextField
            type="date"
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputLabelProps={{ shrink: true }} // Keep label visible
            size="small"
            fullWidth
        />
    );
};

export default CustomDatePicker;
