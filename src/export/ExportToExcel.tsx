import React from 'react';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Button, { ButtonProps } from "@mui/material/Button";

interface PredictionData {
    january?: number;
    february?: number;
    march?: number;
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
}

interface Props {
    data: PredictionData;
    fileName: string;
    buttonProps?: ButtonProps; // optional extra props for the button
}

const ExportToExcel: React.FC<Props> = ({ data, fileName, buttonProps }) => {
    const exportToExcel = () => {
        const {
            january, february, march, april,
            may, june, july, august,
            september, october, november, december
        } = data;

        const worksheetData = [
            ['Month', 'Value'],
            ['January', january?.toString()],
            ['February', february?.toString()],
            ['March', march?.toString()],
            ['April', april?.toString()],
            ['May', may?.toString()],
            ['June', june?.toString()],
            ['July', july?.toString()],
            ['August', august?.toString()],
            ['September', september?.toString()],
            ['October', october?.toString()],
            ['November', november?.toString()],
            ['December', december?.toString()],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Button
            variant="contained"
            onClick={exportToExcel}
            {...buttonProps}
        >
            Export Csv
        </Button>
    );
};

export default ExportToExcel;
