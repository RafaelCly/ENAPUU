import { useState } from "react";
import { Search, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { containers, tickets } from "@/data/mocks";

const QuickContainerQuery = () => {
  const [containerId, setContainerId] = useState("");
  const [containerInfo, setContainerInfo] = useState<any>(null);

  const handleSearch = () => {
    if (!containerId.trim()) {
      toast.error("Por favor ingrese un ID de contenedor");
      return;
    }

    const container = containers.find(c => c.id === containerId.trim());
    const relatedTicket = tickets.find(t => t.contenedorId === containerId.trim());

    if (!container) {
      toast.error("Contenedor no encontrado", {
        description: "No se encontró ningún contenedor con este ID"
      });
      setContainerInfo(null);
      return;
    }

    setContainerInfo({ ...container, ticket: relatedTicket });
    toast.success("Contenedor encontrado");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consulta Rápida de Contenedor
          </CardTitle>
          <CardDescription>Busca información de un contenedor por su ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="containerInput">ID del Contenedor</Label>
            <Input
              id="containerInput"
              placeholder="Ej: CONT-2024-001"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          
          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Buscar Contenedor
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contenedor</CardTitle>
          <CardDescription>Detalles y ubicación actual</CardDescription>
        </CardHeader>
        <CardContent>
          {containerInfo ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-sm font-medium text-muted-foreground mb-1">ID Contenedor</p>
                <p className="text-lg font-bold font-mono">{containerInfo.id}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                  <Badge className={
                    containerInfo.estado === "Retirado" ? "bg-success text-success-foreground" :
                    containerInfo.estado === "Carga/Descarga" ? "bg-warning text-warning-foreground" :
                    "bg-accent text-accent-foreground"
                  }>
                    {containerInfo.estado}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">{containerInfo.ubicacion}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{containerInfo.tipo}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peso:</span>
                  <span className="font-medium">{containerInfo.peso}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Naviera:</span>
                  <span className="font-medium">{containerInfo.naviera}</span>
                </div>

                {containerInfo.ticket && (
                  <div className="mt-4 p-3 bg-accent/10 border border-accent rounded-lg">
                    <p className="text-sm font-medium mb-2">Ticket Asociado:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-semibold">#{containerInfo.ticket.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <Badge variant="outline">{containerInfo.ticket.estado}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold mb-3">Historial de Eventos:</p>
                <div className="space-y-2">
                  {containerInfo.historial.map((evento: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-muted/30 rounded">
                      <p className="font-medium">{evento.evento}</p>
                      <p className="text-xs text-muted-foreground">{evento.fecha} - {evento.usuario}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ingresa un ID de contenedor para ver su información
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickContainerQuery;
