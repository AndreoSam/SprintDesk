import type { MockData } from "../types/mockData";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import type { Sprint } from "../types/sprint";
import type { Comment } from "../types/comment";
import type { Notification } from "../types/notification";

const getMockData = async (): Promise<MockData> => {
  const response = await fetch("/mock-data.json");

  if (!response.ok) {
    throw new Error("Failed to load mock data");
  }

  return response.json();
};

export const getTasks = async (): Promise<Task[]> => {
  const data = await getMockData();

  return data.tasks.slice(0, 30);
};

export const getUsers = async (): Promise<User[]> => {
  const data = await getMockData();

  return data.users;
};

export const getSprints = async (): Promise<Sprint[]> => {
  const data = await getMockData();

  return data.sprints;
};

export const getComments = async (): Promise<Comment[]> => {
  const data = await getMockData();

  return data.comments;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const data = await getMockData();

  return data.notifications;
};

// export const getCommentsByTaskId = async (
//   taskId: number,
// ): Promise<Comment[]> => {
//   const data = await getMockData();

//   return data.comments.filter((comment) => comment.taskId === taskId);
// };
