
const lineChartData: number[] = [5, 6, 8, 10, 10, 11, 12, 13, 14, 15, 16, 13, 12, 12, 11, 10, 10, 9, 8, 7, 7, 6, 4, 5, 7, 9];
const lineChartLabels: string[] = ['00:00', '01:00', '02:00', '03:00', '00:04', '05:00', '06:00', '07:00', '08:00',
    '09:00', '10:00', '11:00', '12:00', '13:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'];

const barChartData = [5, 7, 11, 14, 19, 25, 28, 32,25,19,12,10];
const barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October', 'November','December'];

interface ExportData {
    id: string;
    data: string[];
}

const exportData: ExportData[] = [
    { id: "1", data: ["23", "26"] },
    // Add more data objects as needed
];




export { lineChartData, lineChartLabels, barChartData, barChartLabels,exportData };
