import { Button, Card, Text } from "@mantine/core";

function HomePage() {
  return (
    <section className="flex-1 p-4">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-white">스페이스 목록</h2>
        <Button
          className="!text-white border-gray-400 font-bold"
          variant="outline"
        >
          스페이스 생성
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="!bg-gray-800 text-white" p="md">
          <Text c="white" fz="xl" fw="bold">
            Space 1
          </Text>
          <p className="text-slate-400">This is a description of space 1.</p>
        </Card>
        <Card className="!bg-gray-800 text-white" p="md">
          <Text c="white" fz="xl" fw="bold">
            Space 2
          </Text>
          <p className="text-slate-400">This is a description of space 2.</p>
        </Card>
        <Card className="!bg-gray-800 text-white" p="md">
          <Text c="white" fz="xl" fw="bold">
            Space 3
          </Text>
          <p className="text-slate-400">This is a description of space 3.</p>
        </Card>
        <Card className="!bg-gray-800 text-white" p="md">
          <Text c="white" fz="xl" fw="bold">
            Space 4
          </Text>
          <p className="text-slate-400">This is a description of space 4.</p>
        </Card>
      </div>
    </section>
  );
}

export default HomePage;
