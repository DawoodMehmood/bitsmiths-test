type Props = {
  title: string;
  by: string;
  url: string;
  time: number;
};

export default function StoryItem({ title, by, url, time }: Props) {
  const date = new Date(time * 1000).toLocaleString();
  return (
    <div className="border-b py-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-white hover:underline"
      >
        {title}
      </a>
      <div className="text-sm text-gray-600">
        by {by} | {date}
      </div>
    </div>
  );
}
