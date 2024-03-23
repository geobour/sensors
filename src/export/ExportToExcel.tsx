import React from 'react';
import FileSaver from 'file-saver';
import Button from "@mui/material/Button";
import * as XLSX from 'xlsx';
import { SensorDto } from '../api/ApiSensor';

interface Props {
    data: SensorDto[];
    fileName: string;
}

const ExportToExcel: React.FC<Props> = ({ data, fileName }) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Button variant="contained" color="primary" onClick={exportToExcel}>
            Export
        </Button>
    );
};

export default ExportToExcel;
