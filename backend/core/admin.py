from django.contrib import admin
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)

models = [Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
          CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte]

for m in models:
    admin.site.register(m)
