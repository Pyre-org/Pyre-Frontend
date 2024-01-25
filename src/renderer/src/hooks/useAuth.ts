import { useMyUser } from "@renderer/lib/queries/auth";
import { IProfile } from "@renderer/types/schema";

interface IUseAuthReturn {
  status: "loading" | "authenticated" | "unauthenticated";
  user?: IProfile;
}

export const useAuth = (): IUseAuthReturn => {
  const { data: user, isLoading } = useMyUser();
  return {
    status: isLoading ? "loading" : user ? "authenticated" : "unauthenticated",
    user,
  };
};
