// components/ui/productivity-card.tsx
import { Award, Flame, Target, TrendingUp, Zap } from 'lucide-react';
import React from 'react';

interface ProductivityData {
    productivity: number;
    target: number;
    status: string;
    remaining: string;
    streak: number;
    longestStreak: number;
    todayCompleted: number;
    todayTotal: number;
    streakStatus?: string;
    nextMilestone?: string;
}

interface ProductivityCardProps {
    data: ProductivityData | null;
}

const ProductivityCard: React.FC<ProductivityCardProps> = ({ data }) => {
    if (!data) return null;

    const percent = `${data.productivity}%`;
    const target = `${data.target}%`;

    // Motivational messages based on productivity level
    const getMotivationalMessage = (percentage: number) => {
        if (percentage >= 90)
            return {
                message: "Outstanding work! You're crushing it! 🚀",
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-100',
            };
        if (percentage >= 75)
            return {
                message: 'Great momentum! Keep it up! 💪',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-100',
            };
        if (percentage >= 60)
            return {
                message: "Good progress! You're on track! 📈",
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                borderColor: 'border-indigo-100',
            };
        if (percentage >= 40)
            return {
                message: 'Keep pushing! You can do this! 🎯',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-100',
            };
        return {
            message: "Every step counts! Let's build momentum! 🌱",
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100',
        };
    };

    // Quick action suggestions
    const getQuickTip = (percentage: number) => {
        if (percentage >= 90) return 'Time for a well-deserved break!';
        if (percentage >= 75) return 'Try tackling a challenging task next';
        if (percentage >= 60) return 'Focus on your top priority';
        if (percentage >= 40) return 'Break large tasks into smaller steps';
        return 'Start with a quick 5-minute task';
    };

    const motivation = getMotivationalMessage(data.productivity);
    const tip = getQuickTip(data.productivity);

    // Get streak data from props instead of mock data
    const currentStreak = data.streak || 0;
    const todayCompleted = data.todayCompleted || 0;
    const todayTotal = data.todayTotal || 0;
    const streakStatus = data.streakStatus || motivation.message;

    // Enhanced streak colors based on actual streak length
    // Replace your getStreakColors function with this:
    const getStreakColors = (streak: number) => {
        // When streak is 0, show gray
        if (streak === 0) {
            return {
                bg: 'bg-gray-50',
                text: 'text-gray-500',
                border: 'border-gray-200',
            };
        }

        // When you have any streak (1+), show orange by default
        if (streak >= 30) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
        if (streak >= 14) return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' };
        if (streak >= 7) return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' };

        // For any streak 1-6, show orange
        return {
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            border: 'border-orange-100',
        };
    };

    const streakColors = getStreakColors(currentStreak);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center">
                        <TrendingUp className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Productivity Level</h4>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{percent}</div>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="mb-6 space-y-3">
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
                    <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">{data.status}</span>
                    <span className="text-xs text-gray-400">{data.remaining}</span>
                </div>
            </div>

            {/* Motivational Message */}
            <div className={`mb-4 rounded-lg ${motivation.bgColor} border p-3 ${motivation.borderColor}`}>
                <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${motivation.color}`} />
                    <span className={`text-sm font-medium ${motivation.color}`}>{motivation.message}</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="mb-4 grid grid-cols-2 gap-3">
                {/* Enhanced Streak Counter */}
                <div className={`rounded-lg ${streakColors.bg} border p-4 ${streakColors.border}`}>
                    <div className="text-center">
                        <div className="mb-2 flex justify-center">
                            <Flame className={`h-5 w-5 ${streakColors.text}`} />
                        </div>
                        <div className={`text-xl font-bold ${streakColors.text} mb-1`}>{currentStreak}</div>
                        <div className={`text-xs font-medium ${streakColors.text}`}>Day Streak</div>
                        {data.longestStreak > currentStreak && <div className="mt-1 text-xs text-gray-400">Best: {data.longestStreak}</div>}
                    </div>
                </div>

                {/* Today's Focus */}
                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                    <div className="text-center">
                        <div className="mb-2 flex justify-center">
                            <Target className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="mb-1 text-xl font-bold text-green-600">
                            {todayCompleted}/{todayTotal}
                        </div>
                        <div className="text-xs font-medium text-green-600">Completed</div>
                    </div>
                </div>
            </div>

            {/* Next Milestone or Quick Tip */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Award className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                        <div className="mb-1 text-sm font-semibold text-gray-700">{data.nextMilestone ? '🎯 Next Milestone' : '💡 Quick Tip'}</div>
                        <div className="text-sm leading-relaxed text-gray-600">{data.nextMilestone || tip}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductivityCard;
