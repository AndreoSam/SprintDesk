import type { User } from "./user";
import type { Sprint } from "./sprint";
import type { Task } from "./task";
import type { Comment } from "./comment";
import type { Notification } from "./notification";

export interface MockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: Notification[];
}
