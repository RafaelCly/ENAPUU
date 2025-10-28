import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, reportData } from "@/data/mocks";

const ReportsView = () => {
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
          <h1 className="text-3xl font-bold mb-6">Reportes y Analítica</h1>
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>Tiempos de Espera Promedio</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.tiemposEspera.map((item) => (
                    <div key={item.fecha} className="flex justify-between p-2 bg-muted rounded">
                      <span>{item.fecha}</span>
                      <span className="font-semibold">{item.promedio} min</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Volumen de Contenedores</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.volumenContenedores.map((item) => (
                    <div key={item.fecha} className="flex justify-between p-2 bg-muted rounded">
                      <span>{item.fecha}</span>
                      <span className="font-semibold">{item.cantidad} contenedores</span>
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

export default ReportsView;
