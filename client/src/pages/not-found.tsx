import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2" data-testid="text-404-title">Không Tìm Thấy Trang</h1>
          <p className="text-muted-foreground mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()} data-testid="button-go-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay Lại
            </Button>
            <Link href="/">
              <Button data-testid="button-go-home">
                <Home className="h-4 w-4 mr-2" />
                Về Trang Chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
