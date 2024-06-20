import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './admin.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, map, startWith, switchMap, tap } from 'rxjs';
import { FmUserDto } from '../../models/Api';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PeriodService } from '../period/period.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog.component';

@Component({
  selector: 'glfm-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  providers: [AdminService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  columns: string[] = ['username', 'admin', 'active', 'edit'];

  searchForm = this.formBuilder.group({
    searchUsername: this.formBuilder.control(null as string | null),
    admin: this.formBuilder.nonNullable.control(false),
  });

  addNewForm = this.formBuilder.group({
    username: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    admin: this.formBuilder.nonNullable.control(false),
  });

  editForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    username: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    admin: this.formBuilder.nonNullable.control(false),
    active: this.formBuilder.nonNullable.control(false),
    resetPassword: this.formBuilder.nonNullable.control(false),
  });

  dataSource$: Observable<FmUserDto[]> = this.adminService.users$.pipe(
    tap(() => this.searchForm.reset()),
    switchMap((users) => {
      return this.searchForm.valueChanges.pipe(
        startWith(this.searchForm.value),
        map((valueChange) => {
          return users.filter((user) => {
            const searchedName = valueChange.searchUsername?.trim().toLocaleLowerCase() ?? '';
            const fullName = user.username?.toLowerCase() ?? '';
            return valueChange.admin ? fullName.includes(searchedName) && user.admin : fullName.includes(searchedName);
          });
        })
      );
    })
  );

  #addNewMode$ = new BehaviorSubject(false);
  addNewMode$ = this.#addNewMode$.pipe(tap(() => this.addNewForm.reset()));

  #underEditId$ = new BehaviorSubject<number | null>(null);
  editMode$ = this.#underEditId$.pipe(
    switchMap((underEditId) => {
      return this.adminService.users$.pipe(
        map((users) => {
          const user = users.find((user) => user.id === underEditId);
          if (user) {
            this.editForm.patchValue({
              id: user.id,
              username: user.username,
              admin: user.admin,
              active: user.active,
              resetPassword: false,
            });
          }
          return underEditId !== null;
        })
      );
    })
  );

  constructor(
    public adminService: AdminService,
    public periodService: PeriodService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  setAddNewMode(addNewMode: boolean) {
    this.#addNewMode$.next(addNewMode);
  }

  createUser() {
    if (!this.addNewForm.valid) {
      return;
    }
    const formValue = this.addNewForm.getRawValue();
    const newUser: FmUserDto = {
      username: formValue.username,
      admin: formValue.admin,
      active: true,
    };
    this.adminService.createUser(newUser).subscribe((createdUser) => {
      this.adminService.addUser(createdUser);
      this.setAddNewMode(false);
    });
  }

  setUnderEditId(id: number | null) {
    this.#underEditId$.next(id);
  }

  modifyUser() {
    if (!this.editForm.valid) {
      return;
    }
    const formValue = this.editForm.getRawValue();
    const user: FmUserDto = {
      id: formValue.id!,
      username: formValue.username,
      admin: formValue.admin,
      active: formValue.active,
      resetPassword: formValue.resetPassword,
    };
    this.adminService.modifyUser(user).subscribe(() => {
      this.adminService.updateUser(user);
      this.setUnderEditId(null);
    });
  }

  createFirstPeriod() {
    this.adminService.createFirstPeriod().subscribe(() => {
      this.periodService.loadActivePeriod();
    });
  }

  closeActivePeriod() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Megerősítés',
        message: 'Biztosan lezárja a periódust?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.closeActivePeriod().subscribe(() => {
          this.periodService.loadActivePeriod();
        });
      }
    });
  }
}
