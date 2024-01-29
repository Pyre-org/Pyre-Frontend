import { Button } from "@renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";

function HomePage() {
  return (
    <section className="flex-1 p-4">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">스페이스 목록</h2>
        <Button className="font-bold">스페이스 생성</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Space 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a description of space 1.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Space 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a description of space 2.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Space 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a description of space 3.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Space 4</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a description of space 4.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default HomePage;
