export type Goal = {
    id: string;
    title: string;
    description: string;
    tag: string;
    deadline: string;
  };
  
  export type Task = {
    id: string;
    title: string;
    description?: string;
    priority: string;
    completed: boolean;
    completedAt?: string;
  };
  
  export type User = {
    id: string;
    email: string;
    name: string;
    goals: Goal[];
  };
  
  export type Medal = {
    id: string;
    type: string;
    earnedAt: string;
  };
  