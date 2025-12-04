/**
 * Lote45 API Client
 * Auto-generated client for dashboard integration
 */

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export class Lote45Client {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  private async request<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.config.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          data: null,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  // ============================================================
  // BOOK ENDPOINTS - Portfolio & Performance
  // ============================================================

  async getBook(tradingDesk: string, refDate: Date) {
    return this.request('/api/Book', {
      tradingDesk,
      refDate: refDate.toISOString(),
    });
  }

  async getBooksFromStrategy(tradingDesk: string, strategy: string) {
    return this.request('/api/Book/FromStrategy', {
      tradingDesk,
      strategy,
    });
  }

  async getBookPerformance(startDate: Date, endDate: Date, booksLevel: number) {
    return this.request('/api/Book/Performance', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      BooksLevel: booksLevel,
    });
  }

  async getBookFinancialPerformance(startDate: Date, endDate: Date, booksLevel: number) {
    return this.request('/api/Book/FinancialPerformance', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      BooksLevel: booksLevel,
    });
  }

  async getBookPerformancePL(startDate: Date, endDate: Date, booksLevel: number, books: string[]) {
    return this.request('/api/Book/PerformancePL', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      BooksLevel: booksLevel,
      Books: books,
    });
  }

  // ============================================================
  // RISK CALCULATIONS - VaR, Stress, Correlation
  // ============================================================

  async getCorrelationTable(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/1Day/CorrelationTable', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async getCovarianceTable(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, annualized: boolean, books?: string[]) {
    return this.request('/api/Calc/1Day/CovarianceTable', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      annualized,
      books,
    });
  }

  async getHistVaRTable(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/1Day/HistVaRTable', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async getFullHistVaRTable(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/1Day/FullHistVaRTable', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async getParametricVaRReport(tradingDeskName: string, valDate: Date) {
    return this.request('/api/Calc/1Day/ParametricVaRReport', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
    });
  }

  async getVaR(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/1Day/VaR', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async get5DayVaR(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/5Day/DayVaR', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async getStress(tradingDeskName: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
    return this.request('/api/Calc/Stress', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
      bookLevel,
      mainReport,
      books,
    });
  }

  async getVaRStressReport(tradingDeskName: string, valDate: Date) {
    return this.request('/api/VaR/StressReport', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
    });
  }

  // Custom Parametric VaR
  async getCustomParametricVaR(params: {
    tradingDeskName: string;
    valDate: Date;
    bookLevel: number;
    mainReport: string;
    daysInterval: number;
    monthsPeriod?: number;
    confidenceLevel?: number;
    ewmaLambda?: number;
    useZeroParamAvg?: boolean;
    useMonthlyIPCA?: boolean;
  }) {
    const endpoint = params.monthsPeriod
      ? '/api/Calc/CustomParametric/VaRBookMonthsPeriod'
      : '/api/Calc/CustomParametric/VaRBook';

    return this.request(endpoint, {
      TradingDeskName: params.tradingDeskName,
      valdate: params.valDate.toISOString(),
      bookLevel: params.bookLevel,
      mainReport: params.mainReport,
      daysInterval: params.daysInterval,
      monthsPeriod: params.monthsPeriod,
      confidenceLevel: params.confidenceLevel,
      ewmaLambda: params.ewmaLambda,
      useZeroParamAvg: params.useZeroParamAvg,
      useMonthlyIPCA: params.useMonthlyIPCA,
    });
  }

  // ============================================================
  // COMPASS - Trading Overview
  // ============================================================

  async getCompassOverview(refDate: Date, tradingDesks: string[], tickers?: string[], invertedAmount?: boolean, useAfterMarket?: boolean) {
    return this.request('/api/Compass/OverviewAndPrices', {
      refDate: refDate.toISOString(),
      tradingDesks,
      tickers,
      invertedAmount,
      useAfterMarket,
    });
  }

  async getTradingConsumoCaixa(refDate: Date, tradingDesk: string, days?: number) {
    return this.request('/api/Compass/TradingConsumoCaixa', {
      refDate: refDate.toISOString(),
      tradingDesk,
      days,
    });
  }

  // ============================================================
  // EQUITY - Performance Metrics
  // ============================================================

  async getEquityPerformance(startDate: Date, endDate: Date) {
    return this.request('/api/Equity/Performance', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
    });
  }

  async getEquityFinancialPerformance(startDate: Date, endDate: Date) {
    return this.request('/api/Equity/FinancialPerformance', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
    });
  }

  async getEquityPLPerformance(startDate: Date, endDate: Date, books: string[]) {
    return this.request('/api/Equity/PLPerformance', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      Books: books,
    });
  }

  // ============================================================
  // LOAD - Data Loading Endpoints
  // ============================================================

  async getOverview(refDate: Date, tradingDesk: string, invertedAmount?: boolean, useAfterMarket?: boolean) {
    return this.request('/api/Load/Overview', {
      refDate: refDate.toISOString(),
      tradingDesk,
      invertedAmount,
      useAfterMarket,
    });
  }

  async getOverviewWithBeta(refDate: Date, tradingDesk: string, invertedAmount?: boolean, useAfterMarket?: boolean) {
    return this.request('/api/Load/OverviewWithBeta', {
      refDate: refDate.toISOString(),
      tradingDesk,
      invertedAmount,
      useAfterMarket,
    });
  }

  async getOverviewByPrimitive(refDate: Date, tradingDesk: string, useAfterMarket?: boolean) {
    return this.request('/api/Load/OverviewByPrimitive', {
      refDate: refDate.toISOString(),
      tradingDesk,
      useAfterMarket,
    });
  }

  async getNAV(refDate: Date, tradingDesk: string) {
    return this.request('/api/Load/NAV', {
      refDate: refDate.toISOString(),
      tradingDesk,
    });
  }

  async getNAVAndShare(refDate: Date, tradingDesk: string) {
    return this.request('/api/Load/NAVAndShare', {
      refDate: refDate.toISOString(),
      tradingDesk,
    });
  }

  async getShare(refDate: Date, tradingDesk: string) {
    return this.request('/api/Load/Share', {
      refDate: refDate.toISOString(),
      tradingDesk,
    });
  }

  async getAvailableCash(refDate: Date, tradingDesk: string, days?: number, showDetails?: boolean) {
    return this.request('/api/Load/AvailableCash', {
      refDate: refDate.toISOString(),
      tradingDesk,
      days,
      showDetails,
    });
  }

  async getTrades(refDate: Date, tradingDesk: string, invertedAmount?: boolean, showReplicatedTrades?: boolean) {
    return this.request('/api/Load/Trades', {
      refDate: refDate.toISOString(),
      tradingDesk,
      invertedAmount,
      showReplicatedTrades,
    });
  }

  async getMovements(refDate: Date, tradingDesk: string) {
    return this.request('/api/Load/Movements', {
      refDate: refDate.toISOString(),
      tradingDesk,
    });
  }

  async getPeriodMovements(tradingDesk: string, startDate: Date, endDate: Date) {
    return this.request('/api/Load/PeriodMovements', {
      tradingDesk,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  async getPLResume(tradingDesk: string, refDate: Date) {
    return this.request('/api/Load/PLResume', {
      tradingDesk,
      refDate: refDate.toISOString(),
    });
  }

  async getBooksOverviewReport(refDate: Date, tradingDesk: string, mainReport: string, bookLevel: number, invertedAmount?: boolean, useAfterMarket?: boolean) {
    return this.request('/api/Load/BooksOverviewReport', {
      refDate: refDate.toISOString(),
      tradingDesk,
      mainReport,
      bookLevel,
      invertedAmount,
      useAfterMarket,
    });
  }

  async getHistoricalBookPerformance(startDate: Date, endDate: Date, tradingDesk: string, mainReport: string, bookLevel: number) {
    return this.request('/api/Load/HistoricalBookPerformance', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tradingDesk,
      mainReport,
      bookLevel,
    });
  }

  async getBenchmarkBookPerformance(startDate: Date, endDate: Date, tradingDesk: string, mainReport: string, bookLevel: number, benchmark: string) {
    return this.request('/api/Load/BenchmarkBookPerformance', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tradingDesk,
      mainReport,
      bookLevel,
      benchmark,
    });
  }

  async getCashFlows(refDate: Date, endDate: Date, tradingDesk: string, groupBySettleDealer?: boolean) {
    const endpoint = groupBySettleDealer
      ? '/api/Load/TradingDeskCashFlowsGroupBySettleDealer'
      : '/api/Load/TradingDeskCashFlows';

    return this.request(endpoint, {
      refDate: refDate.toISOString(),
      endDate: endDate.toISOString(),
      tradingDesk,
      groupBySettleDealer,
    });
  }

  async getFXTrades(refDate: Date, tradingDesk: string, showReplicatedTrades?: boolean) {
    return this.request('/api/Load/FXTrades', {
      refDate: refDate.toISOString(),
      tradingDesk,
      showReplicatedTrades,
    });
  }

  async getProductInfo(product: string, valDate: Date) {
    return this.request('/api/Load/ProductInfo', {
      product,
      valDate: valDate.toISOString(),
    });
  }

  async getProductClasses(refDate: Date) {
    return this.request('/api/Load/ProductClasses', {
      refDate: refDate.toISOString(),
    });
  }

  async getCorporateEvents(refDate: Date) {
    return this.request('/api/Load/CorporateEvents', {
      refDate: refDate.toISOString(),
    });
  }

  // ============================================================
  // LOTE45 - Core Platform
  // ============================================================

  async getTradingDesks() {
    return this.request('/api/Lote45/TradingDesks');
  }

  async getUsers() {
    return this.request('/api/Lote45/LoadUsers');
  }

  async getTodaysInfo(tradingDeskName: string, refDate: Date) {
    return this.request('/api/Lote45/GetTodaysInfo', {
      TradingDeskName: tradingDeskName,
      RefDate: refDate.toISOString(),
    });
  }

  async getPerformanceAttribution(startDate: Date, endDate: Date) {
    return this.request('/api/Lote45/PerformanceAttribution', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
    });
  }

  async getPerformanceAttributionFinancial(startDate: Date, endDate: Date) {
    return this.request('/api/Lote45/PerformanceAttributionFinancial', {
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
    });
  }

  async initializeTradingRiskInformation(tradingDeskName: string, valDate: Date) {
    return this.request('/api/Lote45/InitializeTradingRiskInformation', {
      TradingDeskName: tradingDeskName,
      valdate: valDate.toISOString(),
    });
  }

  // ============================================================
  // PARAMETRIC
  // ============================================================

  async getParametricVARTable(params: {
    confidence: number;
    months: number;
    days: number;
    ewmaWeight: number;
    useZeroAvg: boolean;
    useMonthlyIPCA: boolean;
    useWarnings: boolean;
  }) {
    return this.request('/api/Parametric/VARTable', params);
  }

  // ============================================================
  // UTILS - Business Day Utilities
  // ============================================================

  async getLastBusinessDayBR() {
    return this.request<string>('/api/Utils/GetLastBusinessDayBR');
  }

  async getLastBusinessDayUS() {
    return this.request<string>('/api/Utils/GetLastBusinessDayUS');
  }

  async getLastBusinessDayBMF() {
    return this.request<string>('/api/Utils/GetLastBusinessDayBMF');
  }

  async addBusinessDaysBR(refDate: Date, days: number) {
    return this.request<string>('/api/Utils/AddBRBusinessDays', {
      refDate: refDate.toISOString(),
      days,
    });
  }

  async addBusinessDaysBMF(refDate: Date, days: number) {
    return this.request<string>('/api/Utils/AddBMFBusinessDaysBMF', {
      refDate: refDate.toISOString(),
      days,
    });
  }

  async isBusinessDayBR(refDate: Date) {
    return this.request<boolean>('/api/Utils/IsBusinessDayBR', {
      refDate: refDate.toISOString(),
    });
  }

  async isBusinessDayUS(refDate: Date) {
    return this.request<boolean>('/api/Utils/IsBusinessDayUS', {
      refDate: refDate.toISOString(),
    });
  }

  async getWorkDaysBR(startDate: Date, endDate: Date) {
    return this.request('/api/Utils/GetWorkDaysBR', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  async getWorkDaysUS(startDate: Date, endDate: Date) {
    return this.request('/api/Utils/GetWorkDaysUS', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  async getMonthLastBusinessDay(refDate: Date) {
    return this.request<string>('/api/Utils/GetMonthLastBusinessDay', {
      refDate: refDate.toISOString(),
    });
  }
}

// Default export for convenience
export default Lote45Client;
