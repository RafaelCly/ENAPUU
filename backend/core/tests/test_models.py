import pytest
from django.db import IntegrityError
from datetime import datetime, date

# Importa todos tus modelos de la app 'core'
from core.models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)

# El marcador '@pytest.mark.django_db' es esencial.
# Le da a la prueba acceso a una base de datos de prueba.

@pytest.mark.django_db
def test_crear_rol():
    # 1. Arrange & 2. Act
    rol = Rol.objects.create(rol="Administrador")
    
    # 3. Assert
    assert rol.rol == "Administrador"
    assert str(rol) == "Administrador"

@pytest.mark.django_db
def test_crear_nivel_acceso():
    # 1. Arrange & 2. Act
    nivel = NivelAcceso.objects.create(nivel="Acceso Total")
    
    # 3. Assert
    assert nivel.nivel == "Acceso Total"
    assert str(nivel) == "Acceso Total"

@pytest.mark.django_db
def test_crear_usuario():
    # 1. Arrange (Organizar las dependencias)
    rol = Rol.objects.create(rol="Cliente")
    nivel = NivelAcceso.objects.create(nivel="Nivel 1")
    
    # 2. Act (Crear el objeto a probar)
    user = Usuario.objects.create(
        nombre="Juan Perez",
        email="juan.perez@email.com",
        password="password123",
        id_rol=rol,
        id_nivel_acceso=nivel
    )
    
    # 3. Assert (Verificar los datos)
    assert user.nombre == "Juan Perez"
    assert user.id_rol.rol == "Cliente"
    assert user.activo is True  # Probar el valor por defecto
    assert user.fecha_creacion is not None # Probar auto_now_add
    assert str(user) == "Juan Perez"

@pytest.mark.django_db
def test_usuario_email_unique():
    # 1. Arrange
    rol = Rol.objects.create(rol="Cliente")
    nivel = NivelAcceso.objects.create(nivel="Nivel 1")
    Usuario.objects.create(
        nombre="Usuario Uno",
        email="unico@email.com",
        id_rol=rol,
        id_nivel_acceso=nivel
    )
    
    # 2. Act & 3. Assert
    # Verificamos que crear un usuario con el mismo email lanza un IntegrityError
    with pytest.raises(IntegrityError):
        Usuario.objects.create(
            nombre="Usuario Dos",
            email="unico@email.com", # Email repetido
            id_rol=rol,
            id_nivel_acceso=nivel
        )

@pytest.mark.django_db
def test_crear_zona_y_ubicacion():
    # 1. Arrange
    zona = Zona.objects.create(nombre="Zona A", capacidad=100)
    
    # 2. Act
    slot = UbicacionSlot.objects.create(
        fila=1,
        columna=5,
        nivel=2,
        estado="disponible",
        id_zona=zona
    )
    
    # 3. Assert
    assert zona.capacidad == 100
    assert str(zona) == "Zona A"
    assert slot.id_zona.nombre == "Zona A"
    assert slot.estado == "disponible"
    assert str(slot) == f"Slot {slot.id} - Zona {zona}"

@pytest.mark.django_db
def test_crear_buque():
    # 1. Arrange & 2. Act
    buque = Buque.objects.create(
        nombre="La Perla",
        linea_naviera="Maersk"
    )
    
    # 3. Assert
    assert buque.nombre == "La Perla"
    assert str(buque) == "La Perla"

@pytest.mark.django_db
def test_crear_cita_recojo():
    # 1. Arrange & 2. Act
    cita = CitaRecojo.objects.create(
        fecha_recojo=date(2025, 12, 1),
        duracion_viaje_dias=10
    )
    
    # 3. Assert
    assert cita.estado == "reservada" # Probar el valor por defecto
    assert cita.duracion_viaje_dias == 10
    assert cita.fecha_creacion is not None
    assert str(cita) == f"Cita {cita.id} - reservada"

@pytest.mark.django_db
def test_crear_contenedor():
    # 1. Arrange
    buque = Buque.objects.create(nombre="El Veloz", linea_naviera="CMA CGM")
    
    # 2. Act
    contenedor = Contenedor.objects.create(
        codigo_barras="CONT-12345",
        dimensiones="40ft",
        tipo="Refrigerado",
        peso=4500.75,
        id_buque=buque
    )
    
    # 3. Assert
    assert contenedor.peso == 4500.75
    assert contenedor.id_buque.nombre == "El Veloz"
    assert str(contenedor) == "Contenedor CONT-12345 - Refrigerado"

@pytest.mark.django_db
def test_contenedor_codigo_barras_unique():
    # 1. Arrange
    buque = Buque.objects.create(nombre="El Veloz", linea_naviera="CMA CGM")
    Contenedor.objects.create(
        codigo_barras="UNIQUE-987",
        dimensiones="20ft",
        tipo="Dry",
        peso=2000,
        id_buque=buque
    )
    
    # 2. Act & 3. Assert
    with pytest.raises(IntegrityError):
        Contenedor.objects.create(
            codigo_barras="UNIQUE-987", # Código repetido
            dimensiones="40ft",
            tipo="Dry",
            peso=4000,
            id_buque=buque
        )

@pytest.mark.django_db
def test_crear_ticket_factura_y_pago():
    # 1. Arrange (Cadena de dependencias)
    
    # Dependencias de Ticket
    zona = Zona.objects.create(nombre="Patio 1", capacidad=50)
    slot = UbicacionSlot.objects.create(fila=1, columna=1, nivel=1, estado="ocupado", id_zona=zona)
    rol = Rol.objects.create(rol="Operador")
    nivel = NivelAcceso.objects.create(nivel="Nivel 2")
    user = Usuario.objects.create(nombre="Operador 1", email="op1@email.com", id_rol=rol, id_nivel_acceso=nivel)
    buque = Buque.objects.create(nombre="El Gigante", linea_naviera="MSC")
    contenedor = Contenedor.objects.create(codigo_barras="GIGA-001", dimensiones="40ft", tipo="Dry", peso=3000, id_buque=buque)
    
    # 2. Act (Crear Ticket)
    ticket = Ticket.objects.create(
        fecha_hora_entrada=datetime.now(),
        estado="INGRESADO",
        id_ubicacion=slot,
        id_usuario=user,
        id_contenedor=contenedor
    )
    
    # 3. Assert (Ticket)
    assert ticket.estado == "INGRESADO"
    assert ticket.id_contenedor.codigo_barras == "GIGA-001"
    assert str(ticket) == f"Ticket {ticket.id} - INGRESADO"
    
    # 2. Act (Crear Factura)
    factura = Factura.objects.create(
        fecha_emision=date.today(),
        monto=250.50,
        estado="PENDIENTE",
        id_ticket=ticket
    )
    
    # 3. Assert (Factura)
    assert factura.monto == 250.50
    assert factura.id_ticket.id == ticket.id
    assert str(factura) == f"Factura {factura.id} - PENDIENTE"
    
    # 2. Act (Crear Pago)
    pago = Pago.objects.create(
        fecha_pago=date.today(),
        medio_pago="VISA",
        monto=250.50,
        id_factura=factura
    )
    
    # 3. Assert (Pago)
    assert pago.medio_pago == "VISA"
    assert pago.id_factura.estado == "PENDIENTE"
    assert str(pago) == f"Pago {pago.id} - 250.50"

@pytest.mark.django_db
def test_crear_reporte():
    # 1. Arrange & 2. Act
    reporte = Reporte.objects.create(
        tipo="Ocupacion Mensual",
        fecha_generacion=date.today(),
        parametros="zona=A;mes=11"
    )
    
    # 3. Assert
    assert reporte.tipo == "Ocupacion Mensual"
    assert str(reporte) == f"Reporte {reporte.id} - Ocupacion Mensual"