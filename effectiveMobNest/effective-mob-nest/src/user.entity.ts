import { Entity, Column, PrimaryGeneratedColumn, Check, Index } from 'typeorm';

@Entity()
@Check(`"sex" in ('м', 'ж')`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "int" })
  age: number;
  
  @Column()
  sex: string;

  @Index()
  @Column()
  problem: boolean;
}