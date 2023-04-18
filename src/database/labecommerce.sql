-- Active: 1681502376486@@127.0.0.1@3306

CREATE TABLE usuarios (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nome  TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    elaborado TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE produtos (
    id  TEXT PRIMARY KEY UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    preço REAL NOT NULL,
    descricao TEXT NOT NULL,
    imagem_url TEXT NOT NULL
);

CREATE TABLE compras (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    valor_total REAL NOT NULL,
    elaborado TEXT DEFAULT(DATETIME()) NOT NULL,
    pago INTEGER DEFAULT(0) NOT NULL,
    comprador TEXT NOT NULL,
    FOREIGN KEY (comprador) REFERENCES usuarios(id)
);

CREATE TABLE compra_produtos(
    id_compra TEXT NOT NULL,
    id_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT(1),
    FOREIGN KEY (id_compra) REFERENCES compras(id)
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

INSERT INTO usuarios (id, nome, email, senha)
VALUES 
    ("i01", "Elton Limeira", "elton@email.com", "elton123"), 
    ("i02", "Raquel Neves", "raquel@email.com", "raquel123"), 
    ("i03", "Vitor Hughes", "vitor@email.com", "vitor123");

SELECT * FROM usuarios;

INSERT INTO produtos (id, nome, preço, descricao, imagem_url)
VALUES 
    ("p01", "camisa", 114.90, "camisa azul oversized", "http://..."), 
    ("p02", "casaco", 299.90, "casaco oversized", "http://..."), 
    ("p03", "camiseta", 89.90, "camiseta branca", "http://..."), 
    ("p04", "bermuda", 99.90, "bermuda preta algodão", "http://..."), 
    ("p05", "calça", 119.90, "calça jeans preta", "http://...");

SELECT * FROM produtos;

INSERT INTO compras (id, valor_total, pago, comprador)
VALUES 
    ("c01", 299.90, 1, "i01"), 
    ("c02", 99.90, 1, "i01"), 
    ("c03", 89.90, 0, "i02" ), 
    ("c04", 119.90, 0, "i02"), 
    ("c05", 114.90, 1, "i03"), 
    ("c06", 299.90, 1, "i03");

SELECT * FROM compras;

INSERT INTO compra_produtos (id_compra, id_produto, quantidade)
VALUES 
    ("cp01", "p02", 2), 
    ("cp02", "p04", 1), 
    ("cp03", "p03", 1), 
    ("cp04", "p05", 1), 
    ("cp05", "p01", 1), 
    ("cp06", "p02", 1);

SELECT * FROM compra_produtos;

SELECT * FROM compra_produtos
INNER JOIN produtos 
ON compra_produtos.id_produto = produtos.id
INNER JOIN compras 
ON compra_produtos.id_compra = compras.id
INNER JOIN usuarios
ON compras.comprador = usuarios.id;

