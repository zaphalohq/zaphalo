import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity'

@Entity({ name: 'cats'})
export class Cat extends AbstractEntity {
  @Column()
  name: string;
}