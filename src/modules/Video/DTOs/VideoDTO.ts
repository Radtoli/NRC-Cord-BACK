export interface CreateVideoDTO {
  title: string;
  description: string;
  url: string;
  duration?: number;
  trilhaId?: string;
}

export interface UpdateVideoDTO {
  title?: string;
  description?: string;
  url?: string;
  duration?: number;
  trilhaId?: string;
}