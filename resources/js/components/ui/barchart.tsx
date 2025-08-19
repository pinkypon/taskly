// Updated barchart.tsx
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

export function valueFormatter(value: number | null) {
    return `${value} tasks`;
}

interface BarsDatasetProps {
    dataset: { month: string; created: number; completed: number }[];
}

export default function BarsDataset({ dataset }: BarsDatasetProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Mobile: Show as card list
    if (isMobile) {
        const maxValue = Math.max(...dataset.map((d) => Math.max(d.created, d.completed)));

        return (
            <div className="h-[300px] space-y-3 overflow-y-auto pr-2">
                {dataset.map((item, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="font-medium text-gray-800">{item.month}</span>
                            <div className="flex gap-3 text-xs">
                                <span className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                                    {item.created}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    {item.completed}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Created tasks bar */}
                            <div className="flex items-center gap-2">
                                <span className="w-16 text-xs text-indigo-600">Created</span>
                                <div className="h-2 flex-1 rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-indigo-400 transition-all duration-700"
                                        style={{ width: `${(item.created / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="w-8 text-xs font-medium text-indigo-600">{item.created}</span>
                            </div>

                            {/* Completed tasks bar */}
                            <div className="flex items-center gap-2">
                                <span className="w-16 text-xs text-green-600">Done</span>
                                <div className="h-2 flex-1 rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-green-400 transition-all duration-700"
                                        style={{ width: `${(item.completed / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="w-8 text-xs font-medium text-green-600">{item.completed}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Desktop: Regular bar chart
    return (
        <BarChart
            dataset={dataset}
            xAxis={[{ dataKey: 'month' }]}
            series={[
                {
                    dataKey: 'created',
                    label: 'Tasks Created',
                    color: '#A5B4FC',
                    stack: 'a',
                    valueFormatter,
                },
                {
                    dataKey: 'completed',
                    label: 'Tasks Completed',
                    color: '#6EE7B7',
                    stack: 'a',
                    valueFormatter,
                },
            ]}
            height={300}
        />
    );
}
