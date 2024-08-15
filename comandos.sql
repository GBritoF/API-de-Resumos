create database resume_ai;

CREATE TABLE "public"."usuarios" (
  "id" serial NOT NULL,
  "nome" text NOT NULL,
  "email" text NOT NULL,
  "senha" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "email_unique_constraints" UNIQUE ("email")
);

CREATE TABLE "public"."materias" (
  "id" serial NOT NULL,
  "nome" text NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "public"."resumos" (
  "id" serial NOT NULL,
  "usuario_id" int4 NOT NULL,
  "materia_id" int4 NOT NULL,
  "titulo" text,
  "topicos" text NOT NULL,
  "descricao" text,
  "criado" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_resumos_usuarios_1" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios" ("id"),
  CONSTRAINT "fk_resumos_materias_2" FOREIGN KEY ("materia_id") REFERENCES "public"."materias" ("id")
);

INSERT INTO materias (nome)
VALUES
	('Back-end'),
  ('Front-end'),
  ('Carreira'),
  ('Mobile'),
  ('Design'),
  ('Dados'),
  ('SQL');

SELECT * FROM materias;

SELECT email FROM usuarios;

INSERT INTO usuarios (nome, email, senha)
VALUES
	('nome', 'email', 'senha');

INSERT INTO resumos (usuario_id, materia_id, topicos, descricao)
VALUES
	(usuario_id, materia_id, 'topicos', 'descricao');

SELECT * FROM resumos WHERE usuario_id = idDoUsuario;

SELECT * FROM resumos where materia_id = idDaMateria and usuario_id = idDoUsuario;

SELECT * FROM resumos where id = idResumo and usuario_id = idDoUsuario;

UPDATE resumos
SET 
  usuario_id = novoIdUsuario, 
  materia_id = novoIdMateria, 
  topicos = 'novo topico', 
  descricao = 'nova descricao', 
  criado = 'nova data'
WHERE id = idDoResumoEditado; 

DELETE FROM resumos where id = idDoResumoASerDeletado;

SELECT * FROM resumos WHERE EXTRACT(MONTH FROM criado) = MesDeCriação AND EXTRACT(YEAR FROM criado) = AnoDeCriação;