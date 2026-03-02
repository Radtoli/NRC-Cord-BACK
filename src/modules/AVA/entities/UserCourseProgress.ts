import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './Course';

@Entity('user_course_progress')
export class UserCourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', length: 255 })
  userId!: string;

  @Column({ name: 'course_id' })
  courseId!: string;

  @Column({
    name: 'completion_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  completionPercentage!: number;

  @Column({ name: 'total_time_seconds', type: 'int', default: 0 })
  totalTimeSeconds!: number;

  @Column({ name: 'final_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  finalScore?: number;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'last_access', type: 'timestamptz', default: () => 'NOW()' })
  lastAccess!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: Course;
}
