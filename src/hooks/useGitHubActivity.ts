'use client';

import { useState, useEffect } from 'react';
import type { GitHubActivity } from '@/types';

export const useGitHubActivity = () => {
    const [activities, setActivities] = useState<GitHubActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const getActivityMessage = (event: any): string => {
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
    };
    
    const getTimeAgo = (dateString: string): string => {
        const now = new Date();
        const eventDate = new Date(dateString);
        const diffMs = now.getTime() - eventDate.getTime();
        
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
    };
    
    const getTypeIcon = (type: string): string => {
        const icons = {
            'PushEvent': 'fa-code-commit',
            'PullRequestEvent': 'fa-code-branch',
            'IssueCommentEvent': 'fa-comment',
            'WatchEvent': 'fa-star',
            'ForkEvent': 'fa-code-branch',
            'CreateEvent': 'fa-plus',
            'DeleteEvent': 'fa-trash'
        };
        return icons[type as keyof typeof icons] || 'fa-question';
    };
    
    const formatTypeName = (type: string): string => {
        const names = {
            'PushEvent': '推送了代码到仓库 ',
            'PullRequestEvent': '发起了拉取请求在仓库 ',
            'IssueCommentEvent': '评论了Issue在仓库 ',
            'WatchEvent': 'Star了仓库 ',
            'ForkEvent': 'Fork了仓库 ',
            'CreateEvent': '创建了 ',
            'DeleteEvent': '删除了 '
        };
        return names[type as keyof typeof names] || type;
    };
    
    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/github-activities');
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            
            const events = await response.json();
            const recentFive = events.slice(0, 5).map((event: any) => ({
                type: event.type,
                repo: event.repo.name,
                message: getActivityMessage(event),
                timeAgo: getTimeAgo(event.created_at),
            }));
            
            setActivities(recentFive);
        } catch (err) {
            setError('Failed to load GitHub activities');
            console.error('Failed to fetch GitHub activities:', err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchActivities();
    }, []);
    
    return {
        activities,
        loading,
        error,
        getTypeIcon,
        formatTypeName,
        reload: fetchActivities
    };
};
