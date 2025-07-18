import { config } from "./config.js";

//get and process the first five activities on GitHub.
export async function getRecentActivities() {
    const apiURL = config.api.url;

    try {
        // Get user's Info
        const eventsResponse = await fetch(`${apiURL}/api/github/activities`);

        if(!eventsResponse.ok) throw new Error('Failed to fetch user data');
        else console.log("Get userResponse successfully");

        const events = await eventsResponse.json();

        renderActivities(events);

    } catch (error) {
        console.error('request failed:', error);
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