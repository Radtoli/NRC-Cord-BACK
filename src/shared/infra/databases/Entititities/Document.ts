import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

type DocumentType = "pdf" | "doc" | "ppt" | "xlsx";

@Entity('documents')
export class Document {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  type!: DocumentType;

  @Column()
  url!: string;

  @Column()
  size!: string;

  @Column()
  video!: ObjectId;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}