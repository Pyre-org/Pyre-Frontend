import { Button, Center } from "@mantine/core";

function HomePage() {
  const handleClick = async () => {
    const screenInfo = await window.api.getPrimaryScreen();
    const sources = await window.api.getSources({
      types: ["window", "screen"],
      thumbnailSize: screenInfo.size,
    });
    console.log(sources);
  };

  return (
    <Center>
      <Button onClick={handleClick}>Hello</Button>
    </Center>
  );
}

export default HomePage;
