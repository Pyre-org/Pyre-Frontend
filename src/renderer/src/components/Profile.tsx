import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Group, Menu, Text } from "@mantine/core";
import { useLogoutMutation, useMyUser } from "@renderer/lib/queries/auth";
import { useCallback } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const { data: user } = useMyUser();
  const logoutMutation = useLogoutMutation();
  const isLogin = !!user;

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, []);

  if (!isLogin)
    return (
      <Link to="/login">
        <Button>로그인</Button>
      </Link>
    );
  return (
    <Menu>
      <Menu.Target>
        <Button variant="subtle">{user?.nickname}</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Group p="sm">
          <Avatar src={user.image_url} radius="xl" />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user.nickname}
            </Text>
            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </div>
        </Group>
        <Menu.Divider />
        <Menu.Item
          leftSection={<ArrowRightStartOnRectangleIcon className="w-4 h-4" />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default Profile;
