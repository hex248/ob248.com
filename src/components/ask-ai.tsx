import { Icon } from "@iconify/react";
import { AI_SUMMARY_PROMPT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const chatGptUrl = "https://chat.openai.com/?q=";

export function AskAI({
  name,
  prompt = AI_SUMMARY_PROMPT,
  inline = false,
}: {
  name: string;
  prompt?: string;
  inline?: boolean;
}) {
  const encodedPrompt = encodeURIComponent(prompt);

  return (
    <div
      className={cn(
        "flex flex-col items-end gap-2",
        inline && "flex-row items-center gap-4",
      )}
    >
      <p className="text-fg text-lg text-pretty">Ask AI about {name}:</p>
      <div className="flex items-center gap-4">
        <a
          href={chatGptUrl + encodedPrompt}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg hover:text-accent pointer"
          title={"Ask ChatGPT"}
        >
          <Icon icon="simple-icons:openai" className="size-6" />
        </a>
      </div>
    </div>
  );
}
