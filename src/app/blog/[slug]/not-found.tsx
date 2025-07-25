import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h1 className="display-4 mb-4">博客未找到</h1>
            <p className="lead mb-4">抱歉，您访问的博客文章不存在。</p>
            <Link href="/" className="btn btn-primary">
                返回首页
            </Link>
        </div>
    );
}
