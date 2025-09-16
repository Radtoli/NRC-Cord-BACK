import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User, Document, Video, Trilha } from './Entititities';

config();

export const mongoDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URL,
  synchronize: true,
  entities: [User, Document, Video, Trilha],
});
