'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogPost {
  _id: string;
  title: string;
  tag: string;
  tagColor: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  slug: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?admin=true&limit=50')
      .then(r => r.json())
      .then(data => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p._id !== id));
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/news/${post._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      setPosts(prev => prev.map(p => p._id === post._id ? { ...p, published: !p.published } : p));
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>PDF tips, tutorials & how-to guides</p>
        </div>
        <Link href="/admin/blog/new"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: '#eb1000' }}>
          + New Blog Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#eb1000', borderTopColor: 'transparent' }} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-lg font-medium text-white mb-2">No blog posts yet</p>
          <p className="text-sm mb-6" style={{ color: '#888' }}>Start writing PDF tips and tutorials</p>
          <Link href="/admin/blog/new"
            className="px-6 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#eb1000' }}>
            Write First Post
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                {['Title', 'Tag', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#666' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post._id}
                  style={{ borderBottom: '1px solid #1e1e1e', background: i % 2 === 0 ? '#111' : '#0f0f0f' }}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white line-clamp-1">{post.title}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: '#555' }}>{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${post.tagColor}22`, color: post.tagColor }}>
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(post)}
                      className="text-xs px-2 py-0.5 rounded-full font-medium transition-all"
                      style={{
                        background: post.published ? '#05966922' : '#44444422',
                        color: post.published ? '#059669' : '#888',
                      }}>
                      {post.published ? '● Published' : '○ Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>{post.views}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${post._id}`}
                        className="text-xs px-2 py-1 rounded" style={{ color: '#888', border: '1px solid #2a2a2a' }}>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post._id)}
                        className="text-xs px-2 py-1 rounded" style={{ color: '#eb1000', border: '1px solid #eb100022' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
