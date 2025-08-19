import { PieChart } from '@mui/x-charts/PieChart';

type DonutChartProps = {
    statusCounts: {
        Completed: number;
        Pending: number;
        Overdue: number;
    };
};

const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
};

export default function DonutChart({ statusCounts }: DonutChartProps) {
    const data = [
        { label: 'Completed', value: statusCounts.Completed, color: '#6EE7B7' },
        { label: 'Pending', value: statusCounts.Pending, color: '#FDE68A' },
        { label: 'Overdue', value: statusCounts.Overdue, color: '#FCA5A5' },
    ];

    return (
        <PieChart
            series={[
                {
                    innerRadius: 50,
                    outerRadius: 100,
                    data,
                    arcLabel: 'value',
                },
            ]}
            {...settings}
        />
    );
}
