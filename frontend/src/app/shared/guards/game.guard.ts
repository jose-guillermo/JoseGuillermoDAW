import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { SearchGameService } from '../services/search-game.service';

export const gameGuard: CanMatchFn = () => {
  const searchGameService = inject(SearchGameService);

  return searchGameService.gameStarted();
};
