export type TaskList = {
  name: string;
  basename: string;
  path: string;
  createdAt: number;
  modifiedAt: number;
  tasks: Task[];
  file: TFile;
};

export type Task = {
  description: string;
  completed: boolean;
};
