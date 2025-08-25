<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Task;
use Carbon\Carbon;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
               'current_streak',
        'longest_streak',
        'last_activity_date',
        'streak_updated_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
                    'last_activity_date' => 'date',
        'streak_updated_at' => 'datetime',
        ];
    }
    public function updateStreak()
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // If already updated today, don't update again
        if ($this->streak_updated_at && $this->streak_updated_at->isSameDay($today)) {
            return $this->current_streak;
        }

        // Check last activity date
        if ($this->last_activity_date) {
            $lastActivityDate = Carbon::parse($this->last_activity_date);

            // If last activity was yesterday, increment streak
            if ($lastActivityDate->isSameDay($yesterday)) {
                $this->current_streak += 1;
            }
            // If last activity was today, this is first activity of day but already counted
            elseif ($lastActivityDate->isSameDay($today)) {
                // Don't change streak - already active today
                // This case shouldn't happen due to streak_updated_at check above
            }
            // If gap is more than 1 day, reset streak to 1 (starting fresh)
            elseif ($lastActivityDate->lt($yesterday)) {
                $this->current_streak = 1; // Start fresh
            }
        } else {
            // First ever activity - start streak
            $this->current_streak = 1;
        }

        // Update longest streak if current is higher
        if ($this->current_streak > ($this->longest_streak ?? 0)) {
            $this->longest_streak = $this->current_streak;
        }

        // Update tracking fields
        $this->last_activity_date = $today->toDateString();
        $this->streak_updated_at = now();
        $this->save();

        return $this->current_streak;
    }

    /**
     * Check if streak should be broken (for users who didn't complete tasks yesterday)
     */
    public function checkStreakBreak()
    {
        $yesterday = Carbon::yesterday();

        if ($this->last_activity_date) {
            $lastActivityDate = Carbon::parse($this->last_activity_date);

            // If user didn't complete any task yesterday and day before, break streak
            if ($lastActivityDate->lt($yesterday)) {
                $this->current_streak = 0;
                $this->save();
            }
        }
    }

    /**
     * Get streak status message
     */
    public function getStreakStatusAttribute()
    {
        if ($this->current_streak >= 30) {
            return 'Streak Master! 🔥';
        }
        if ($this->current_streak >= 14) {
            return 'On Fire! 🚀';
        }
        if ($this->current_streak >= 7) {
            return 'Great Momentum! 💪';
        }
        if ($this->current_streak >= 3) {
            return 'Building Up! 📈';
        }
        if ($this->current_streak >= 1) {
            return 'Getting Started! 🌱';
        }
        return 'Start Your Streak! ✨';
    }

    /**
     * Get next milestone
     */
    public function getNextMilestoneAttribute()
    {
        $milestones = [3, 7, 14, 30, 50, 100];

        foreach ($milestones as $milestone) {
            if ($this->current_streak < $milestone) {
                $remaining = $milestone - $this->current_streak;
                return "{$remaining} days to {$milestone}-day milestone";
            }
        }

        return "Keep the streak alive!";
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
