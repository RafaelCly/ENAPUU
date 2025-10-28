import { useState, useEffect } from "react";
import { Monitor, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tickets } from "@/data/mocks";

const TurnMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [monitorTickets, setMonitorTickets] = useState(tickets);

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular cambios de estado en tiempo real
  useEffect(() => {
    const stateChanger = setInterval(() => {
      setMonitorTickets(prevTickets => {
        const ticketsWithActiveStates = prevTickets.filter(t => 
          ["Pendiente", "En Cola", "Validado", "En Proceso"].includes(t.estado)
        );
        
        if (ticketsWithActiveStates.length === 0) return prevTickets;
        
        const randomTicket = ticketsWithActiveStates[Math.floor(Math.random() * ticketsWithActiveStates.length)];
        
        return prevTickets.map(t => {
          if (t.id === randomTicket.id) {
            const states = ["En Cola", "Validado", "En Proceso"];
            const currentIndex = states.indexOf(t.estado);
            const nextState = currentIndex >= 0 && currentIndex < states.length - 1 
              ? states[currentIndex + 1] 
              : t.estado;
            
            return { ...t, estado: nextState };
          }
          return t;
        });
      });
    }, 8000); // Cambiar estado cada 8 segundos

    return () => clearInterval(stateChanger);
  }, []);

  const handleRefresh = () => {
    setMonitorTickets(tickets);
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      "Pendiente": "bg-accent text-accent-foreground",
      "En Cola": "bg-muted text-muted-foreground",
      "Validado": "bg-primary text-primary-foreground",
      "En Proceso": "bg-warning text-warning-foreground",
      "Completado": "bg-success text-success-foreground",
      "Retirado": "bg-success text-success-foreground"
    };
    return colors[estado] || "bg-muted";
  };

  const activeTickets = monitorTickets.filter(t => 
    ["Pendiente", "En Cola", "Validado", "En Proceso"].includes(t.estado)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 animate-pulse" />
                Monitor de Turnos en Tiempo Real
              </CardTitle>
              <CardDescription>
                Actualización automática cada 8 segundos - {currentTime.toLocaleTimeString('es-PE')}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTickets.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets activos en este momento
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTickets.map((ticket, index) => (
                <div 
                  key={ticket.id} 
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Ticket</p>
                      <p className="font-semibold">#{ticket.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Contenedor</p>
                      <p className="font-mono text-sm">{ticket.contenedorId}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Placa</p>
                      <p className="font-semibold">{ticket.placa}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Turno</p>
                      <p className="text-sm font-medium">{ticket.turno}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Slot</p>
                      <Badge variant="outline">{ticket.slot}</Badge>
                    </div>
                    
                    <div className="flex justify-end">
                      <Badge className={getStatusColor(ticket.estado)}>
                        {ticket.estado}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de slots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{monitorTickets.filter(t => t.estado === "En Cola").length}</p>
            <p className="text-sm text-muted-foreground">En Cola</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{monitorTickets.filter(t => t.estado === "Validado").length}</p>
            <p className="text-sm text-muted-foreground">Validados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{monitorTickets.filter(t => t.estado === "En Proceso").length}</p>
            <p className="text-sm text-muted-foreground">En Proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{monitorTickets.filter(t => t.estado === "Completado").length}</p>
            <p className="text-sm text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TurnMonitor;
