import { useState } from "react";
import { LogIn, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { tickets } from "@/data/mocks";

interface RegisterEntryProps {
  operatorName: string;
}

const RegisterEntry = ({ operatorName }: RegisterEntryProps) => {
  const [registeredTickets, setRegisteredTickets] = useState<number[]>([]);
  
  const validatedTickets = tickets.filter(t => 
    t.estado === "Validado" || t.estado === "En Cola"
  );

  const handleRegisterEntry = (ticketId: number) => {
    const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    toast.success("Ingreso registrado", {
      description: `Vehículo ingresó al puerto a las ${now}`
    });

    setRegisteredTickets(prev => [...prev, ticketId]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Registrar Ingreso de Vehículos
          </CardTitle>
          <CardDescription>
            Tickets validados listos para ingresar al puerto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validatedTickets.length === 0 ? (
            <div className="text-center py-12">
              <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets validados pendientes de ingreso
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validatedTickets.map((ticket) => {
                const isRegistered = registeredTickets.includes(ticket.id);
                
                return (
                  <Card key={ticket.id} className={isRegistered ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{ticket.contenedorId}</p>
                        </div>
                        <Badge className={
                          isRegistered 
                            ? "bg-success text-success-foreground" 
                            : "bg-warning text-warning-foreground"
                        }>
                          {isRegistered ? "Ingresado" : ticket.estado}
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
                          <span className="text-muted-foreground">Turno:</span>
                          <span className="font-medium">{ticket.turno}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <Badge variant="outline">{ticket.slot}</Badge>
                        </div>
                      </div>

                      {isRegistered ? (
                        <div className="flex items-center justify-center gap-2 p-3 bg-success/10 text-success rounded-lg">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Ingresado a las {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleRegisterEntry(ticket.id)}
                          className="w-full"
                          size="lg"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Registrar Ingreso
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

export default RegisterEntry;
