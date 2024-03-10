import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { SendIcon } from "lucide-react";

function ChatDetail() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* chat section */}
      <div className="flex-1 overflow-y-scroll scrollbar-thin">
        <div className="flex flex-col gap-2">
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
          <div className="bg-blue-400 h-[200px]"></div>
        </div>
      </div>
      <div className="flex gap-2 w-full p-4">
        <Input className="flex-1" />
        <Button className="shrink-0" size="icon">
          <SendIcon color="currentColor" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default ChatDetail;
