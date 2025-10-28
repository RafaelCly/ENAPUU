import { useState } from "react";
import { LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { tickets } from "@/data/mocks";

interface RegisterExitProps {
  operatorName: string;
}

const RegisterExit = ({ operatorName }: RegisterExitProps) => {
  const [exitedTickets, setExitedTickets] = useState<number[]>([]);
  
  const completedTickets = tickets.filter(t => 
    t.estado === "Completado" || t.estado === "En Proceso"
  );

  const handleRegisterExit = (ticketId: number) => {
    const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    toast.success("Salida registrada", {
      description: `Vehículo salió del puerto a las ${now}`
    });

    setExitedTickets(prev => [...prev, ticketId]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Registrar Salida de Vehículos
          </CardTitle>
          <CardDescription>
            Tickets completados listos para salir del puerto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedTickets.length === 0 ? (
            <div className="text-center py-12">
              <LogOut className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets completados pendientes de salida
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTickets.map((ticket) => {
                const hasExited = exitedTickets.includes(ticket.id);
                
                return (
                  <Card key={ticket.id} className={hasExited ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{ticket.contenedorId}</p>
                        </div>
                        <Badge className={
                          hasExited 
                            ? "bg-muted text-muted-foreground" 
                            : "bg-success text-success-foreground"
                        }>
                          {hasExited ? "Retirado" : ticket.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Placa:</span>
                          <span className="font-mono font-semibold">{ticket.placa}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Conductor:</span>
                          <span className="font-medium">{ticket.conductor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transportista:</span>
                          <span className="font-medium text-xs">{ticket.transportista}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <Badge variant="outline">{ticket.slot}</Badge>
                        </div>
                      </div>

                      {hasExited ? (
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Salida a las {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleRegisterExit(ticket.id)}
                          className="w-full"
                          size="lg"
                          variant="destructive"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Registrar Salida
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterExit;
