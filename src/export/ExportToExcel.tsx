import React from 'react';
import * as XLSX from 'xlsx'; // Import all exports as XLSX
import FileSaver from 'file-saver';
import Button from "@mui/material/Button";

interface PredictionData {
    january?: number;
    february?: number;
    march?: number;
    april?: number;
}

interface Props {
    data: PredictionData;
    fileName: string;
}

const ExportToExcel: React.FC<Props> = ({ data, fileName }) => {
    const exportToExcel = () => {
        const { january, february, march, april } = data;

        const worksheetData = [
            ['January', january?.toString()],
            ['February', february?.toString()],
            ['March', march?.toString()],
            ['April', april?.toString()],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Button variant="contained"
                onClick={exportToExcel}
                style={{
                    marginRight: '10px',
                    marginTop: '10px',
                    marginBottom: '20px',
                    backgroundColor: '#FFD700',
                    color: '#55565B',
                }}
        >
            Export
        </Button>
    );
};

export default ExportToExcel;
