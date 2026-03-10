import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';
import Link from 'next/link';

export default async function NewArticlePage() {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminLayout user={user}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/news" className="text-sm" style={{ color: '#666' }}>← All Articles</Link>
        <h1 className="text-2xl font-bold text-white">New Article</h1>
      </div>
      <ArticleForm mode="create" />
    </AdminLayout>
  );
}
