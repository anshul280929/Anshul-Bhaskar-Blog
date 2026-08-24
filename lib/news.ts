interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  source_name: string;
  source_url: string;
  image_url: string | null;
  category: string[];
  pubDate: string;
  link: string;
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

interface CurrentsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  author: string;
  image: string;
  language: string;
  category: string[];
  published: string;
}

interface CurrentsResponse {
  status: string;
  news: CurrentsArticle[];
}

export interface NormalizedArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string | null;
  category: string[];
  publishedAt: string;
}

function normalizeNewsData(article: NewsArticle): NormalizedArticle {
  return {
    id: article.article_id,
    title: article.title,
    description: article.description || "",
    source: article.source_name || "Unknown",
    url: article.source_url || article.link || "#",
    imageUrl: article.image_url,
    category: article.category || [],
    publishedAt: article.pubDate,
  };
}

function normalizeCurrents(article: CurrentsArticle): NormalizedArticle {
  return {
    id: article.id,
    title: article.title,
    description: article.description || "",
    source: article.author || "Unknown",
    url: article.url,
    imageUrl: article.image || null,
    category: article.category || [],
    publishedAt: article.published,
  };
}

export async function fetchNewsDataIO(
  category: string = "technology"
): Promise<NormalizedArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    console.error("NEWSDATA_API_KEY not set");
    return [];
  }

  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=${category}&language=en`;
    const res = await fetch(url, { next: { revalidate: 900 } });

    if (!res.ok) {
      console.error(`NewsData.io error: ${res.status}`);
      return [];
    }

    const data: NewsDataResponse = await res.json();
    return (data.results || [])
      .filter((a) => a.title && a.title.trim() !== "")
      .map(normalizeNewsData);
  } catch (error) {
    console.error("NewsData.io fetch error:", error);
    return [];
  }
}

export async function fetchCurrentsAPI(
  category: string = "technology"
): Promise<NormalizedArticle[]> {
  const apiKey = process.env.CURRENTS_NEWS_API_KEY;
  if (!apiKey) {
    console.error("CURRENTS_NEWS_API_KEY not set");
    return [];
  }

  try {
    const url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&category=${category}&language=en&page_size=20`;
    const res = await fetch(url, { next: { revalidate: 900 } });

    if (!res.ok) {
      console.error(`Currents API error: ${res.status}`);
      return [];
    }

    const data: CurrentsResponse = await res.json();
    return (data.news || [])
      .filter((a) => a.title && a.title.trim() !== "")
      .map(normalizeCurrents);
  } catch (error) {
    console.error("Currents API fetch error:", error);
    return [];
  }
}

export async function fetchNews(
  category: string = "technology"
): Promise<NormalizedArticle[]> {
  const [newsDataResult, currentsResult] = await Promise.allSettled([
    fetchNewsDataIO(category),
    fetchCurrentsAPI(category),
  ]);

  const articles: NormalizedArticle[] = [];
  if (newsDataResult.status === "fulfilled") {
    articles.push(...newsDataResult.value);
  }
  if (currentsResult.status === "fulfilled") {
    articles.push(...currentsResult.value);
  }

  // Deduplicate by title similarity
  const seenTitles = new Set<string>();
  return articles.filter((a) => {
    const simplified = a.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 30);
    if (!simplified || seenTitles.has(simplified)) return false;
    seenTitles.add(simplified);
    return true;
  });
}
