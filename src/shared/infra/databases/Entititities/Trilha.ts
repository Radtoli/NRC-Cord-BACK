import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('trilhas')
export class Trilha {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column("array")
  videos!: ObjectId[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}