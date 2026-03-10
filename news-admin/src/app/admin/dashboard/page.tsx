import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { User } from '@/lib/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  await connectDB();
  const [total, published, drafts, featured, totalViews, users] = await Promise.all([
    News.countDocuments(),
    News.countDocuments({ published: true }),
    News.countDocuments({ published: false }),
    News.countDocuments({ featured: true }),
    News.aggregate([{ $group: { _id: null, sum: { $sum: '$views' } } }]),
    User.countDocuments(),
  ]);

  const recentArticles = await News.find()
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const viewCount = totalViews[0]?.sum || 0;

  const stats = [
    { label: 'Total Articles', value: total, icon: '📰', color: '#6B7FD7' },
    { label: 'Published', value: published, icon: '✅', color: '#3FC87A' },
    { label: 'Drafts', value: drafts, icon: '📝', color: '#F5A623' },
    { label: 'Featured', value: featured, icon: '⭐', color: '#E87CF3' },
    { label: 'Total Views', value: viewCount.toLocaleString(), icon: '👁️', color: '#5BB8F5' },
    { label: 'Admin Users', value: users, icon: '👤', color: '#E8526A' },
  ];

  return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>Welcome back, {user.name}</p>
        </div>
        <Link href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: '#eb1000' }}>
          + New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
          <h2 className="font-semibold text-white">Recent Articles</h2>
          <Link href="/admin/news" className="text-xs" style={{ color: '#eb1000' }}>View all →</Link>
        </div>
        <table className="w-full" style={{ background: '#111' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              {['Title', 'Tag', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((a: any) => (
              <tr key={a._id.toString()} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3 text-sm text-white max-w-xs truncate">{a.title}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
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
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>{a.views}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#555' }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/news/${a._id}`}
                    className="text-xs px-3 py-1 rounded font-medium transition-all"
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
