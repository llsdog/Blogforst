import { config } from "./config.js";

//function to render activities
function renderActivities(activities) {
    const container = document.getElementById('activity-cards');
    container.innerHTML = '';

    container.innerHTML = activities.map((activity, index) => `
        <div class="blog-small-card-effect blog-post-w d-flex flex-row align-items-center me-auto rounded-3 m-2 col-14" style="animation-delay: ${index * 0.1}s">
             <i class="fa-solid ${getTypeIcon(activity.type)} m-3" style="font-size: 150%"></i>
             <div class="d-flex flex-column m-2">
                  <div class="d-flex flex-row">  
                      <span class="gradient-text m-1" style="font-size: 80%"> ${formatTypeName(activity.type)}${activity.repo} </span>
                  </div>
                  <div class="d-flex flex-row">
                      <span class="gradient-text m-1" style="font-size: 60%"> "${activity.message}" </span>
                  </div>
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

class GitHubActivityManager {
    constructor() {
        this.pollingInterval = null;
        this.pollingDelay = 60000; // 30秒轮询一次
        this.isPolling = false;
    }

    async getRecentActivities() {
        const apiURL = config.api.url;

        try {
            const eventsResponse = await fetch(`${apiURL}/api/github/activities`);

            if(!eventsResponse.ok) throw new Error('Failed to fetch user data');
            else console.log("Get userResponse successfully");

            const events = await eventsResponse.json();
            renderActivities(events);

        } catch (error) {
            console.error('request failed:', error);
        }
    }

    startPolling(delay = this.pollingDelay) {
        if (this.isPolling) {
            console.log('轮询已在进行中');
            return;
        }

        this.isPolling = true;
        this.pollingDelay = delay;

        // 立即执行一次
        this.getRecentActivities();

        // 设置定时轮询
        this.pollingInterval = setInterval(() => {
            this.getRecentActivities();
            console.log('轮询更新GitHub活动');
        }, this.pollingDelay);

        console.log(`GitHub活动轮询已启动，间隔：${delay}ms`);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            this.isPolling = false;
            console.log('GitHub活动轮询已停止');
        }
    }

    changePollingInterval(delay) {
        if (this.isPolling) {
            this.stopPolling();
            this.startPolling(delay);
        } else {
            this.pollingDelay = delay;
        }
    }
}

const githubActivityManager = new GitHubActivityManager();

export async function getRecentActivities() {
    return await githubActivityManager.getRecentActivities();
}

export function startActivityPolling(delay) {
    return githubActivityManager.startPolling(delay);
}

export function stopActivityPolling() {
    return githubActivityManager.stopPolling();
}