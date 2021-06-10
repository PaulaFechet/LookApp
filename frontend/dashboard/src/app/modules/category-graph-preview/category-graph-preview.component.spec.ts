import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGraphPreviewComponent } from './category-graph-preview.component';

describe('CategoryGraphPreviewComponent', () => {
  let component: CategoryGraphPreviewComponent;
  let fixture: ComponentFixture<CategoryGraphPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryGraphPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryGraphPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
