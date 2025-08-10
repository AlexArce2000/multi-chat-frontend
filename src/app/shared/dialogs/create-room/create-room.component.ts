import { Component, OnInit, OnDestroy } from '@angular/core'; // <-- AÑADIR OnDestroy
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs'; // <-- AÑADIR Subscription

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit, OnDestroy { 
  createRoomForm!: FormGroup;
  private isPublicSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateRoomComponent>
  ) { }

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      isPublic: [true],
      password: [''] 
    });
    this.isPublicSubscription = this.createRoomForm.get('isPublic')?.valueChanges.subscribe(isPublic => {
      const passwordControl = this.createRoomForm.get('password');
      if (passwordControl) {
        if (!isPublic) {
          passwordControl.setValidators([Validators.required, Validators.minLength(4)]);
        } else {
          passwordControl.clearValidators();
        }
        passwordControl.updateValueAndValidity();
      }
    });
  }
  ngOnDestroy(): void {
    this.isPublicSubscription?.unsubscribe();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.createRoomForm.invalid) {
      return;
    }
    this.dialogRef.close(this.createRoomForm.value);
  }
}