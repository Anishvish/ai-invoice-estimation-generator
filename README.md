# AI Invoice & Estimation Generator

Production-ready MVP for interior designers, contractors, and small businesses in India.

An Expo mobile app backed by Spring Boot and PostgreSQL for project management, multi-line estimates, company-based invoicing, advance payment handling, invoice PDF generation, and AI-assisted measurement parsing.

## Highlights

- Multi-line estimate builder with material-wise pricing
- Measurements in feet + inches or inches-only
- Quantity-based line items
- GST-ready calculation flow for Indian business use cases
- Multiple billing companies with GST-enabled or GST-free invoice behavior
- PDF invoice generation with itemized commercial breakdown and downloadable invoice endpoint
- Advance payment support with balance due in the final invoice
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
- Create and reuse multiple company billing profiles
- Add multiple measurement line items to one estimate
- Calculate area, subtotal, GST, discount, and final amount
- Store and reuse material rates
- Generate multiple invoice PDFs for the same estimate
- Parse natural language measurement input
- Review invoice-ready estimate summaries inside the mobile app

## Project structure

- `backend/` Spring Boot API
- `frontend/` Expo mobile app

## API summary

- `POST /projects`
- `GET /projects`
- `POST /companies`
- `GET /companies`
- `POST /estimate/calculate`
- `POST /invoice/generate`
- `GET /invoice/{invoiceId}/download`
- `POST /ai/parse`
- `GET /materials`
- `POST /materials`

## Backend architecture

- Layered structure: `controller`, `service`, `repository`, `dto`, `model`
- Tables: `users`, `companies`, `projects`, `measurements`, `estimates`, `invoices`, `material_rates`
- Estimate flow supports multiple measurement items plus additional charges and discounts
- Invoice GST is derived from the selected company profile
- Multiple invoices can be generated for the same estimate
- Generated PDFs are written to `backend/generated-invoices`
- GSTIN is masked in API responses to reduce unnecessary PII exposure

## Mobile app UX

- KPI-based dashboard
- Company-aware project creation flow
- Card-driven estimate builder
- Material preset shortcuts
- AI-assisted item capture
- Estimate review and invoice preview flow with advance payment entry

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

If you are upgrading from an older local version of this project, use a fresh database or reset the schema first. This version changes invoice and company relationships, and `ddl-auto=update` may not remove older constraints automatically.

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
  "clientName": "Client A",
  "companyId": 1
}
```

### Create company

```json
{
  "name": "DesignFlow India Pvt. Ltd.",
  "gstEnabled": true,
  "gstin": "29ABCDE1234F1Z5"
}
```

### Calculate estimate

```json
{
  "projectId": 1,
  "measurements": [
    {
      "type": "wardrobe",
      "lengthFeet": 6,
      "lengthInches": 0,
      "widthFeet": 7,
      "widthInches": 0,
      "quantity": 2,
      "material": "laminate",
      "ratePerSqft": 450
    },
    {
      "type": "tv unit",
      "lengthFeet": 0,
      "lengthInches": 72,
      "widthFeet": 0,
      "widthInches": 24,
      "quantity": 1,
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
  ,
  "advancePayment": 10000
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
  "clientName": "Client A",
  "companyName": "DesignFlow India Pvt. Ltd.",
  "items": [
    {
      "measurementId": 1,
      "type": "wardrobe",
      "material": "laminate",
      "lengthFeet": 6,
      "lengthInches": 0,
      "widthFeet": 7,
      "widthInches": 0,
      "quantity": 2,
      "unitArea": 42.0,
      "area": 84.0,
      "ratePerSqft": 450.0,
      "baseCost": 37800.0
    },
    {
      "measurementId": 2,
      "type": "tv unit",
      "material": "veneer",
      "lengthFeet": 6,
      "lengthInches": 0,
      "widthFeet": 2,
      "widthInches": 0,
      "quantity": 1,
      "unitArea": 12.0,
      "area": 12.0,
      "ratePerSqft": 780.0,
      "baseCost": 9360.0
    }
  ],
  "totalArea": 96.0,
  "subtotal": 47160.0,
  "additionalCharges": 2500.0,
  "discount": 1000.0,
  "gstPercentage": 18.0,
  "gstAmount": 8758.8,
  "finalAmount": 57418.8
}
```

## Sample invoice response

```json
{
  "invoiceId": 1,
  "invoiceNumber": "INV-202603201830-1",
  "downloadUrl": "/invoice/1/download",
  "companyName": "DesignFlow India Pvt. Ltd.",
  "companyGstinMasked": "***********F1Z5",
  "gstApplied": true,
  "clientName": "Client A",
  "subtotal": 48660.0,
  "gstAmount": 8758.8,
  "totalAmount": 57418.8,
  "advancePayment": 10000.0,
  "balanceDue": 47418.8,
  "generatedAt": "2026-03-20T18:30:00"
}
```

## Deployment notes

- The generated PDF path is backend-local in this MVP.
- The API no longer needs to expose raw server file paths to the mobile client; use the download endpoint instead.
- For production, expose invoices via object storage or signed URLs.
- Replace the mocked AI parser with OpenAI or Claude API integration.
- Add authentication, authorization, encryption at rest, and tenant isolation before real client use.
- Treat client names, GST numbers, and invoice PDFs as sensitive business data.

## Suggested next improvements

- Company profile settings with GSTIN, logo, bank account, and UPI QR
- WhatsApp share flow with invoice summary
- Client management and project history
- Offline drafts with sync
- Real AI extraction using OpenAI function-calling or JSON schema responses
