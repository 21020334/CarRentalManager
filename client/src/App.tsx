import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CarsPage from "@/pages/cars";
import CarDetailPage from "@/pages/car-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCarsPage from "@/pages/admin/cars";
import AdminBookingsPage from "@/pages/admin/bookings";
import { AdminLayout } from "@/pages/admin/layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cars" component={CarsPage} />
      <Route path="/cars/:id" component={CarDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/cars">
        <AdminLayout>
          <AdminCarsPage />
        </AdminLayout>
      </Route>
      <Route path="/admin/bookings">
        <AdminLayout>
          <AdminBookingsPage />
        </AdminLayout>
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
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
