import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCalendar from "@/pages/admin/Calendar";
import AdminServices from "@/pages/admin/Services";
import AdminTeam from "@/pages/admin/Team";
import AdminClients from "@/pages/admin/Clients";
import BookingFlow from "@/pages/booking/BookingFlow";
import ClientDashboard from "@/pages/client/Dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/calendar" component={AdminCalendar} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/book/:barbershopSlug" component={BookingFlow} />
      <Route path="/client" component={ClientDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
