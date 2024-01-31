import { HashtagIcon } from "@heroicons/react/16/solid";
import { Link, Outlet } from "react-router-dom";
import { NAVBAR_MENUS } from "@renderer/constants/layout";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import Profile from "@renderer/components/Profile";
import ChannelList from "./ChannelList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@renderer/components/ui/resizable";

function MainPageLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background divide-y">
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
          <nav className="flex flex-col bg-background p-4 text-muted-foreground w-full">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-foreground">
                방 목록
              </h2>
            </div>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/" className="justify-start">
                <HashtagIcon className="w-5 h-5 mr-2" />
                <span>전체</span>
              </Link>
            </Button>
            {NAVBAR_MENUS.map((menu) => (
              <Button
                variant="ghost"
                className="justify-start"
                key={menu.name}
                asChild
              >
                <Link to={menu.href}>
                  <HashtagIcon className="w-5 h-5 mr-2" />
                  <span>{menu.name}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={40}>
          <main className="flex-1 w-full">
            <Outlet />
          </main>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={20} maxSize={40}>
          <aside className="flex flex-col p-4 bg-background text-muted-foreground">
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
