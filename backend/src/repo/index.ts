import MySQL from "../mysql";
import { Task, User } from "../types";
import * as CONSTANTS from "../utils/constants";

class Repo {
  constructor() {}

  createTask = async (task: Task): Promise<Task> => {
    const conn = await MySQL.getDb();
    const query = `insert into ${CONSTANTS.TASKS_TABLE} set ?`;
    const params: any[] = [task];
    await conn.query<any>(query, params);
    return task;
  };

  // query the original task and update the different fields
  updateTask = async (task: Task): Promise<Task> => {
    console.log("TASK IS");
    console.log(task);
    const conn = await MySQL.getDb();
    const query = `update ${CONSTANTS.TASKS_TABLE} set ? where uuid = ?`;
    const params: any[] = [task, task.uuid];
    await conn.query<any>(query, params);
    return task;
  };

  deleteTask = async (task: Task) => {
    const conn = await MySQL.getDb();
    const query = `update ${CONSTANTS.TASKS_TABLE} set deletedAtUTC = ? where uuid = ?`;
    const params: any[] = [task.deletedAtUTC, task.uuid];
    await conn.query<any>(query, params);
  };

  getTaskByUuid = async (uuid: string): Promise<Task> => {
    const conn = await MySQL.getDb();
    const query = `select * from ${CONSTANTS.TASKS_TABLE} where uuid = ?`;
    const params: any[] = [uuid];
    const [rows] = await conn.query<any>(query, params);

    if (rows?.length === 0) return null;
    return rows[0];
  };

  getUser = async (uuid: string): Promise<User> => {
    const conn = await MySQL.getDb();

    const query = `
    select * from ${CONSTANTS.USERS_TABLE} 
    where uuid = ? `;
    const params: any[] = [uuid];
    const [rows] = await conn.query<any>(query, params);
    if (rows.length === 0) return null;
    return rows[0];
  };

  getTechniciansOfManager = async (managerUuid: string): Promise<string[]> => {
    const conn = await MySQL.getDb();
    const uuids = [];

    const query = `
    select uuid from ${CONSTANTS.USERS_TABLE} 
    where managerUuid = ? `;
    const params: any[] = [managerUuid];
    const [rows] = await conn.query<any>(query, params);

    for (const row of rows) {
      uuids.push(row.uuid);
    }
    return uuids;
  };

  // need to add a join here for the manager/technician requirement
  getTasks = async (uuids: string[]): Promise<Task[]> => {
    const conn = await MySQL.getDb();

    // or just make a separate query to get everyone this manager reports to
    const tasks: Task[] = [];
    const query = `select * from ${CONSTANTS.TASKS_TABLE} 
        where deletedAtUTC is null and 
        createdByUuid in (?)`;
    const params: any[] = [uuids];
    const [rows] = await conn.query<any>(query, params);

    for (const row of rows) {
      tasks.push(row);
    }

    return tasks;
  };

  createUser = async (user: User): Promise<User> => {
    const conn = await MySQL.getDb();
    const query = `insert into ${CONSTANTS.USERS_TABLE} set ?`;
    const params: any[] = [user];
    await conn.query<any>(query, params);
    return user;
  };

  getUserByEmail = async (email: string): Promise<User> => {
    const conn = await MySQL.getDb();
    const query = `select * from ${CONSTANTS.USERS_TABLE} where email = ?`;
    const params: any[] = [email];
    const [rows] = await conn.query<any>(query, params);

    if (rows?.length === 0) return null;
    return rows[0];
  };
}

export default Repo;
