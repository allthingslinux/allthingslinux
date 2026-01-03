import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getAllPostsAsPostType } from '@/lib/blog';

export async function UpdatesSection() {
  // Get the most recent blog posts (news/updates)
  const posts = await getAllPostsAsPostType();
  const recentPosts = posts
    .filter((post) => post.categorySlug === 'news')
    .slice(0, 3);

  if (recentPosts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground text-lg mb-2">
            Community updates coming soon
          </div>
          <div className="text-sm text-muted-foreground">
            We're working on sharing regular updates about our community and projects.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {recentPosts.map((post) => {
        const date = new Date(post.date);
        const monthYear = date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });

        return (
          <div key={post.slug} className="mb-6 last:mb-0">
            <Link href={`/blog/${post.categorySlug}/${post.slug}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{monthYear}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {post.title}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  Read report →
                </div>
              </CardContent>
            </Card>
          </Link>
          </div>
        );
      })}
    </div>
  );
}
