# Lote45 API Documentation Review

**API Version:** v1
**Host:** api.lote45.norte.link
**Scheme:** HTTPS
**Authentication:** API Key (Bearer token in Authorization header)

---

## Executive Summary

The Lote45 API is a comprehensive financial trading and risk management platform with **180+ endpoints** organized across 9 main controllers. The API follows REST conventions but has several areas that could benefit from improvement.

---

## API Structure Overview

### Controllers

| Controller | Endpoints | Purpose |
|------------|-----------|---------|
| **Book** | 5 | Book management and performance tracking |
| **Calc** | 30 | Risk calculations (VaR, Stress, Correlation) |
| **Compass** | 2 | Trading overview and cash consumption |
| **Equity** | 4 | Equity performance metrics |
| **Load** | 45+ | Data loading for various financial entities |
| **Lote45** | 9 | Core platform operations |
| **Parametric** | 1 | Parametric VaR calculations |
| **Trade** | 100+ | Trade management and reporting |
| **Utils** | 12 | Business day utilities |

---

## Detailed Findings

### 1. Positive Aspects ✅

1. **Consistent URL structure** - Endpoints follow logical groupings (`/api/{Controller}/{Action}`)
2. **Multiple response formats** - Supports JSON, XML, and text formats
3. **Required parameters clearly marked** - All required fields are explicitly specified
4. **API Key authentication** - Secure authentication mechanism in place
5. **Comprehensive coverage** - Extensive functionality for trading operations

### 2. Critical Issues 🔴

#### 2.1 Missing Response Schemas
**All endpoints return `{"type": "object"}` without defined properties.**

```json
"responses": {
  "200": {
    "description": "OK",
    "schema": {"type": "object"}  // ❌ No schema definition
  }
}
```

**Impact:** API consumers cannot know the response structure without trial and error.

**Recommendation:** Define proper response schemas for each endpoint:
```json
"responses": {
  "200": {
    "description": "OK",
    "schema": {
      "$ref": "#/definitions/BookPerformanceResponse"
    }
  }
}
```

#### 2.2 Duplicate Operation IDs
Several endpoints share the same `operationId`, which violates OpenAPI spec:

| Operation ID | Endpoints |
|--------------|-----------|
| `Calc_HistVaRTable` | `/api/Calc/1Day/HistVaRTable`, `/api/Calc/InitializeRiskDataContainer` |
| `Calc_CalcCustomParametricVaRBook` | `/api/Calc/CustomParametric/VaRBookMonthsPeriod`, `/api/Calc/CustomParametric/VaRBook` |
| `Calc_CalcCustomParametricVaRTradingDesk` | `/api/Calc/CustomParametric/VaRTradingDeskMonthsPeriod`, `/api/Calc/CustomParametric/VaRTradingDesk` |
| `Calc_CalcCustomParametricVaRUpperLevel` | `/api/Calc/CustomParametric/VaRUpperLevelMonthsPeriod`, `/api/Calc/CustomParametric/VaRUpperLevel` |
| `Load_LoadTradingDeskCashFlows` | `/api/Load/TradingDeskCashFlowsGroupBySettleDealer`, `/api/Load/TradingDeskCashFlows` |

**Impact:** Code generators will fail or produce incorrect client code.

#### 2.3 Missing Error Responses
No endpoints define error responses (400, 401, 403, 404, 500).

**Recommendation:** Add standard error responses:
```json
"responses": {
  "200": {...},
  "400": {"description": "Bad Request - Invalid parameters"},
  "401": {"description": "Unauthorized - Invalid or missing API key"},
  "404": {"description": "Not Found - Resource not found"},
  "500": {"description": "Internal Server Error"}
}
```

#### 2.4 Inconsistent Parameter Naming
Parameter naming conventions are inconsistent:

| Inconsistency | Examples |
|---------------|----------|
| Case variations | `refDate` vs `RefDate` vs `valDate` vs `ValDate` vs `valdate` |
| Naming style | `TradingDeskName` vs `tradingDesk` vs `TradingDesk` |
| Date naming | `refDate`, `valDate`, `valdate`, `startDate`, `StartDate` |

**Examples:**
- `/api/Load/NAVAndShareImputed`: uses `tradingDesk`, `refDate`
- `/api/Lote45/GetTodaysInfo`: uses `TradingDeskName`, `RefDate`
- `/api/Trade/LoadTrades`: uses `ValDate`, `TradingDesk` (integer!)

### 3. Moderate Issues 🟡

#### 3.1 Inconsistent Trading Desk Parameter Types
The `tradingDesk` parameter is sometimes a `string` and sometimes an `integer`:

**As String:**
- `/api/Book?tradingDesk={string}`
- `/api/Load/Overview?tradingDesk={string}`

**As Integer:**
- `/api/Trade/LoadTrades?TradingDesk={int32}`

**Impact:** Confusing for API consumers and potential runtime errors.

#### 3.2 HTTP Methods
All endpoints use **GET** method, even for operations that might be better suited for POST:
- `/api/Calc/InitializeRiskDataContainer` - Initialization should be POST
- Various "Load" operations that might create server-side state

#### 3.3 Missing Descriptions
- No endpoint descriptions
- No parameter descriptions
- No tag descriptions

#### 3.4 Array Parameters Without Proper Documentation
Several endpoints accept array parameters but lack examples:
```json
{
  "name": "books",
  "in": "query",
  "required": false,
  "type": "array",
  "items": {"type": "string"},
  "collectionFormat": "multi"
}
```

**Recommendation:** Add examples showing how to pass multiple values.

### 4. Minor Issues 🟢

#### 4.1 Empty Definitions Section
```json
"definitions": {}
```
No reusable schema definitions are provided.

#### 4.2 Swagger 2.0 (Legacy)
The API uses Swagger 2.0 instead of OpenAPI 3.x. Consider migrating to OpenAPI 3.0+ for:
- Better schema support
- Improved security definitions
- Enhanced examples support

#### 4.3 Product Endpoint Miscategorization
`/api/Product/ParametricVaRReport` is tagged as "Calc" but uses "Product" path.

---

## Endpoint Categories Analysis

### Book Endpoints (5)
| Endpoint | Required Params | Issues |
|----------|-----------------|--------|
| `GET /api/Book` | tradingDesk, refDate | None |
| `GET /api/Book/FromStrategy` | tradingDesk, strategy | None |
| `GET /api/Book/Performance` | StartDate, EndDate, BooksLevel | None |
| `GET /api/Book/FinancialPerformance` | StartDate, EndDate, BooksLevel | None |
| `GET /api/Book/PerformancePL` | StartDate, EndDate, BooksLevel, Books[] | None |

### Calc Endpoints (30) - Risk Calculations
**1-Day VaR Family:**
- CorrelationTable, CovarianceTable, FullHistVaRTable, HistVaRTable
- ParametricVaRReport, StdDevTable, VaR

**5-Day VaR Family:**
- CorrelationTable, CovarianceTable, HistVaRTable, StdDevTable, DayVaR

**Custom Parametric:**
- VaRBookMonthsPeriod, VaRBook, VaRTradingDeskMonthsPeriod, VaRTradingDesk
- VaRUpperLevelMonthsPeriod, VaRUpperLevel

**Book-level:**
- PrimitivesStressReport, PrimitivesVaRReport, VaRStressReport

### Utils Endpoints (12) - Business Day Utilities
Excellent utility endpoints for date calculations across BR, US, and BMF calendars:
- `AddBMFBusinessDaysBMF`, `AddBRBusinessDays`
- `GetLastBusinessDayBR`, `GetLastBusinessDayUS`, `GetLastBusinessDayBMF`
- `GetMonthLastBusinessDay`
- `GetWorkDaysBMF`, `GetWorkDaysBR`, `GetWorkDaysUS`
- `IsBusinessDayBR`, `IsBusinessDayUS`
- `GetBusinessDaysPeriod`

---

## Recommendations Summary

### High Priority
1. **Define response schemas** for all endpoints
2. **Fix duplicate operationIds** - each must be unique
3. **Add error responses** (400, 401, 403, 404, 500)
4. **Standardize parameter naming** - choose one convention

### Medium Priority
5. **Standardize tradingDesk type** - decide if string or integer
6. **Add descriptions** to endpoints, parameters, and tags
7. **Consider POST methods** for state-changing operations
8. **Add examples** for complex parameters (arrays, dates)

### Low Priority
9. **Migrate to OpenAPI 3.x** for modern tooling support
10. **Add definitions section** with reusable schemas
11. **Fix tag categorization** for Product endpoint

---

## Parameter Reference

### Common Required Parameters

| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| tradingDesk / TradingDeskName | string | - | Trading desk identifier |
| refDate / valDate | string | date-time | Reference/valuation date |
| startDate / StartDate | string | date-time | Period start date |
| endDate / EndDate | string | date-time | Period end date |
| bookLevel / BooksLevel | integer | int32 | Book hierarchy level |
| mainReport | string | - | Main report identifier |

### Common Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| invertedAmount | boolean | - | Invert amount sign |
| useAfterMarket | boolean | - | Include after-market data |
| showReplicatedTrades | boolean | - | Show replicated trades |
| books | array[string] | - | Filter by book names |

---

## Date Format Note

All date parameters use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`

Example: `2024-12-04T00:00:00`

---

*Review generated: 2025-12-04*
