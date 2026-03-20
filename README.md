# AI Invoice & Estimation Generator

Production-ready MVP for interior designers, contractors, and small businesses in India.

## What changed in this version

- Multi-line estimates instead of a single measurement only
- Saved material-rate catalog
- Refined Expo UI with KPI cards, card-based forms, and a stronger business look
- Richer invoice PDF with line items and commercial breakdown
- Idempotent invoice generation for the same estimate

## Project structure

- `backend/`: Spring Boot 3, Java 17, PostgreSQL, OpenPDF
- `frontend/`: Expo React Native app with Zustand and React Navigation

## Backend APIs

- `POST /projects`
- `GET /projects`
- `POST /estimate/calculate`
- `POST /invoice/generate`
- `POST /ai/parse`
- `GET /materials`
- `POST /materials`

## Key backend design

- Layered architecture: controller, service, repository, dto, model
- Tables: `users`, `projects`, `measurements`, `estimates`, `invoices`, `material_rates`
- Estimate flow supports multiple measurement items plus additional charges and discount
- PDF generation uses OpenPDF and writes into `backend/generated-invoices`
- AI parsing is mocked with deterministic extraction logic and can be swapped later

## Key frontend design

- Expo-managed React Native app
- Dashboard with KPI cards and recent projects
- Multi-item estimate builder with AI input and material presets
- Estimate review with line-item summary and cost breakdown
- Invoice preview and share flow
- Zustand store for project, estimate, invoice, draft line items, and materials

## Run backend

1. Create PostgreSQL database `ai_invoice_db`
2. Update credentials in `backend/src/main/resources/application.yml`
3. Start the server:

```bash
cd backend
mvn spring-boot:run
```

## Run frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start Expo:

```bash
npm run start
```

3. If you test on a physical device, update the API base URL in `frontend/src/services/api.js`

## Sample requests

### Create project

```json
{
  "name": "Luxury Apartment Interiors",
  "clientName": "Ananya Mehta"
}
```

### Calculate estimate

```json
{
  "projectId": 1,
  "measurements": [
    {
      "type": "wardrobe",
      "length": 6,
      "width": 7,
      "material": "laminate",
      "ratePerSqft": 450
    },
    {
      "type": "tv unit",
      "length": 5,
      "width": 3,
      "material": "veneer",
      "ratePerSqft": 780
    }
  ],
  "additionalCharges": 2500,
  "discount": 1000
}
```

### Generate invoice

```json
{
  "estimateId": 1
}
```

### AI parse

```json
{
  "input": "Wardrobe 6 by 7 feet laminate finish"
}
```

## Sample estimate response

```json
{
  "estimateId": 1,
  "projectId": 1,
  "projectName": "Luxury Apartment Interiors",
  "clientName": "Ananya Mehta",
  "items": [
    {
      "measurementId": 1,
      "type": "wardrobe",
      "material": "laminate",
      "length": 6.0,
      "width": 7.0,
      "area": 42.0,
      "ratePerSqft": 450.0,
      "baseCost": 18900.0
    },
    {
      "measurementId": 2,
      "type": "tv unit",
      "material": "veneer",
      "length": 5.0,
      "width": 3.0,
      "area": 15.0,
      "ratePerSqft": 780.0,
      "baseCost": 11700.0
    }
  ],
  "totalArea": 57.0,
  "subtotal": 30600.0,
  "additionalCharges": 2500.0,
  "discount": 1000.0,
  "gstPercentage": 18.0,
  "gstAmount": 5778.0,
  "finalAmount": 37878.0
}
```

## Notes

- `POST /invoice/generate` is idempotent for the same estimate and returns the existing invoice if already generated.
- The mobile app is Expo-based, not React Native CLI.
- The generated PDF path is backend-local; in a real production deployment you would usually expose this through object storage or a signed download URL.
