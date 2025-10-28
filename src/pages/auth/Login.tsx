import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserCog, ShieldCheck, Ship, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetPath, setTargetPath] = useState<string>("/");

  const roles = [
    {
      id: "CLIENTE",
      name: "Cliente",
      description: "Gestiona tus tickets y flota",
      icon: User,
      path: "/client/dashboard",
      demoEmail: "cliente@enapu.pe",
      demoPassword: "1234",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    },
    {
      id: "OPERARIO",
      name: "Operario",
      description: "Valida y procesa tickets",
      icon: UserCog,
      path: "/operator/panel",
      demoEmail: "operador@enapu.pe",
      demoPassword: "1234",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    },
    {
      id: "ADMIN",
      name: "Administrador",
      description: "Gestiona el sistema completo",
      icon: ShieldCheck,
      path: "/admin/dashboard",
      demoEmail: "admin@enapu.pe",
      demoPassword: "1234",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    }
  ];

  // Se llama al presionar la tarjeta: abre el formulario pre-llenado
  const openLoginFormForRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    setSelectedRole(roleId);
    setEmail(role.demoEmail);
    setPassword(role.demoPassword);
    setTargetPath(role.path);
    setShowForm(true);
  };

  const simulateLogin = (roleId: string) => {
    // Simular login guardando en localStorage
    localStorage.setItem("userRole", roleId);
    localStorage.setItem("userId", roleId === "CLIENTE" ? "1" : roleId === "OPERARIO" ? "3" : "5");
    toast.success(`Bienvenido al sistema ENAPU`, {
      description: `Has ingresado como ${roles.find(r => r.id === roleId)?.name}`
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedRole) {
      toast.error("Selecciona un rol antes de continuar");
      return;
    }

    // Aquí podrías agregar validaciones de email/password.
    simulateLogin(selectedRole);

    setTimeout(() => {
      navigate(targetPath);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Ship className="h-14 w-14 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">ENAPU</h1>
              <p className="text-white/90 text-sm">Sistema de Gestión de Tickets</p>
            </div>
          </div>
          <p className="text-white/80 text-lg">Selecciona tu rol para ingresar al sistema</p>
        </div>

        {/* Role Cards OR Login Screen */}
        {!showForm ? (
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    selectedRole === role.id ? 'ring-4 ring-white' : ''
                  }`}
                  onClick={() => openLoginFormForRole(role.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${role.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full ${role.color}`} size="lg" onClick={() => openLoginFormForRole(role.id)}>
                      Ingresar como {role.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
              <button
                className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                onClick={() => { setShowForm(false); setSelectedRole(null); }}
              >
                <ArrowLeft className="mr-2" /> Volver
              </button>

              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-md mb-3">
                  <Ship className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
                <p className="text-sm text-gray-500">{roles.find(r => r.id === selectedRole)?.name}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2"
                    placeholder="usuario@enapu.pe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2"
                    placeholder="********"
                    required
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full bg-primary text-white">Iniciar Sesión</Button>
                </div>

                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="font-medium mb-1">Credenciales de prueba:</div>
                  <ul className="list-disc list-inside">
                    <li>Admin: admin@enapu.pe / 1234</li>
                    <li>Operador: operador@enapu.pe / 1234</li>
                    <li>Cliente: cliente@enapu.pe / 1234</li>
                  </ul>
                  <div className="mt-1 italic text-xs text-gray-500">O cualquier correo/contraseña para modo DEMO</div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>© 2024 ENAPU - Empresa Nacional de Puertos S.A.</p>
          <p className="mt-1">Sistema de gestión portuaria con datos simulados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
