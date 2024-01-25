import { Loader, Text } from "@mantine/core";
import Logo from "@renderer/components/Logo";

function LoadingPage() {
  return (
    <div className="justify-center items-center w-full min-h-screen flex flex-col gap-4">
      <Logo />
      <Text className="text-white">로딩 중입니다...</Text>
      <Loader size="lg" />
    </div>
  );
}

export default LoadingPage;
