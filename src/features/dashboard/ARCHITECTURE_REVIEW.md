# 🧭 Dashboard Feature Architecture

The dashboard feature presents a user overview with analytics cards, sentiment
and interview history.

## Boundaries

- **Domain**: statistics and summaries are fetched via the Dashboard service.
- **UI**: all visual components live under `components/` and are orchestrated by
  the `DashboardContainer` in `containers/`.
- **Routing**: feature level routes are defined in `routes/dashboard.routes.ts`.

## Data Flow

1. `DashboardContainer` calls the hook `useDashboard`.
2. The hook uses services to request data and exposes loading/error states.
3. Components render the resulting data.

This mirrors the structure of the auth feature to keep feature logic
self‑contained and portable.
