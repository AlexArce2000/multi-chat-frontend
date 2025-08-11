import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-join-private-room',
  templateUrl: './join-private-room.component.html',
  styleUrls: ['./join-private-room.component.scss']
})
export class JoinPrivateRoomComponent implements OnInit {

  joinForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JoinPrivateRoomComponent>
  ) { }

  ngOnInit(): void {
    this.joinForm = this.fb.group({
      roomId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.joinForm.invalid) {
      return;
    }
    this.dialogRef.close(this.joinForm.value);
  }
}