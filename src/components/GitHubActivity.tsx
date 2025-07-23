'use client';

import { useGitHubActivity } from '@/hooks/useGitHubActivity';

export const GitHubActivity: React.FC = () => {
    const { activities, loading, error, getTypeIcon, formatTypeName } = useGitHubActivity();
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center p-3">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-danger m-2" role="alert">
                {error}
            </div>
        );
    }
    
    return (
        <div className="d-flex flex-column">
            {activities.map((activity, index) => (
                <div
                    key={index}
                    className="blog-small-card-effect blog-post-w d-flex flex-row align-items-center me-auto rounded-3 m-2 col-14"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <i className={`fa-solid ${getTypeIcon(activity.type)} m-3`} style={{ fontSize: '150%' }}></i>
                    <div className="d-flex flex-column m-2">
                        <div className="d-flex flex-row">
              <span className="gradient-text m-1" style={{ fontSize: '80%' }}>
                {formatTypeName(activity.type)}{activity.repo}
              </span>
                        </div>
                        <div className="d-flex flex-row">
              <span className="gradient-text m-1" style={{ fontSize: '60%' }}>
                "{activity.message}"
              </span>
                        </div>
                        <div className="d-flex flex-row">
                            <i className="bi bi-clock-fill m-1" style={{ fontSize: '60%' }}></i>
                            <span className="gradient-text m-1" style={{ fontSize: '60%' }}>
                {activity.timeAgo}
              </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
