import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoomSearchTab from "./RoomSearchTab";
import SpaceSearchTab from "./SpaceSearchTab";

export const SIZE = 15;

export interface ITabItemCompProps {
  keyword: string;
  page: number;
  size: number;
}

interface ITabItem {
  id: string;
  label: string;
  comp: React.FC<ITabItemCompProps>;
}

const tabs: ITabItem[] = [
  {
    id: "room",
    label: "룸",
    comp: RoomSearchTab,
  },
  {
    id: "space",
    label: "스페이스",
    comp: SpaceSearchTab,
  },
];

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const curTab = searchParams.get("tab") || tabs[0].id;
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || SIZE.toString());
  const [input, setInput] = useState(keyword);

  const handleSearch = () => {
    navigate(`/search?keyword=${input}&tab=${curTab}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setInput(keyword);
  }, [keyword]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {keyword && (
        <h2 className="text-lg font-semibold">
          &quot;{keyword}&quot; 검색 결과
        </h2>
      )}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="검색어를 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" className="shrink-0" onClick={handleSearch}>
          <SearchIcon size={16} />
        </Button>
      </div>
      <Tabs defaultValue={curTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="w-[90px]"
              onClick={() =>
                navigate(`/search?tab=${tab.id}&keyword=${keyword}`)
              }
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => {
          const Comp = tab.comp;
          return (
            <TabsContent value={tab.id} key={tab.id} className="mt-4">
              <Comp keyword={keyword} page={page} size={size} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

export default SearchPage;
