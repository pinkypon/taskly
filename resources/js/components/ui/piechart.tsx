import { PieChart } from '@mui/x-charts/PieChart';

interface BasicPieProps {
    data: { priority: string; total: number }[];
}

export default function BasicPie({ data }: BasicPieProps) {
    // Map incoming data to chart format
    const chartData = data.map((item, index) => ({
        id: index,
        value: item.total,
        label: item.priority,
        color:
            item.priority === 'Low'
                ? '#6EE7B7' // Green
                : item.priority === 'Medium'
                  ? '#FDE68A' // Yellow
                  : '#A5B4FC', // Indigo
    }));

    return (
        <PieChart
            series={[
                {
                    data: chartData,
                    arcLabel: (item) => `${item.value}`, // ✅ Show number as label
                    arcLabelMinAngle: 20, // Optional: only show if slice is big enough
                    arcLabelRadius: '60%', // Optional: position label
                },
            ]}
            width={200}
            height={200}
        />
    );
}
