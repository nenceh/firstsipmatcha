import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownToggle } from './dropdown_toggle';

describe('DropdownToggle', () => {
  let component: DropdownToggle;
  let fixture: ComponentFixture<DropdownToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
