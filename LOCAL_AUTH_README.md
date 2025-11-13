# Autenticación Local (Solo para Pruebas)

Este documento detalla los cambios realizados para implementar un sistema de autenticación local, diseñado para propósitos de prueba y desarrollo. La funcionalidad original de Supabase ha sido comentada para permitir esta implementación temporal.

## Archivos Modificados

### `contexts/AuthContext.tsx`

- **Importaciones de Supabase comentadas:**
  ```typescript
  // import { supabase } from "@/lib/supabase";
  // import type { User as SupabaseUser } from "@supabase/supabase-js";
  ```
- **Importaciones de autenticación local eliminadas de `AuthContext.tsx`:**
  ```typescript
  // import { readUsers, writeUsers } from "@/lib/local-storage";
  // import { v4 as uuidv4 } from "uuid";
  ```
- **`useEffect` de sesión modificado:** El `useEffect` original que verificaba la sesión de Supabase ha sido reemplazado por una simulación simple para la autenticación local.
  ```typescript
  useEffect(() => {
    // Simulate session check for local auth
    setLoading(false);
  }, []);
  ```
- **Función `loadUserProfile` comentada:** La función que cargaba el perfil del usuario desde Supabase ha sido comentada.
  ```typescript
  // const loadUserProfile = async (userId: string) => { ... };
  ```
- **Funciones `login` y `register` reemplazadas:** Las implementaciones de estas funciones ahora realizan llamadas `fetch` a las nuevas rutas API (`/api/auth/login` y `/api/auth/register`). La función `logout` se mantiene del lado del cliente.

### `lib/local-storage.ts` (Nuevo Archivo)

Este archivo se encarga de la persistencia de los datos de usuario en `local-auth.json`.

- **`readUsers()`:** Lee el archivo `local-auth.json` y devuelve un array de usuarios.
- **`writeUsers(users)`:** Escribe el array de usuarios en `local-auth.json`.

### `lib/local-auth.json` (Nuevo Archivo)

Este archivo JSON almacena los datos de los usuarios registrados localmente. Es un array de objetos de usuario.

## Cómo Revertir a Supabase (Para Producción)

Para volver a utilizar la autenticación de Supabase, sigue estos pasos:

1.  **Eliminar o renombrar `LOCAL_AUTH_README.md` y `lib/local-auth.json`:** Estos archivos ya no serán necesarios.
2.  **Eliminar `lib/local-storage.ts`:** Este archivo es específico de la autenticación local.
3.  **Desinstalar `uuid`:**
    ```bash
    npm uninstall uuid
    ```
4.  **Restaurar `contexts/AuthContext.tsx`:**
    - Descomenta las importaciones de Supabase:
      ```typescript
      import { supabase } from "@/lib/supabase";
      import type { User as SupabaseUser } from "@supabase/supabase-js";
      ```
    - Elimina las importaciones de `local-storage` y `uuid`:
      ```typescript
      // import { readUsers, writeUsers } from "@/lib/local-storage";
      // import { v4 as uuidv4 } from "uuid";
      ```
    - Restaurar el `useEffect` original para la verificación de sesión de Supabase y la función `loadUserProfile`. Puedes encontrar el código original en el historial de versiones del archivo o en la documentación de Supabase.
    - Restaurar las implementaciones originales de `login`, `register` y `logout` que interactúan con `supabase.auth`.

## Consideraciones Adicionales

- La autenticación local no persiste entre recargas de página en el estado actual, ya que está diseñada solo para pruebas rápidas. Para una persistencia local más robusta, se podría implementar `localStorage` del navegador, pero esto está fuera del alcance de esta implementación temporal.
- Las contraseñas se almacenan en texto plano en `local-auth.json` para simplificar las pruebas. **Esto no es seguro para entornos de producción.**
