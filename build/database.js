"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bComprasUsuario = exports.criarCompra = exports.consulProdutos = exports.getProdutosID = exports.getProdutos = exports.criarProduto = exports.getAllusuarios = exports.criarUsuario = exports.compras = exports.produtos = exports.usuarios = void 0;
const types_1 = require("./types");
exports.usuarios = [
    {
        id: "Solosun",
        email: "Solosun@email.com",
        senha: "Solosun1"
    },
    {
        id: "Darius",
        email: "Darius@email.com",
        senha: "Darius123"
    }
];
exports.produtos = [
    {
        id: "chocolate",
        nome: "bis",
        preço: 4.90,
        categoria: types_1.categoria.FOOD
    },
    {
        id: "bolo",
        nome: "bolo de chocolate",
        preço: 15.90,
        categoria: types_1.categoria.FOOD
    }
];
exports.compras = [
    {
        idUsuario: "Solosun",
        Idproduto: "chocolate",
        quantidade: 2,
        valorTotal: 9.80
    },
    {
        idUsuario: "Darius",
        Idproduto: "bolo",
        quantidade: 1,
        valorTotal: 15.90
    }
];
const criarUsuario = (id, email, senha) => {
    const novoUsuario = {
        id: id,
        email: email,
        senha: senha
    };
    exports.usuarios.push(novoUsuario);
    console.log("Cadastro realizado com sucesso!");
};
exports.criarUsuario = criarUsuario;
const bTodosUsuarios = () => {
    console.table(exports.usuarios);
};
exports.bTodosUsuarios = bTodosUsuarios;
const criarProduto = (id, nome, preço, categoria) => {
    const novoProduto = {
        id: id,
        nome: nome,
        preço: preço,
        categoria: categoria
    };
    exports.produtos.push(novoProduto);
    console.log("Produto criado com sucesso!");
};
exports.criarProduto = criarProduto;
const getProdutos = () => {
    console.table(exports.produtos);
};
exports.getProdutos = getProdutos;
const getProdutosID = (idToSearch) => {
    return exports.produtos.filter((produto) => {
        return (produto.id === idToSearch);
    });
};
exports.getProdutosID = getProdutosID;
const consulProdutos = (q) => {
    const consul = exports.produtos.filter((produto) => {
        return (produto.nome.toLowerCase().includes(q.toLowerCase()));
    });
    console.table(consul);
};
exports.consulProdutos = consulProdutos;
const criarCompra = (idUsuario, Idproduto, quantidade, valorTotal) => {
    const novaCompra = {
        idUsuario,
        Idproduto,
        quantidade,
        valorTotal
    };
    exports.compras.push(novaCompra);
    console.log("Compra realizada com sucesso!");
    console.table(exports.compras);
};
exports.criarCompra = criarCompra;
const bComprasUsuario = (procurarUsuario) => {
    return exports.compras.filter((compra) => {
        return (compra.idUsuario.toLowerCase().includes(procurarUsuario.toLowerCase()));
    });
};
exports.bComprasUsuario = bComprasUsuario;
//# sourceMappingURL=database.js.map
