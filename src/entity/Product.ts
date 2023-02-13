import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ length: 8 })
  sku: string;

  @Column()
  desc: string;

  @Column("simple-json", { default: null })
  images: string;

  @Column({ default: true })
  isActive: boolean;
}
