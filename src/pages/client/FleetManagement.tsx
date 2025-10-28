import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { fleet, users } from "@/data/mocks";


const FleetManagement = () => {
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

  const userFleet = fleet.filter(f => f.clienteId === user.id);

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "placa", 
      label: "Placa",
      render: (value: string) => <span className="font-mono font-semibold">{value}</span>
    },
    { key: "conductor", label: "Conductor" },
    { key: "tipo", label: "Tipo de Vehículo" },
    { 
      key: "estado", 
      label: "Estado",
      render: (value: string) => {
        const variant = value === "Activo" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground";
        return <Badge className={variant}>{value}</Badge>;
      }
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Flota</h1>
            <p className="text-muted-foreground">Administra tus vehículos y conductores registrados</p>
          </div>

          <DataTable
            columns={columns}
            data={userFleet}
            searchKeys={["placa", "conductor", "tipo"]}
            itemsPerPage={10}
          />
        </main>
      </div>
    </div>
  );
};

export default FleetManagement;
