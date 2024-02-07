import { Link, Outlet, useParams } from "react-router-dom";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import Profile from "@renderer/components/common/Profile";
import ChannelList from "./ChannelList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@renderer/components/ui/resizable";
import RoomList from "./RoomList";

function MainPageLayout() {
  const { channelId } = useParams<{ channelId: string }>();

  return (
    <div className="flex flex-col h-screen w-full bg-background divide-y overflow-hidden">
      <header className="h-[60px] flex justify-between px-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          <Input
            className="w-64 rounded-md px-2 py-1"
            placeholder="검색"
            type="search"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" asChild>
            <Link to="/">마이 페이지</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/channels">채널</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="#">설정</Link>
          </Button>
          <Profile />
        </div>
      </header>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 divide-x"
      >
        <ResizablePanel defaultSize={20} minSize={20} maxSize={40}>
          <nav className="flex flex-col bg-background p-4 text-muted-foreground w-full overflow-y-scroll h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
            {channelId ? (
              <RoomList />
            ) : (
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-sm">아직 선택된 채널이 없습니다</span>
                <span className="text-sm">채널을 선택해주세요</span>
              </div>
            )}
          </nav>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={40}>
          <main className="flex-1 w-full overflow-y-scroll h-full scrollbar-thumb-border scrollbar-thin scrollbar-track-transparent">
            <Outlet />
          </main>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={20} maxSize={40}>
          <aside className="flex flex-col p-4 bg-background text-muted-foreground overflow-y-scroll h-full scrollbar-thumb-border scrollbar-thin scrollbar-track-transparent">
            <ChannelList />
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default MainPageLayout;
