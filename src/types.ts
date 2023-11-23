export type User = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
