import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.username, data.password);
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn quay lại.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Đăng Nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Đăng Nhập</FormLabel>
                    <Input
                      {...field}
                      placeholder="Nhập tên đăng nhập"
                      data-testid="input-username"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật Khẩu</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Nhập mật khẩu"
                      data-testid="input-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-login"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Đăng Nhập
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Chưa có tài khoản?{" "}
            <Link href="/auth/signup">
              <a className="text-primary hover:underline" data-testid="link-signup">
                Đăng ký
              </a>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
