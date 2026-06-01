import type { ProtocolConfig } from "@/protocols/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProtocolSection } from "./ProtocolSection";

export function FAQSection({
  config,
  id,
  title,
}: {
  config: ProtocolConfig;
  id: string;
  title: string;
}) {
  const { faqs } = config.resources;
  if (faqs.length === 0) return null;

  return (
    <ProtocolSection id={id} title={title}>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ProtocolSection>
  );
}
