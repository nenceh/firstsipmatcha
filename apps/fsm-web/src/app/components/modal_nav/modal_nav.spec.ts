import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalNav } from './modal_nav';

describe('ModalNav', () => {
  let component: ModalNav;
  let fixture: ComponentFixture<ModalNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNav],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
