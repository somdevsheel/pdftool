'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then(r => r.json())
      .then(data => setPost(data.article))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#eb1000', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <BlogPostForm initialData={post} postId={id} />
      )}
    </AdminLayout>
  );
}
