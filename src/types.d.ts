declare module 'react-simple-maps';

export interface BlogPostData {
    blogPostId: string;
    blogTitle: string;
    blogExcerpt: string;
    blogContent: string;
    publishedDate: string;
    lastModifiedDate: string;
    authorName: string;
    blogTags: string[];
    isPublished: boolean;
    readingTimeMinutes: number;
}