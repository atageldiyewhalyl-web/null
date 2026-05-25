import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Accordion05Item = {
  id: string;
  title: string;
  content: string;
};

const items: Accordion05Item[] = [
  {
    id: "1",
    title: "Who am I?",
    content:
      "I’m Ali Imam — a designer and creative developer focused on building digital experiences that are minimal, meaningful, and timeless.",
  },
  {
    id: "2",
    title: "What do I design?",
    content:
      "I create clean, functional interfaces, brand systems, and digital products. My work blends simplicity with clarity and usability.",
  },
  {
    id: "3",
    title: "My design approach",
    content:
      "For me, design isn’t just visuals — it’s how something feels and works. I focus on clarity, detail, and storytelling in every project.",
  },
  {
    id: "4",
    title: "Beyond design",
    content:
      "I bridge design and development, turning ideas into interactive experiences with modern tools and technology.",
  },
  {
    id: "5",
    title: "What inspires me",
    content:
      "Minimalism, architecture, and everyday details. I believe great design is found in the small things we often overlook.",
  },
  {
    id: "6",
    title: "Who I work with",
    content:
      "I collaborate with startups, brands, and individuals who value thoughtful design and want to create lasting impact.",
  },
  {
    id: "7",
    title: "My toolkit",
    content:
      "Figma, Next.js, and modern frameworks are part of my process — but for me, tools always serve the idea, not the other way around.",
  },
  {
    id: "8",
    title: "Let’s connect",
    content:
      "You can reach me through contact@aliimam.in or on social platforms. I’m always open to new projects, collaborations, and conversations.",
  },
];

export function Accordion05({
  className,
  defaultValue = "1",
  items: accordionItems = items,
}: {
  className?: string;
  defaultValue?: string;
  items?: Accordion05Item[];
}) {
  return (
    <div className={cn("w-full max-w-5xl", className)}>
      <Accordion type="single" defaultValue={defaultValue} collapsible className="w-full">
        {accordionItems.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-[#d8dde7] last:border-b">
            <AccordionTrigger className="group h-[4.85rem] cursor-pointer overflow-hidden pl-0 text-left text-[#0e0e10]/18 duration-200 hover:no-underline data-[state=open]:h-auto data-[state=open]:min-h-[5.6rem] data-[state=open]:text-primary [&>svg:last-child]:hidden">
              <div className="flex flex-1 items-start gap-4 md:gap-8">
                <p className="mt-2 min-w-8 text-xs font-bold tracking-[-0.02em] text-[#0e0e10]/75 md:mt-3">
                  {item.id}
                </p>
                <h3 className="relative -mt-1 text-left text-3xl font-bold uppercase leading-[0.9] tracking-[-0.075em] md:text-[3.65rem]">
                  {item.title}
                </h3>
              </div>
              <PlusIcon className="mt-2 h-5 w-5 shrink-0 text-current transition-transform duration-200 group-data-[state=open]:rotate-45" />
            </AccordionTrigger>

            <AccordionContent className="pb-7 pl-12 text-[1rem] font-medium leading-relaxed tracking-[-0.02em] text-muted-foreground md:px-20">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
