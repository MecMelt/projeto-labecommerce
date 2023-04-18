import { Categoria } from "./types";
import express, { Request, Response } from "express"
import cors from 'cors';
import {TUsuario, TProdutos, TCompras} from "./types"
import { db } from "./database/knex";


const app = express()
app.use(express.json())
app.use(cors())

app.listen(3004, () => {
    console.log("Servidor rodando na porta 3004")
})

app.get(`/usuarios`, async(req: Request , res: Response) => {
    try{
        const result = await db("usuarios").select("id", "nome", "email", "senha","elaborado AS criado")

        res.status(200).send(result)

    }catch(error:any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.post(`/usuarios`, async(req:Request, res: Response) => {
    try{
        
        const {id, nome, email, senha} = req.body as TUsuario

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' deve ser string.")
        }
        if(id.length < 3){
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 3 caracteres.")
        }
        if(id[0] !== "i"){
            res.status(404)
            throw new Error("'id' deve começar com a letra i.")
        }
        if(typeof nome !== "string"){
            res.status(400)
            throw new Error("'nome' deve ser string.")
        }
        if(nome.length < 2){
            res.status(400)
            throw new Error("'nome' deve possuir pelo menos 2 caracteres.")
        }
        if(typeof email !== "string"){
            res.status(400)
            throw new Error("'email' deve ser string.")
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
			throw new Error("O 'email' deve ser do tipo 'test@email.com'.")
		}
        if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'senha' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
        
        const [usuarioExistente] = await db("usuarios").where({id})
        if(usuarioExistente){
            res.status(400)
            throw new Error("id já existe.")
        }

        const [emailExistente] = await db("usuarios").where({email})
        if(emailExistente){
            res.status(400)
            throw new Error("email já existe.")
        }

        const novoUsuario = {
            id,
            nome,
            email, 
            senha
        }

        await db("usuarios").insert(novoUsuario)
        res.status(201).send({
            message: "Cadastro realizado com sucesso",
            usuario: novoUsuario})

    }catch(error:any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//////////////////////////////////////PRODUCTS//////////////////////////////////////////
//GET ALL PRODUCTS
app.get(`/produtos`, async(req:Request, res: Response) => {
    try{
        const searchTerm = req.query.q as string | undefined

        if(searchTerm === undefined){
            const result = await db("produtos").select("id", "nome", "preço", "descricao","imagem_url AS imagemUrl")
            res.status(200).send(result)
        }else{
            const resultSearchTerm = await db("produtos")
            .where("nome", "LIKE", `%${searchTerm}%`)
            .orWhere("descricao", "LIKE", `%${searchTerm}%`)
            res.status(200).send(resultSearchTerm)
        }

    }catch(error:any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    } 
})


// POST CREATE PRODUCTS
app.post(`/produtos`, async(req:Request, res: Response) => {
    try{
        const {id, nome, preço, descricao, imagemUrl} = req.body

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' deve ser string.")
        }
        if(id[0] !== "p"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p'.")
        }
        if(id[1] !== "0"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p' e depois '0'.")
        }
        if(typeof nome !== "string"){
            res.status(400)
            throw new Error("'nome' deve ser string.")
        }
        if(typeof preço !== "number"){
            res.status(400)
            throw new Error("'preço' deve ser number.")
        }
        if(typeof descricao !== "string"){
            res.status(400)
            throw new Error("'descricao' deve ser string.")
        }
        if(typeof imagemUrl !== "string"){
            res.status(400)
            throw new Error("'imagem_url' deve ser string.")
        }

        const [produtoExistente] = await db("produtos").where({id})
        if(produtoExistente){
            res.status(400)
            throw new Error("id já existe.")
        }

        const novoProduto: TProdutos = {
            id,
            nome,
            preço,
            descricao,
            imagem_url: imagemUrl
        }

        const mostrarProduto = {
            id,
            nome,
            preço,
            descricao,
            imagemUrl
        }

        await db("produtos").insert(novoProduto)
        res.status(201).send({
            message: "Produto cadastrado com sucesso",
            produto: mostrarProduto})

    } catch(error:any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//PUT PRODUCT BY ID
app.put(`/produto/:id`, async (req:Request, res:Response) => {
    try{
        const idToEdit = req.params.id

        if(idToEdit[0] !== "p"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p'.")
        }
        if(idToEdit[1] !== "0"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p' e '0'.")
        }

        const novoNome = req.body.nome
        const novoPreco = req.body.preço
        const novaDescricao = req.body.descricao
        const novaImagemUrl = req.body.imagemUrl

        if(novoNome !== undefined){
            if(typeof novoNome !== "string"){
                res.status(400)
                throw new Error("'nome' deve ser string.")
            }
            if(novoNome.length < 2){
                res.status(400)
                throw new Error("'nome' deve possuir pelo menos 2 caracteres.")
            }
        }

        if(novoPreco !== undefined){
            if(typeof novoPreco !== "number"){
                res.status(400)
                throw new Error("'preço' deve ser number.")
            }
        }
        
        if(novaDescricao !== undefined){
            if(typeof novaDescricao !== "string"){
                res.status(400)
                throw new Error("'descricao' deve ser string.")
            }
            if(novaDescricao.length < 2){
                res.status(400)
                throw new Error("'descricao' deve possuir pelo menos 2 caracteres.")
            }
        }
        
        if(novaImagemUrl !== undefined){
            if(typeof novaImagemUrl !== "string"){
                res.status(400)
                throw new Error("'imagemUrl' deve ser string.")
            }
        }

        const [editarProduto] : TProdutos[] | undefined[] = await db("produtos").where({id : idToEdit})
        
        if(!editarProduto){
            res.status(404)
            throw new Error("id não encontrado.")
        }

        const novoProduto = {
            nome: novoNome || editarProduto.nome,
            preço: novoPreco || editarProduto.preço,
            descricao: novaDescricao || editarProduto.descricao,
            imagem_url: novaImagemUrl || editarProduto.imagem_url
        }

        const mostrarProduto = {
            nome: novoNome || editarProduto.nome,
            preço: novoPreco || editarProduto.preço,
            descricao: novaDescricao || editarProduto.descricao,
            imagemUrl: novaImagemUrl || editarProduto.imagem_url
        }

        await db("produtos").update(novoProduto).where({id: idToEdit})
        res.status(200).send({
            message: "Produto atualizado com sucesso",
            produto: mostrarProduto})

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})


//////////////////////////////////////PURCHASES//////////////////////////////////////////

// GET ALL PURCHASES
app.get(`/compras`, async(req:Request, res: Response) => {
    try{
        const result = await db("compras").select("id", "valor_total AS valorTotal", "elaborado AS criado", "pago","comprador AS idComprador")

        res.status(200).send(result)

    }catch(error:any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//POST PURCHASE
app.post("/compras", async (req: Request, res: Response) => {

    try {

        const novoIdComprador = req.body.id
        const novoComprador = req.body.comprador
        const novosProdutos = req.body.produtos

        const {Idproduto, quantidade} = novosProdutos

        const [idExist] = await db("compras").where({id: novoIdComprador})

        if(idExist){
            res.status(400)
            throw new Error("Id já cadastrado")
        }

        if(novoIdComprador[0] !== "c" && novoIdComprador[1] !== "0"){
            res.status(400)
            throw new Error("O id deve iniciar com 'c0'.")
        }

        if (!novoIdComprador || !novoComprador|| !novosProdutos) {
            res.status(400)
            throw new Error("Falta adicionar id, comprador e produtos.")
        }

        if (typeof novoIdComprador !== "string" &&
            typeof novoComprador !== "string") {
            res.status(400)
            throw new Error("'idUsuario' e 'Idproduto' são string.")
        }

        let novoValorTotal = 0

        const Ccompra = {
            id: novoIdComprador,
            comprador: novoComprador,
            valor_total: novoValorTotal
        }

        await db("compras").insert(Ccompra)

        const produtos = []

        for(let item of novosProdutos){
            const [addItem] = await db("produtos").where({ id: item.id})
            novoValorTotal += addItem.preço * item.quantidade
            await db("compra_produtos").insert({id_compra: novoIdComprador , id_produto: item.id, quantidade: item.quantidade})
            const CompletaProduto = {
                ...addItem,
                quantidade
            }
            produtos.push(CompletaProduto)
        }

        await db("compras").update({valor_total: novoValorTotal}).where({ id: novoIdComprador})

        const result = {
            id: Ccompra.id,
            comprador: Ccompra.comprador,
            valorTotal: novoValorTotal,
            produtos
        }

        res.status(201).send({ 
            message: "Pedido realizado com sucesso",
            compra: result
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// DELETE PURCHASE BY ID
app.delete("/compras/:id", async (req: Request, res: Response) => {
    try {
        const deletarID = req.params.id

        if(deletarID[0] !== "c"){
            res.status(404)
            throw new Error("'id' deve começar com a letra c.")
        }

        const [deletarCompra] = await db("compras").where({id:deletarID})

        if(!deletarCompra){
            res.status(404)
            throw new Error("'id' não encontrado.")
        }

        await db("compra_produtos").del().where({id_compra: deletarID})
        await db("compras").del().where({id:deletarID})
        res.status(200).send({message:"Pedido cancelado com sucesso"})        
		
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.get("/compras/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const [compra] = await db("compras").where({ id: id })
        if (compra) {

            const [CompraUsuario] = await db("compras")
                .select(
                    "compras.id AS compraID",
                    "compras.valor_total AS valorTotal",
                    "compras.elaborado AS criado",
                    "compras.pago",
                    "usuarios.id AS idComprador",
                    "usuarios.email",
                    "usuarios.nome")
                .innerJoin("usuarios", "compras.comprador", "=", "usuarios.id")
                .where({ "compras.id": id })

            const compraProduto = await db("compra_produtos")
                .select("compra_produtos.id_produto AS id",
                    "produtos.nome",
                    "produtos.preço",
                    "produtos.descricao",
                    "produtos.imagem_url AS imagemUrl",
                    "compra_produtos.quantidade")
                .innerJoin("produtos", "produtos.id", "=", "compra_produtos.id_produto")
                .where({ id_compra: id })

            const result = { ...CompraUsuario, listaProdutos: compraProduto }

            res.status(200).send(result)

        } else {
            res.status(404)
            throw new Error("Compra não encontrada");

        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send({ message: error.message })
        } else {
            res.send({ message: "Erro inesperado" })
        }
    }
})

