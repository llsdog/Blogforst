import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import gsap from "gsap";
import './index.css';
import { config } from "./config.js";

//Page switch function
function showPage(pageId, methodName) {
    //remove 'active' class from all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    //add 'active' class to the target page
    const bodyHomeTop = document.querySelector("#body-home-top");
    const targetPage = document.getElementById(pageId);
    if (pageId === 'body-home-bottom-mainpage') {
        if (methodName === 'load') {
            bodyHomeTop.classList.remove('page-background-sun');
            bodyHomeTop.classList.add('page-background-moon');
            return;
        }
        gsap.to(bodyHomeTop, {
            x: 100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.classList.remove('page-background-sun');
                bodyHomeTop.classList.add('page-background-moon');
                targetPage.classList.add('active');
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    } else if (pageId === 'body-home-bottom-readme') {
        if (methodName === 'load') {
            bodyHomeTop.classList.remove('page-background-moon');
            bodyHomeTop.classList.add('page-background-sun');
            return;
        }
        gsap.to(bodyHomeTop, {
            x: -100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.classList.remove('page-background-moon');
                bodyHomeTop.classList.add('page-background-sun');
                targetPage.classList.add('active');
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    }
}


//get and process the first five activities on GitHub.
async function getRecentActivities() {
    const token = config.github.token;

    try {
        // Get user's Info
        const userResponse = await fetch(`https://api.github.com/users/${config.github.username}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if(!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        //get activity events
        const eventsUrl = userData.events_url.split('{')[0];
        const eventsResponse = await fetch(eventsUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!eventsResponse.ok) throw new Error('Failed to fetch events data');
        const events = await eventsResponse.json();

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
            const commitCount = event.payload.commits.length;
            const firstCommit = event.payload.commits[0]?.message || 'No commit message';
            return `${firstCommit.substring(0, 40)}...`;

        case 'PullRequestEvent':
            const prTitle = event.payload.pull_request.title;
            const action = event.payload.action;
            return `${action} 了一个拉取请求: ${prTitle}`;

        case 'IssueCommentEvent':
            const comment = event.payload.comment.body;
            return `${comment.substring(0, 50)}...`;

        case 'WatchEvent':
            return 'Star了此仓库';

        case 'ForkEvent':
            return 'Fork了此仓库';

        case 'CreateEvent':
            const refType = event.payload.ref_type;
            return `创建了${refType}: ${event.payload.ref || ''}`;

        case 'DeleteEvent':
            return `删除了 ${event.payload.ref_type}: ${event.payload.ref}`;

        default:
            return `执行了 ${event.type} 操作`;
    }
}

//function to get time ago
function getTimeAgo(dataString) {
    const now = new Date();
    const eventData = new Date(dataString);
    const diffMs = now - eventData;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
        return `${minutes} 分钟前`;
    } else if (hours < 24) {
        return `${hours} 小时前`;
    } else {
        return `${days} 天前`;
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
        'ForkEvent': 'fa-code-fork',
        'CreateEvent': 'fa-plus',
        'DeleteEvent': 'fa-trash'
    };
    return icons[type] || 'fa-question';
}

//function to format type name
function formatTypeName(type) {
    const names = {
        'PushEvent': '推送了代码到仓库 ',
        'PullRequestEvent': '拉取请求 在仓库',
        'IssueCommentEvent': '评论了 Issue 在仓库',
        'WatchEvent': 'Star了仓库 ',
        'ForkEvent': 'Fork了仓库 ',
        'CreateEvent': '创建了 ',
        'DeleteEvent': '删除了 '
    }
    return names[type] || type;
}

//button
document.getElementById("button-to-mainpage").addEventListener("click",
    function () {
        showPage('body-home-bottom-mainpage', 'click');
    });
document.getElementById("button-to-readme").addEventListener("click",
    function () {
        showPage('body-home-bottom-readme', 'click');
    });

//加载一言
fetch('/hitokoto')
    .then(response => response.json())
    .then(data => {
        document.getElementById('hitokoto').innerText = data.hitokoto;

        //显示出处
        const fromElement = document.getElementById('hitokoto-type');
        if (data.from) {
            fromElement.innerText = `—— ${data.from}`;
            fromElement.style.display = 'inline-block';
        } else {
            fromElement.style.display = 'none';
        }
    })
    .catch(console.error);

// 页面加载完成后显示主页
document.addEventListener('DOMContentLoaded', function () {
    showPage('body-home-bottom-mainpage', 'load');
    getRecentActivities(); //获取最近的活动
    console.log("加载成功, 欢迎来到我的Blog");
});



