import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tickets, notifications, users } from "@/data/mocks";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    if (!storedUserId || storedRole !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    const foundUser = users.find(u => u.id === parseInt(storedUserId));
    setUser(foundUser);
  }, [navigate]);

  if (!user) return null;

  const userTickets = tickets.filter(t => t.clienteId === user.id);
  const activeTickets = userTickets.filter(t => ["Pendiente", "En Proceso", "Validado", "En Cola"].includes(t.estado));
  const userNotifications = notifications.filter(n => n.userId === user.id && !n.leido);
  const nextTurno = userTickets.find(t => t.estado === "Pendiente");

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: History },
    { name: "Gestión de Flota", path: "/client/fleet", icon: Truck },
    //{ name: "Notificaciones", path: "/client/notifications", icon: Bell },
    //{ name: "Perfil", path: "/client/profile", icon: UserIcon },
  ];

  const quickActions = [
    {
      title: "Ver Mis Tickets",
      description: "Consulta el estado de todos tus tickets",
      icon: List,
      action: () => navigate("/client/my-tickets"),
      color: "bg-accent text-accent-foreground hover:bg-accent/90"
    },
    {
      title: "Historial",
      description: "Revisa el historial completo de operaciones",
      icon: History,
      action: () => navigate("/client/history"),
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    },
    {
      title: "Gestionar Flota",
      description: "Administra tus vehículos y conductores",
      icon: Truck,
      action: () => navigate("/client/fleet"),
      color: "bg-success text-success-foreground hover:bg-success/90"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={user.name} notifications={userNotifications.length} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bienvenido, {user.name}
            </h1>
            <p className="text-muted-foreground">
              Panel de control de gestión de tickets
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CardStat
              title="Tickets Activos"
              value={activeTickets.length}
              icon={LayoutGrid}
              trend="+2 este mes"
              variant="default"
            />
            <CardStat
              title="Próximo Turno"
              value={nextTurno ? nextTurno.turno.split("-")[0] : "--:--"}
              icon={Bell}
              trend={nextTurno ? `Slot ${nextTurno.slot}` : "Sin turnos"}
              variant="warning"
            />
            <CardStat
              title="Completados"
              value={userTickets.filter(t => t.estado === "Completado" || t.estado === "Retirado").length}
              icon={History}
              trend="Esta semana"
              variant="success"
            />
            <CardStat
              title="Notificaciones"
              value={userNotifications.length}
              icon={Bell}
              trend="Sin leer"
              variant="destructive"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={action.action}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Tickets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tickets Recientes</h2>
              <Button variant="outline" onClick={() => navigate("/client/my-tickets")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {userTickets.slice(0, 4).map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                        <CardDescription className="text-sm mt-1">{ticket.contenedorId}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.estado === "Completado" || ticket.estado === "Retirado" ? "bg-success text-success-foreground" :
                        ticket.estado === "En Proceso" ? "bg-warning text-warning-foreground" :
                        ticket.estado === "Pendiente" ? "bg-accent text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {ticket.estado}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transportista:</span>
                        <span className="font-medium">{ticket.transportista}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="font-medium">{ticket.placa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Turno:</span>
                        <span className="font-medium">{ticket.turno}</span>
                      </div>
                      {ticket.slot && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <span className="font-medium">{ticket.slot}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
