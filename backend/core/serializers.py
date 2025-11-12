from rest_framework import serializers
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class NivelAccesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelAcceso
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='id_rol.rol', read_only=True)
    nivel_nombre = serializers.CharField(source='id_nivel_acceso.nivel', read_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'password', 'telefono', 'empresa', 
                  'id_rol', 'rol_nombre', 'id_nivel_acceso', 'nivel_nombre', 
                  'fecha_modificacion', 'fecha_creacion', 'activo']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        # Hash password before saving
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            from django.contrib.auth.hashers import make_password
            usuario.password = make_password(password)
        usuario.save()
        return usuario
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            from django.contrib.auth.hashers import make_password
            instance.password = make_password(password)
        instance.save()
        return instance

class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = '__all__'

class UbicacionSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = UbicacionSlot
        fields = '__all__'

class BuqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buque
        fields = '__all__'

class CitaRecojoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='id_cliente.nombre', read_only=True)
    cliente_email = serializers.CharField(source='id_cliente.email', read_only=True)
    
    class Meta:
        model = CitaRecojo
        fields = ['id', 'fecha_envio', 'fecha_recojo', 'duracion_viaje_dias', 'estado', 
                  'id_cliente', 'cliente_nombre', 'cliente_email', 'fecha_creacion',
                  'fecha_inicio_horario', 'fecha_salida_horario']

class ContenedorSerializer(serializers.ModelSerializer):
    cita_info = serializers.SerializerMethodField()
    buque_nombre = serializers.CharField(source='id_buque.nombre', read_only=True)
    
    class Meta:
        model = Contenedor
        fields = ['id', 'codigo_barras', 'numero_contenedor', 'dimensiones', 'tipo', 'peso', 
                  'id_buque', 'buque_nombre', 'id_cita_recojo', 'cita_info']
    
    def get_cita_info(self, obj):
        if obj.id_cita_recojo:
            return {
                'fecha_envio': obj.id_cita_recojo.fecha_envio,
                'fecha_recojo': obj.id_cita_recojo.fecha_recojo,
                'cliente': obj.id_cita_recojo.id_cliente.nombre if obj.id_cita_recojo.id_cliente else None,
                'estado': obj.id_cita_recojo.estado
            }
        return None

class TicketSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='id_usuario.nombre', read_only=True)
    contenedor_info = serializers.SerializerMethodField()
    ubicacion_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = ['id', 'fecha_hora_entrada', 'fecha_hora_salida', 'estado', 
                  'id_ubicacion', 'ubicacion_info', 'id_usuario', 'usuario_nombre', 
                  'id_contenedor', 'contenedor_info', 'fecha_modificacion']
    
    def get_contenedor_info(self, obj):
        if obj.id_contenedor:
            return {
                'codigo_barras': obj.id_contenedor.codigo_barras,
                'numero_contenedor': obj.id_contenedor.numero_contenedor,
                'tipo': obj.id_contenedor.tipo,
                'dimensiones': obj.id_contenedor.dimensiones,
                'peso': obj.id_contenedor.peso
            }
        return None
    
    def get_ubicacion_info(self, obj):
        if obj.id_ubicacion:
            return {
                'fila': obj.id_ubicacion.fila,
                'columna': obj.id_ubicacion.columna,
                'nivel': obj.id_ubicacion.nivel,
                'zona_nombre': obj.id_ubicacion.id_zona.nombre if obj.id_ubicacion.id_zona else None,
                'zona_id': obj.id_ubicacion.id_zona.id if obj.id_ubicacion.id_zona else None
            }
        return None

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'
