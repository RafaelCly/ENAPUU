# backend/core/tests/test_views.py

import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import datetime

from core.models import (
    Usuario, Rol, NivelAcceso, Ticket, Zona, 
    UbicacionSlot, Contenedor, Buque
)

# --- PRUEBAS DE AUTENTICACIÓN (LOGIN) ---

@pytest.mark.django_db
def test_login_exitoso(client):
    # 1. Arrange: Crear usuario con contraseña hasheada (encriptada)
    rol = Rol.objects.create(rol="Admin")
    nivel = NivelAcceso.objects.create(nivel="Total")
    
    # Importante: Usamos make_password para que la contraseña se guarde encriptada,
    # ya que tu vista usa check_password para verificarla.
    Usuario.objects.create(
        nombre="Test User",
        email="admin@test.com",
        password=make_password("passwordSeguro123"), 
        id_rol=rol,
        id_nivel_acceso=nivel,
        activo=True
    )

    # 2. Act: Hacemos POST al endpoint de login
    # Asumiendo que la ruta se registró como 'usuarios' en el router
    # La URL suele ser /api/usuarios/login/
    url = reverse('usuario-login') 
    data = {
        'email': 'admin@test.com',
        'password': 'passwordSeguro123'
    }
    response = client.post(url, data, content_type='application/json')

    # 3. Assert
    assert response.status_code == status.HTTP_200_OK
    assert 'login exitoso' in response.data['message'].lower()
    assert response.data['user']['email'] == 'admin@test.com'

@pytest.mark.django_db
def test_login_credenciales_invalidas(client):
    # 1. Arrange
    rol = Rol.objects.create(rol="Admin")
    nivel = NivelAcceso.objects.create(nivel="Total")
    Usuario.objects.create(
        nombre="Test User",
        email="admin@test.com",
        password=make_password("passwordCorrecto"),
        id_rol=rol,
        id_nivel_acceso=nivel
    )

    # 2. Act: Intentamos login con password incorrecto
    url = reverse('usuario-login')
    data = {
        'email': 'admin@test.com',
        'password': 'PASSWORD_INCORRECTO'
    }
    response = client.post(url, data, content_type='application/json')

    # 3. Assert
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'credenciales inválidas' in response.data['error'].lower()

# --- PRUEBAS DE FILTROS DE USUARIO ---

@pytest.mark.django_db
def test_filtrar_usuarios_por_rol(client):
    # 1. Arrange
    rol_admin = Rol.objects.create(rol="Admin")
    rol_cliente = Rol.objects.create(rol="Cliente")
    nivel = NivelAcceso.objects.create(nivel="Basico")
    
    # Creamos 2 usuarios admin y 1 cliente
    Usuario.objects.create(nombre="A1", email="a1@t.com", id_rol=rol_admin, id_nivel_acceso=nivel)
    Usuario.objects.create(nombre="A2", email="a2@t.com", id_rol=rol_admin, id_nivel_acceso=nivel)
    Usuario.objects.create(nombre="C1", email="c1@t.com", id_rol=rol_cliente, id_nivel_acceso=nivel)

    # 2. Act: Llamamos a la acción 'by_role'
    url = reverse('usuario-by-role')
    response = client.get(url, {'role': 'Admin'})

    # 3. Assert
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2  # Debería encontrar solo los 2 admins
    assert response.data[0]['id_rol'] == rol_admin.id

# --- PRUEBAS DE LÓGICA DE TICKETS ---

@pytest.mark.django_db
def test_cambiar_estado_ticket_a_completado(client):
    # 1. Arrange: Crear TODA la infraestructura necesaria para un Ticket
    zona = Zona.objects.create(nombre="Z1", capacidad=10)
    slot = UbicacionSlot.objects.create(fila=1, columna=1, nivel=1, estado="ok", id_zona=zona)
    rol = Rol.objects.create(rol="Op")
    nivel = NivelAcceso.objects.create(nivel="1")
    usuario = Usuario.objects.create(nombre="U1", email="u@u.com", id_rol=rol, id_nivel_acceso=nivel)
    buque = Buque.objects.create(nombre="B1", linea_naviera="L1")
    contenedor = Contenedor.objects.create(codigo_barras="C1", dimensiones="20", tipo="Dry", peso=100, id_buque=buque)

    ticket = Ticket.objects.create(
        fecha_hora_entrada=timezone.now(),
        estado="EN_PROCESO",
        id_ubicacion=slot,
        id_usuario=usuario,
        id_contenedor=contenedor
    )

    # 2. Act: Llamamos a la acción 'cambiar_estado'
    # La URL para una acción de detalle es /api/tickets/{id}/cambiar_estado/
    url = reverse('ticket-cambiar-estado', args=[ticket.id])
    data = {'estado': 'Completado'}
    
    response = client.patch(url, data, content_type='application/json')

    # 3. Assert
    ticket.refresh_from_db() # Recargamos el objeto desde la BD para ver cambios
    
    assert response.status_code == status.HTTP_200_OK
    assert ticket.estado == 'Completado'
    assert ticket.fecha_hora_salida is not None # La lógica debe haber puesto la hora actual

@pytest.mark.django_db
def test_filtrar_tickets_por_estado(client):
    # 1. Arrange: (Reutilizamos lógica simplificada de creación por brevedad, 
    # en un proyecto real usaríamos fixtures o factories)
    zona = Zona.objects.create(nombre="Z1", capacidad=10)
    slot = UbicacionSlot.objects.create(fila=1, columna=1, nivel=1, estado="ok", id_zona=zona)
    rol = Rol.objects.create(rol="Op")
    nivel = NivelAcceso.objects.create(nivel="1")
    usuario = Usuario.objects.create(nombre="U1", email="u@u.com", id_rol=rol, id_nivel_acceso=nivel)
    buque = Buque.objects.create(nombre="B1", linea_naviera="L1")
    contenedor = Contenedor.objects.create(codigo_barras="C1", dimensiones="20", tipo="Dry", peso=100, id_buque=buque)

    # Creamos 1 ticket PENDIENTE y 1 COMPLETADO
    Ticket.objects.create(fecha_hora_entrada=timezone.now(), estado="PENDIENTE", id_ubicacion=slot, id_usuario=usuario, id_contenedor=contenedor)
    Ticket.objects.create(fecha_hora_entrada=timezone.now(), estado="COMPLETADO", id_ubicacion=slot, id_usuario=usuario, id_contenedor=contenedor)

    # 2. Act
    url = reverse('ticket-by-estado')
    response = client.get(url, {'estado': 'PENDIENTE'})

    # 3. Assert
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1 # Solo debe traer el pendiente
    assert response.data[0]['estado'] == 'PENDIENTE'