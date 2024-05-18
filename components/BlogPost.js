import FormattedDate from "@/components/FormattedDate";
import TagItem from '@/components/TagItem'
import { useConfig } from "@/lib/config";
import Link from "next/link";

const BlogPost = ({ post }) => {
  const BLOG = useConfig();

  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <article key={post.id} className="mb-6 md:mb-10">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>          
        </header>
        <main>
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300 text-sm mb-1">
            {post.summary}
          </p>
          {/* TODO */}
          <div className="flex flex-row items-center">
            <time className="flex-shrink-0 text-xs text-gray-600 dark:text-gray-400 mr-2">
              {'Posted on'} <FormattedDate date={post.date} />            
            </time>
            {/* {post.tags && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {post.tags.map(tag => (
                  <TagItem key={tag} tag={tag} />
                ))}
              </div>
            )} */}
          </div>
        </main>        
      </article>
    </Link>
  );
};

export default BlogPost;
