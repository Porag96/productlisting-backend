import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Five02@1998",
  database: "productlisting",
  synchronize: true,
  logging: false,
  entities: [Product],
});
