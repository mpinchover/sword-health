import RedisGateway from "../gateway/redis";
import Repo from "../repo";
import { Task } from "../types";
import * as uuid from "uuid";
import * as CONSTANTS from "../utils/constants";
class TaskController {
  private repo: Repo;
  private redisGateway: RedisGateway;

  constructor() {
    this.repo = new Repo();
    this.redisGateway = new RedisGateway();
  }

  createTask = (task: Task): Promise<Task> => {
    task.uuid = uuid.v4();
    task.createdAtUTC = new Date();

    return this.repo.createTask(task);
  };

  updateTask = async (task: Task, userUuid: string): Promise<Task> => {
    task.updatedAtUTC = new Date();

    task.createdAtUTC = new Date(task.createdAtUTC);
    if (task.datePerformed) task.datePerformed = new Date(task.datePerformed);

    const existingTask = await this.repo.getTaskByUuid(task.uuid);
    if (!existingTask) throw new Error("Task does not exist");

    if (existingTask.createdByUuid !== userUuid)
      throw new Error("Unauthorized to update this task");

    if (existingTask.taskStatus !== "CLOSED" && task.taskStatus === "CLOSED") {
      this.redisGateway.publish(
        CONSTANTS.NOTIFICATION_CHANNEL,
        `The tech ${userUuid} performed task ${existingTask.uuid} on date ${task.datePerformed}`
      );
    }

    return this.repo.updateTask(task);
  };

  deleteTask = async (uuid: string, userUuid: string) => {
    // check if the task exists
    const existingTask = await this.repo.getTaskByUuid(uuid);
    if (!existingTask) throw new Error("Task does not exist");

    const user = await this.repo.getUser(userUuid);
    const uuids = new Set();

    if (user.userRole === "MANAGER") {
      const reports = await this.repo.getTechniciansOfManager(userUuid);
      for (const str of reports) uuids.add(str);
    } else {
      uuids.add(userUuid);
    }
    
    if (!uuids.has(existingTask.createdByUuid))
      throw new Error("Unauthorized to delete this task");

    existingTask.deletedAtUTC = new Date();
    this.repo.deleteTask(existingTask);
  };

  // if the user is a manager, get all their direct reports 
  getTasks = async (userUuid: string): Promise<Task[]> => {
    const user = await this.repo.getUser(userUuid);
    const uuids = [userUuid];

    if (user.userRole === "MANAGER") {
      const reports = await this.repo.getTechniciansOfManager(userUuid);
      uuids.push(...reports);
    }
    return this.repo.getTasks(uuids);
  };
}

export default TaskController;
