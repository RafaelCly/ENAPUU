import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, systemConfig, portsSlots } from "@/data/mocks";

const SystemConfigView = () => {
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
          <h1 className="text-3xl font-bold mb-6">Configuración del Sistema (Solo Lectura)</h1>
          <div className="grid gap-6 max-w-4xl">
            <Card>
              <CardHeader><CardTitle>Horario de Operación</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Inicio:</strong> {systemConfig.horarioOperacion.inicio}</p>
                <p><strong>Fin:</strong> {systemConfig.horarioOperacion.fin}</p>
                <p><strong>Días:</strong> {systemConfig.horarioOperacion.diasLaborales.join(", ")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Slots Disponibles (Solo Vista)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {portsSlots.map(slot => (
                    <div key={slot.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{slot.nombre}</p>
                      <p className="text-sm text-muted-foreground">{slot.zona}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemConfigView;
