import { NextFunction, Request, Response } from "express"
import pool from "../bancoDeDados";

export default class UsuarioIntermediario {
    async validarUsuario(req: Request, res: Response, next: NextFunction) {
        const {nome, email, senha} = req.body

        if(!nome || !email || !senha) {
            return res.status(400).json({
                "mensagem": "Todos os campos são obrigatórios"
            })
        }

        const emailBanco = (await pool.query('SELECT email FROM usuarios')).rows;

        const emailCadastrado = emailBanco.some((usuario) => usuario.email === email)
        if(emailCadastrado) {
            return res.status(400).json({
                "mensagem": "E-mail já cadastrado"
            });
        }

        next()
    }
}