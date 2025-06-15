import { SefariaAPI } from './api.ts';
export { Routes } from './routes.ts';
export type { TextsResponse } from './types/texts.ts';
export { type ApiError, ErrorType } from './types/api.ts';

export const sefariaAPI = SefariaAPI.getInstance();
export default sefariaAPI;
