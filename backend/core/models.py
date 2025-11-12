from django.db import models


class Rol(models.Model):
    id = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=50)

    class Meta:
        db_table = 'Rol'

    def __str__(self):
        return self.rol


class NivelAcceso(models.Model):
    id = models.AutoField(primary_key=True)
    nivel = models.CharField(max_length=50)

    class Meta:
        db_table = 'Nivel_acceso'

    def __str__(self):
        return self.nivel


class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True, default='')
    password = models.CharField(max_length=255, default='')
    telefono = models.CharField(max_length=20, null=True, blank=True)
    empresa = models.CharField(max_length=100, null=True, blank=True)
    id_rol = models.ForeignKey(Rol, db_column='id_rol', on_delete=models.CASCADE)
    id_nivel_acceso = models.ForeignKey(NivelAcceso, db_column='id_nivel_acceso', on_delete=models.CASCADE)
    fecha_modificacion = models.DateTimeField(null=True, blank=True, auto_now=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'Usuario'

    def __str__(self):
        return self.nombre


class Zona(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=25)
    capacidad = models.IntegerField()

    class Meta:
        db_table = 'Zona'

    def __str__(self):
        return self.nombre


class UbicacionSlot(models.Model):
    id = models.AutoField(primary_key=True)
    fila = models.IntegerField()
    columna = models.IntegerField()
    nivel = models.IntegerField()
    estado = models.CharField(max_length=20)
    id_zona = models.ForeignKey(Zona, db_column='id_zona', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Ubicacion_slot'

    def __str__(self):
        return f"Slot {self.id} - Zona {self.id_zona}"


class Buque(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    linea_naviera = models.CharField(max_length=50)

    class Meta:
        db_table = 'Buque'

    def __str__(self):
        return self.nombre


class CitaRecojo(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_envio = models.DateField(null=True, blank=True)
    fecha_recojo = models.DateField(null=True, blank=True)
    duracion_viaje_dias = models.IntegerField(default=0)
    estado = models.CharField(max_length=50, default='reservada')  # reservada, confirmada, en_proceso, completada, cancelada
    id_cliente = models.ForeignKey('Usuario', db_column='id_cliente', on_delete=models.CASCADE, related_name='citas_cliente', null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    # Campos legacy para compatibilidad
    fecha_inicio_horario = models.DateField(null=True, blank=True)
    fecha_salida_horario = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'Cita_recojo'

    def __str__(self):
        return f"Cita {self.id} - {self.estado}"


class Contenedor(models.Model):
    id = models.AutoField(primary_key=True)
    codigo_barras = models.CharField(max_length=50, unique=True, null=True, blank=True)
    numero_contenedor = models.CharField(max_length=50, null=True, blank=True)  # Número legible del contenedor
    dimensiones = models.CharField(max_length=50)
    tipo = models.CharField(max_length=20)
    peso = models.FloatField()
    id_buque = models.ForeignKey(Buque, db_column='id_buque', on_delete=models.CASCADE)
    id_cita_recojo = models.ForeignKey(CitaRecojo, db_column='id_cita_recojo', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'Contenedor'

    def __str__(self):
        return f"Contenedor {self.codigo_barras or self.numero_contenedor or self.id} - {self.tipo}"


class Ticket(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_hora_entrada = models.DateTimeField()
    fecha_hora_salida = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=50)
    id_ubicacion = models.ForeignKey(UbicacionSlot, db_column='id_ubicacion', on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, db_column='id_usuario', on_delete=models.CASCADE)
    id_contenedor = models.ForeignKey(Contenedor, db_column='id_contenedor', on_delete=models.CASCADE)
    fecha_modificacion = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'Ticket'

    def __str__(self):
        return f"Ticket {self.id} - {self.estado}"


class Factura(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_emision = models.DateField()
    monto = models.FloatField()
    estado = models.CharField(max_length=50)
    id_ticket = models.ForeignKey(Ticket, db_column='id_ticket', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Factura'

    def __str__(self):
        return f"Factura {self.id} - {self.estado}"


class Pago(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_pago = models.DateField()
    medio_pago = models.CharField(max_length=30)
    monto = models.FloatField()
    id_factura = models.ForeignKey(Factura, db_column='id_factura', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Pago'

    def __str__(self):
        return f"Pago {self.id} - {self.monto}"


class Reporte(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50)
    fecha_generacion = models.DateField()
    parametros = models.CharField(max_length=50)

    class Meta:
        db_table = 'Reporte'

    def __str__(self):
        return f"Reporte {self.id} - {self.tipo}"
