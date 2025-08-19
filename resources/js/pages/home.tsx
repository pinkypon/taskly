import { Button } from '@/components/button/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../components/pagination/pagination';
import { useAuth } from '../context/AuthContext';
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

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const { user, loading } = useAuth();
    const [search, setSearch] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
    const selectedTasksArray = tasks.filter((task) => selectedTaskIds.has(task.id));
    const allCompleted = selectedTasksArray.length > 0 && selectedTasksArray.every((task) => task.completed);
    const allActive = selectedTasksArray.length > 0 && selectedTasksArray.every((task) => !task.completed);

    // Form for adding new task
    const [form, setForm] = useState({
        title: '',
        priority: '',
        due_date: '',
        details: '',
    });

    // Form for editing a task
    const [editForm, setEditForm] = useState({
        title: '',
        priority: '',
        due_date: '',
        details: '',
    });

    const [filter, setFilter] = useState<'active' | 'completed'>('active');

    const fetchTasks = async (page = 1, status = filter, searchQuery = search) => {
        try {
            const res = await axios.get('/api/tasks', {
                params: {
                    page,
                    status,
                    search: searchQuery,
                },
            });
            setTasks(res.data.data);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchTasks(currentPage, filter, search);
        }
    }, [loading, user, currentPage, filter, search]);

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = async (taskId: number) => {
        try {
            await axios.put(`/api/tasks/${taskId}`, {
                title: editForm.title,
                description: editForm.details,
                due_date: editForm.due_date,
                priority: editForm.priority,
            });
            setEditingTask(null);
            fetchTasks(currentPage);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/tasks', {
                title: form.title,
                description: form.details,
                due_date: form.due_date,
                priority: form.priority,
            });
            setForm({ title: '', priority: '', due_date: '', details: '' });
            setTasks((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    if (loading || !user) return null;

    const navItems = [
        { label: 'Active', key: 'active', icon: '🟡' },
        { label: 'Completed', key: 'completed', icon: '✅' },
    ];

    const handleTabChange = (key: typeof filter) => {
        setCurrentPage(1);
        setFilter(key);
        setSelectedTaskIds(new Set()); // 🧹 clear row selections when switching tabs
    };

    const toggleTaskSelection = (taskId: number) => {
        setSelectedTaskIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const toggleAllTasks = () => {
        if (selectedTaskIds.size === tasks.length) {
            setSelectedTaskIds(new Set());
        } else {
            setSelectedTaskIds(new Set(tasks.map((task) => task.id)));
        }
    };

    return (
        <HomeLayout>
            <main className="mx-auto mt-10 max-w-5xl p-4">
                <header className="mb-8">
                    <h2 className="mb-2 text-3xl font-bold">Your Tasks</h2>
                    <p className="text-gray-600">Manage and track your daily activities</p>
                </header>

                {/* Add Task Form */}
                <section className="mb-10 rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-xl font-semibold">Add a New Task</h3>
                    <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="rounded border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        />
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleInputChange}
                            className="rounded border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        >
                            <option value="">Select priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <label className="relative block">
                            <span className="pointer-events-none absolute top-2 left-3 text-sm text-gray-400">Select due date</span>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleInputChange}
                                className="w-full rounded border border-gray-300 p-3 pt-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                        </label>

                        <textarea
                            name="details"
                            placeholder="Task details"
                            value={form.details}
                            onChange={handleInputChange}
                            className="rounded border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none md:col-span-2"
                            rows={3}
                        ></textarea>

                        <button type="submit" className="w-full rounded bg-indigo-600 py-3 text-white hover:bg-indigo-700 md:col-span-2">
                            Add Task
                        </button>
                    </form>
                </section>

                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <header className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
                        <p className="text-gray-500">Filter by status: Active or Completed</p>
                    </header>

                    {/* Navigation Tabs */}
                    <div className="mb-6 flex space-x-4 border-b">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleTabChange(item.key as any)}
                                className={`border-b-2 pb-2 text-sm font-medium transition ${
                                    filter === item.key
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-indigo-500'
                                }`}
                            >
                                <span className="mr-1">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {/* Task Table */}
                    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
                        {selectedTaskIds.size > 0 && (
                            <div className="mb-4 flex items-center justify-between rounded bg-indigo-100 px-4 py-2 text-sm text-indigo-800">
                                <span>{selectedTaskIds.size} task(s) selected</span>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">⚙️ Actions</Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {/* ✅ Show "Mark Complete" if all selected are active */}
                                        {allActive && (
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    try {
                                                        await Promise.all(
                                                            selectedTasksArray.map((task) => axios.put(`/api/tasks/${task.id}`, { completed: true })),
                                                        );
                                                        setTasks((prev) =>
                                                            prev.map((t) => (selectedTaskIds.has(t.id) ? { ...t, completed: true } : t)),
                                                        );
                                                        setSelectedTaskIds(new Set());
                                                    } catch (err) {
                                                        console.error('Failed to mark tasks complete:', err);
                                                    }
                                                }}
                                            >
                                                ✅ Mark Selected Complete
                                            </DropdownMenuItem>
                                        )}

                                        {/* 🔄 Show "Set Active" if all selected are completed */}
                                        {allCompleted && (
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    try {
                                                        await Promise.all(
                                                            selectedTasksArray.map((task) =>
                                                                axios.put(`/api/tasks/${task.id}`, { completed: false }),
                                                            ),
                                                        );
                                                        setTasks((prev) =>
                                                            prev.map((t) => (selectedTaskIds.has(t.id) ? { ...t, completed: false } : t)),
                                                        );
                                                        setSelectedTaskIds(new Set());
                                                    } catch (err) {
                                                        console.error('Failed to mark tasks active:', err);
                                                    }
                                                }}
                                            >
                                                🔄 Mark Selected Active
                                            </DropdownMenuItem>
                                        )}

                                        {/* 🗑️ Always show delete */}
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                try {
                                                    await Promise.all(selectedTasksArray.map((task) => axios.delete(`/api/tasks/${task.id}`)));
                                                    setTasks((prev) => prev.filter((t) => !selectedTaskIds.has(t.id)));
                                                    setSelectedTaskIds(new Set());
                                                } catch (err) {
                                                    console.error('Failed to delete selected tasks:', err);
                                                }
                                            }}
                                            className="text-red-600"
                                        >
                                            🗑️ Delete Selected
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        <div className="flex items-center pb-4">
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => {
                                    setCurrentPage(1); // ✅ Reset to page 1 when searching
                                    setSearch(e.target.value);
                                }}
                                className="max-w-sm"
                            />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="group bg-indigo-600 duration-200">
                                    <TableHead className="px-6 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedTaskIds.size === tasks.length && tasks.length > 0}
                                            onChange={toggleAllTasks}
                                        />
                                    </TableHead>
                                    <TableHead className="px-6 py-3">Title</TableHead>
                                    <TableHead className="px-6 py-3">Details</TableHead>
                                    <TableHead className="px-6 py-3">Due</TableHead>
                                    <TableHead className="px-6 py-3">Priority</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                            No tasks found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task) => {
                                        const isOverdue =
                                            task.due_date && !task.completed && differenceInCalendarDays(parseISO(task.due_date), new Date()) < 0;

                                        const isEditing = editingTask?.id === task.id;

                                        return (
                                            <TableRow
                                                key={task.id}
                                                className={`hover:bg-gray-50 ${selectedTaskIds.has(task.id) ? 'bg-indigo-50' : ''}`}
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTaskIds.has(task.id)}
                                                        onChange={() => toggleTaskSelection(task.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>

                                                <TableCell className="px-6 py-4 font-medium text-gray-800">
                                                    {isEditing ? (
                                                        <input
                                                            name="title"
                                                            value={editForm.title}
                                                            onChange={handleEditInputChange}
                                                            className="w-full rounded border border-gray-300 p-2"
                                                        />
                                                    ) : (
                                                        task.title
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-medium text-gray-800">
                                                    {isEditing ? (
                                                        <textarea
                                                            name="details"
                                                            value={editForm.details}
                                                            onChange={handleEditInputChange}
                                                            className="w-full rounded border border-gray-300 p-2"
                                                        />
                                                    ) : (
                                                        task.description
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-gray-500">
                                                    {isEditing ? (
                                                        <label className="relative block">
                                                            <span className="pointer-events-none absolute top-2 left-3 text-sm text-gray-400">
                                                                Select due date
                                                            </span>
                                                            <input
                                                                type="date"
                                                                name="due_date"
                                                                value={editForm.due_date}
                                                                onChange={handleEditInputChange}
                                                                className="w-full rounded border border-gray-300 p-3 pt-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                            />
                                                        </label>
                                                    ) : task.completed ? (
                                                        <span className="font-semibold text-green-600">Completed</span>
                                                    ) : isOverdue ? (
                                                        <span className="font-semibold text-red-600">Overdue</span>
                                                    ) : task.due_date ? (
                                                        (() => {
                                                            const days = differenceInCalendarDays(parseISO(task.due_date), new Date());
                                                            if (days === 0) return 'Due today';
                                                            if (days === 1) return 'Due in 1 day';
                                                            if (days > 1) return `Due in ${days} days`;
                                                            return 'Overdue';
                                                        })()
                                                    ) : (
                                                        'No due date'
                                                    )}
                                                </TableCell>
                                                <TableCell className="relative flex items-center space-x-2 px-6 py-4">
                                                    {isEditing ? (
                                                        <select
                                                            name="priority"
                                                            value={editForm.priority}
                                                            onChange={handleEditInputChange}
                                                            className="rounded border border-gray-300 p-2"
                                                        >
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                task.priority === 'High'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : task.priority === 'Medium'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : 'bg-green-100 text-green-800'
                                                            }`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    )}

                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditSave(task.id)}
                                                                className="text-sm text-green-600 hover:underline"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingTask(null)}
                                                                className="text-sm text-gray-600 hover:underline"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenuId(openMenuId === task.id ? null : task.id);
                                                                }}
                                                                className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                                            >
                                                                ⋯
                                                            </button>

                                                            {openMenuId === task.id && (
                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="absolute top-6 right-0 z-10 w-34 rounded-md border border-gray-200 bg-white shadow-lg"
                                                                >
                                                                    {/* ✏️ Edit */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingTask(task);
                                                                            setEditForm({
                                                                                title: task.title,
                                                                                priority: task.priority,
                                                                                due_date: task.due_date ?? '',
                                                                                details: task.description ?? '',
                                                                            });
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                                                    >
                                                                        ✏️ Edit
                                                                    </button>

                                                                    {/* ✅/🔄 Toggle Complete */}
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                const updated = !task.completed;
                                                                                await axios.put(`/api/tasks/${task.id}`, {
                                                                                    completed: updated,
                                                                                });
                                                                                setTasks((prev) =>
                                                                                    prev.map((t) =>
                                                                                        t.id === task.id ? { ...t, completed: updated } : t,
                                                                                    ),
                                                                                );
                                                                                setOpenMenuId(null);
                                                                            } catch (err) {
                                                                                console.error('Failed to toggle task status:', err);
                                                                            }
                                                                        }}
                                                                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                                                    >
                                                                        {task.completed ? '🔄 Set Active' : '✅ Set Complete'}
                                                                    </button>

                                                                    {/* 🗑️ Delete */}
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                await axios.delete(`/api/tasks/${task.id}`);
                                                                                setTasks((prev) => prev.filter((t) => t.id !== task.id));
                                                                                setOpenMenuId(null);
                                                                            } catch (err) {
                                                                                console.error('Failed to delete task:', err);
                                                                            }
                                                                        }}
                                                                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                                                    >
                                                                        🗑️ Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                        <Pagination className="mt-5 mb-5">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                    />
                                </PaginationItem>

                                {Array.from({ length: lastPage }, (_, i) => {
                                    const page = i + 1;
                                    // show first, last, current, current +/- 1
                                    const shouldRender = page === 1 || page === lastPage || Math.abs(currentPage - page) <= 1;

                                    if (!shouldRender && Math.abs(currentPage - page) === 2) {
                                        return (
                                            <PaginationItem key={`ellipsis-${page}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }

                                    if (!shouldRender) return null;

                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currentPage}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page);
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < lastPage) setCurrentPage(currentPage + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </main>
        </HomeLayout>
    );
}
