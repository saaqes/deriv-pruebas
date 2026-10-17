# Aurora Demo (app bancaria FICTICIA) dentro de Deriv

**No es un banco real ni una réplica de ninguno.** Marca, logo y paleta (acento verde lima) son inventados, y
cada pantalla lleva la etiqueta "MODO DEMO · APP FICTICIA". Sí reproduce el flujo de uso de la referencia:
animación de arranque (blanco → splash oscuro con arcos y contador %), esqueleto de carga, inicio de sesión,
pantalla "Cargando", inicio con arco animado, clave demo con anillo, carrusel de cuentas, accesos, "Más opciones",
ofertas, barra inferior, botón QR, Transacciones / Explorar / Trámites / Ajustes, Cuenta (Detalles y Movimientos
con filtros), detalle de movimiento, comprobante de prueba, notificaciones, Tu usuario → Personalizar nombre,
Seguridad y Preferencias de pantalla → **Aspecto** (Detector facial / Huella).

## Cómo abrirla
Perfil de Deriv (`profile.html`) → sección **Otras apps** → *Banco demo (app ficticia)* → `banco-demo.html`.
Botón **‹ Deriv** (arriba a la izquierda) para volver. Ejecutar: `cd bot-app && npm install && npm run dev`
(o `npm start` tras `npm run build`); abrir `/banco-demo.html` con sesión iniciada.

## Archivos
- `public/banco-demo.html`, `public/assets/sim/css/banco-demo.css`
- `public/assets/sim/js/banco-demo.js` (UI/enrutador) y `banco-demo-data.js` (datos, adaptadores, reconciliación)
- `public/profile.html` (nueva opción)

## Datos y persistencia
`localStorage` (`aurora-demo-v1`): nombre, preferencias, saldos y movimientos de DEMOSTRACIÓN. No se guardan
claves ni datos bancarios. El alias de ingreso acepta cualquier texto; no hay contraseñas.

## Edición de saldos y notificaciones (Ajustes → Panel demo)
Solo con sesión de administrador activa en `/admin` (se valida con `GET /api/admin/session`). Permite editar saldo
disponible, bolsillos, cobros en proceso, saldo en canje, crear/editar/borrar movimientos (importe, fecha/hora, tipo,
estado) y notificaciones. Todo se refleja en todas las pantallas. Limitación: es una app estática; la validación en
servidor de esas ediciones no existe (los datos viven en el navegador y nunca son una operación bancaria).

## Biometría
Aspecto usa WebAuthn/passkeys (verificación local del dispositivo: rostro, huella o PIN según el equipo). Es una
comprobación en el cliente, sin verificación en servidor; si el navegador no la admite (o no hay HTTPS) se informa
y se sigue con el alias. "Detector facial"/"Huella" solo cambian la etiqueta y el icono; el sistema operativo decide
el método real.

## Integración Deriv → app
Arquitectura de adaptadores (`banco-demo-data.js`):
- **demo**: movimientos de prueba editables.
- **deriv** (`deriv-sim`): lee los retiros del SIMULADOR local de este repo (`TradeLabSim`), **no** la API real de Deriv.
- **bank**: NO conectado; no existe una API pública para crear movimientos en una cuenta real.
- Reconciliación idempotente por `externalId` (nunca duplica), registro de eventos, consulta cada 30 s y comprobación
  a los 3 min (solo un objetivo de refresco: no crea ingresos ni modifica saldos por el paso del tiempo).
- El importe en COP, tipo de cambio y comisiones aparecen como "Pendiente/No disponible" mientras no haya dato.
Para una integración real haría falta un backend con token propio de Deriv (estado del retiro) y una API/convenio
oficial del banco; nada de eso está conectado.

## Comprobantes
Siempre rotulados "PRUEBA / DEMOSTRACIÓN", con marca de agua, sin validez, y no deben presentarse como prueba de pago.
