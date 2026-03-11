export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title?: string;
  done?: boolean;
}