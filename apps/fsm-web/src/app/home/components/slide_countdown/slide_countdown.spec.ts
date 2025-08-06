import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideCountdown } from './slide_countdown';

describe('SlideCountdown', () => {
  let component: SlideCountdown;
  let fixture: ComponentFixture<SlideCountdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideCountdown],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideCountdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
