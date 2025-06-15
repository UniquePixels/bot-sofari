import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { err, ok } from 'neverthrow';
import type { Routes } from './routes.js';

import {
	ErrorType,
	type RouteResult,
	type SefariaResponse,
} from './types/api.js';

export class SefariaAPI {
	private static instance: SefariaAPI;
	private readonly axiosInstance: AxiosInstance;

	private constructor() {
		this.axiosInstance = axios.create({
			baseURL: 'https://www.sefaria.org/api/',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	public static getInstance(): SefariaAPI {
		if (!SefariaAPI.instance) {
			SefariaAPI.instance = new SefariaAPI();
		}
		return SefariaAPI.instance;
	}

	private categorizeError(status?: number): ErrorType {
		// If we got a 200 response, any errors are user input related
		if (status === 200) {
			return ErrorType.USER_INPUT;
		}

		// Check if it's a system error based on status code
		if (this.isSystemErrorByStatus(status)) {
			return ErrorType.SYSTEM;
		}

		// 4xx errors are typically user input (except auth/rate limit)
		if (status && status >= 400 && status < 500) {
			if ([401, 403, 429].includes(status)) {
				return ErrorType.SYSTEM;
			}
			return ErrorType.USER_INPUT;
		}

		// Default to system error for unknown cases
		return ErrorType.SYSTEM;
	}

	private isSystemErrorByStatus(status?: number): boolean {
		if (!status) return false;

		// 5xx errors are system issues
		if (status >= 500) return true;

		// Auth and rate limit are system issues
		if ([401, 403, 429].includes(status)) return true;

		return false;
	}

	private isSefariaError(data: SefariaResponse): boolean {
		// Check for explicit error field
		if (data.error) {
			return true;
		}

		// Check for warnings that indicate errors
		if (data.warnings && Array.isArray(data.warnings)) {
			return data.warnings.some((warning) =>
				Object.values(warning).some(
					(w) =>
						w.warning_code &&
						(w.warning_code.includes('APINoSourceText') ||
							w.warning_code.includes('APINoTranslationText') ||
							w.warning_code.includes('APINoLanguageVersion') ||
							w.warning_code.includes('APINoVersion')),
				),
			);
		}

		return false;
	}

	public async fetchData<T = unknown>(
		routeConfig: ReturnType<(typeof Routes)[keyof typeof Routes]>,
	): Promise<RouteResult<T>> {
		try {
			const { type, url } = routeConfig;
			const params = 'params' in routeConfig ? routeConfig.params : undefined;

			const response = await this.axiosInstance.request<SefariaResponse>({
				method: type,
				url,
				...(type === 'GET'
					? {
							params,
							paramsSerializer: {
								indexes: null, // Don't add brackets for arrays
							},
						}
					: { data: params }),
			});

			const data = response.data;

			// Check for Sefaria-specific errors in 200 responses
			if (this.isSefariaError(data)) {
				const message =
					data.error || 'API returned warnings indicating an error';
				const errorType = this.categorizeError(response.status);

				return err({
					status: response.status,
					message,
					data: data,
					warnings: data.warnings || undefined,
					errorType,
				});
			}

			return ok(data as T);
		} catch (error) {
			const axiosError = error as AxiosError<SefariaResponse>;

			// Handle HTTP errors that might still have Sefaria error format
			const errorData = axiosError.response?.data;
			const message =
				errorData?.error || axiosError.message || 'Request failed';
			const status = axiosError.response?.status;
			const errorType = this.categorizeError(status);

			return err({
				status: status || undefined,
				message,
				data: errorData || undefined,
				warnings: errorData?.warnings || undefined,
				errorType,
			});
		}
	}
}
