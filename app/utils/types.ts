export type Goal = {
  id: number;
  title: string;
  description: string;
  tag: 'PERSONAL' | 'WORK';
  deadLine: Date;
  completed: boolean;
  tasks?: Task[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

  
  export type Task = {
    id: number;
    title: string;
    description: string;
    priority: 'P1' | 'P2' | 'P3';
    completed: boolean;
    completedAt: Date | null;
    goalId: number;
    createdAt: Date;
    updatedAt: Date;
  };