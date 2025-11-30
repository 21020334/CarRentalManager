import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CarsPage from "@/pages/cars";
import CarDetailPage from "@/pages/car-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCarsPage from "@/pages/admin/cars";
import AdminBookingsPage from "@/pages/admin/bookings";
import { AdminLayout } from "@/pages/admin/layout";

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <NotFound />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cars" component={CarsPage} />
      <Route path="/cars/:id" component={CarDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/admin">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/cars">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminCarsPage />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/bookings">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminBookingsPage />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="car-rental-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
