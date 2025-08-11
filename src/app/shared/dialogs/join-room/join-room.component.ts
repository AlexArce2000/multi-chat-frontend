import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  joinRoomForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JoinRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roomName: string }
  ) { }

  ngOnInit(): void {
    this.joinRoomForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.joinRoomForm.invalid) {
      return;
    }
    this.dialogRef.close(this.joinRoomForm.value.password);
  }
}