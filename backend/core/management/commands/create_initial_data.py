from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from core.models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, 
    Buque, CitaRecojo, Contenedor, Ticket
)


class Command(BaseCommand):
    help = 'Crea datos iniciales para el sistema ENAPU'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creando datos iniciales...')
        
        # Crear Roles
        rol_admin, _ = Rol.objects.get_or_create(id=1, defaults={'rol': 'ADMINISTRADOR'})
        rol_operario, _ = Rol.objects.get_or_create(id=2, defaults={'rol': 'OPERARIO'})
        rol_cliente, _ = Rol.objects.get_or_create(id=3, defaults={'rol': 'CLIENTE'})
        
        self.stdout.write(self.style.SUCCESS('✓ Roles creados'))
        
        # Crear Niveles de Acceso
        nivel_admin, _ = NivelAcceso.objects.get_or_create(id=1, defaults={'nivel': 'Total'})
        nivel_operario, _ = NivelAcceso.objects.get_or_create(id=2, defaults={'nivel': 'Operativo'})
        nivel_cliente, _ = NivelAcceso.objects.get_or_create(id=3, defaults={'nivel': 'Básico'})
        
        self.stdout.write(self.style.SUCCESS('✓ Niveles de acceso creados'))
        
        # Crear Usuarios principales
        usuarios_data = [
            {
                'nombre': 'Juan Administrador',
                'email': 'admin@enapu.com',
                'password': 'admin123',
                'telefono': '999888777',
                'empresa': 'ENAPU',
                'id_rol': rol_admin,
                'id_nivel_acceso': nivel_admin
            },
            {
                'nombre': 'Carlos López',
                'email': 'operario@enapu.com',
                'password': 'operario123',
                'telefono': '999777666',
                'empresa': 'ENAPU',
                'id_rol': rol_operario,
                'id_nivel_acceso': nivel_operario
            },
            {
                'nombre': 'María García',
                'email': 'cliente@empresa.com',
                'password': 'cliente123',
                'telefono': '999666555',
                'empresa': 'Transportes García SAC',
                'id_rol': rol_cliente,
                'id_nivel_acceso': nivel_cliente
            }
        ]
        
        for user_data in usuarios_data:
            if not Usuario.objects.filter(email=user_data['email']).exists():
                user_data['password'] = make_password(user_data['password'])
                Usuario.objects.create(**user_data)
                self.stdout.write(self.style.SUCCESS(f"✓ Usuario creado: {user_data['nombre']}"))
        
        # Crear Zonas
        zonas_data = [
            {'nombre': 'Zona A', 'capacidad': 100},
            {'nombre': 'Zona B', 'capacidad': 150},
            {'nombre': 'Zona C', 'capacidad': 120},
        ]
        
        zonas = []
        for zona_data in zonas_data:
            zona, created = Zona.objects.get_or_create(
                nombre=zona_data['nombre'],
                defaults={'capacidad': zona_data['capacidad']}
            )
            zonas.append(zona)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Zona creada: {zona.nombre}"))
        
        # Crear Ubicaciones Slot
        slot_count = 0
        for zona in zonas:
            for fila in range(1, 6):  # 5 filas
                for columna in range(1, 11):  # 10 columnas
                    for nivel in range(1, 4):  # 3 niveles
                        if not UbicacionSlot.objects.filter(
                            id_zona=zona, fila=fila, columna=columna, nivel=nivel
                        ).exists():
                            UbicacionSlot.objects.create(
                                fila=fila,
                                columna=columna,
                                nivel=nivel,
                                estado='Disponible',
                                id_zona=zona
                            )
                            slot_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ {slot_count} slots creados'))
        
        # Crear Buques
        buques_data = [
            {'nombre': 'MSC MAYA', 'linea_naviera': 'MSC'},
            {'nombre': 'MAERSK ESSEX', 'linea_naviera': 'MAERSK'},
            {'nombre': 'EVERGREEN HARMONY', 'linea_naviera': 'EVERGREEN'},
        ]
        
        buques = []
        for buque_data in buques_data:
            buque, created = Buque.objects.get_or_create(**buque_data)
            buques.append(buque)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Buque creado: {buque.nombre}"))
        
        # Crear Citas de Recojo
        citas = []
        for i in range(10):
            fecha_inicio = timezone.now().date()
            fecha_salida = fecha_inicio + timezone.timedelta(days=7)
            
            cita, created = CitaRecojo.objects.get_or_create(
                fecha_inicio_horario=fecha_inicio,
                fecha_salida_horario=fecha_salida,
                defaults={'estado': 'Activa'}
            )
            citas.append(cita)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Cita creada: {cita.id}"))
        
        # Crear Contenedores
        tipos_contenedor = ['20FT', '40FT', '40HC']
        contenedores = []
        
        for i in range(20):
            if not Contenedor.objects.filter(id=i+1).exists():
                contenedor = Contenedor.objects.create(
                    dimensiones=f'{tipos_contenedor[i % 3]}',
                    tipo=tipos_contenedor[i % 3],
                    peso=15000.0 + (i * 500),
                    id_buque=buques[i % len(buques)],
                    id_cita_recojo=citas[i % len(citas)]
                )
                contenedores.append(contenedor)
                self.stdout.write(self.style.SUCCESS(f"✓ Contenedor creado: CONT-{contenedor.id:04d}"))
        
        # Crear Tickets de ejemplo
        estados = ['Pendiente', 'Validado', 'En Cola', 'En Proceso', 'Completado']
        slots_disponibles = list(UbicacionSlot.objects.filter(estado='Disponible')[:20])
        usuario_operario = Usuario.objects.filter(id_rol=rol_operario).first()
        
        for i, contenedor in enumerate(contenedores[:10]):
            if not Ticket.objects.filter(id_contenedor=contenedor).exists():
                slot = slots_disponibles[i] if i < len(slots_disponibles) else slots_disponibles[0]
                
                ticket = Ticket.objects.create(
                    fecha_hora_entrada=timezone.now() - timezone.timedelta(hours=i),
                    estado=estados[i % len(estados)],
                    id_ubicacion=slot,
                    id_usuario=usuario_operario,
                    id_contenedor=contenedor
                )
                
                if ticket.estado == 'Completado':
                    ticket.fecha_hora_salida = timezone.now()
                    ticket.save()
                
                if ticket.estado in ['En Proceso', 'Completado']:
                    slot.estado = 'Ocupado'
                    slot.save()
                
                self.stdout.write(self.style.SUCCESS(f"✓ Ticket creado: #{ticket.id}"))
        
        self.stdout.write(self.style.SUCCESS('\n¡Datos iniciales creados exitosamente!'))
        self.stdout.write('\nUsuarios creados:')
        self.stdout.write('1. Administrador - admin@enapu.com / admin123')
        self.stdout.write('2. Operario - operario@enapu.com / operario123')
        self.stdout.write('3. Cliente - cliente@empresa.com / cliente123')
