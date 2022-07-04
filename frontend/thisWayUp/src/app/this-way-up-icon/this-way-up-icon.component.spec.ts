import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisWayUpIconComponent } from './this-way-up-icon.component';

describe('ThisWayUpIconComponent', () => {
  let component: ThisWayUpIconComponent;
  let fixture: ComponentFixture<ThisWayUpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThisWayUpIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisWayUpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
