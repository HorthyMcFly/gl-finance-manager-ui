import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from './income.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IncomeDto } from '../../../models/Api';

@Component({
  selector: 'glfm-income',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [IncomeService],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent {
  columns: string[] = ['amount', 'source', 'comment', 'edit'];

  incomeForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    amount: this.formBuilder.control(null as number | null),
    source: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]),
    comment: this.formBuilder.control(null as string | null, [Validators.maxLength(100)]),
  });

  #formValueIncome$ = new BehaviorSubject<IncomeDto | null>(null);
  formVisible$ = this.#formValueIncome$.pipe(
    tap(() => this.incomeForm.reset()),
    map((formValueIncome) => formValueIncome !== null)
  );

  constructor(public incomeService: IncomeService, private formBuilder: FormBuilder) {}

  addNew() {
    this.#formValueIncome$.next({});
  }

  cancelForm() {
    this.#formValueIncome$.next(null);
  }

  createOrModifyIncome() {
    const formValue = this.incomeForm.getRawValue();
    // TODO swagger mandatory fields
    const saveObject = {
      id: undefined,
      amount: formValue.amount ?? undefined,
      source: formValue.source ?? undefined,
      comment: formValue.comment ?? undefined,
    }
    this.incomeService.createIncome(saveObject).subscribe((savedIncome) => {
      this.incomeService.addIncome(savedIncome);
    });
  }
}
