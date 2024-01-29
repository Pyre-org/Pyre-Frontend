import Logo from "@renderer/components/Logo";

function LoadingPage() {
  return (
    <div className="justify-center items-center w-full min-h-screen flex flex-col gap-4">
      <Logo />
      <p>로딩 중입니다...</p>
      {/* Loader */}
    </div>
  );
}

export default LoadingPage;
