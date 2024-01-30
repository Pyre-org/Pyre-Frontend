import { HashtagIcon } from "@heroicons/react/16/solid";
import { Button } from "@renderer/components/ui/button";
import { NAVBAR_MENUS } from "@renderer/constants/layout";
import {
  useGetChannels,
  useGetMyChannels,
} from "@renderer/lib/queries/channel";
import { Link } from "react-router-dom";

function ChannelList() {
  const { data: publicChannelData } = useGetChannels({});
  const { data: myChannelData } = useGetMyChannels();

  console.log(publicChannelData, myChannelData);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">
            내 채널
          </h2>
        </div>
        <Button variant="ghost" className="justify-start" asChild>
          <Link to="/">
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
      </div>
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">탐색</h2>
        </div>
        <Button variant="ghost" className="justify-start" asChild>
          <Link to="/">
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
      </div>
    </div>
  );
}

export default ChannelList;
