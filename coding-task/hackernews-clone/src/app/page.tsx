import { fetchTopStoryIds, fetchItem } from '@/lib/hn';
import StoryItem from '@/components/StoryItem';

const STORIES_PER_PAGE = 10;

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchParam = await searchParams;
  const pageParam = searchParam?.page;
  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;

  const start = (page - 1) * STORIES_PER_PAGE;
  const end = start + STORIES_PER_PAGE;

  const topIds = await fetchTopStoryIds();
  const storyIds = topIds.slice(start, end);
  const stories = await Promise.all(storyIds.map(id => fetchItem(id)));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Hacker News Clone</h1>

      {stories.map(story =>
        story && story.type === 'story' ? (
          <StoryItem
            key={story.id}
            title={story.title}
            by={story.by}
            url={story.url}
            time={story.time}
          />
        ) : null
      )}

      <div className="flex justify-between mt-6">
        {page > 1 ? (
          <a href={`/?page=${page - 1}`} className="text-gray-500 hover:underline">← Previous</a>
        ) : <div />}

        {end < topIds.length && (
          <a href={`/?page=${page + 1}`} className="text-gray-500 hover:underline">Next →</a>
        )}
      </div>
    </div>
  );
}
