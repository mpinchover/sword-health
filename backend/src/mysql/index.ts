import * as mysql2 from "mysql2/promise";

class MySQL {
  private static mysqlDB: mysql2.Connection;

  public static async closeConn() {
    if (this.mysqlDB) {
      await this.mysqlDB.end();
    }
  }

  public static async getDb(): Promise<mysql2.Connection> {
    if (this.mysqlDB) {
      return this.mysqlDB;
    }

    let host, user, password, database, port;

    host = process.env.TASK_MANAGER_SQL_HOST;
    user = process.env.TASK_MANAGER_USER;
    password = process.env.TASK_MANAGER_PASSWORD;
    database = process.env.TASK_MANAGER_DATABASE;
    port = parseInt(process.env.TASK_MANAGER_SQL_PORT);

    const connection = await mysql2.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
    this.mysqlDB = connection;
    return connection;
  }
}

export default MySQL;
