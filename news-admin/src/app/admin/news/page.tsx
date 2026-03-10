import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function NewsListPage() {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  await connectDB();
  const articles = await News.find()
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Articles</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{articles.length} total articles</p>
        </div>
        <Link href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#eb1000' }}>
          + New Article
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
        <table className="w-full" style={{ background: '#111' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
              {['Image', 'Title', 'Tag', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((a: any) => (
              <tr key={a._id.toString()} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td className="px-4 py-3">
                  <img src={a.imageUrl} alt="" className="w-12 h-8 object-cover rounded" />
                </td>
                <td className="px-4 py-3 text-sm text-white max-w-xs">
                  <p className="truncate font-medium">{a.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#555' }}>{a.summary}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${a.tagColor}22`, color: a.tagColor }}>
                    {a.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>{(a.author as any)?.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: a.published ? 'rgba(63,200,122,0.15)' : 'rgba(245,166,35,0.15)',
                      color: a.published ? '#3FC87A' : '#F5A623',
                    }}>
                    {a.published ? 'Published' : 'Draft'}
                  </span>
                  {a.featured && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(232,124,243,0.15)', color: '#E87CF3' }}>
                      ★
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>{a.views}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#555' }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/news/${a._id}`}
                    className="text-xs px-3 py-1.5 rounded font-medium"
                    style={{ background: '#2a2a2a', color: '#ccc' }}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
