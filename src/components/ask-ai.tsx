import { Icon } from "@iconify/react";
import { Copy } from "@nsmr/pixelart-react";
import { useRef, useState } from "react";
import { AI_SUMMARY_PROMPT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const chatGptUrl = "https://chat.openai.com/?q=";
const claudeUrl = "https://claude.ai/new?q=";

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
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

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
          className="text-fg hover:text-accent"
          title={"Ask ChatGPT"}
        >
          <Icon icon="simple-icons:openai" className="size-6" />
        </a>
        <a
          href={`${claudeUrl}${encodedPrompt}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg hover:text-accent"
          title="Ask Claude"
        >
          <Icon icon="simple-icons:claude" className="size-6" />
        </a>
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={handleCopy}
            className="text-fg hover:text-accent cursor-pointer flex items-center"
            title="Copy prompt to clipboard"
            aria-label="Copy prompt to clipboard"
          >
            <Copy className="size-6" />
          </button>
          <span
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-background border opacity-0 pointer-events-none whitespace-nowrap",
              copied && "opacity-100",
            )}
          >
            Copied to clipboard
          </span>
        </div>
      </div>
    </div>
  );
}
