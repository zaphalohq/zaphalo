"use client";
import { useState } from "react";
import { Button } from "@components/UI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/UI/tooltip";
import {
  Copy,
} from "lucide-react";

export default function CopyInviteLinkButton({
  link,
}: {
  link: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined}>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" /> Copy Invite Link
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy link with parameters"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
