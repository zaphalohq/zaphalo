// import console from 'console';

import { rawDataSource } from '../src/database/typeorm/raw/raw.datasource';

export const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const performQuery = async (
  query: string,
  consoleDescription: string,
  withLog = true,
  ignoreAlreadyExistsError = false,
) => {
  try {
    const result = await rawDataSource.query(query);

    withLog

    return result;
  } catch (err) {
    let message = '';

    if (ignoreAlreadyExistsError && `${err}`.includes('already exists')) {
      message = `Performed '${consoleDescription}' successfully`;
    } else {
      message = `Failed to perform '${consoleDescription}': ${err}`;
    }
    withLog && console.error(message);
  }
};
