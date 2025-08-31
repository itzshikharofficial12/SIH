// Mock Data (IST Timezone)
const mockData = {
    student: {
        id: "stu_1029",
        name: "Aarav Sharma",
        level: 5,
        xp: 3420,
        xpToNextLevel: 3800,
        attendancePct: 92,
        quizAverage: 86,
        assignmentsCompletedPct: 78,
        streakDays: 6
    },
    performance: {
        last7Days: [
            {"date": "2025-08-25", "xp": 120, "tasks": 3},
            {"date": "2025-08-26", "xp": 80, "tasks": 2},
            {"date": "2025-08-27", "xp": 150, "tasks": 4},
            {"date": "2025-08-28", "xp": 60, "tasks": 1},
            {"date": "2025-08-29", "xp": 200, "tasks": 5},
            {"date": "2025-08-30", "xp": 90, "tasks": 2},
            {"date": "2025-08-31", "xp": 140, "tasks": 3}
        ]
    },
    todaySchedule: [
        {"id": "ev1", "type": "lecture", "title": "Math: Calculus II", "start": "2025-08-31T09:30:00+05:30", "end": "2025-08-31T10:30:00+05:30", "joinUrl": "#"},
        {"id": "ev2", "type": "quiz", "title": "Physics — Kinematics (10 Qs)", "start": "2025-08-31T11:00:00+05:30", "end": "2025-08-31T11:20:00+05:30", "startUrl": "#"},
        {"id": "ev3", "type": "assignment", "title": "CS: DSA Worksheet #3 (Deadline)", "start": "2025-08-31T17:00:00+05:30", "end": "2025-08-31T17:00:00+05:30", "openUrl": "#"},
        {"id": "ev4", "type": "study", "title": "Self-Study: English Essay Draft", "start": "2025-08-31T19:30:00+05:30", "end": "2025-08-31T20:30:00+05:30"}
    ]
};

// Daily quotes array
const dailyQuotes = [
    {
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
    },
    {
        quote: "Success is not how high you have climbed, but how you make a positive difference to the world.",
        author: "Roy T. Bennett"
    },
    {
        quote: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        quote: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        quote: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    }
];

// Function to get daily quote based on date
function getDailyQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % dailyQuotes.length;
    return dailyQuotes[quoteIndex];
}

// Function to update daily quote
function updateDailyQuote() {
    const quoteData = getDailyQuote();
    const quoteElement = document.getElementById('dailyQuote');
    const authorElement = document.querySelector('.quote-author');
    
    if (quoteElement && authorElement) {
        quoteElement.textContent = `"${quoteData.quote}"`;
        authorElement.textContent = `— ${quoteData.author}`;
    }
}

// Function to update streak data dynamically
function updateStreakData() {
    const studentData = JSON.parse(localStorage.getItem('eduverse_student'));
    const streakData = {
        currentStreak: 6,
        rank: 3,
        topStreaker: { name: "Isha", streak: 10 },
        classSize: 25,
        nextMilestone: 10,
        xpBonus: 50
    };
    
    // Update streak count
    const streakCount = document.querySelector('.streak-count-large');
    if (streakCount) {
        streakCount.textContent = streakData.currentStreak;
    }
    
    // Update rank badge
    const rankBadge = document.querySelector('.streak-rank-badge');
    if (rankBadge) {
        rankBadge.textContent = `#${streakData.rank} in Class`;
    }
    
    // Update comparison bars
    const myBar = document.querySelector('.my-bar');
    const topBar = document.querySelector('.top-bar');
    if (myBar && topBar) {
        const myPercentage = (streakData.currentStreak / streakData.topStreaker.streak) * 100;
        myBar.style.width = `${myPercentage}%`;
        myBar.querySelector('span').textContent = `You: ${streakData.currentStreak}`;
        topBar.querySelector('span').textContent = `${streakData.topStreaker.name}: ${streakData.topStreaker.streak}`;
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        const daysToGo = streakData.topStreaker.streak - streakData.currentStreak;
        if (daysToGo > 0) {
            progressText.textContent = `${daysToGo} more days to beat ${streakData.topStreaker.name}!`;
        } else {
            progressText.textContent = "You're the top streaker! 🏆";
        }
    }
    
    // Update XP bonus
    const xpBonus = document.querySelector('.xp-bonus');
    if (xpBonus) {
        xpBonus.textContent = `+${streakData.xpBonus} XP bonus at ${streakData.nextMilestone} days`;
    }
    
    // Update progress bar
    const streakFill = document.querySelector('.streak-fill-enhanced');
    if (streakFill) {
        const progressPercentage = (streakData.currentStreak / streakData.nextMilestone) * 100;
        streakFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    initializeChart();
    initializeTimeline();
    initializeInteractions();
    updateTimeBasedElements();
    updateDailyQuote();
    updateStreakData();
    
    // Update every minute for real-time features
    setInterval(updateTimeBasedElements, 60000);
    
    // Update quote at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        updateDailyQuote();
        // Set interval for daily updates
        setInterval(updateDailyQuote, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
});

// Load Student Data
function loadStudentData() {
    const studentData = JSON.parse(localStorage.getItem('eduverse_student'));
    
    if (studentData) {
        // Update avatar name in navigation
        const avatarName = document.getElementById('studentName');
        if (avatarName) {
            avatarName.textContent = studentData.firstName;
        }
        
        // Update avatar alt text
        const avatar = document.getElementById('studentAvatar');
        if (avatar) {
            avatar.alt = studentData.fullName;
        }
        
        // Update leaderboard name
        const leaderboardName = document.getElementById('leaderboardName');
        if (leaderboardName) {
            leaderboardName.textContent = `${studentData.firstName} (You)`;
        }
        
        // Update welcome message or any other personalized elements
        updatePersonalizedContent(studentData);
    } else {
        // Use default mock data if no signup data exists
        console.log('Using default student data');
    }
}

// Update Personalized Content
function updatePersonalizedContent(studentData) {
    // Update leaderboard to show actual student name
    const currentUserItem = document.querySelector('.leaderboard-item.current-user .user-name');
    if (currentUserItem) {
        currentUserItem.textContent = `${studentData.firstName} (You)`;
    }
    
    // Update avatar alt text
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.alt = studentData.fullName;
    }
    
    // Update any XP or level data if it's a new user
    if (studentData.level === 1 && studentData.xp === 0) {
        updateNewUserStats();
    }
}

function updateNewUserStats() {
    // Update XP card for new users
    const xpValue = document.querySelector('.xp-icon').closest('.overview-card').querySelector('.card-value');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (xpValue) {
        xpValue.textContent = '0';
        progressFill.style.width = '0%';
        progressText.textContent = '100 XP to Level 2';
    }
    
    // Update other stats for new users
    const assignmentCard = document.querySelector('.assignments-icon').closest('.overview-card').querySelector('.card-value');
    const quizCard = document.querySelector('.quiz-icon').closest('.overview-card').querySelector('.card-value');
    const attendanceCard = document.querySelector('.attendance-icon').closest('.overview-card').querySelector('.card-value');
    
    if (assignmentCard) assignmentCard.textContent = '0%';
    if (quizCard) quizCard.textContent = '0%';
    if (attendanceCard) attendanceCard.textContent = '0%';
    
    // Update leaderboard position for new user
    const currentUserXP = document.querySelector('.leaderboard-item.current-user .user-xp');
    if (currentUserXP) {
        currentUserXP.textContent = '0 XP';
    }
}

// Performance Chart
let performanceChart;
let currentMetric = 'xp';

function initializeChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.performance.last7Days.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'XP Earned',
                data: mockData.performance.last7Days.map(d => d.xp),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
    
    // Chart toggle handlers
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const metric = this.dataset.metric;
            updateChart(metric);
        });
    });
}

function updateChart(metric) {
    currentMetric = metric;
    const data = mockData.performance.last7Days.map(d => d[metric]);
    const label = metric === 'xp' ? 'XP Earned' : 'Tasks Completed';
    
    performanceChart.data.datasets[0].data = data;
    performanceChart.data.datasets[0].label = label;
    performanceChart.update();
}

// Timeline Management
function initializeTimeline() {
    const now = new Date();
    const currentTime = now.getTime();
    
    mockData.todaySchedule.forEach(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const timeUntilStart = eventStart.getTime() - currentTime;
        const timeUntilEnd = eventEnd.getTime() - currentTime;
        
        // Mark as completed if event has passed
        if (timeUntilEnd < 0) {
            markEventCompleted(event.id);
        }
        
        // Show "Join Now" if within 15 minutes of start
        if (timeUntilStart > 0 && timeUntilStart <= 15 * 60 * 1000) {
            showJoinButton(event.id);
        }
    });
}

function markEventCompleted(eventId) {
    const timelineItem = document.querySelector(`[data-event-id="${eventId}"]`);
    if (timelineItem) {
        timelineItem.classList.add('completed');
    }
}

function showJoinButton(eventId) {
    const timelineItem = document.querySelector(`[data-event-id="${eventId}"]`);
    if (timelineItem) {
        const joinBtn = timelineItem.querySelector('.join-btn');
        if (joinBtn) {
            joinBtn.style.display = 'block';
            joinBtn.textContent = 'Join Now';
            joinBtn.style.background = '#10b981';
        }
    }
}

// Interactive Elements
function initializeInteractions() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would navigate to different pages
            const page = this.dataset.page;
            console.log(`Navigating to ${page} page`);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        console.log('Searching for:', query);
        // In a real app, this would filter content
    });
    
    // Notification button
    document.querySelector('.notification-btn').addEventListener('click', function() {
        console.log('Opening notifications');
        // In a real app, this would show notifications panel
    });
    
    // Calendar navigation
    document.querySelectorAll('.calendar-nav').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Calendar navigation clicked');
            // In a real app, this would change months
        });
    });
    
    // Calendar day clicks
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('click', function() {
            if (!this.classList.contains('inactive')) {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
                
                const selectedDate = this.textContent;
                console.log('Selected date:', selectedDate);
                // In a real app, this would filter timeline
            }
        });
    });
    
    // Leaderboard interactions
    document.querySelectorAll('.leaderboard-item').forEach(item => {
        item.addEventListener('click', function() {
            console.log('Opening user profile');
            // In a real app, this would show user details
        });
    });
    
    document.querySelector('.view-full-btn').addEventListener('click', function() {
        console.log('Opening full leaderboard');
        window.location.href = '/leaderboard';
    });
    
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            console.log('Action clicked:', action);
            // In a real app, this would perform the specific action
        });
    });
    
    // Recommendation actions
    document.querySelectorAll('.rec-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            console.log('Recommendation action:', action);
            // In a real app, this would perform the specific action
        });
    });
}

// Time-based Updates
function updateTimeBasedElements() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update any time-sensitive elements
    updateScheduleStatus(now);
}

function updateScheduleStatus(currentTime) {
    mockData.todaySchedule.forEach(event => {
        const eventStart = new Date(event.start);
        const timeUntilStart = eventStart.getTime() - currentTime.getTime();
        
        // Show join button if event is starting soon
        if (timeUntilStart > 0 && timeUntilStart <= 15 * 60 * 1000) {
            const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
            if (eventElement) {
                const joinBtn = eventElement.querySelector('.join-btn');
                if (joinBtn) {
                    joinBtn.style.display = 'inline-block';
                    joinBtn.textContent = 'Join Now';
                }
            }
        }
    });
}

// Mobile Menu
function toggleMobileMenu() {
    const sidebar = document.querySelector('.left-sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Skeleton Loaders
function showSkeletons() {
    document.querySelector('.skeleton-loader').style.display = 'grid';
    document.querySelector('.overview-grid').style.display = 'none';
}

function hideSkeletons() {
    document.querySelector('.skeleton-loader').style.display = 'none';
    document.querySelector('.overview-grid').style.display = 'grid';
}

// Simulate loading
setTimeout(() => {
    hideSkeletons();
}, 1000);

// Tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.background = '#1f2937';
        tooltip.style.color = '#ffffff';
        tooltip.style.padding = '0.5rem 0.75rem';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.zIndex = '1000';
        tooltip.style.whiteSpace = 'nowrap';
    });
    
    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Quick navigation with number keys
    if (e.key >= '1' && e.key <= '9') {
        const navItems = document.querySelectorAll('.nav-item');
        const index = parseInt(e.key) - 1;
        if (navItems[index]) {
            navItems[index].click();
        }
    }
    
    // Search focus with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-container input').focus();
    }
});

// Initialize mobile menu toggle
document.querySelector('.mobile-menu-toggle')?.addEventListener('click', toggleMobileMenu);
