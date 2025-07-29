import { useState } from 'react';
import { BlogPostData } from '../types';

const mockBlogPostsData: BlogPostData[] = [
    {
        blogPostId: '1',
        blogTitle: 'Getting Started with React and TypeScript',
        blogExcerpt: 'A comprehensive guide to building modern web applications with React and TypeScript, covering best practices and common patterns.',
        blogContent: 'Full content here...',
        publishedDate: '2024-01-15',
        lastModifiedDate: '2024-01-16',
        authorName: 'Developer',
        blogTags: ['React', 'TypeScript', 'Web Development'],
        isPublished: true,
        readingTimeMinutes: 8
    },
    {
        blogPostId: '2',
        blogTitle: 'Building Serverless APIs with Vercel',
        blogExcerpt: 'Learn how to create and deploy serverless functions using Vercel Edge Runtime for optimal performance.',
        blogContent: 'Full content here...',
        publishedDate: '2024-01-10',
        lastModifiedDate: '2024-01-10',
        authorName: 'Developer',
        blogTags: ['Serverless', 'Vercel', 'API'],
        isPublished: true,
        readingTimeMinutes: 12
    },
    {
        blogPostId: '3',
        blogTitle: 'Spotify API Integration Guide',
        blogExcerpt: 'Step-by-step tutorial on integrating Spotify Web API with OAuth authentication and data fetching.',
        blogContent: 'Full content here...',
        publishedDate: '2024-01-05',
        lastModifiedDate: '2024-01-06',
        authorName: 'Developer',
        blogTags: ['Spotify', 'API', 'OAuth'],
        isPublished: true,
        readingTimeMinutes: 15
    }
];

const Blog = () => {
    const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPostData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBlogPosts = mockBlogPostsData.filter(blogPost =>
        blogPost.isPublished &&
        (blogPost.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
         blogPost.blogExcerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
         blogPost.blogTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const formatPublishedDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (selectedBlogPost) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => setSelectedBlogPost(null)}
                    className="mb-6 text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                    ← Back to Blog Posts
                </button>
                
                <article className="prose lg:prose-xl max-w-none">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{selectedBlogPost.blogTitle}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                            <span>By {selectedBlogPost.authorName}</span>
                            <span>•</span>
                            <span>{formatPublishedDate(selectedBlogPost.publishedDate)}</span>
                            <span>•</span>
                            <span>{selectedBlogPost.readingTimeMinutes} min read</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedBlogPost.blogTags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>
                    
                    <div className="text-lg leading-relaxed">
                        {selectedBlogPost.blogContent}
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
                <p className="text-xl text-gray-600 mb-8">Thoughts on development, technology, and more</p>
                
                <div className="max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </header>

            {filteredBlogPosts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No blog posts found matching your search.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogPosts.map(blogPost => (
                        <article
                            key={blogPost.blogPostId}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedBlogPost(blogPost)}
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <span>{formatPublishedDate(blogPost.publishedDate)}</span>
                                    <span>•</span>
                                    <span>{blogPost.readingTimeMinutes} min read</span>
                                </div>
                                
                                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                                    {blogPost.blogTitle}
                                </h2>
                                
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {blogPost.blogExcerpt}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blogPost.blogTags.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {blogPost.blogTags.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            +{blogPost.blogTags.length - 3} more
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">By {blogPost.authorName}</span>
                                    <span className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        Read more →
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;