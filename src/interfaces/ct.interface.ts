export type { ByProjectKeyRequestBuilder as ApiRoot } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
export type { ByProjectKeyRequestBuilder as ImportApiRoot } from '@commercetools/importapi-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export interface Response {
  status?: number;
  message?: string;
  data?: any;
  total?: number;
  limit?: number;
  offset?: number;
}
export interface OpenAIResponse {
  status?: number;
  message?: string;
  data?: any;
  error?: any;
}
