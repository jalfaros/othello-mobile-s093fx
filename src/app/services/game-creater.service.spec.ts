import { TestBed } from '@angular/core/testing';

import { GameCreaterService } from './game-creater.service';

describe('GameCreaterService', () => {
  let service: GameCreaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCreaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
