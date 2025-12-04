/**
 * React Hooks for Lote45 API
 * Easy integration with React dashboards
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Lote45Client, ApiConfig, ApiResponse } from './client';

// ============================================================
// Client Context & Provider
// ============================================================

let globalClient: Lote45Client | null = null;

export function initializeLote45Client(config: ApiConfig): Lote45Client {
  globalClient = new Lote45Client(config);
  return globalClient;
}

export function getLote45Client(): Lote45Client {
  if (!globalClient) {
    throw new Error('Lote45Client not initialized. Call initializeLote45Client first.');
  }
  return globalClient;
}

// ============================================================
// Generic Hook for API Calls
// ============================================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: (client: Lote45Client) => Promise<ApiResponse<T>>,
  deps: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = getLote45Client();
      const response = await fetcher(client);

      if (mountedRef.current) {
        if (response.error) {
          setError(response.error);
          setData(null);
        } else {
          setData(response.data);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [...deps, fetch]);

  return { data, loading, error, refetch: fetch };
}

// ============================================================
// Lazy API Hook (fetch on demand)
// ============================================================

interface UseLazyApiState<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: P) => Promise<void>;
  reset: () => void;
}

export function useLazyApi<T, P extends unknown[]>(
  fetcher: (client: Lote45Client, ...args: P) => Promise<ApiResponse<T>>
): UseLazyApiState<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P) => {
    setLoading(true);
    setError(null);

    try {
      const client = getLote45Client();
      const response = await fetcher(client, ...args);

      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// ============================================================
// Dashboard-Specific Hooks
// ============================================================

/**
 * Get list of trading desks
 */
export function useTradingDesks() {
  return useApi(
    (client) => client.getTradingDesks(),
    []
  );
}

/**
 * Get today's info for a trading desk
 */
export function useTodaysInfo(tradingDesk: string, refDate: Date) {
  return useApi(
    (client) => client.getTodaysInfo(tradingDesk, refDate),
    [tradingDesk, refDate.toISOString()]
  );
}

/**
 * Get NAV and Share data
 */
export function useNAVAndShare(tradingDesk: string, refDate: Date) {
  return useApi(
    (client) => client.getNAVAndShare(refDate, tradingDesk),
    [tradingDesk, refDate.toISOString()]
  );
}

/**
 * Get portfolio overview
 */
export function useOverview(tradingDesk: string, refDate: Date, options?: {
  invertedAmount?: boolean;
  useAfterMarket?: boolean;
}) {
  return useApi(
    (client) => client.getOverview(refDate, tradingDesk, options?.invertedAmount, options?.useAfterMarket),
    [tradingDesk, refDate.toISOString(), options?.invertedAmount, options?.useAfterMarket]
  );
}

/**
 * Get book performance over a period
 */
export function useBookPerformance(startDate: Date, endDate: Date, booksLevel: number) {
  return useApi(
    (client) => client.getBookPerformance(startDate, endDate, booksLevel),
    [startDate.toISOString(), endDate.toISOString(), booksLevel]
  );
}

/**
 * Get VaR data
 */
export function useVaR(tradingDesk: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
  return useApi(
    (client) => client.getVaR(tradingDesk, valDate, bookLevel, mainReport, books),
    [tradingDesk, valDate.toISOString(), bookLevel, mainReport, JSON.stringify(books)]
  );
}

/**
 * Get stress test data
 */
export function useStress(tradingDesk: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
  return useApi(
    (client) => client.getStress(tradingDesk, valDate, bookLevel, mainReport, books),
    [tradingDesk, valDate.toISOString(), bookLevel, mainReport, JSON.stringify(books)]
  );
}

/**
 * Get P&L resume
 */
export function usePLResume(tradingDesk: string, refDate: Date) {
  return useApi(
    (client) => client.getPLResume(tradingDesk, refDate),
    [tradingDesk, refDate.toISOString()]
  );
}

/**
 * Get available cash
 */
export function useAvailableCash(tradingDesk: string, refDate: Date, days?: number) {
  return useApi(
    (client) => client.getAvailableCash(refDate, tradingDesk, days),
    [tradingDesk, refDate.toISOString(), days]
  );
}

/**
 * Get trades for a date
 */
export function useTrades(tradingDesk: string, refDate: Date, options?: {
  invertedAmount?: boolean;
  showReplicatedTrades?: boolean;
}) {
  return useApi(
    (client) => client.getTrades(refDate, tradingDesk, options?.invertedAmount, options?.showReplicatedTrades),
    [tradingDesk, refDate.toISOString(), options?.invertedAmount, options?.showReplicatedTrades]
  );
}

/**
 * Get movements for a date
 */
export function useMovements(tradingDesk: string, refDate: Date) {
  return useApi(
    (client) => client.getMovements(refDate, tradingDesk),
    [tradingDesk, refDate.toISOString()]
  );
}

/**
 * Get cash flows
 */
export function useCashFlows(tradingDesk: string, refDate: Date, endDate: Date, groupBySettleDealer?: boolean) {
  return useApi(
    (client) => client.getCashFlows(refDate, endDate, tradingDesk, groupBySettleDealer),
    [tradingDesk, refDate.toISOString(), endDate.toISOString(), groupBySettleDealer]
  );
}

/**
 * Get equity performance
 */
export function useEquityPerformance(startDate: Date, endDate: Date) {
  return useApi(
    (client) => client.getEquityPerformance(startDate, endDate),
    [startDate.toISOString(), endDate.toISOString()]
  );
}

/**
 * Get correlation table
 */
export function useCorrelationTable(tradingDesk: string, valDate: Date, bookLevel: number, mainReport: string, books?: string[]) {
  return useApi(
    (client) => client.getCorrelationTable(tradingDesk, valDate, bookLevel, mainReport, books),
    [tradingDesk, valDate.toISOString(), bookLevel, mainReport, JSON.stringify(books)]
  );
}

/**
 * Get historical book performance
 */
export function useHistoricalBookPerformance(
  startDate: Date,
  endDate: Date,
  tradingDesk: string,
  mainReport: string,
  bookLevel: number
) {
  return useApi(
    (client) => client.getHistoricalBookPerformance(startDate, endDate, tradingDesk, mainReport, bookLevel),
    [startDate.toISOString(), endDate.toISOString(), tradingDesk, mainReport, bookLevel]
  );
}

/**
 * Get benchmark comparison
 */
export function useBenchmarkPerformance(
  startDate: Date,
  endDate: Date,
  tradingDesk: string,
  mainReport: string,
  bookLevel: number,
  benchmark: string
) {
  return useApi(
    (client) => client.getBenchmarkBookPerformance(startDate, endDate, tradingDesk, mainReport, bookLevel, benchmark),
    [startDate.toISOString(), endDate.toISOString(), tradingDesk, mainReport, bookLevel, benchmark]
  );
}

// ============================================================
// Utility Hooks
// ============================================================

/**
 * Get last business day (BR)
 */
export function useLastBusinessDayBR() {
  return useApi(
    (client) => client.getLastBusinessDayBR(),
    []
  );
}

/**
 * Check if date is business day
 */
export function useIsBusinessDay(date: Date, calendar: 'BR' | 'US' = 'BR') {
  return useApi(
    (client) => calendar === 'BR' ? client.isBusinessDayBR(date) : client.isBusinessDayUS(date),
    [date.toISOString(), calendar]
  );
}

// ============================================================
// Combined Dashboard Hook
// ============================================================

interface DashboardData {
  tradingDesks: unknown;
  nav: unknown;
  overview: unknown;
  plResume: unknown;
  var: unknown;
}

interface UseDashboardOptions {
  tradingDesk: string;
  refDate: Date;
  bookLevel?: number;
  mainReport?: string;
}

export function useDashboard(options: UseDashboardOptions) {
  const { tradingDesk, refDate, bookLevel = 1, mainReport = 'Default' } = options;

  const tradingDesks = useTradingDesks();
  const nav = useNAVAndShare(tradingDesk, refDate);
  const overview = useOverview(tradingDesk, refDate);
  const plResume = usePLResume(tradingDesk, refDate);
  const varData = useVaR(tradingDesk, refDate, bookLevel, mainReport);

  const loading = tradingDesks.loading || nav.loading || overview.loading || plResume.loading || varData.loading;
  const error = tradingDesks.error || nav.error || overview.error || plResume.error || varData.error;

  const data: DashboardData = useMemo(() => ({
    tradingDesks: tradingDesks.data,
    nav: nav.data,
    overview: overview.data,
    plResume: plResume.data,
    var: varData.data,
  }), [tradingDesks.data, nav.data, overview.data, plResume.data, varData.data]);

  const refetch = useCallback(() => {
    tradingDesks.refetch();
    nav.refetch();
    overview.refetch();
    plResume.refetch();
    varData.refetch();
  }, [tradingDesks, nav, overview, plResume, varData]);

  return { data, loading, error, refetch };
}
