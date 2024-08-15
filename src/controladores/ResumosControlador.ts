import { Request, Response } from "express";
import pool from "../bancoDeDados";
import jwt from 'jsonwebtoken'

export default class ResumosControlador {
    async criar(req: Request, res: Response) {
        const { authorization } = req.headers
        const { materiaId, titulo, topicos } = req.body

        if(!materiaId || !topicos) {
            return res.status(400).json({
                "mensagem": "Todos os campos são obrigatórios"
            })
        }

        try {
            const queryMateria = 'SELECT * FROM materias where id = $1'
            const materiaValida = (await pool.query(queryMateria, [materiaId])).rows

            if(materiaValida.length === 0) {
                return res.status(404).json({
                    "mensagem": "Matéria não encontrada"
                })
            }

            const query = "INSERT INTO resumos (usuario_id, materia_id, titulo, topicos) VALUES ($1, $2, $3, $4) RETURNING *"

            const token = authorization?.split(' ')[1]
            const { id } = jwt.verify(token!, process.env.SECRET_JWT || '') as {id: string}
            
            const topicosFormatado = topicos.join(', '); // No teste não precisou formatar
            
            const resposta = (await pool.query(query, [id, materiaId, titulo, topicos]))

            const resumo = resposta.rows.map(resumo => {
                return {
                    id: resumo.id,
                    usuarioId: resumo.usuario_id,
                    materiaId: resumo.materia_id,
                    titulo: resumo.titulo || "Sem título",
                    topicos,
                    descricao: resumo.descricao,
                    criado: resumo.criado
                }
            })[0]
            
            return res.status(201).json(resumo)

        } catch(error) {
            console.log(error);
            
            return res.status(500).json({ mensagem: "Erro interno" });
        }
    }

    async pegar(req: Request, res: Response) {

        try {
            const { materia } = req.query

            const { authorization } = req.headers
            const token = authorization?.split(' ')[1]
            const { id } = jwt.verify(token!, process.env.SECRET_JWT || '') as {id: string}

            if(materia) {
                const query = 'SELECT * , materias.nome, resumos.id AS id_resumo FROM resumos JOIN materias ON resumos.materia_id = materias.id WHERE materias.nome = $2 AND resumos.usuario_id = $1'
                const resposta = (await pool.query(query, [id, materia]))

                const resumo = resposta.rows.map(resumo => {
                    return {
                        id: resumo.id_resumo,
                        usuarioId: resumo.usuario_id,
                        materia: resumo.nome,
                        titulo: resumo.titulo || "Sem título",
                        topicos: resumo.topicos,
                        descricao: resumo.descricao,
                        criado: resumo.criado
                    }
                })

                return res.status(200).json(resumo)
            }

            const queryMateria = 'SELECT * FROM resumos JOIN materias ON resumos.materia_id = materias.id WHERE resumos.usuario_id = $1'
            const materiaConsultada = (await pool.query(queryMateria, [id]))

            const resumo = materiaConsultada.rows.map(resumo => {
                return {
                    id: resumo.id,
                    usuarioId: resumo.usuario_id,
                    materia: resumo.nome,
                    titulo: resumo.titulo || "Sem título",
                    topicos: resumo.topicos,
                    descricao: resumo.descricao,
                    criado: resumo.criado
                }
            })

            return res.status(200).json(resumo)

        } catch(error) {
            return res.status(500).json({ mensagem: "Erro interno" });
        }
    }

    async editar(req: Request, res: Response) {
        const { materiaId, titulo} = req.body
        
        if(!materiaId || !titulo) {
            return res.status(400).json({
                "mensagem": "Todos os campos são obrigatórios"
            })
        }

        const queryMateria = 'select * from materias where id = $1'
        const materiaExiste = (await pool.query(queryMateria, [materiaId])).rows
        if(materiaExiste.length === 0) {
            return res.status(404).json({
                "mensagem": "Matéria não encontrada"
            })
        }

        try {
            const { authorization } = req.headers
            const token = authorization?.split(' ')[1]
            const { id } = jwt.verify(token!, process.env.SECRET_JWT || '') as {id: string}
            const idResumo = req.params.id
            

            const queryUsuario = 'select * from resumos where id = $1 AND usuario_id = $2'
            const pertenceAoUsuario = (await pool.query(queryUsuario, [idResumo, id])).rows

            if(pertenceAoUsuario.length === 0) {
                console.log(pertenceAoUsuario)
                return res.status(404).json({
                    "mensagem": "Resumo não encontrado"
                })
            }

            const query = "UPDATE resumos SET materia_id = $1, titulo = $2 WHERE id = $3 RETURNING *"
            const resposta = (await pool.query(query, [materiaId, titulo, idResumo]))
            const novoResumo = resposta.rows.map((resumo) => {
                return {
                    id: resumo.id,
                    usuarioId: resumo.usuario_id,
                    materiaId: resumo.materia_id,
                    titulo: resumo.titulo,
                    topicos: resumo.topicos.split(','),
                    descricao: resumo.descricao,
                    criado: resumo.criado
                }
            })[0]

            return res.status(200).json(novoResumo)

        } catch(error) {
            return res.status(500).json({ mensagem: "Erro interno" });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { authorization } = req.headers
            const token = authorization?.split(' ')[1]
            const { id } = jwt.verify(token!, process.env.SECRET_JWT || '') as {id: string}
            const idResumo = req.params.id
            

            const queryUsuario = 'select * from resumos where id = $1 AND usuario_id = $2'
            const pertenceAoUsuario = (await pool.query(queryUsuario, [idResumo, id])).rows

            if(pertenceAoUsuario.length === 0) {
                console.log(pertenceAoUsuario)
                return res.status(404).json({
                    "mensagem": "Resumo não encontrado"
                })
            }

            const query = 'DELETE FROM resumos where id = $1'
            await pool.query(query, [idResumo])
            
            return res.status(204).json()
        } catch(error) {           
            return res.status(500).json({ mensagem: "Erro interno" });
        }
    }
} 