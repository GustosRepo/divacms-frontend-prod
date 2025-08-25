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
      {/* light mode subtle overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.5),transparent_60%)] dark:opacity-0 transition" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_50%)] dark:opacity-0 transition" />
      {/* dark mode atmospheric glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.10),transparent_70%)] transition" />

      <div className="relative container mx-auto">
        {/* Page Title */}
        <header className="text-center mb-16">
          <h1 className="font-shuneva text-5xl md:text-6xl font-extrabold tracking-widest drop-shadow-md">
            💖 Nail Care & Tips
          </h1>
          <p className="font-shuneva max-w-2xl mx-auto text-lg leading-relaxed font-medium mt-4">
            Keep your nails looking flawless with our expert tips & tricks!
          </p>
          
          {/* Admin Toggle - Only show for logged in admins */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="font-shuneva mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-purple-500/60 focus:outline-none shadow-md hover:shadow-lg"
            >
              {isAdminMode ? "Exit Admin" : "✏️ Edit Blog"}
            </button>
          )}
        </header>

        {/* Admin Form - Only show for logged in admins in admin mode */}
        {isAdmin && isAdminMode && (
          <div className="mb-12 p-6 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/20 shadow-lg">
            <h2 className="font-shuneva text-2xl font-bold mb-4">
              {editingPost ? "Edit Post" : "Add New Post"}
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title (e.g., 💅 Amazing Nail Tips)"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-pink-500/60 focus:outline-none"
              />
              
              <textarea
                placeholder="Full content..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
                className="font-shuneva w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-pink-500/60 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={editingPost ? handleUpdatePost : handleAddPost}
                className="font-shuneva bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-green-500/60 focus:outline-none shadow-md hover:shadow-lg"
              >
                {editingPost ? "Update Post" : "Add Post"}
              </button>
              
              {editingPost && (
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setFormData({ title: "", content: "" });
                  }}
                  className="font-shuneva bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-500/60 focus:outline-none shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
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
                  <div
                    key={post.id}
                    className="relative rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.6)] transform transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.32)] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)]"
                  >
                    {/* Admin Controls - Only show for logged in admins in admin mode */}
                    {isAdmin && isAdminMode && (
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition duration-300 focus:ring-2 focus:ring-blue-500/60 focus:outline-none"
                          title="Edit post"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-300 focus:ring-2 focus:ring-red-500/60 focus:outline-none"
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    {/* Content Container */}
                    <div className="p-6">
                      <h2 className="font-shuneva text-2xl font-bold mb-3">{post.title}</h2>
                      <p className="font-shuneva text-gray-600 dark:text-gray-300 mb-4">
                        {getExcerpt(post.content)}
                      </p>
                      <p className="font-shuneva text-sm text-gray-500 mb-4">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>

                      {/* Read Full Post Button */}
                      <Link
                        href={`/blog/${post.id}`}
                        className="font-shuneva bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-4 py-2 rounded-lg w-full transition duration-300 focus:ring-2 focus:ring-pink-500/60 focus:outline-none shadow-md hover:shadow-lg block text-center"
                      >
                        Read Full Post →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
