export interface Response{
  exito: boolean,
  mensaje?: string,
  error?: string,
  jwt?: string,
  userId?: string,
  idProduct?: string,
  idAchievement?: string,
  idGame?: string,
  user?: User,
  mensajes?: Message[],
  juegos?: Game[],
  productos?: Product[],
  logros?: Achievement[],
  compras?: string[]
}

export interface User {
  id: string;
  userName: string;
  email: string;
  rol: string;
  coins: number;
  creationDate: Date;
  favouriteGame: string;
  favouriteAchievement: string;
}

export interface Message{
  id: string,
  sender: string;
  creationDate: Date;
  title: string;
  read: boolean;
  body: string;
  type: "BUG" | "SUGGESTION" | "GAME_CHALLENGE" | "FRIEND_REQUEST" | "ACHIEVEMENT_UNLOCKED" | "SHOP_MESSAGE" | "WARNING" | "SYSTEM_NOTIFICATION" | "ADMIN_REPLY";
}

export interface Achievement{
  id: string,
  game: string,
  coins: number,
  level: string,
  name: string,
}

export interface Game{
  id: string
  name: string,
  pieces: string[],
}

export interface Product{
  id: string,
  game: string,
  price: number,
  name: string,
  type: string,
}