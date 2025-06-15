import type { Result } from 'neverthrow';
import type { TextsResponse } from './texts.ts';

export type ApiWarning = {
	// biome-ignore lint/style/useNamingConvention: Sefaria's API uses snake_case for warning codes
	warning_code: string;
	message: string;
};

export type SefariaResponse =
	| TextsResponse
	| {
			error?: string;
			warnings?: Record<string, ApiWarning>[];
			[key: string]: unknown;
	  };

export enum ErrorType {
	USER_INPUT = 'USER_INPUT',
	SYSTEM = 'SYSTEM',
}

export type ApiError = {
	status?: number | undefined;
	message: string;
	data?: unknown;
	warnings?: Record<string, ApiWarning>[] | undefined;
	errorType: ErrorType;
};

export type RouteResult<T> = Result<T, ApiError>;
