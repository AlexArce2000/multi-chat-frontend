import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPrivateRoomComponent } from './join-private-room.component';

describe('JoinPrivateRoomComponent', () => {
  let component: JoinPrivateRoomComponent;
  let fixture: ComponentFixture<JoinPrivateRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinPrivateRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinPrivateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
