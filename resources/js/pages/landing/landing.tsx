import { ArrowRight, BarChart3, CheckCircle, Edit3, PieChart, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EnhancedLanding() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <Zap className="h-8 w-8" />,
            title: 'Lightning Fast',
            description: 'Create and manage tasks instantly with our clean, intuitive interface designed for efficiency',
            delay: '0ms',
        },
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: 'Visual Analytics',
            description: 'Track your progress with beautiful bar charts showing tasks created vs completed over time',
            delay: '200ms',
        },
        {
            icon: <PieChart className="h-8 w-8" />,
            title: 'Priority Insights',
            description: 'Understand your task distribution with pie charts breaking down high, medium, and low priorities',
            delay: '400ms',
        },
        {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Productivity Tracking',
            description: 'Monitor your weekly productivity levels with clear progress indicators and completion rates',
            delay: '600ms',
        },
        {
            icon: <Target className="h-8 w-8" />,
            title: 'Task Status Overview',
            description: 'Visualize your workflow with donut charts showing completed, pending, and overdue tasks',
            delay: '800ms',
        },
        {
            icon: <Edit3 className="h-8 w-8" />,
            title: 'Easy Task Management',
            description: 'Edit, update, and organize your tasks with a powerful table interface and quick actions',
            delay: '1000ms',
        },
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-500/5 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                    }}
                ></div>
                <div
                    className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-blue-500/5 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                    }}
                ></div>
            </div>

            {/* Navigation */}
            <nav className="relative border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-indigo-700">Taskly</h1>
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-100">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                        </div>
                    </div>
                    <div className="hidden items-center space-x-6 md:flex">
                        <a href="#features" className="text-gray-700 transition-colors hover:text-indigo-600">
                            Features
                        </a>
                        <a href="#analytics" className="text-gray-700 transition-colors hover:text-indigo-600">
                            Analytics
                        </a>
                        <button className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center px-6">
                <div className="mx-auto flex min-h-[100vh] max-w-6xl flex-col py-10 text-center">
                    <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="mb-8 text-6xl leading-tight font-black text-gray-900 md:text-8xl">
                            Task Management
                            <span className="mt-4 block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-4xl text-transparent md:text-6xl">
                                With Visual Insights
                            </span>
                        </h1>

                        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
                            Transform your productivity with beautiful charts, comprehensive analytics, and
                            <span className="font-semibold text-indigo-600"> powerful task management</span> features.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <button className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <span className="relative flex items-center">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>

                            <button className="rounded-2xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Dashboard Preview Cards - Positioned Below Text Content */}
                <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
                    {/* Productivity Card */}
                    <div
                        className="animate-float absolute transition-opacity duration-200 hover:opacity-30"
                        style={{
                            left: '5%',
                            top: '65%',
                            animationDelay: '0s',
                            animationDuration: '6s',
                        }}
                    >
                        <div className="w-64 rotate-3 transform rounded-xl border border-indigo-200 bg-white/70 p-3 shadow-lg backdrop-blur-sm transition-transform duration-500">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                                        <TrendingUp className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-800">Productivity</span>
                                </div>
                                <span className="text-lg font-bold text-gray-800">87%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                    style={{ width: '87%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Preview */}
                    <div
                        className="animate-float absolute transition-opacity duration-200 hover:opacity-30"
                        style={{
                            right: '8%',
                            top: '55%',
                            animationDelay: '2s',
                            animationDuration: '7s',
                        }}
                    >
                        <div className="w-56 -rotate-2 transform rounded-xl border border-indigo-200 bg-white/70 p-3 shadow-lg backdrop-blur-sm">
                            <h4 className="mb-2 text-xs font-medium text-gray-600">Task Completion</h4>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Completed</span>
                                    <span className="text-xs text-green-600">24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Pending</span>
                                    <span className="text-xs text-yellow-600">8</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Overdue</span>
                                    <span className="text-xs text-red-600">2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Table Preview */}
                    <div
                        className="animate-float absolute transition-opacity duration-200 hover:opacity-30"
                        style={{
                            left: '50%',
                            top: '70%',
                            transform: 'translateX(-50%)',
                            animationDelay: '4s',
                            animationDuration: '5s',
                        }}
                    >
                        <div className="w-72 rotate-1 transform rounded-xl border border-indigo-200 bg-white/70 p-3 shadow-lg backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Edit3 className="h-3 w-3 text-indigo-600" />
                                <span className="text-xs font-medium text-gray-800">Task Manager</span>
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="mb-1.5 flex items-center gap-2 rounded border-l-2 border-indigo-500 bg-gray-50 p-1.5">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-gray-700">Task {i + 1} - High Priority</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative bg-gradient-to-b from-gray-50 to-white py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div
                        className={`mb-20 transform text-center transition-all delay-300 duration-1000 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        <h2 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
                            Powerful Features for
                            <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Better Productivity
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">Everything you need to stay organized and track your progress</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative transform rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? feature.delay : '0ms',
                                }}
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 transition-transform duration-300 group-hover:scale-110">
                                        <div className="text-white">{feature.icon}</div>
                                    </div>

                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">{feature.title}</h3>

                                    <p className="leading-relaxed text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Analytics Preview Section */}
            <section id="analytics" className="relative bg-white py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-6 text-5xl font-bold text-gray-900">Visualize Your Progress</h2>
                        <p className="text-xl text-gray-600">Track productivity with beautiful charts and comprehensive analytics</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Bar Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Progress Over Time</h4>
                            </div>
                            <div className="space-y-2">
                                {[80, 60, 90, 70].map((height, i) => (
                                    <div key={i} className="flex items-end gap-1">
                                        <div
                                            className="animate-pulse rounded-sm bg-indigo-500"
                                            style={{
                                                width: '20px',
                                                height: `${height / 2}px`,
                                                animationDelay: `${i * 200}ms`,
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pie Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Task Priorities</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-600">High (45%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-gray-600">Medium (35%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600">Low (20%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Donut Chart Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Task Status</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600">Completed (60%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-gray-600">Pending (30%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-600">Overdue (10%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Productivity Level Preview */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                <h4 className="font-semibold text-gray-800">Productivity Level</h4>
                            </div>
                            <div className="mb-2">
                                <div className="text-2xl font-bold text-gray-800">87%</div>
                                <div className="text-sm text-gray-600">This week</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                    style={{ width: '87%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative bg-gradient-to-r from-indigo-50 to-blue-50 py-32">
                <div className="relative mx-auto max-w-4xl px-6 text-center">
                    <div
                        className={`transform transition-all delay-500 duration-1000 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    >
                        <h3 className="mb-8 text-5xl font-bold text-gray-900 md:text-6xl">
                            Ready to Boost Your
                            <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Productivity?</span>
                        </h3>

                        <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
                            Join thousands of professionals who've transformed their workflow with visual task management
                        </p>

                        <div className="flex flex-col justify-center gap-6 sm:flex-row">
                            <button className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <span className="relative flex items-center">
                                    Start Your Journey
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-20px) rotate(-3deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `,
                }}
            />
        </div>
    );
}
