"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin.freenoo.com";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  tag: string;
  tagColor: string;
  readTime: number;
  createdAt: string;
}

export default function ToolBlogSection({ tag }: { tag: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(API_BASE + "/api/blog?tag=" + encodeURIComponent(tag) + "&limit=3")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.posts)) setPosts(data.posts.filter((p: BlogPost) => p.slug));
      })
      .catch(() => {});
  }, [tag]);

  if (posts.length === 0) return null;

  return (
    <div style={{ marginTop: "48px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          {tag} Guides
        </h2>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <Link href="/blog" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>
          View all
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {posts.map(post => (
          <Link key={post._id} href={"/blog/" + post.slug} style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "14px",
              padding: "14px 16px", borderRadius: "10px",
              background: "var(--surface)", border: "1px solid var(--border)",
              transition: "border-color 0.15s", cursor: "pointer",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)", margin: "0 0 4px", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.title}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.summary}
                </p>
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", marginTop: "2px" }}>
                {post.readTime} min read
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
