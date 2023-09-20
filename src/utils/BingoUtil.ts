export const createCard = (size: number): string[] => {
  const totalCells = size * size;
  const halfSize = Math.floor(size / 2);

  // 1から99までの数値を生成
  const numbers = Array.from({ length: 99 }, (_, i) => i + 1);

  // Fisher-Yatesシャッフル
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // カードに配置する数値を取得
  const cardNumbers = numbers.slice(0, totalCells - 1).map(String);  // 真ん中のセル分を除く
  cardNumbers.splice(halfSize * size + halfSize, 0, "");

  return cardNumbers;
};