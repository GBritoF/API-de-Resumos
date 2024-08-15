import { Request, Response } from "express";
import pool from "../bancoDeDados";

const materias = async (req: Request, res: Response) => {  
    try {
        const query = 'SELECT * FROM materias'

        const resposta = await (await pool.query(query)).rows

        res.status(200).json(resposta)
    } catch(error) {
        return res.status(500).json({
            message: "Erro interno do servidor"
        })
    }
}

export default materias