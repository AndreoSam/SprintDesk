interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const fetchNotificationPosts = async (): Promise<
  JsonPlaceholderPost[]
> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};
