/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FmUser {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 5
   * @maxLength 20
   */
  username?: string;
  password?: string;
  admin?: boolean;
  active?: boolean;
}

export interface RegisterRequest {
  /**
   * User name
   * @example "username"
   */
  username: string;
  /**
   * Password
   * @example "password"
   */
  password: string;
}

export interface LoginResponse {
  /**
   * User name
   * @example "username"
   */
  username: string;
  /**
   * User role
   * @example "ROLE_USER"
   */
  role: string;
  /** JWT access token */
  accessToken: string;
}

export interface FmPeriod {
  /** @format int32 */
  id?: number;
  name?: string;
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
  active?: boolean;
}

export interface LoanDto {
  /** @format int32 */
  id?: number;
  amount?: number;
  name?: string;
  interestRate?: number;
  monthlyRepayment?: number;
}

export interface IncomeDto {
  /** @format int32 */
  id?: number;
  amount?: number;
  source?: string;
  comment?: string;
}

export interface ExpenseCategory {
  /** @format int32 */
  id?: number;
  category?: string;
}

export interface ExpenseDto {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  periodId?: number;
  /** @format int32 */
  loanId?: number;
  amount?: number;
  recipient?: string;
  expenseCategory?: ExpenseCategory;
  comment?: string;
}

export interface AssetSummary {
  totalAssetValue?: number;
}

export interface BalanceDto {
  /** @format int32 */
  id?: number;
  balance: number;
  investmentBalance: number;
}

export interface DashboardData {
  balance?: BalanceDto;
  incomeExpenseSummary?: IncomeExpenseSummary;
  assetSummary?: AssetSummary;
  loanSummary?: LoanSummary;
}

export interface IncomeExpenseSummary {
  totalIncome?: number;
  totalExpense?: number;
}

export interface LoanSummary {
  totalLoanValue?: number;
}

export interface AssetDto {
  /** @format int32 */
  id?: number;
  amount?: number;
  name?: string;
  assetType?: AssetType;
  /** @format date */
  maturityDate?: string;
  interestRate?: number;
  /** @format date */
  interestPaymentDate?: string;
}

export interface AssetType {
  /** @format int32 */
  id?: number;
  type?: string;
}
