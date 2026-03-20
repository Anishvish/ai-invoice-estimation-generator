# AI Invoice & Estimation Generator

Production-ready MVP for interior designers, contractors, and small businesses in India.

An Expo mobile app backed by Spring Boot and PostgreSQL for project management, multi-line estimates, GST calculation, invoice PDF generation, and AI-assisted measurement parsing.

## Highlights

- Multi-line estimate builder with material-wise pricing
- GST-ready calculation flow for Indian business use cases
- PDF invoice generation with itemized commercial breakdown
- Expo React Native app with polished business UI
- Saved material-rate catalog for repeated jobs
- AI parser mock for converting plain language into structured measurement input

## Tech stack

### Backend

- Java 17
- Spring Boot
- PostgreSQL
- Spring Data JPA
- OpenPDF

### Frontend

- Expo React Native
- Zustand
- React Navigation
- Axios

## Features

- Create and list projects
- Add multiple measurement line items to one estimate
- Calculate area, subtotal, GST, discount, and final amount
- Store and reuse material rates
- Generate invoice PDFs
- Parse natural language measurement input
- Review invoice-ready estimate summaries inside the mobile app

## Project structure

- `backend/` Spring Boot API
- `frontend/` Expo mobile app

## API summary

- `POST /projects`
- `GET /projects`
- `POST /estimate/calculate`
- `POST /invoice/generate`
- `POST /ai/parse`
- `GET /materials`
- `POST /materials`

## Backend architecture

- Layered structure: `controller`, `service`, `repository`, `dto`, `model`
- Tables: `users`, `projects`, `measurements`, `estimates`, `invoices`, `material_rates`
- Estimate flow supports multiple measurement items plus additional charges and discounts
- `POST /invoice/generate` is idempotent for the same estimate
- Generated PDFs are written to `backend/generated-invoices`

## Mobile app UX

- KPI-based dashboard
- Card-driven estimate builder
- Material preset shortcuts
- AI-assisted item capture
- Estimate review and invoice preview flow

## Local setup

### 1. Start PostgreSQL

Create a database named `ai_invoice_db`.

Update credentials in:

`backend/src/main/resources/application.yml`

### 2. Run backend

```bash
cd backend
mvn spring-boot:run
```

Default API base URL:

`http://localhost:8080`

### 3. Run frontend

```bash
cd frontend
npm install
npm run start
```

For Android emulator, the current API base URL is already set to:

`http://10.0.2.2:8080`

If you test on a physical device, update:

`frontend/src/services/api.js`

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

## Deployment notes

- The generated PDF path is backend-local in this MVP.
- For production, expose invoices via object storage or signed URLs.
- Replace the mocked AI parser with OpenAI or Claude API integration.
- Add authentication, authorization, and tenant isolation before real client use.

## Suggested next improvements

- Company profile settings with GSTIN, logo, bank account, and UPI QR
- WhatsApp share flow with invoice summary
- Client management and project history
- Offline drafts with sync
- Real AI extraction using OpenAI function-calling or JSON schema responses
