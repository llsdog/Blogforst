import { getAllBlogs } from '@/lib/blogLoader';
import { HomeClient } from '@/components/HomeClient';

export default async function Home() {
    const blogs = await getAllBlogs();
    
    return <HomeClient initialBlogs={blogs} />;
}
