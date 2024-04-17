import { createApiBuilderFromCtpClient as createImportApiBuilderFromCtpClient } from '@commercetools/importapi-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class CtClientService {
  authMiddlewareOptions: AuthMiddlewareOptions;
  httpMiddlewareOptions: HttpMiddlewareOptions;
  ctpClient: any;
  apiRoot: any;
  constructor() {
    // Configure authMiddlewareOptions
    this.authMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL,
      projectKey: process.env.CTP_PROJECT_KEY,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID,
        clientSecret: process.env.CTP_CLIENT_SECRET,
      },  
      scopes: [process.env.CTP_SCOPES],
      fetch,
    };

    // Configure httpMiddlewareOptions
    this.httpMiddlewareOptions = {
      host: process.env.CTP_API_URL,
      fetch,
    };

    // Export the ClientBuilder
    this.ctpClient = new ClientBuilder()
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  createApiClient = (client: any) =>
    createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });

  createImportApiClient = (client: any) =>
    createImportApiBuilderFromCtpClient(client).withProjectKeyValue({
      projectKey: process.env.CTP_PROJECT_KEY,
    });

  createStoreApiClient = (client: any) =>
    createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });

  createMyApiClient = () => {
    const authMiddlewareOptions: PasswordAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL,
      projectKey: process.env.CTP_PROJECT_KEY,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID,
        clientSecret: process.env.CTP_CLIENT_SECRET,
        user: {
          username: process.env.CTP_USERNAME,
          password: process.env.CTP_PASSWORD,
        },
      },
      scopes: [process.env.CTP_SCOPES],
      fetch,
    };

    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: process.env.CTP_API_URL,
      fetch,
    };

    const client = new ClientBuilder()
      .withPasswordFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();
    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });
  };
}
