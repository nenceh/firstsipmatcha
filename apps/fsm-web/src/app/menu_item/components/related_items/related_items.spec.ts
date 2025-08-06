import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedItems } from './related_items';

describe('RelatedItems', () => {
  let component: RelatedItems;
  let fixture: ComponentFixture<RelatedItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedItems],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
