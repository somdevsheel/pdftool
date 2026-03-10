import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { redirect, notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';
import Link from 'next/link';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  await connectDB();
  const article = await News.findById(params.id).lean();
  if (!article) notFound();

  return (
    <AdminLayout user={user}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/news" className="text-sm" style={{ color: '#666' }}>← All Articles</Link>
        <h1 className="text-2xl font-bold text-white">Edit Article</h1>
      </div>
      <ArticleForm mode="edit" article={JSON.parse(JSON.stringify(article))} />
    </AdminLayout>
  );
}
