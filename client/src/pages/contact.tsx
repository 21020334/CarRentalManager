import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerFooter } from "@/components/customer-footer";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  message: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: "Địa Chỉ",
    content: "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  },
  {
    icon: Phone,
    title: "Điện Thoại",
    content: "0909 123 456",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@chothuexe.vn",
  },
  {
    icon: Clock,
    title: "Giờ Làm Việc",
    content: "Thứ 2 - Chủ Nhật: 7:00 - 21:00",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-contact-title">Liên Hệ</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Có thắc mắc hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi, 
              đội ngũ nhân viên sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h2>
                <Card>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và Tên</FormLabel>
                              <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} data-testid="input-contact-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} data-testid="input-contact-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Số Điện Thoại</FormLabel>
                                <FormControl>
                                  <Input placeholder="0909123456" {...field} data-testid="input-contact-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nội Dung</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập nội dung tin nhắn của bạn..."
                                  className="min-h-[150px] resize-none"
                                  {...field}
                                  data-testid="input-contact-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" disabled={isSubmitting} className="w-full" data-testid="button-submit-contact">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Đang Gửi...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Gửi Tin Nhắn
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Thông Tin Liên Hệ</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="hover-elevate">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-sm text-muted-foreground">{info.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Bản Đồ</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center rounded-b-lg">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Quận 7, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}
