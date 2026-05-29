import { getContent } from "@/lib/content";
import { extractNewsImage, sortNewsByDate } from "@/lib/news-media";
import type { GovNews } from "@/lib/types";

export type PressHubItem = GovNews & {
  detailHref: string;
};

/** Лента главной: пресс-релизы + новости, с реальными фото. */
export function getPressHubFeed(limit = 50): PressHubItem[] {
  const { news, pressReleases } = getContent();
  const items: PressHubItem[] = [
    ...sortNewsByDate(pressReleases).map((pr) => ({
      ...pr,
      detailHref: `/press/releases/details/${pr.id}`,
    })),
    ...sortNewsByDate(news).map((n) => ({
      ...n,
      detailHref: `/press/news/details/${n.id}`,
    })),
  ];
  const withImg: PressHubItem[] = [];
  const rest: PressHubItem[] = [];
  for (const item of items) {
    if (extractNewsImage(item)) withImg.push(item);
    else rest.push(item);
  }
  return [...withImg, ...rest].slice(0, limit);
}
