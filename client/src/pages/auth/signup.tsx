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

const signupSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { signup, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await signup(data.username, data.password);
      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản của bạn đã được tạo.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra",
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
          <CardTitle className="text-center">Đăng Ký</CardTitle>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác Nhận Mật Khẩu</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      data-testid="input-confirm-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-signup"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Đăng Ký
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Đã có tài khoản?{" "}
            <Link href="/auth/login">
              <a className="text-primary hover:underline" data-testid="link-login">
                Đăng nhập
              </a>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
