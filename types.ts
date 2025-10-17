export interface User {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
}

export interface Comment {
  id: number;
  parent_id: number | null;
  text: string;
  upvotes: number;
  created_at: string;
  user_id: string;
}
