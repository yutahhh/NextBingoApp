import React from 'react';
import { XIcon, CheckCircleIcon, BellIcon } from '@heroicons/react/solid';
import { Player } from '@/models/player';
import { ColType } from '@/types/BingoCardType';

interface BingoCardProps {
  title: string;
  cols: ColType[];
  bingoPlayers?: Player[];
  reachPlayers?: Player[];
};

const BingoCard: React.FC<BingoCardProps> = ({ title, cols, bingoPlayers, reachPlayers }) => {
  return (
    <div className="max-w-sm m-auto p-4">
      {/* ビンゴの人 */}
      {bingoPlayers?.length > 0 && (
        <div id="toast-bingo" className="flex items-center w-full max-w-xs p-4 my-2 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
          <CheckCircleIcon className="w-5 h-5 text-green-400" aria-hidden="true" />
          <span>{bingoPlayers.map(player => player.name || '無名').join(', ')}</span>
        </div>
      )}
      {/* リーチの人 */}
      {reachPlayers?.length > 0 && (
        <div id="toast-reach" className="flex items-center w-full max-w-xs p-4 my-2 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
          <BellIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
          <span>{reachPlayers.map(player => player.name || '無名').join(', ')}</span>
        </div>
      )}
      {/* ビンゴカード */}
      <div className="border border-purple-200 p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">{ title }</h1>
        <div className="grid grid-cols-5 gap-4">
          {cols.map((col, index) => (
            <div 
              key={index} 
              className={`
                w-12 h-12 flex justify-center items-center border border-gray-300 rounded-lg 
                ${col.isBingoCol ? 'bg-green-200' : col.isReachCol ? 'bg-yellow-200' : ''}
              `}
            >
              {col.isDone ? (
                <XIcon className="h-6 w-6 text-gray-400" />
              ) : (
                <span className="text-xl">{col.num}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;
