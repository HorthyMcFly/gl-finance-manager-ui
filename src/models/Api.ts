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
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
}

export interface DashboardResponse {
  dashboardData?: string;
}

export interface BalanceDto {
  /** @format int32 */
  id?: number;
  balance: number;
  investmentBalance: number;
}
