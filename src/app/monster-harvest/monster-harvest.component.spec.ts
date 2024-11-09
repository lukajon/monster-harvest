import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterHarvestComponent } from './monster-harvest.component';

describe('MonsterHarvestComponent', () => {
  let component: MonsterHarvestComponent;
  let fixture: ComponentFixture<MonsterHarvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterHarvestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
