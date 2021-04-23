import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { FormBuilder } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryModel } from 'src/app/shared/models/category';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  public categoryModel: CategoryModel;


  constructor(public dialogRef: MatDialogRef<AddCategoryComponent>,
              public formBuilder: FormBuilder,
              public categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  get f() {
    return this.categoryForm.controls;
  }

  onClear() {

  }

  onSubmit() {
    const data: CategoryModel = this.categoryForm.getRawValue();
    console.log(this.f.title.value, this.f.type.value, this.f.description.value);

    this.categoryService.addCategory(data).subscribe(res =>{
        console.log("data:", data);
        console.log("s-a facut adaugarea");
    }, (error=>{
      console.log(error);
    }))

    this.onClose();
  }

  onClose() {
    console.log(this.categoryForm.value);
    this.dialogRef.close();
  }

}
