"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface BlogPost {
  id: string; // UUID in your schema
  title: string;
  content: string;
  created_at: string;
}

interface BlogFormData {
  title: string;
  content: string;
}

export default function BlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: ""
  });

  // Only allow admin users to access admin features
  const isAdmin = user?.isAdmin === true;

  // Fetch blog posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch blog posts');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!formData.title || !formData.content || !user?.token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setFormData({ title: "", content: "" });
      } else {
        const error = await response.json();
        console.error('Failed to create post:', error);
        alert('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content
    });
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !formData.title || !formData.content || !user?.token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(post => 
          post.id === editingPost.id ? updatedPost : post
        ));
        setEditingPost(null);
        setFormData({ title: "", content: "" });
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

  const handleDeletePost = async (postId: string) => {
    if (!user?.token) return;
    
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
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

  // Helper function to get excerpt from content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <main className="relative min-h-screen px-4 py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
      {/* light mode subtle overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.5),transparent_60%)] dark:opacity-0 transition" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_50%)] dark:opacity-0 transition" />
      {/* dark mode atmospheric glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.10),transparent_70%)] transition" />

  <div className="relative">
        {/* Page Title */}
        <header id="blog-hero" className="text-center mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-pink-500 font-semibold mb-2">Latest from the Diva Desk</p>

<h1
  id="blog-title"
  aria-describedby="blog-desc"
  className="font-shuneva text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600"
>
  Kawaii Culture & Style Tips{' '}
  <span
    className="inline-block align-[-0.1em] text-white"
    style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji' }}
    aria-hidden="true"
  >
    💖
  </span>
</h1>

            <p
              id="blog-desc"
              className="font-shuneva max-w-2xl mx-auto text-2xl leading-relaxed font-bold mt-4 "
            >
              Collectible guides, kawaii culture, and Y2K style tips — curated for Vegas's kawaii community and beyond.
            </p>
          </div>
          
          {/* Admin Toggle - Only show for logged in admins */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="font-shuneva mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-purple-500/40 shadow-md hover:shadow-lg"
            >
              {isAdminMode ? "Exit Admin" : "✏️ Edit Blog"}
            </button>
          )}
        </header>

        {/* Featured Posts Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-shuneva text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
              ✨ Featured Guides
            </h2>
            <p className="text-gray-800 dark:text-gray-100">
              Your complete guide to kawaii culture, collectibles & Y2K style
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/blog/collectibles-bae" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-pink-500 transition-colors">
                  Collectibles & Kawaii Guide
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Ultimate guide to Labubu collecting, Pop Mart blind boxes, and kawaii culture essentials.
                </p>
                <div className="mt-4 text-pink-500 font-semibold text-sm">
                  Read Guide →
                </div>
              </div>
            </Link>

            <Link href="/blog/kawaii-aesthetic-guide" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">�</div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-pink-500 transition-colors">
                  Kawaii Aesthetic Guide
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Master the kawaii aesthetic with our complete guide to cute culture and collectibles.
                </p>
                <div className="mt-4 text-pink-500 font-semibold text-sm">
                  Read Guide →
                </div>
              </div>
            </Link>

            <Link href="/blog/y2k-nail-trends-2025" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">💅</div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-pink-500 transition-colors">
                  Y2K Nail Trends 2025
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Discover the hottest Y2K nail trends taking over 2025. From chrome finishes to butterfly motifs.
                </p>
                <div className="mt-4 text-pink-500 font-semibold text-sm">
                  Read Guide →
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link 
              href="/nail-guide" 
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              📚 Complete Nail Guide
            </Link>
          </div>
        </section>

        {/* Admin Form - Only show for logged in admins in admin mode */}
        {isAdmin && isAdminMode && (
          <div className="mb-12 p-6 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 shadow-lg">
            <h2 className="font-shuneva text-2xl font-bold mb-4">
              {editingPost ? "Edit Post" : "Add New Post"}
            </h2>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); editingPost ? handleUpdatePost() : handleAddPost(); }}>
              <label htmlFor="post-title" className="sr-only">Post title</label>
              <input
                id="post-title"
                type="text"
                placeholder="Post Title (e.g., 💅 Amazing Nail Tips)"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-500/40"
              />

              <label htmlFor="post-content" className="sr-only">Post content</label>
              <textarea
                id="post-content"
                placeholder="Full content..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-500/40"
              />

              <div className="flex gap-4 mt-2">
                <button
                  type="submit"
                  className="font-shuneva bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500/40 shadow-md hover:shadow-lg"
                >
                  {editingPost ? "Update Post" : "Add Post"}
                </button>

                {editingPost && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost(null);
                      setFormData({ title: "", content: "" });
                    }}
                    className="font-shuneva bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-500/40 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="font-shuneva text-lg mt-4">Loading blog posts...</p>
          </div>
        ) : (
          /* Blog Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="font-shuneva text-xl text-gray-500">No blog posts yet!</p>
                {isAdmin && (
                  <p className="font-shuneva text-gray-400 mt-2">Click "Edit Blog" to add your first post.</p>
                )}
              </div>
            ) : (
              posts.map((post) => {
                return (
                  <article key={post.id} className="relative">
                    <Link
                      href={`/blog/${post.id}`}
                      aria-label={`Read full post ${post.title}`}
                      className="blog-card group block relative rounded-2xl overflow-hidden bg-white text-black dark:text-gray-200 backdrop-blur-xl border border-white/70 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.25)] transform transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.32)] focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-pink-500/30"
                    >
                      {/* Admin Controls - Only show for logged in admins in admin mode */}
                      {isAdmin && isAdminMode && (
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleEditPost(post); }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
                            title="Edit post"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDeletePost(post.id); }}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/40"
                            title="Delete post"
                          >
                            🗑️
                          </button>
                        </div>
                      )}

                      <div className="p-6">
                        <h2 className="font-shuneva dark:!text-black text-2xl font-bold mb-3">{post.title}</h2>
                        <p className="font-shuneva dark:!text-black mb-4">{getExcerpt(post.content)}</p>
                        <p className="font-shuneva text-sm text-gray-500 mb-4 dark:!text-black">{new Date(post.created_at).toLocaleDateString()}</p>
                        <span className="inline-block mt-2 font-shuneva bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg dark:!text-black">Read Full Post →</span>
                      </div>
                    </Link>
                  </article>
                );
              })
            )}
          </div>
        )}

        {/* More Resources Section */}
        <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="font-shuneva text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <span aria-hidden className="inline-block w-10 h-10">
                <svg viewBox="0 0 64 64" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="emojiGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#9b5cf6" />
                      <stop offset="50%" stopColor="#ff66b8" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontSize="36"
                    fontFamily="Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji"
                    fill="url(#emojiGrad)"
                  >
                    🎯
                  </text>
                </svg>
              </span>

              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                More Resources
              </span>
            </h2>
            <p className="text-gray-800 dark:text-gray-100">
              Additional guides and information to help you succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/faq" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center">
                <div className="text-3xl mb-3">❓</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-500 transition-colors">
                  FAQ
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Common questions answered
                </p>
              </div>
            </Link>

            <Link href="/las-vegas" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center">
                <div className="text-3xl mb-3">🎰</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-500 transition-colors">
                  Las Vegas
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Local pickup & Vegas info
                </p>
              </div>
            </Link>

            <Link href="/contact" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center">
                <div className="text-3xl mb-3">💌</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-500 transition-colors">
                  Contact Us
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Get in touch for help
                </p>
              </div>
            </Link>

            <Link href="/shop?brand_segment=nails" className="group">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center">
                <div className="text-3xl mb-3">💅</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-500 transition-colors">
                  Shop
                </h3>
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  Browse our collection
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
