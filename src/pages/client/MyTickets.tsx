import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { tickets, users } from "@/data/mocks";

const MyTickets = () => {
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

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "contenedorId", 
      label: "Contenedor",
      render: (value: string) => <span className="font-mono text-sm">{value}</span>
    },
    { key: "transportista", label: "Transportista" },
    { key: "placa", label: "Placa" },
    { 
      key: "estado", 
      label: "Estado",
      render: (value: string) => {
        const variants: Record<string, string> = {
          "Pendiente": "bg-accent text-accent-foreground",
          "En Proceso": "bg-warning text-warning-foreground",
          "Validado": "bg-primary text-primary-foreground",
          "Completado": "bg-success text-success-foreground",
          "Retirado": "bg-success text-success-foreground",
          "En Cola": "bg-muted text-muted-foreground",
          "Cancelado": "bg-destructive text-destructive-foreground"
        };
        return (
          <Badge className={variants[value] || "bg-muted"}>
            {value}
          </Badge>
        );
      }
    },
    { key: "turno", label: "Turno" },
    { key: "fecha", label: "Fecha" },
    { 
      key: "slot", 
      label: "Slot",
      render: (value: string) => value ? <Badge variant="outline">{value}</Badge> : <span className="text-muted-foreground">-</span>
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: History },
    { name: "Gestión de Flota", path: "/client/fleet", icon: Truck },
    //{ name: "Notificaciones", path: "/client/notifications", icon: Bell },
    //{ name: "Perfil", path: "/client/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={user.name} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mis Tickets</h1>
            <p className="text-muted-foreground">Consulta y gestiona todos tus tickets</p>
          </div>

          <DataTable
            columns={columns}
            data={userTickets}
            searchKeys={["contenedorId", "transportista", "placa", "estado"]}
            itemsPerPage={10}
          />
        </main>
      </div>
    </div>
  );
};

export default MyTickets;
