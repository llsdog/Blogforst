import { config } from "./config.js";

//get and process the first five activities on GitHub.
export async function getRecentActivities() {
    const token = config.github.token;
    const username = config.github.username;
    const timestamp = new Date().getTime(); //时间戳

    try {
        // Get user's Info
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?t=${timestamp}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            }
        });

        if(!eventsResponse.ok) throw new Error('Failed to fetch user data');
        else console.log("Get userResponse successfully");

        const events = await eventsResponse.json();

        // Check if events are available
        console.log('最新事件时间:', events[0]?.created_at);
        console.log('当前时间:', new Date().toISOString());

        // process events
        const recentFive = events.slice(0, 5).map(event => {
            return {
                type: event.type,
                repo: event.repo.name,
                message: getActivityMessage(event),
                timeAgo: getTimeAgo(event.created_at),
            };
        });

        renderActivities(recentFive);
    } catch (error) {
        console.error('request failed:', error);
    }
}

//function to get an activity message based on event type
function getActivityMessage(event) {
    switch(event.type) {
        case 'PushEvent':
            const firstCommit = event.payload.commits[0]?.message || 'No commit message';
            return `${firstCommit.substring(0, 40)}...`;

        case 'PullRequestEvent':
            const prTitle = event.payload.pull_request.title;
            const action = event.payload.action;
            return `${action}了一个拉取请求: ${prTitle}`;

        case 'IssueCommentEvent':
            const comment = event.payload.comment.body;
            return `${comment.substring(0, 50)}...`;

        case 'WatchEvent':
            return 'Star了此仓库';

        case 'ForkEvent':
            return 'Fork了此仓库';

        case 'CreateEvent':
            const refType = event.payload.ref_type;
            return `创建了${refType}:${event.payload.ref || ''}`;

        case 'DeleteEvent':
            return `删除了${event.payload.ref_type}:${event.payload.ref}`;

        default:
            return `执行了${event.type}操作`;
    }
}

//function to get time ago
function getTimeAgo(dataString) {
    const now = new Date();
    const eventData = new Date(dataString);

    const diffMs = now.getTime() - eventData.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else {
        return `${days}天前`;
    }
}

//function to render activities
function renderActivities(activities) {
    const container = document.getElementById('activity-cards');
    container.innerHTML = '';

    container.innerHTML = activities.map((activity, index) => `
        <div class="blog-small-card-effect blog-post-w d-flex flex-row align-items-center me-auto rounded-3 m-2 col-14" style="animation-delay: ${index * 0.1}s">
             <i class="fa-solid ${getTypeIcon(activity.type)} m-3" style="font-size: 150%"></i>
             <div class="d-flex flex-column m-2">
                  <span class="gradient-text m-1" style="font-size: 80%"> ${formatTypeName(activity.type)}${activity.repo} </span>
                  <span class="gradient-text m-1" style="font-size: 60%"> "${activity.message}" </span>
                  <div class="d-flex flex-row">
                      <i class="bi bi-clock-fill m-1" style="font-size: 60%"></i>
                      <span class="gradient-text m-1" style="font-size: 60%">${activity.timeAgo}</span>
                  </div>
             </div>
        </div>
    `).join('');
}

//function to get icon based on event type
function getTypeIcon(type) {
    const icons = {
        'PushEvent': 'fa-code-commit',
        'PullRequestEvent': 'fa-code-branch',
        'IssueCommentEvent': 'fa-comment',
        'WatchEvent': 'fa-star',
        'ForkEvent': 'fa-code-branch',
        'CreateEvent': 'fa-plus',
        'DeleteEvent': 'fa-trash'
    };
    return icons[type] || 'fa-question';
}

//function to format type name
function formatTypeName(type) {
    const names = {
        'PushEvent': '推送了代码到仓库 ',
        'PullRequestEvent': '发起了拉取请求在仓库 ',
        'IssueCommentEvent': '评论了Issue在仓库 ',
        'WatchEvent': 'Star了仓库 ',
        'ForkEvent': 'Fork了仓库 ',
        'CreateEvent': '创建了 ',
        'DeleteEvent': '删除了 '
    }
    return names[type] || type;
}