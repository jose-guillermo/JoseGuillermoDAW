-- Tabla usuarios 
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id TEXT PRIMARY KEY,
    nombre_usuario TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    monedas INT DEFAULT 100,
    fecha_creacion_usuario BIGINT  DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
    password_hash TEXT NOT NULL,
    rol TEXT CHECK (rol IN ('user', 'admin')) DEFAULT 'user'
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- tabla notificaciones
DROP TABLE IF EXISTS mensajes CASCADE;

CREATE TABLE mensajes (
    id TEXT PRIMARY KEY,
    id_remitente TEXT REFERENCES usuarios(id) ON DELETE CASCADE DEFAULT NULL,
    id_destinatario TEXT REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
    fecha BIGINT DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
    titulo TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    contenido TEXT NOT NULL,
    tipo TEXT NOT NULL
);

ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;

-- tabla juegos
DROP TABLE IF EXISTS juegos CASCADE;

CREATE TABLE juegos(
    id TEXT PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL,
    piezas TEXT[] NOT NULL
);

ALTER TABLE public.juegos ENABLE ROW LEVEL SECURITY;

-- añade una restricción de clave foranea al campo juego_favorito de juegos para referenciar a juegos(id)
ALTER TABLE usuarios
ADD CONSTRAINT fk_juego_favorito
FOREIGN KEY (juego_favorito) REFERENCES juegos(id)
ON DELETE SET NULL;  

-- Tabla logros
DROP TABLE IF EXISTS logros CASCADE;

CREATE TABLE logros(
    id TEXT PRIMARY KEY,
    juego TEXT REFERENCES juegos(id) ON DELETE CASCADE NOT NULL,
    recompensa_monedas INT DEFAULT 0,
    nivel TEXT CHECK (nivel IN ('bronze', 'plata', 'oro', 'diamante')) NOT NULL,
    nombre TEXT NOT NULL
);

ALTER TABLE public.logros ENABLE ROW LEVEL SECURITY;

-- añade una restricción de clave foranea al campo logro_favorito de usuario para referenciar a logros(id)
ALTER TABLE usuarios
ADD CONSTRAINT fk_logro_favorito
FOREIGN KEY (logro_favorito) REFERENCES logros(id)
ON DELETE SET NULL;  

-- Tabla representa los logros conseguidos por cada usuario
DROP TABLE IF EXISTS logros_usuarios CASCADE;

CREATE TABLE logros_usuarios(
    id_usuario TEXT,
    id_logro TEXT,
    fecha BIGINT DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
    PRIMARY KEY(id_usuario, id_logro)
);

ALTER TABLE public.logros_usuarios ENABLE ROW LEVEL SECURITY;

-- tabla productos
DROP TABLE IF EXISTS productos CASCADE;

CREATE TABLE productos(
    id TEXT PRIMARY KEY,
    juego TEXT REFERENCES juegos(id) ON DELETE CASCADE NOT NULL,
    precio INT NOT NULL,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- tabla compras que guarda los productos comprados por los usuarios
DROP TABLE IF EXISTS compras CASCADE;

CREATE TABLE compras(
    id_usuario TEXT REFERENCES usuarios(id) ON DELETE CASCADE,
    id_producto TEXT REFERENCES productos(id) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_producto)
);

ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;

-- tabla partidas
DROP TABLE IF EXISTS partidas CASCADE;

CREATE TABLE partidas(
    id TEXT PRIMARY KEY,
    juego TEXT REFERENCES juegos(id) ON DELETE CASCADE NOT NULL,
    id_jugador1 TEXT REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
    id_jugador2 TEXT REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
    fecha_hora BIGINT DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);

ALTER TABLE public.partidas ENABLE ROW LEVEL SECURITY;