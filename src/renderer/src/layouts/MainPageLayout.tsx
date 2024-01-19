import { ActionIcon, AppShell, Button, Group, TextInput } from "@mantine/core";
import Logo from "@renderer/components/Logo";
import {
  ChevronLeftIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { Link, Outlet } from "react-router-dom";
import classes from "./MainPageLayout.module.css";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import { NAVBAR_MENUS } from "@renderer/constants/layout";

function MainPageLayout() {
  const [asideOpened, { toggle: toggleAside }] = useDisclosure(false);
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
      withBorder={false}
      padding="md"
    >
      <AppShell.Header
        className={clsx(classes.Header, "shadow-lg")}
        bg="dark.6"
      >
        <Logo />
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
          <Link to="/login">
            <Button variant="light">로그인</Button>
          </Link>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="xs" bg="dark.7">
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
      <AppShell.Main bg="dark.6">
        <Outlet />
      </AppShell.Main>
      <AppShell.Aside>
        <AppShell.Section>Hello world</AppShell.Section>
        <AppShell.Section>Hello world</AppShell.Section>
        <AppShell.Section>Hello world</AppShell.Section>
      </AppShell.Aside>
    </AppShell>
  );
}

export default MainPageLayout;
