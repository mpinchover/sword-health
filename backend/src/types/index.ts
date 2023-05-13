export enum UserRole {
  MANAGER,
  TECHNICIAN,
}

export enum UpdateActions {
  UPDATE_DESCRIPTION = 1,
  UPDATE_DATE_PERFORMED,
}

export interface User {
  createdAtUTC?: Date;
  uuid?: string;
  managerUuid?: string;
  hashedPassword?: string;
  email?: string;
  userRole?: string; // manager vs tech
}

export interface Task {
  createdAtUTC?: Date;
  updatedAtUTC?: Date;
  deletedAtUTC?: Date;

  summary?: string;
  createdByUuid?: string;
  datePerformed?: Date | string;
  uuid?: string;

  taskStatus?: string;
}

export interface CreateTaskRequest extends Request {
  task: Task;
  userUuid?: string;
}

export interface UpdateTaskRequest extends Request {
  task: Task;
  userUuid?: string;
}

export interface DeleteTaskRequest extends Request {
  taskUuid: string;
  userUuid?: string;
}

export interface GetTasksRequest extends Request {
  userUuid?: string;
}

export interface CreateUserRequest extends Request {
  email?: string;
  managerUuid?: string;
  password?: string;
  confirmPassword?: string;
  userRole?: string;
}

export interface LoginUserRequest extends Request {
  email?: string;
  password?: string;
}
