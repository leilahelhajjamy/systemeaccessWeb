import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalYearStatisticsComponent } from './modal-year-statistics.component';

describe('ModalYearStatisticsComponent', () => {
  let component: ModalYearStatisticsComponent;
  let fixture: ComponentFixture<ModalYearStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalYearStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalYearStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
