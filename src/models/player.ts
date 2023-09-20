import { ColType } from '@/types/BingoCardType'

export type ResultStateType = {
  isReach: boolean,
  isBingo: boolean
}

export interface IPlayer {
  userId: string
  name: string
  cardValues: string
}

export class Player implements IPlayer {
  userId: string
  name: string
  cardValues: string;

  // 実際に使う値は配列で持つ
  _cardValues: string[]

  constructor(defaults?: IPlayer) {
    this.userId = defaults?.userId || ''
    this.name = defaults?.name || ''
    // 文字列カンマ区切りを数値配列に変換
    this._cardValues = defaults?.cardValues ? defaults?.cardValues?.split(',').map((value) => value) : []
  }

  toParams(): IPlayer {
    return {
      userId: this.userId,
      name: this.name,
      cardValues: this._cardValues.join(',')
    }
  }

  private createMatrix(size: number): string[][] {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix.push(this._cardValues.slice(i * size, (i + 1) * size));
    }
    return matrix;
  }

  private isLineReachOrBingo(line: string[], results: string[]): ResultStateType {
    // ど真ん中のセルは空白になっているので除外
    const filteredLine = line.filter(num => num !== '');
    if (filteredLine.length === 0) {
      return { isReach: false, isBingo: false };
    }
    const matchedCount = filteredLine.filter(num => results.includes(num)).length;
    return {
      isReach: matchedCount === filteredLine.length - 1,
      isBingo: matchedCount === filteredLine.length
    };
  }

  private isColReachOrBingo(matrix: string[][], results: string[], colIndex: number): ResultStateType {
    const col = matrix.map(row => row[colIndex]);
    return this.isLineReachOrBingo(col, results);
  }

  private isDiagonalReachOrBingo(matrix: string[][], results: string[]): ResultStateType[] {
    const diagonals = [
      matrix.map((row, i) => row[i]), // 左上から右下
      matrix.map((row, i) => row[row.length - 1 - i]) // 右上から左下
    ];

    return diagonals.map(diagonal => this.isLineReachOrBingo(diagonal, results));
  }

  // 盤上の各セルに対していろんなステータス(ColType)を設定する
  resultValues(size: number, results: string[]): ColType[] {
    const matrix = this.createMatrix(size);
    const resultArray: ColType[] = [];

    const diagonalResults = this.isDiagonalReachOrBingo(matrix, results);

    matrix.forEach((row, rowIndex) => {
      const rowResult = this.isLineReachOrBingo(row, results);
      row.forEach((num, colIndex) => {
        const colResult = this.isColReachOrBingo(matrix, results, colIndex);

        // 縦と横の判定
        let isReachCol = rowResult.isReach || colResult.isReach;
        let isBingoCol = rowResult.isBingo || colResult.isBingo;

        // 斜めの判定
        if (rowIndex === colIndex || rowIndex + colIndex === size - 1) {
          const diagonalResult = diagonalResults[rowIndex === colIndex ? 0 : 1];
          isReachCol = isReachCol || diagonalResult.isReach;
          isBingoCol = isBingoCol || diagonalResult.isBingo;
        }

        resultArray.push({
          num,
          isReachCol,
          isBingoCol,
          isDone: num ? results.includes(num) : true // 真ん中のセルは空白になっているので除外
        });
      });
    });

    return resultArray;
  }

  private isReachOrBingoCommon(size: number, results: string[], targetKey: 'isReach' | 'isBingo'): boolean {
    const matrix = this.createMatrix(size);
    const diagonalResults = this.isDiagonalReachOrBingo(matrix, results);

    return matrix.some(row => this.isLineReachOrBingo(row, results)[targetKey]) ||
      Array.from({ length: size }, (_, i) => i).some(i => this.isColReachOrBingo(matrix, results, i)[targetKey]) ||
      diagonalResults.some(res => res[targetKey]);
  }

  isBingo(size: number, results: string[]): boolean {
    return this.isReachOrBingoCommon(size, results, 'isBingo');
  }

  isReach(size: number, results: string[]): boolean {
    return this.isReachOrBingoCommon(size, results, 'isReach');
  }
}