import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShakeBarComponent } from './shake-bar.component';

describe('ShakeBarComponent', () => {
  let component: ShakeBarComponent;
  let fixture: ComponentFixture<ShakeBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShakeBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShakeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
