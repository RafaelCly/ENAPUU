const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  } as Record<string,string>;

  const resp = await fetch(url, { ...opts, headers, credentials: 'include' });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
  }
  // Try parse JSON, otherwise return text
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.text();
}

// API functions for common operations
export const api = {
  // Usuarios
  usuarios: {
    list: () => apiFetch('/usuarios/'),
    get: (id: number) => apiFetch(`/usuarios/${id}/`),
    create: (data: any) => apiFetch('/usuarios/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => apiFetch(`/usuarios/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/usuarios/${id}/`, { method: 'DELETE' }),
    login: (email: string, password: string) => 
      apiFetch('/usuarios/login/', { method: 'POST', body: JSON.stringify({ email, password }) }),
    byRole: (role: string) => apiFetch(`/usuarios/by_role/?role=${role}`),
  },

  // Tickets
  tickets: {
    list: () => apiFetch('/tickets/'),
    get: (id: number) => apiFetch(`/tickets/${id}/`),
    create: (data: any) => apiFetch('/tickets/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => apiFetch(`/tickets/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/tickets/${id}/`, { method: 'DELETE' }),
    byEstado: (estado: string) => apiFetch(`/tickets/by_estado/?estado=${estado}`),
    byUsuario: (usuarioId: number) => apiFetch(`/tickets/by_usuario/?usuario_id=${usuarioId}`),
    cambiarEstado: (id: number, estado: string) => 
      apiFetch(`/tickets/${id}/cambiar_estado/`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  },

  // Contenedores
  contenedores: {
    list: () => apiFetch('/contenedores/'),
    get: (id: number) => apiFetch(`/contenedores/${id}/`),
    create: (data: any) => apiFetch('/contenedores/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => apiFetch(`/contenedores/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/contenedores/${id}/`, { method: 'DELETE' }),
  },

  // Zonas
  zonas: {
    list: () => apiFetch('/zonas/'),
    get: (id: number) => apiFetch(`/zonas/${id}/`),
  },

  // Slots
  slots: {
    list: () => apiFetch('/slots/'),
    get: (id: number) => apiFetch(`/slots/${id}/`),
    update: (id: number, data: any) => apiFetch(`/slots/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Buques
  buques: {
    list: () => apiFetch('/buques/'),
    get: (id: number) => apiFetch(`/buques/${id}/`),
    create: (data: any) => apiFetch('/buques/', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Roles
  roles: {
    list: () => apiFetch('/roles/'),
  },

  // Niveles de acceso
  niveles: {
    list: () => apiFetch('/niveles/'),
  },
};

export default apiFetch;
