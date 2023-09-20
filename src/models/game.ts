import { Player, IPlayer } from '@/models/player'

export interface IGame {
  id: string
  name: string
  size: number
  hostId: string
  results: string[]
}

export class Game implements IGame {
  id: string
  name: string = 'BINGO'
  size: number = 5
  hostId: string
  results: string[]

  constructor(defaults?: IGame) {
    this.id = defaults?.id || ''
    this.name = defaults?.name || 'BINGO'
    this.size = defaults?.size || 5
    this.hostId = defaults?.hostId || ''
    this.results = defaults?.results || []
  }

  toParams(): IGame {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      hostId: this.hostId,
      results: this.results
    }
  }
}