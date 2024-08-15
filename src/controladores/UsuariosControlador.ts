import { Request, Response } from "express";
import pool from "../bancoDeDados";
import { hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken'

export default class UsuarioControlador {
    async Criar(req: Request, res: Response) {
        const {nome, email, senha} = req.body

        try {
            const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *'

            const senhaCriptografada = await hash(senha, 8)

            const resposta = await pool.query(query, [nome, email, senhaCriptografada])

            const usuarios = resposta.rows.map(usuario => {
                return {
                    id: usuario.id,
                    nome,
                    email
                }
            })

            return res.status(201).json(usuarios[0])

        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno" });
        }
    }

    async UsuarioLogin(req: Request, res: Response) {
        const {email, senha} = req.body

        if(!email || !senha) {
            res.status(400).json({
                "mensagem": "Todos os campos são obrigatórios"
            })
        }

        try {
            const query = 'SELECT * FROM usuarios WHERE email = $1';
            const usuario = (await pool.query(query, [email])).rows[0];
            
            if(!usuario) {
                return res.status(400).json({
                    "mensagem": "E-mail ou senha inválidos"
                })
            }

            const validarSenha = await compare(senha, usuario.senha)

            if(!validarSenha) {
                return res.status(400).json({
                    "mensagem": "E-mail ou senha inválidos"
                })
            }

            const token = jwt.sign({ id: usuario.id }, process.env.SECRET_JWT || "", {
                expiresIn: "1h"
            })

            return res.status(200).json({token})

        } catch (error) {
            console.log(error)
            return res.status(500).json({ mensagem: "Erro interno" });
        }
        
    }
}
