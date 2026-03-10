'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Write a PDF tip, tutorial or how-to guide</p>
      </div>
      <BlogPostForm />
    </AdminLayout>
  );
}
