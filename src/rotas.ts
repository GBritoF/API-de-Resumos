import { Router, text } from "express";
import UsuarioControlador from "./controladores/UsuariosControlador";
import UsuarioIntermediario from "./intermediarios/UsuarioIntermediario";
import authMiddleware from "./intermediarios/AutenticacaoItermediario";
import materias from "./controladores/MateriasControlador";
import ResumosControlador from "./controladores/ResumosControlador";

const usuarioControlador = new UsuarioControlador()
const usuarioIntermediario = new UsuarioIntermediario()
const resumosControlador = new ResumosControlador()

const rotas = Router();

rotas.post('/usuarios', usuarioIntermediario.validarUsuario, usuarioControlador.Criar)
rotas.post('/login', usuarioControlador.UsuarioLogin)
rotas.use(authMiddleware)
rotas.get('/materias', materias)
rotas.post('/resumos', resumosControlador.criar)
rotas.get('/resumos', resumosControlador.pegar)
rotas.put('/resumos/:id', resumosControlador.editar)
rotas.delete('/resumos/:id', resumosControlador.deletar)

export default rotas