export interface ResponseFormat<T extends {}> {
  success: boolean;
  data?: T;
  error?: string;
}
