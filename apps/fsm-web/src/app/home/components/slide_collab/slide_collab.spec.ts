import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideCollab } from './slide_collab';

describe('SlideCollab', () => {
  let component: SlideCollab;
  let fixture: ComponentFixture<SlideCollab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideCollab],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideCollab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
