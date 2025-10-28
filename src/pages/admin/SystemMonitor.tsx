import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { users, systemLogs } from "@/data/mocks";

const SystemMonitor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    if (!storedUserId || storedRole !== "ADMIN") {
      navigate("/");
      return;
    }
    setUser(users.find(u => u.id === parseInt(storedUserId)));
  }, [navigate]);

  if (!user) return null;

  const columns = [
    { key: "fecha", label: "Fecha/Hora" },
    { key: "modulo", label: "Módulo" },
    { key: "evento", label: "Evento" },
    { 
      key: "nivel", 
      label: "Nivel",
      render: (value: string) => {
        const variant = value === "error" ? "bg-destructive text-destructive-foreground" : 
                       value === "warning" ? "bg-warning text-warning-foreground" : 
                       value === "success" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground";
        return <Badge className={variant}>{value}</Badge>;
      }
    },
    { key: "detalle", label: "Detalle" },
  ];

  const sidebarItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", path: "/admin/users", icon: Users },
    { name: "Configuración", path: "/admin/config", icon: Settings },
    { name: "Reportes", path: "/admin/reports", icon: BarChart3 },
    { name: "Monitor del Sistema", path: "/admin/monitor", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="ADMIN" userName={user.name} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">Monitor del Sistema</h1>
          <DataTable columns={columns} data={systemLogs} searchKeys={["evento", "modulo", "nivel"]} />
        </main>
      </div>
    </div>
  );
};

export default SystemMonitor;
