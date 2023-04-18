
export type TUsuario = {
    id: string,
    nome: string,
    email: string,
    senha: string,
    elaborado: string
}

export enum Categoria {
    ACESSORIOS = "Acessórios",
    ROUPASESAPATOS = "Roupas e calçados",
    ELETRONICOS = "Eletrônicos",
    COMIDA = "comida"
}

export type TProdutos = {
    id: string,
    nome: string,
    preço: number,
    descricao: string,
    imagem_url: string
}

export type TCompras = {
    id: string,
    valorTotal: number,
    elaborado: string,
    pago: number,
    comprador: string
}

