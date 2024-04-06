import React from 'react';
import * as FileSaver from 'file-saver';
import Button from "@mui/material/Button";
import * as XLSX from 'xlsx';
import { SensorRecordDto } from '../api/ApiSensor';

interface Props {
    data: SensorRecordDto[];
    fileName: string;
}

const ExportToExcel: React.FC<Props> = ({ data, fileName }) => {
    const exportToExcel = () => {
        const worksheetData = data.map(record => [
            record.id.toString(),
            record.temperature !== undefined ? record.temperature.toString() : '',
            record.time.toString()
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([['ID', 'Temperature', 'Time'], ...worksheetData]);
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
