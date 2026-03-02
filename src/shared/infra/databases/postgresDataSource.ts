import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { Course } from '../../../modules/AVA/entities/Course';
import { Module } from '../../../modules/AVA/entities/Module';
import { Page } from '../../../modules/AVA/entities/Page';
import { Section } from '../../../modules/AVA/entities/Section';
import { SectionContent } from '../../../modules/AVA/entities/SectionContent';
import { Quiz } from '../../../modules/AVA/entities/Quiz';
import { QuizQuestion } from '../../../modules/AVA/entities/QuizQuestion';
import { QuizOption } from '../../../modules/AVA/entities/QuizOption';
import { UserCourseProgress } from '../../../modules/AVA/entities/UserCourseProgress';
import { UserPageProgress } from '../../../modules/AVA/entities/UserPageProgress';
import { UserAnswer } from '../../../modules/AVA/entities/UserAnswer';

config();

export const postgresDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'ava',
  synchronize: process.env.POSTGRES_SYNCHRONIZE !== 'false',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Course,
    Module,
    Page,
    Section,
    SectionContent,
    Quiz,
    QuizQuestion,
    QuizOption,
    UserCourseProgress,
    UserPageProgress,
    UserAnswer,
  ],
  migrations: ['src/shared/infra/databases/migrations/*.ts'],
});
