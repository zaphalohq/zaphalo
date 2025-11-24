import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  FetchResult,
  fromPromise,
  Observable,
  Operation,
  ServerError,
  ServerParseError,
  from,
  InMemoryCache,
  HttpLink

} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { RestLink } from 'apollo-link-rest';
import { createUploadLink } from 'apollo-upload-client';

import { renewToken } from '@src/modules/auth/services/AuthService';
import { CurrentWorkspaceMember } from '@/auth/states/currentWorkspaceMemberState';
import { CurrentWorkspace } from '@/auth/states/currentWorkspaceState';
import { AuthTokenPair } from '~/generated/graphql';
import { logDebug } from '@src/utils/logDebug';

import { i18n } from '@lingui/core';
import {
  DefinitionNode,
  DirectiveNode,
  GraphQLFormattedError,
  SelectionNode,
} from 'graphql';
import isEmpty from 'lodash.isempty';
import { isDefined } from '@src/utils/validation/isDefined';
import { getGenericOperationName } from '@src/utils/getGenericOperationName';
import { cookieStorage } from "@src/utils/cookie-storage";
import { isUndefinedOrNull } from '@src/utils/isUndefinedOrNull';
import { ApolloManager } from '../types/apolloManager.interface';
import { getTokenPair } from '../utils/getTokenPair';
import { loggerLink } from '../utils/loggerLink';

const logger = loggerLink(() => 'Zaphalo');

export interface Options<TCacheShape> extends ApolloClientOptions<TCacheShape> {
  onError?: (err: readonly GraphQLFormattedError[] | undefined) => void;
  onNetworkError?: (err: Error | ServerParseError | ServerError) => void;
  onTokenPairChange?: (tokenPair: AuthTokenPair) => void;
  onUnauthenticatedError?: () => void;
  currentWorkspaceMember: CurrentWorkspaceMember | null;
  currentWorkspace: CurrentWorkspace | null;
  extraLinks?: ApolloLink[];
  isDebugMode?: boolean;
}


export class ApolloFactory<TCacheShape> implements ApolloManager<TCacheShape> {
  private client: ApolloClient<TCacheShape>;
  private currentWorkspaceMember: CurrentWorkspaceMember | null = null;
  private currentWorkspace: CurrentWorkspace | null = null;

  constructor(opts: Options<TCacheShape>) {
    const {
      uri,
      onError: onErrorCb,
      onNetworkError,
      onTokenPairChange,
      onUnauthenticatedError,
      currentWorkspaceMember,
      currentWorkspace,
      extraLinks,
      isDebugMode,
      ...options
    } = opts;

    this.currentWorkspaceMember = currentWorkspaceMember;
    this.currentWorkspace = currentWorkspace;

    const buildApolloLink = (): ApolloLink => {
      const uploadLink = createUploadLink({
        uri,
      });

      const httpLink = new HttpLink({ uri: uri });

      const authLink = setContext(async (_, { headers }) => {
        const tokenPair = getTokenPair();

        if (isUndefinedOrNull(tokenPair)) {
          return {
            headers: {
              ...headers,
              ...options.headers,
            },
          };
        }
        return {
          headers: {
            ...headers,
            ...options.headers,
            authorization: tokenPair.accessToken.token
              ? `Bearer ${tokenPair.accessToken.token}`
              : '',
          },
        };
      });

      const retryLink = new RetryLink({
        delay: {
          initial: 3000,
        },
        attempts: {
          max: 2,
          retryIf: (error) => {
            if (this.isAuthenticationError(error)) {
              return false;
            }
            return Boolean(error);
          },
        },
      });

      const handleTokenRenewal = (
        operation: Operation,
        forward: (operation: Operation) => Observable<FetchResult>,
      ) => {
        return fromPromise(
          renewToken(uri, getTokenPair())
            .then((tokens) => {
              if (isDefined(tokens)) {
                onTokenPairChange?.(tokens);
                cookieStorage.setItem('tokenPair', JSON.stringify(tokens));
              }
            })
            .catch(() => {
              onUnauthenticatedError?.();
            }),
        ).flatMap(() => forward(operation));
      };

      const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {

          if (isDefined(graphQLErrors)) {
            onErrorCb?.(graphQLErrors);
            for (const graphQLError of graphQLErrors) {
              if (graphQLError.message === 'Unauthorized') {
                return handleTokenRenewal(operation, forward);
              }

              switch (graphQLError?.extensions?.code) {
                case 'UNAUTHENTICATED': {
                  return handleTokenRenewal(operation, forward);
                }
                case 'FORBIDDEN': {
                  return;
                }
                case 'INTERNAL_SERVER_ERROR': {
                  return; // already caught in BE
                }
                default:
                  if (isDebugMode === true) {
                    logDebug(
                      `[GraphQL error]: Message: ${
                        graphQLError.message
                      }, Location: ${
                        graphQLError.locations
                          ? JSON.stringify(graphQLError.locations)
                          : graphQLError.locations
                      }, Path: ${graphQLError.path}`,
                    );
                  }
                  import('@sentry/react')
                    .then(({ captureException, withScope }) => {
                      withScope((scope) => {
                        const error = new Error(graphQLError.message);

                        error.name = graphQLError.message;

                        const fingerPrint: string[] = [];
                        if (isDefined(graphQLError.extensions)) {
                          scope.setExtra('extensions', graphQLError.extensions);
                          if (isDefined(graphQLError.extensions.subCode)) {
                            fingerPrint.push(
                              graphQLError.extensions.subCode as string,
                            );
                          }
                        }

                        if (isDefined(operation.operationName)) {
                          scope.setExtra('operation', operation.operationName);
                          const genericOperationName = getGenericOperationName(
                            operation.operationName,
                          );

                          if (isDefined(genericOperationName)) {
                            fingerPrint.push(genericOperationName);
                          }
                        }

                        if (!isEmpty(fingerPrint)) {
                          scope.setFingerprint(fingerPrint);
                        }

                        captureException(error); // Sentry expects a JS error
                      });
                    })
                    .catch((sentryError) => {
                      // eslint-disable-next-line no-console
                      console.error(
                        'Failed to capture GraphQL error with Sentry:',
                        sentryError,
                      );
                    });
              }
            }
          }
          if (isDefined(networkError)) {
            if (
              this.isRestOperation(operation) &&
              this.isAuthenticationError(networkError as ServerError)
            ) {
              return handleTokenRenewal(operation, forward);
            }

            if (isDebugMode === true) {
              logDebug(`[Network error]: ${networkError}`);
            }
            onNetworkError?.(networkError);
          }
      });

      return ApolloLink.from(
        [
          errorLink,
          authLink,
          ...(extraLinks || []),
          isDebugMode ? logger : null,
          retryLink,
          uploadLink,
        ].filter(isDefined),
      );
    };

    this.client = new ApolloClient({
      link: buildApolloLink(),
      cache: new InMemoryCache()
    });
  }

  private isRestOperation(operation: Operation): boolean {
    return operation.query.definitions.some(
      (def: DefinitionNode) =>
        def.kind === 'OperationDefinition' &&
        def.selectionSet?.selections.some(
          (selection: SelectionNode) =>
            selection.kind === 'Field' &&
            selection.directives?.some(
              (directive: DirectiveNode) =>
                directive.name.value === 'rest' ||
                directive.name.value === 'stream',
            ),
        ),
    );
  }

  private isAuthenticationError(error: ServerError): boolean {
    return error.statusCode === 401;
  }

  updateWorkspaceMember(workspaceMember: CurrentWorkspaceMember | null) {
    this.currentWorkspaceMember = workspaceMember;
  }

  updateCurrentWorkspace(workspace: CurrentWorkspace | null) {
    this.currentWorkspace = workspace;
  }

  getClient() {
    return this.client;
  }
}
