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
  /** JWT access token */
  accessToken: string;
}

export interface DashboardResponse {
  dashboardData?: string;
}
