import { Car, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function CustomerFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Cho Thuê Xe</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hệ thống cho thuê xe uy tín, chuyên nghiệp. Đa dạng dòng xe từ sedan, SUV đến xe thể thao. 
              Cam kết giá tốt nhất, dịch vụ tốt nhất.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-cars">
                  Xe Cho Thuê
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. HCM</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>0909 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@chothuexe.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cho Thuê Xe. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
