import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { numberRegEx } from './../../shared/constants';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public categoryForm: FormGroup;
  public categoryModel: CategoryModel;

  public color: string = "#000000";

  public readonly action: string;
  public readonly local_data: any;

  get categoryFormControls() {
    return this.categoryForm.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    public formBuilder: FormBuilder,
    public categoryService: CategoryService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any //@Optional() is used to prevent error if no data is passed

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      graphColor: [''],
      title: ['', Validators.required],
      unitOfMeasure: ['', Validators.required],
      lowerLimit: ['', Validators.pattern(numberRegEx)],
      upperLimit: ['', Validators.pattern(numberRegEx)],
      description: ['']
    }, { validators: this.checkIfLimitsAreValid })

  }

  onClear(): void {
    this.categoryForm.reset()
  }

  onSubmit(): void {
    if (!this.categoryForm.valid) {
      return;
    }

    this.categoryForm.controls.graphColor.setValue(this.color);

    const data: CategoryModel = this.categoryForm.getRawValue();
    this.categoryService.addCategory(data).subscribe();

    this.dialogRef.close({ event: this.action });
  }

  onClose(): void {
    this.dialogRef.close({event: "Close"});
  }

  checkIfLimitsAreValid(categoryForm: AbstractControl): ValidationErrors | null {

    let lowerLimitControl = categoryForm.get("lowerLimit");
    let upperLimitControl = categoryForm.get("upperLimit");

    if (lowerLimitControl.invalid ||
      upperLimitControl.invalid) {
      return null;
    }

    let lowerLimit = parseFloat(lowerLimitControl?.value);
    let upperLimit = parseFloat(upperLimitControl?.value);

    if (Number.isNaN(lowerLimit) ||
      Number.isNaN(upperLimit)) {
      return null;
    }

    if (lowerLimit < upperLimit) {
      return null;
    }

    return { invalidLimits: true };
  }
}
