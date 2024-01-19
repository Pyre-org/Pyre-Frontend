import { ActionIcon, AppShell, Button, Group, TextInput } from "@mantine/core";
import Logo from "@renderer/components/Logo";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { Link, Outlet } from "react-router-dom";
import classes from "./MainPageLayout.module.css";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";

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
      padding="md"
    >
      <AppShell.Header className={classes.Header}>
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
      <AppShell.Navbar>
        <AppShell.Section>Hello world</AppShell.Section>
        <AppShell.Section>Hello world</AppShell.Section>
        <AppShell.Section>Hello world</AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
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
