import { ref, set, push, update, onValue, DataSnapshot } from "firebase/database";
import { db } from "@/plugins/firebase";
import { Game, IGame } from "@/models/game";
import { IPlayer, Player } from "@/models/player";

export const createGame = async (game: Game): Promise<string | null> => {
  const gamesRef = ref(db, 'games');
  
  const newGameRef = push(gamesRef);
  game.id = newGameRef.key || '';
  await set(newGameRef, game.toParams());
  return game.id;
};

export const drawRandomNumber = async (gameId: string, currentResults: string[]): Promise<void> => {
  let newNumber: string;
  do {
    newNumber = (Math.floor(Math.random() * 99) + 1).toString();
  } while (currentResults.includes(newNumber));

  const newResults = [...currentResults, newNumber];
  const gameRef = ref(db, `games/${gameId}`);
  await update(gameRef, { results: newResults });
};

export const updateGame = async (gameId: string, game: Game): Promise<void> => {
  const gameRef = ref(db, `games/${gameId}`);
  await update(gameRef, game.toParams());
};

export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = ref(db, `games/${gameId}`);
  await set(gameRef, null);
}

export const assignPlayer = async (gameId: string, player: Player): Promise<void> => {
  const gameRef = ref(db, `games/${gameId}/players/${player.userId}`);
  await set(gameRef, player.toParams());
}

export const updatePlayer = async (gameId: string, player: Player): Promise<void> => {
  const gameRef = ref(db, `games/${gameId}/players/${player.userId}`);
  await update(gameRef, player.toParams());
}

export const listenToGame = (gameId: string, callback: (data: IGame | null) => void): void => {
  const gameRef = ref(db, `games/${gameId}`);
  onValue(gameRef, (snapshot: DataSnapshot) => {
    callback(snapshot.val());
  });
};

export const listenToPlayers = (gameId: string, callback: (data: IPlayer[] | null) => void): void => {
  const playersRef = ref(db, `games/${gameId}/players`);
  onValue(playersRef, (snapshot: DataSnapshot) => {
    callback(snapshot.val());
  });
};