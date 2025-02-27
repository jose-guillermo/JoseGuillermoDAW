import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { StartGameService } from '../../services/start-game.service';
import { ImagePipe } from 'src/app/shared/pipes/image.pipe';
import { ProductService } from 'src/app/shared/services/backend/product.service';
import { database, RealtimeDatabaseService } from 'src/app/shared/services/realtime-database.service';
import { onChildAdded, onValue, ref, Unsubscribe } from 'firebase/database';
type Piece = {
  color: 'black' | 'white';
  type: 'peon' | 'dama';
  position: { row: number; col: number };
};

type Cell = {
  piece: Piece | null;
  isPossibleMove: boolean;
};

@Component({
  selector: 'game-board-damas',
  templateUrl: './game-board-damas.component.html',
  styleUrls: ['./game-board-damas.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
  imports: [ ImagePipe ],
  
})
export class GameBoardDamasComponent{

  private startGameService = inject(StartGameService);
  private productService = inject(ProductService);
  private realtimeDb = inject(RealtimeDatabaseService);
  private unsubscribe = signal<Unsubscribe | null>(null);

  public board = signal<Cell[][]>([]);
  public selectedPiece = signal<Piece | null>(null);
  public currentPlayer = signal<'black' | 'white'>('white');

  public productIdPieces = computed<string | null>(() => {
    let defaultPieces = this.productService.products()?.find((product) => product.name === "damas_default_pieces");
    return defaultPieces!.id;
  })

  public userColorPieces = computed<string>(() => {
    if(this.startGameService.isPlayer1()) {
      return "white";
    } else {
      return "black";
    }
  });


  public gamePath = computed<string>(() => {
    if(this.startGameService.player1() && this.startGameService.player2()){
      return `games/${this.startGameService.player1()?.id}vs${this.startGameService.player2()?.id}`
    }
    return "";
  });
  public numberOfTurn = signal<number>(0);

  @Output() turn: EventEmitter<string> = new EventEmitter<string>();
  @Output() victory: EventEmitter<"WIN" | "LOSE"> = new EventEmitter<"WIN" | "LOSE">();

  constructor() {
    this.initializeBoard();
    console.log("gamePath:",this.gamePath());
    
    effect(() => {
      if(this.currentPlayer() !== this.userColorPieces()) {
        const dbRef = ref(database, this.gamePath());
        this.unsubscribe.set(onChildAdded(dbRef, (snapshot) => {
          const data = snapshot.val();
          console.log("data:", data);

          if(data === true){
            this.victory.emit("WIN");
            console.log("Victoria emitida");
          } else {
            this.movePiece(data.from, data.to)
          }
          this.unsubscribe()?.()      
        }));
      }
    })

    effect(() => {
      if(this.currentPlayer() === this.userColorPieces()) { 
        this.turn.emit("YOURS");
      } else {
        this.turn.emit("ENEMY");
      }
    })
    this.currentPlayer.set("white");
  }


  initializeBoard() {
    // Crear tablero vacío
    const initialBoard = Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({
        piece: null,
        isPossibleMove: false
      }))
    );

    // Colocar piezas iniciales
    this.setupInitialPieces(initialBoard);
    this.board.set(initialBoard);
  }

  private setupInitialPieces(board: Cell[][]) {
    // Colocar peones negros
    for (let row = 0; row < 3; row++) {
      for (let col = (row % 2 === 0) ? 1 : 0; col < 8; col += 2) {
        board[row][col].piece = {
          color: 'black',
          type: 'peon',
          position: { row, col }
        };
      }
    }

    // Colocar peones blancos
    for (let row = 5; row < 8; row++) {
      for (let col = (row % 2 === 0) ? 1 : 0; col < 8; col += 2) {
        board[row][col].piece = {
          color: 'white',
          type: 'peon',
          position: { row, col }
        };
      }
    }
  }

  selectCell(row: number, col: number) {
    if(this.userColorPieces() === this.currentPlayer()) {
      const cell = this.board()[row][col];
      
      if (cell.piece?.color === this.currentPlayer()) {
        this.selectedPiece.set(cell.piece);
        this.highlightPossibleMoves(row, col);
      } else if (cell.isPossibleMove && this.selectedPiece()) {
        // si la celda seleccionada es posible moverse y ya hay una pieza en movimiento
        this.movePiece(this.selectedPiece()!.position, { row, col });
        this.selectedPiece.set(null);
        this.clearHighlights();
      }
    }
  }

  private highlightPossibleMoves(row: number, col: number) {
    this.clearHighlights();
    const piece = this.board()[row][col].piece!;

    // las direcciones a las que se pueden mover la pieza si hacia arriba o hacia abajo
    // si es reina se puede mover hacia ambos lados
    const directions = piece.type === 'peon'
      ? (piece.color === 'black' ? [1] : [-1])
      : [-1, 1];

    directions.forEach(dRow => {
      [-1, 1].forEach(dCol => {
        this.checkMove(piece, row, col, dRow, dCol, false);
      });
    });
  }



  private checkMove(piece: Piece, row: number, col: number, 
                   dRow: number, dCol: number, isCapture: boolean) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    // Si se sale del tablero vuelve
    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return;

    // Encuentra la casilla para comprobar movimiento
    const targetCell = this.board()[newRow][newCol];
    
    if (!isCapture && !targetCell.piece) {
      // Si no se ha capturado una pieza o hay alguna pieza en la casilla objetiva
      this.board.update(board => {
        // Se modifica la casilla como posibleMovimiento
        const newBoard = board.map(r => [...r]);
        newBoard[newRow][newCol].isPossibleMove = true;
        return newBoard;
      });
    } else if (targetCell.piece?.color !== piece.color) {
      // En caso de que la pieza de la casilla objetiva sea de un color diferente
      // Saltará esta casilla a la siguiente
      const jumpRow = newRow + dRow;
      const jumpCol = newCol + dCol;
      
      if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
        // Si al saltar la casilla sigue dentro del tablero
        const jumpCell = this.board()[jumpRow][jumpCol];
        if (!jumpCell.piece) {
          // Si la celda a la que se ha saltado no es una pieza
          this.board.update(board => {
            const newBoard = board.map(r => [...r]);
            newBoard[jumpRow][jumpCol].isPossibleMove = true;
            return newBoard;
          });
          this.checkMove(piece, jumpRow, jumpCol, dRow, dCol, true);
        }
      }
    }
  }

  private movePiece(from: { row: number; col: number }, 
                   to: { row: number; col: number }) {
    this.numberOfTurn.set(this.numberOfTurn() + 1)
    this.board.update(board => {
      const newBoard = board.map(r => [...r]); // Clonar el tablero
      const piece = newBoard[from.row][from.col].piece!;
      piece.position = to;
      
      // Mover pieza
      newBoard[to.row][to.col].piece = piece;
      newBoard[from.row][from.col].piece = null;

      // Eliminar pieza capturada
      const middleRow = (from.row + to.row) / 2;
      const middleCol = (from.col + to.col) / 2;
      if (Math.abs(from.row - to.row) === 2) {
        newBoard[middleRow][middleCol].piece = null;
      }

      // Promoción a reina
      if ((piece.color === 'black' && to.row === 7) || 
          (piece.color === 'white' && to.row === 0)) {
        piece.type = 'dama';
      }

      if(this.currentPlayer() === this.userColorPieces()) {
        this.realtimeDb.writeData(`${ this.gamePath() }/turn${this.numberOfTurn()}`, { from, to });
      }

      this.currentPlayer.set(this.currentPlayer() === 'black' ? 'white' : 'black');

      return newBoard;
    });
    this.checkVictory();
  }

  private clearHighlights() {
    this.board.update(board => {
      const newBoard = board.map(r => [...r]);
      newBoard.forEach(row => row.forEach(cell => cell.isPossibleMove = false));
      return newBoard;
    });
  }

  private checkVictory() {
    let blackPieces = 0;
    let whitePieces = 0;
  
    // Recorrer el tablero y contar las piezas de cada jugador
    this.board().forEach(row => {
      row.forEach(cell => {
        if (cell.piece?.color === 'black') {
          blackPieces++;
        } else if (cell.piece?.color === 'white') {
          whitePieces++;
        }
      });
    });
  
    // Comprobar si un jugador ha perdido todas sus piezas
    if (blackPieces === 0) {
      if (this.userColorPieces() === "black"){
        this.victory.emit("LOSE");
      } else {
        this.victory.emit("WIN");
      }
    } else if (whitePieces === 0) {
      if (this.userColorPieces() === "white"){
        this.victory.emit("LOSE");
      } else {
        this.victory.emit("WIN"); 
      }
    }
  }
}
