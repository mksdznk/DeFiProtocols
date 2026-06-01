import { BookOpen, Clock, ExternalLink, PlayCircle } from "lucide-react";
import type {
  ArticleResource,
  ProtocolConfig,
  ResourceDifficulty,
  VideoResource,
} from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtocolSection } from "./ProtocolSection";

const DIFFICULTY_LABEL: Record<ResourceDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function VideoCard({ video }: { video: VideoResource }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="h-full overflow-hidden bg-card/60 transition-colors group-hover:border-[var(--protocol-accent)]/50">
        <div className="flex aspect-video items-center justify-center bg-muted/50">
          {video.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <PlayCircle
              className="size-10 text-muted-foreground/60 transition-colors group-hover:text-[var(--protocol-accent)]"
              aria-hidden
            />
          )}
        </div>
        <CardContent className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{DIFFICULTY_LABEL[video.difficulty]}</Badge>
            <span className="text-xs text-muted-foreground">{video.source}</span>
            {video.durationMinutes && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" aria-hidden />
                {video.durationMinutes}m
              </span>
            )}
          </div>
          <h3 className="font-medium leading-snug">{video.title}</h3>
          <p className="text-sm text-muted-foreground">{video.description}</p>
        </CardContent>
      </Card>
    </a>
  );
}

function ArticleRow({ article }: { article: ArticleResource }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group focus-visible:ring-ring flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-4 transition-colors hover:border-[var(--protocol-accent)]/50 focus-visible:ring-2 focus-visible:outline-none"
    >
      <BookOpen
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium leading-snug">{article.title}</h3>
          <ExternalLink
            className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
            aria-hidden
          />
        </div>
        <p className="text-sm text-muted-foreground">{article.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.category && <span>{article.category}</span>}
          {article.readingMinutes && (
            <>
              <span aria-hidden>·</span>
              <span>{article.readingMinutes} min read</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

export function ProtocolResources({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { videos, articles } = config.resources;
  if (videos.length === 0 && articles.length === 0) return null;

  return (
    <ProtocolSection
      id={id}
      title={title}
      description={`Learn how ${config.name} works before you use it.`}
    >
      {videos.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
      {articles.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      )}
    </ProtocolSection>
  );
}
