# Discount Rule Engine

A pluggable business rules engine for calculating discounts built with Node.js, Express, and Jest. This service provides a flexible and extensible way to apply discount rules based on customer type, order value, day of the week, and other business criteria.

## Features

- **Pluggable Rule System**: Easy to add, modify, or remove discount rules
- **Priority-based Rule Selection**: Rules are evaluated by priority (1 = highest)
- **Input Validation**: Comprehensive validation using Joi schema
- **Currency Precision**: Proper rounding for monetary calculations
- **RESTful API**: Clean HTTP endpoints for discount calculations
- **Comprehensive Testing**: Full test coverage with Jest and Supertest

## Architecture

```
src/
├── index.js             
├── routes/
│   └── discount.js       
├── engine/
│   └── RuleEngine.js    
├── rules/
│   └── rules.js          
└── utils/
    └── money.js          
```

## API Endpoints

### GET `/api/discount`
Returns a list of available discount rules.

**Response:**
```json
{
  "availableRules": [
    "NEW_CUSTOMER_10_PERCENT",
    "BIG_ORDER_FLAT_500",
    "WEDNESDAY_5_PERCENT"
  ]
}
```

### POST `/api/discount`
Calculate discount for an order.

**Request Body:**
```json
{
  "customerType": "NEW|REGULAR|PREMIUM",
  "items": [
    {
      "productId": "string|number",
      "category": "string",
      "price": "number"
    }
  ],
  "orderTotal": "number",
  "dayOfWeek": "MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY"
}
```

**Response:**
```json
{
  "input": {
    "customerType": "NEW",
    "items": [...],
    "orderTotal": 11000,
    "dayOfWeek": "WEDNESDAY"
  },
  "result": {
    "appliedRule": "NEW_CUSTOMER_10_PERCENT",
    "discount": 1100,
    "payable": 9900
  }
}
```

## Business Rules

The system currently implements three discount rules with the following priorities:

### 1. NEW_CUSTOMER_10_PERCENT (Priority: 1)
- **Condition**: Customer type is "NEW"
- **Discount**: 10% of order total
- **Example**: $11,000 order → $1,100 discount

### 2. BIG_ORDER_FLAT_500 (Priority: 2)
- **Condition**: Order total > $10,000
- **Discount**: Flat $500 off
- **Example**: $11,001 order → $500 discount

### 3. WEDNESDAY_5_PERCENT (Priority: 3)
- **Condition**: Day of week is "WEDNESDAY"
- **Discount**: 5% of order total
- **Example**: $5,000 order → $250 discount

## Rule Priority System

Rules are evaluated in priority order (1 = highest). Only the highest priority applicable rule is applied. For example:
- A NEW customer ordering $15,000 on Wednesday will get 10% off (NEW_CUSTOMER_10_PERCENT) instead of the flat $500 or 5% Wednesday discount.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd discount
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## Testing

Run the test suite:
```bash
npm test
```
