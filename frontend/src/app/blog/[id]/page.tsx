"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface BlogFormData {
  title: string;
  content: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: ""
  });

  const isAdmin = user?.isAdmin === true;
  const postId = params.id as string;

  // Fetch individual blog post
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Update document title for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Diva CMS Blog`;
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content
        });
      } else {
        console.error('Failed to fetch blog post');
        // Redirect to blog list if post not found
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!formData.title || !formData.content || !user?.token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
        setIsEditing(false);
      } else {
        const error = await response.json();
        console.error('Failed to update post:', error);
        alert('Failed to update post. Please try again.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    }
  };

  const handleDeletePost = async () => {
    if (!user?.token) return;
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        const error = await response.json();
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen px-4 py-24 overflow-x-hidden">
        <div className="relative container mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="font-shuneva text-lg mt-4">Loading blog post...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative min-h-screen px-4 py-24 overflow-x-hidden">
        <div className="relative container mx-auto">
          <div className="text-center py-12">
            <h1 className="font-shuneva text-3xl font-bold mb-4">Post Not Found</h1>
            <Link 
              href="/blog"
              className="font-shuneva bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-24 overflow-x-hidden">
      {/* light mode subtle overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.5),transparent_60%)] dark:opacity-0 transition" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_50%)] dark:opacity-0 transition" />
      {/* dark mode atmospheric glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.10),transparent_70%)] transition" />

      <div className="relative container mx-auto max-w-4xl">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/blog"
            className="font-shuneva text-pink-500 hover:text-pink-400 transition duration-300"
          >
            ← Back to Blog
          </Link>
        </nav>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="font-shuneva bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-blue-500/60 focus:outline-none shadow-md hover:shadow-lg"
            >
              {isEditing ? "Cancel Edit" : "✏️ Edit Post"}
            </button>
            
            <button
              onClick={handleDeletePost}
              className="font-shuneva bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-red-500/60 focus:outline-none shadow-md hover:shadow-lg"
            >
              🗑️ Delete Post
            </button>
          </div>
        )}

        {/* Edit Mode */}
        {isAdmin && isEditing ? (
          <div className="mb-12 p-6 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 shadow-lg">
            <h2 className="font-shuneva text-2xl font-bold mb-4">Edit Post</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-pink-500/60 focus:outline-none"
              />
              
              <textarea
                placeholder="Full content..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-pink-500/60 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdatePost}
                className="font-shuneva bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-green-500/60 focus:outline-none shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    title: post.title,
                    content: post.content
                  });
                }}
                className="font-shuneva bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-500/60 focus:outline-none shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Display Mode */
          <article className="blog-card bg-white text-black dark:text-gray-200 backdrop-blur-xl border border-white/70 rounded-2xl p-8 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.6)]">
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="font-shuneva text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-black dark:text-gray-100">
                {post.title}
              </h1>
              <p className="font-shuneva text-sm text-gray-600 dark:text-gray-400">
                Published on {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </header>
            {/* Post Content */}
            <div className="prose prose-lg max-w-none text-black dark:text-gray-200">
              <div className="font-shuneva text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </article>
        )}

        {/* Navigation Footer */}
        <nav className="mt-12 text-center">
          <Link 
            href="/blog"
            className="font-shuneva bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 focus:ring-2 focus:ring-pink-500/60 focus:outline-none shadow-md hover:shadow-lg"
          >
            ← Back to All Posts
          </Link>
        </nav>
      </div>
    </main>
  );
}
