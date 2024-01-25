import { AppShell, Button, TextInput } from "@mantine/core";
import { HashtagIcon } from "@heroicons/react/16/solid";
import { Link, Outlet } from "react-router-dom";
import classes from "./MainPageLayout.module.css";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import { NAVBAR_MENUS } from "@renderer/constants/layout";
import Profile from "@renderer/components/Profile";

function MainPageLayout() {
  const [asideOpened] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: "xs",
      }}
      aside={{
        width: 200,
        breakpoint: "xs",
        collapsed: {
          desktop: !asideOpened,
          mobile: !asideOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header
        bg="darknavy.8"
        className={clsx(classes.Header, "shadow-lg")}
      >
        {/* <Logo />
        <Group>
          <TextInput
            leftSection={<MagnifyingGlassIcon className="h-6 w-6" />}
            placeholder="검색하기"
          />
          <ActionIcon onClick={toggleAside}>
            <ChevronLeftIcon
              className={clsx("w-6 h-6", asideOpened && "rotate-180")}
            />
          </ActionIcon>
          <Profile />
        </Group> */}
        <div className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <TextInput
            className="w-64 text-white rounded-md px-2 py-1"
            placeholder="검색"
            type="search"
            classNames={{ input: "!bg-gray-800" }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Link className="text-white hover:underline" to="#">
            <Button variant="subtle" size="sm">
              마이 페이지
            </Button>
          </Link>
          <Link className="text-white hover:underline" to="#">
            <Button variant="subtle" size="sm">
              설정
            </Button>
          </Link>
          <Profile />
        </div>
      </AppShell.Header>
      <AppShell.Navbar p="sm" bg="darknavy.8">
        <AppShell.Section>
          <h2 className="text-lg font-semibold mb-2">방 목록</h2>
        </AppShell.Section>
        <AppShell.Section>
          <Link to="/">
            <Button
              leftSection={<HashtagIcon className="w-5 h-5" />}
              variant="subtle"
              justify="start"
              fullWidth
            >
              전체
            </Button>
          </Link>
        </AppShell.Section>
        {NAVBAR_MENUS.map((menu) => (
          <AppShell.Section key={menu.name}>
            <Link to={menu.href}>
              <Button
                leftSection={<HashtagIcon className="w-5 h-5" />}
                variant="subtle"
                justify="start"
                fullWidth
              >
                {menu.name}
              </Button>
            </Link>
          </AppShell.Section>
        ))}
      </AppShell.Navbar>
      <AppShell.Main bg="darknavy.7">
        <Outlet />
      </AppShell.Main>
      <AppShell.Aside bg="darknavy.8" p="sm">
        <AppShell.Section>
          <h2 className="text-lg font-semibold mb-2">채널 목록</h2>
        </AppShell.Section>
        <AppShell.Section>
          <Link to="/">
            <Button
              leftSection={<HashtagIcon className="w-5 h-5" />}
              variant="subtle"
              justify="start"
              fullWidth
            >
              전체
            </Button>
          </Link>
        </AppShell.Section>
        {NAVBAR_MENUS.map((menu) => (
          <AppShell.Section key={menu.name}>
            <Link to={menu.href}>
              <Button
                leftSection={<HashtagIcon className="w-5 h-5" />}
                variant="subtle"
                justify="start"
                fullWidth
              >
                {menu.name}
              </Button>
            </Link>
          </AppShell.Section>
        ))}
      </AppShell.Aside>
    </AppShell>
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
