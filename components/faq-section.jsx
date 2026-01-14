'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export function FAQSection() {
  return (
    <section className="w-full py-16 md:py-28 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            💬 FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about Watshibo and getting started
          </p>
        </div>

        <div className="max-w-3xl mx-auto" suppressHydrationWarning>
          <Accordion type="single" collapsible suppressHydrationWarning>
            {faqs.map((f, idx) => (
              <AccordionItem 
                key={`faq-${idx}`} 
                value={`item-${idx}`} 
                className="border-b border-border/30"
                suppressHydrationWarning
              >
                <AccordionTrigger 
                  className="text-lg font-semibold hover:text-primary transition-colors py-5"
                  suppressHydrationWarning
                >
                  {f.question}
                </AccordionTrigger>
                <AccordionContent suppressHydrationWarning>
                  <p className="text-muted-foreground text-base leading-relaxed">{f.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
