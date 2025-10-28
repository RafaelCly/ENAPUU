import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tickets, users, portsSlots } from "@/data/mocks";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    if (!storedUserId || storedRole !== "ADMIN") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    const foundUser = users.find(u => u.id === parseInt(storedUserId));
    setUser(foundUser);
  }, [navigate]);

  if (!user) return null;

  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => ["Pendiente", "En Proceso", "Validado"].includes(t.estado)).length;
  const totalUsers = users.length;
  const availableSlots = portsSlots.filter(s => s.disponible).length;

  const sidebarItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", path: "/admin/users", icon: Users },
    { name: "Configuración", path: "/admin/config", icon: Settings },
    { name: "Reportes", path: "/admin/reports", icon: BarChart3 },
    { name: "Monitor del Sistema", path: "/admin/monitor", icon: Activity },
  ];

  const quickLinks = [
    { title: "Gestión de Usuarios", path: "/admin/users", icon: Users, description: "Ver usuarios del sistema" },
    { title: "Configuración", path: "/admin/config", icon: Settings, description: "Configuración del sistema" },
    { title: "Reportes", path: "/admin/reports", icon: BarChart3, description: "Analítica y reportes" },
    { title: "Monitor", path: "/admin/monitor", icon: Activity, description: "Logs del sistema" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="ADMIN" userName={user.name} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Vista general del sistema ENAPU</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CardStat title="Total Tickets" value={totalTickets} icon={LayoutDashboard} variant="default" />
            <CardStat title="Tickets Activos" value={activeTickets} icon={Activity} variant="warning" />
            <CardStat title="Usuarios Registrados" value={totalUsers} icon={Users} variant="success" />
            <CardStat title="Slots Disponibles" value={availableSlots} icon={Settings} variant="destructive" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card key={link.path} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(link.path)}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
