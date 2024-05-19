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

export interface LoanDto {
  /** @format int32 */
  id: number | null;
  /**
   * @min 1
   * @exclusiveMin false
   * @max 1000000000
   * @exclusiveMax false
   */
  amount: number;
  /**
   * @minLength 1
   * @maxLength 30
   */
  name: string;
  /**
   * @min 0.01
   * @exclusiveMin false
   * @max 1000
   * @exclusiveMax false
   */
  interestRate: number;
  /**
   * @min 1
   * @exclusiveMin false
   */
  monthlyRepayment: number;
}

export interface IncomeDto {
  /** @format int32 */
  id: number | null;
  /**
   * @min 1
   * @exclusiveMin false
   * @max 1000000000
   * @exclusiveMax false
   */
  amount: number;
  /**
   * @minLength 1
   * @maxLength 30
   */
  source: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  comment: string | null;
}

export interface ExpenseCategory {
  /** @format int32 */
  id?: number;
  category?: string;
}

export interface ExpenseDto {
  /** @format int32 */
  id: number | null;
  /**
   * @min 1
   * @exclusiveMin false
   * @max 1000000000
   * @exclusiveMax false
   */
  amount: number;
  /**
   * @minLength 1
   * @maxLength 30
   */
  recipient: string;
  expenseCategory: ExpenseCategory;
  /**
   * @minLength 0
   * @maxLength 100
   */
  comment: string | null;
  relatedLoanName: string | null;
}

export interface AssetDto {
  /** @format int32 */
  id: number | null;
  /**
   * @min 1
   * @exclusiveMin false
   * @max 1000000000
   * @exclusiveMax false
   */
  amount: number;
  /**
   * @minLength 1
   * @maxLength 30
   */
  name: string;
  useInvestmentBalance: boolean | null;
  assetType: AssetType;
  /** @format date */
  maturityDate: string | null;
  /**
   * @min 0.01
   * @exclusiveMin false
   * @max 1000
   * @exclusiveMax false
   */
  interestRate: number;
  /** @format int32 */
  interestPaymentMonth: number | null;
}

export interface AssetType {
  /** @format int32 */
  id?: number;
  type?: string;
}

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

export interface AssetInvestmentBalanceDto {
  /**
   * @min 1
   * @exclusiveMin false
   * @max 1000000000
   * @exclusiveMax false
   */
  amount: number;
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
