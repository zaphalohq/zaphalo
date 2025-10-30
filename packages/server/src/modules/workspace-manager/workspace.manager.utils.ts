import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { typeORMWorkspaceModuleOptions } from 'src/database/typeorm/workspace/workspace.datasource';

export function getWorkspaceConnection(workspaceId: string): Promise<Connection> {
  const connectionName = `workspace_${workspaceId}`;
  const connectionManager = getConnectionManager();

  if (connectionManager.has(connectionName)) {
    const connection = connectionManager.get(connectionName);
    return Promise.resolve(connection.isConnected ? connection : connection.connect());
  }

  return createConnection({
    ...(typeORMWorkspaceModuleOptions as PostgresConnectionOptions),
    name: connectionName,
    schema: connectionName,
  });
}
