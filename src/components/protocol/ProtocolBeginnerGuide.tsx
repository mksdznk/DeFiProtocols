import { Lightbulb, Sparkles } from "lucide-react";
import type { ProtocolConfig } from "@/protocols/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProtocolSection } from "./ProtocolSection";

/**
 * The newcomer's entry point: a friendly, jargon-free "Start here" shown first
 * on every protocol page. Plain-language summary, an everyday analogy, and a few
 * simple first steps — so a total beginner understands what this is and how to
 * begin before meeting any of the denser sections below.
 */
export function ProtocolBeginnerGuide({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { beginner, name } = config;

  return (
    <ProtocolSection id={id} title={title}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card/60 lg:col-span-2">
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium text-protocol">
                <Sparkles className="size-4" aria-hidden />
                In simple words
              </p>
              <p className="text-xl leading-relaxed text-balance">
                {beginner.inSimpleTerms}
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-protocol/20 bg-protocol/5 p-4">
              <Lightbulb
                className="mt-0.5 size-5 shrink-0 text-protocol"
                aria-hidden
              />
              <p className="text-sm">
                <span className="font-medium">Think of it like this: </span>
                {beginner.analogy}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardContent className="space-y-4">
            <h3 className="font-medium">Your first steps</h3>
            <ol className="space-y-3">
              {beginner.firstSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--protocol-accent)",
                      color: "var(--protocol-accent-foreground)",
                    }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">
              New to {name}? Take it one step at a time — you can read more below
              before you try anything.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtocolSection>
  );
}
