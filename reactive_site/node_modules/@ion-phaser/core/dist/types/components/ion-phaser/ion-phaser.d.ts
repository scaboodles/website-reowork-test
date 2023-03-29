import { GameInstance } from '../models/game';
export declare class IonPhaser {
  el: HTMLIonPhaserElement;
  /**
   * Set the configuration of the game
   */
  game?: GameInstance;
  onGameChange(game: GameInstance): void;
  /**
   * Initialize the phaser game manually
   */
  initialize?: boolean;
  onInitialize(newInitialize: boolean, oldInitialize: boolean): void;
  /**
   * Get the Phaser game instance
   */
  getInstance(): Promise<GameInstance['instance']>;
  /**
   * Destroy the Phaser game instance
   */
  destroy(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  private hasInitialized;
  private initializeGame;
}
