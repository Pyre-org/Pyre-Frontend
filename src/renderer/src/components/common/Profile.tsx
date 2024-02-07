import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useLogoutMutation, useMyUser } from "@renderer/lib/queries/auth";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@renderer/components/ui/switch";

function Profile() {
  const { data: user } = useMyUser();
  const { setTheme, theme } = useTheme();
  const logoutMutation = useLogoutMutation();
  const isLogin = !!user;

  const handleLogout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  }, []);

  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setTheme(theme === "light" ? "dark" : "light");
    },
    [theme],
  );

  if (!isLogin)
    return (
      <Button asChild>
        <Link to="/login">로그인</Link>
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{user?.nickname}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex gap-4 items-center p-2">
          <Avatar>
            <AvatarImage src={user.image_url} alt="profile" />
            <AvatarFallback>{user.nickname[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div style={{ flex: 1 }}>
            <p className="text-md">{user.nickname}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-between" onClick={toggleTheme}>
          <div className="flex items-center">
            {theme === "light" ? (
              <Moon className="w-4 h-4 mr-2" />
            ) : (
              <Sun className="w-4 h-4 mr-2" />
            )}
            <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
          </div>
          <Switch checked={theme === "dark"} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-2" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
