import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History as HistoryIcon, Truck, Bell, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { tickets, users } from "@/data/mocks";

const History = () => {
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

  const userTicketsHistory = tickets
    .filter(t => t.clienteId === user.id && (t.estado === "Completado" || t.estado === "Retirado" || t.estado === "Cancelado"))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "contenedorId", 
      label: "Contenedor",
      render: (value: string) => <span className="font-mono text-sm">{value}</span>
    },
    { key: "transportista", label: "Transportista" },
    { key: "placa", label: "Placa" },
    { key: "conductor", label: "Conductor" },
    { 
      key: "estado", 
      label: "Estado Final",
      render: (value: string) => {
        const variants: Record<string, string> = {
          "Completado": "bg-success text-success-foreground",
          "Retirado": "bg-success text-success-foreground",
          "Cancelado": "bg-destructive text-destructive-foreground"
        };
        return (
          <Badge className={variants[value] || "bg-muted"}>
            {value}
          </Badge>
        );
      }
    },
    { key: "fecha", label: "Fecha" },
    { key: "turno", label: "Turno" },
  ];

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: HistoryIcon },
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Historial de Tickets</h1>
            <p className="text-muted-foreground">Consulta el historial completo de tickets completados</p>
          </div>

          <DataTable
            columns={columns}
            data={userTicketsHistory}
            searchKeys={["contenedorId", "transportista", "placa", "conductor"]}
            itemsPerPage={10}
          />
        </main>
      </div>
    </div>
  );
};

export default History;
