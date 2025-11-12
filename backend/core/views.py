from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)
from .serializers import (
    RolSerializer, NivelAccesoSerializer, UsuarioSerializer, ZonaSerializer,
    UbicacionSlotSerializer, BuqueSerializer, CitaRecojoSerializer, ContenedorSerializer,
    TicketSerializer, FacturaSerializer, PagoSerializer, ReporteSerializer
)

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class NivelAccesoViewSet(viewsets.ModelViewSet):
    queryset = NivelAcceso.objects.all()
    serializer_class = NivelAccesoSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            usuario = Usuario.objects.select_related('id_rol', 'id_nivel_acceso').get(email=email, activo=True)
            
            if check_password(password, usuario.password):
                serializer = self.get_serializer(usuario)
                return Response({
                    'user': serializer.data,
                    'message': 'Login exitoso'
                })
            else:
                return Response(
                    {'error': 'Credenciales inválidas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def by_role(self, request):
        role = request.query_params.get('role')
        if role:
            usuarios = self.queryset.filter(id_rol__rol=role, activo=True)
            serializer = self.get_serializer(usuarios, many=True)
            return Response(serializer.data)
        return Response({'error': 'Rol no especificado'}, status=status.HTTP_400_BAD_REQUEST)

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer

class UbicacionSlotViewSet(viewsets.ModelViewSet):
    queryset = UbicacionSlot.objects.all()
    serializer_class = UbicacionSlotSerializer

class BuqueViewSet(viewsets.ModelViewSet):
    queryset = Buque.objects.all()
    serializer_class = BuqueSerializer

class CitaRecojoViewSet(viewsets.ModelViewSet):
    queryset = CitaRecojo.objects.all()
    serializer_class = CitaRecojoSerializer

class ContenedorViewSet(viewsets.ModelViewSet):
    queryset = Contenedor.objects.all()
    serializer_class = ContenedorSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    
    @action(detail=False, methods=['get'])
    def by_estado(self, request):
        estado = request.query_params.get('estado')
        if estado:
            tickets = self.queryset.filter(estado=estado)
            serializer = self.get_serializer(tickets, many=True)
            return Response(serializer.data)
        return Response({'error': 'Estado no especificado'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_usuario(self, request):
        usuario_id = request.query_params.get('usuario_id')
        if usuario_id:
            tickets = self.queryset.filter(id_usuario=usuario_id)
            serializer = self.get_serializer(tickets, many=True)
            return Response(serializer.data)
        return Response({'error': 'Usuario no especificado'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        ticket = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado:
            ticket.estado = nuevo_estado
            if nuevo_estado == 'Completado':
                from django.utils import timezone
                ticket.fecha_hora_salida = timezone.now()
            ticket.save()
            serializer = self.get_serializer(ticket)
            return Response(serializer.data)
        
        return Response({'error': 'Estado no especificado'}, status=status.HTTP_400_BAD_REQUEST)

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
