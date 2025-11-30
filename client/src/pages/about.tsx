import { Car, Users, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerFooter } from "@/components/customer-footer";

const stats = [
  { icon: Car, value: "50+", label: "Xe Cho Thuê" },
  { icon: Users, value: "1,000+", label: "Khách Hàng" },
  { icon: Award, value: "5+", label: "Năm Kinh Nghiệm" },
  { icon: Clock, value: "24/7", label: "Hỗ Trợ" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-about-title">Về Chúng Tôi</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hệ thống cho thuê xe uy tín hàng đầu Việt Nam với hơn 5 năm kinh nghiệm 
              phục vụ hàng ngàn khách hàng.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Được thành lập từ năm 2019, Cho Thuê Xe bắt đầu với sứ mệnh mang đến 
                    trải nghiệm thuê xe đơn giản, thuận tiện và chất lượng cao cho mọi 
                    khách hàng tại Việt Nam.
                  </p>
                  <p>
                    Từ những ngày đầu với chỉ 5 chiếc xe, chúng tôi đã phát triển thành 
                    một trong những đơn vị cho thuê xe lớn nhất khu vực với đội ngũ hơn 
                    50 chiếc xe đa dạng từ sedan, SUV đến xe thể thao sang trọng.
                  </p>
                  <p>
                    Với phương châm "Khách hàng là trọng tâm", chúng tôi không ngừng 
                    nỗ lực để nâng cao chất lượng dịch vụ, đảm bảo mỗi chuyến đi của 
                    bạn đều là một trải nghiệm tuyệt vời.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center hover-elevate">
                    <CardContent className="pt-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Giá Trị Cốt Lõi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chất Lượng</h3>
                <p className="text-muted-foreground">
                  Tất cả xe đều được bảo dưỡng định kỳ, đảm bảo an toàn và 
                  hoạt động tốt nhất cho mỗi chuyến đi.
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tận Tâm</h3>
                <p className="text-muted-foreground">
                  Đội ngũ nhân viên chuyên nghiệp, thân thiện, luôn sẵn sàng 
                  hỗ trợ khách hàng 24/7.
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nhanh Chóng</h3>
                <p className="text-muted-foreground">
                  Quy trình đặt xe đơn giản, xác nhận nhanh chóng trong vòng 
                  15 phút, tiết kiệm thời gian của bạn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}
