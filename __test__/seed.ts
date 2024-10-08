import { QueryResult } from "pg";
import pool from "../src/bancoDeDados";

export function popularMaterias(): Promise<QueryResult<any>> {
  return pool.query(`
    INSERT INTO materias
      (nome)
    VALUES
      ('Back-end'),
      ('Front-end'),
      ('Carreira'),
      ('Mobile'),
      ('Design'),
      ('Dados'),
      ('SQL');
  `);
}
