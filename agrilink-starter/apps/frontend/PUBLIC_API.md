# Frontend → Backend API (contract sketch)
- `POST /api/auth/login` → {token}
- `GET /api/me` → profile + role
- `GET /api/farms` / `POST /api/farms`
- `GET /api/lots?farmId=...` / `POST /api/lots`
- `GET /api/lots/:id/events` / `POST /api/lots/:id/events`
- `GET /api/shipments` / `POST /api/shipments`
- `GET /api/public/lot/:publicId` — public QR page
- `POST /api/pilot` — request pilot form
- Socket.IO namespace `/realtime` event `sensor:update` {lotId, temp, hum, location}
