const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStoryIds(): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/topstories.json`);
  return res.json();
}

export async function fetchItem(id: number) {
  const res = await fetch(`${BASE_URL}/item/${id}.json`);
  return res.json();
}
