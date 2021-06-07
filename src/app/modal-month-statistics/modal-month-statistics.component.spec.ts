import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMonthStatisticsComponent } from './modal-month-statistics.component';

describe('ModalMonthStatisticsComponent', () => {
  let component: ModalMonthStatisticsComponent;
  let fixture: ComponentFixture<ModalMonthStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMonthStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMonthStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
