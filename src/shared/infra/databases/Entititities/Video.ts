import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('videos')
export class Video {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  youtubeId!: string;

  @Column({ nullable: true })
  duration?: string;

  @Column("array")
  documents!: ObjectId[];

  @Column()
  trilha!: ObjectId;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}