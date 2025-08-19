import BarChart from '@/components/ui/barchart';
import { DataTableDemo, type DataTableDemoHandle } from '@/components/ui/data-table';
import DonutChart from '@/components/ui/donut-chart';
import Header from '@/components/ui/nav-header';
import BasicPie from '@/components/ui/piechart';
import { Check, X as CloseIcon, RotateCcw, Trash2 } from 'lucide-react'; // example using lucide icons
import React, { useEffect, useRef, useState } from 'react';
import HomeLayout from '../layouts/home-layout';
import axios from '../lib/axios';

interface Task {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
}

interface ProductivityData {
    productivity: number;
    target: number;
    status: string;
    remaining: string;
}

const Toast = ({
    message,
    type,
    onClose,
    iconType = 'default',
}: {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    iconType?: 'default' | 'check' | 'undo' | 'delete';
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-indigo-500' : 'bg-red-500';

    const icon = (() => {
        if (iconType === 'delete') return <Trash2 className="h-5 w-5" />;
        if (iconType === 'undo') return <RotateCcw className="h-5 w-5" />;
        if (iconType === 'check') return <Check className="h-5 w-5" />;
        // default behaviour based on success/error:
        return type === 'success' ? <Check className="h-5 w-5" /> : <CloseIcon className="h-5 w-5" />;
    })();

    return (
        <div className="fixed top-4 right-4 z-50 duration-300 animate-in fade-in slide-in-from-top-2">
            <div className={`${bgColor} flex max-w-sm items-center gap-3 rounded-lg px-6 py-4 text-white shadow-lg`}>
                <div className="flex-shrink-0">{icon}</div>
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="ml-auto flex-shrink-0 text-white/80 transition-colors hover:text-white">
                    <CloseIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    const [data, setData] = useState<ProductivityData | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const tableRef = useRef<DataTableDemoHandle>(null);
    const [submitting, setSubmitting] = useState(false);
    // Form for adding new task
    const [form, setForm] = useState({
        title: '',
        priority: '',
        due_date: '',
        details: '',
    });

    // donut chart data
    const [statusCounts, setStatusCounts] = useState({
        Completed: 0,
        Pending: 0,
        Overdue: 0,
    });

    //toast messages
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
        iconType?: 'default' | 'check' | 'undo' | 'delete'; // 👈 add this
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const showToast = (message: string, type: 'success' | 'error', iconType?: 'default' | 'check' | 'undo' | 'delete') => {
        setToast({ show: true, message, type, iconType });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    // pie chart data
    const [priorityCounts, setPriorityCounts] = useState<{ priority: string; total: number }[]>([]);

    // bar chart data
    const [barData, setBarData] = useState<{ month: string; created: number; completed: number }[]>([]);

    const fetchBarChartData = async () => {
        try {
            const { data } = await axios.get('/api/tasks/bar-chart');
            setBarData(data);
        } catch (err) {
            console.error('Failed to fetch bar chart data:', err);
        }
    };

    //donut chart data fetch
    const fetchStatusCounts = async () => {
        try {
            const { data } = await axios.get('/api/tasks/status-counts');
            setStatusCounts(data);
        } catch (err) {
            console.error('Failed to fetch status counts:', err);
        }
    };

    // pie chart data fetch
    const fetchPriorityCounts = async () => {
        try {
            const { data } = await axios.get('/api/tasks/priority-counts');
            setPriorityCounts(data);
        } catch (err) {
            console.error('Failed to fetch priority counts:', err);
        }
    };

    // productivity card
    const fetchProductivity = async () => {
        try {
            const res = await axios.get('/api/tasks/productivity');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const percent = `${data?.productivity}%`;
    const target = `${data?.target}%`;

    useEffect(() => {
        axios
            .get('/api/tasks/status-counts')
            .then((res) => setStatusCounts(res.data))
            .catch((err) => console.error('Failed to fetch status counts:', err));
    }, []);

    // fetch all
    useEffect(() => {
        fetchStatusCounts();
        fetchPriorityCounts();
        fetchBarChartData();
        fetchProductivity();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return; // prevent double submit

        setSubmitting(true);

        try {
            const res = await axios.post('/api/tasks', {
                title: form.title,
                description: form.details,
                due_date: form.due_date,
                priority: form.priority,
            });

            showToast(`Task "${form.title}" created successfully!`, 'success');

            setForm({ title: '', priority: '', due_date: '', details: '' });

            tableRef.current?.refreshData();
        } catch (err) {
            console.error('Failed to add task:', err);
            showToast('Failed to create task. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <HomeLayout>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                    iconType={toast.iconType} // 👈 ADD THIS
                />
            )}
            <main className="animate-fade-in-up mx-auto mt-10 max-w-6xl px-4">
                {/* Page Header */}
                <div className="mb-5">
                    <div className="flex items-center gap-x-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                        </span>
                        <Header className="inline-block rounded-lg p-2">Your Tasks</Header>
                    </div>
                    <p className="mt-1 text-gray-600">Manage and track your daily activities efficiently.</p>
                </div>

                {/* Add Task Section */}
                <section className="mb-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">Add a New Task</h3>
                    <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        {/* Task Title */}
                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        />

                        {/* Priority */}
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        >
                            <option value="">Select priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        {/* Due Date */}
                        <label className="relative block">
                            <span className="pointer-events-none absolute top-2 left-3 text-sm text-gray-400">Select due date</span>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 p-3 pt-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                        </label>

                        {/* Details */}
                        <textarea
                            name="details"
                            placeholder="Task details"
                            value={form.details}
                            onChange={handleInputChange}
                            className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none md:col-span-2"
                            rows={3}
                        ></textarea>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full rounded-lg py-3 font-medium text-white transition md:col-span-2 ${
                                submitting ? 'cursor-not-allowed bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {submitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </form>
                </section>

                {/* Analytics Section */}
                <section className="mb-12">
                    <div className="mb-5">
                        <div className="flex items-center gap-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                            </span>
                            <Header className="inline-block rounded-lg p-2">Task Analytics</Header>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Productivity Card*/}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Productivity</h4>
                                        <p className="text-xs text-gray-500">This week</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-800">{percent}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Progress</span>
                                    <span>Target: {target}</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                                        style={{ width: percent }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">{data?.status}</span>
                                    <span className="text-xs text-gray-400">{data?.remaining}</span>
                                </div>
                            </div>
                        </div>
                        {/* Donut Chart */}
                        <div
                            id="task-chart"
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <h4 className="mb-2 text-sm font-medium text-gray-600">Task Completion Rate</h4>
                            <DonutChart statusCounts={statusCounts} />
                        </div>
                        {/* Pie Chart */}
                        <div
                            id="task-chart"
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:col-span-2 lg:col-span-1"
                        >
                            <h4 className="mb-2 text-sm font-medium text-gray-600">Tasks by Priority</h4>
                            <BasicPie data={priorityCounts} />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div
                        id="task-chart"
                        className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <h4 className="mb-2 text-sm font-medium text-gray-600">Tasks Over Time</h4>
                        {/* Remove the h-[300px] wrapper div */}
                        <BarChart dataset={barData} />
                    </div>
                </section>

                {/* Task Table */}
                <div className="mb-5">
                    <div className="flex items-center gap-x-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-700"></span>
                        </span>
                        <Header className="inline-block rounded-lg p-2">Task Table</Header>
                    </div>
                </div>
                <div className="mx-auto mb-12 max-w-6xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <DataTableDemo
                        ref={tableRef}
                        onTaskStatusChange={() => {
                            fetchStatusCounts();
                            fetchPriorityCounts();
                            fetchBarChartData();
                            fetchProductivity();
                        }}
                        showToast={showToast}
                    />
                </div>
            </main>
        </HomeLayout>
    );
}
