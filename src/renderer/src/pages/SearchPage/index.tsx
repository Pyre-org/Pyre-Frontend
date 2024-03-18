import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const tabs = [
  {
    id: "room",
    label: "룸",
  },
  {
    id: "channel",
    label: "채널",
  },
  {
    id: "space",
    label: "스페이스",
  },
  {
    id: "user",
    label: "유저",
  },
];

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [input, setInput] = useState(keyword);

  const handleSearch = () => {
    navigate(`/search?keyword=${input}`);
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
      <h2 className="text-lg font-semibold">&quot;{keyword}&quot; 검색 결과</h2>
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
      <Tabs defaultValue={tabs[0].id}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default SearchPage;
