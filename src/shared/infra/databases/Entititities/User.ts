import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

type UserRole = "user" | "manager" | "corretor";
type UserStatus = "active" | "inactive" | "blocked";
type Theme = "light" | "dark";

interface UserSettings {
  theme: Theme;
  language: string;
}

interface UserMeta {
  createdBy: ObjectId;
  updatedBy: ObjectId;
  lastCheatCheckAt?: Date;
  loginCount: number;
  amountOfCheatChecks: number;
}

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  demolayId!: number;

  @Column("array")
  roles!: UserRole[];

  @Column("array")
  permissions!: string[];

  @Column()
  status!: UserStatus;

  @Column({ nullable: true })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  settings!: UserSettings;

  @Column()
  meta!: UserMeta;
}