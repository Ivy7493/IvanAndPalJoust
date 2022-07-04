import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameReadyTextComponent } from './game-ready-text.component';

describe('GameReadyTextComponent', () => {
  let component: GameReadyTextComponent;
  let fixture: ComponentFixture<GameReadyTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameReadyTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameReadyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
