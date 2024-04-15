import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './admin.service';
import { FormBuilder } from '@angular/forms';
import { Observable, map, startWith, switchMap, tap } from 'rxjs';
import { FmUser } from '../../models/Api';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'glfm-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  providers: [AdminService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {

  columns: string[] = ['username', 'admin', 'active'];

  searchForm = this.formBuilder.group({
    searchUsername: this.formBuilder.nonNullable.control(''),
  });

  dataSource$: Observable<FmUser[]> = this.adminService.users$.pipe(
    tap(() => this.searchForm.reset()),
    switchMap((users) => {
      return this.searchForm.valueChanges.pipe(
        startWith(this.searchForm.value),
        map((valueChange) => {
          return users.filter((user) => {
            const searchedName = valueChange.searchUsername?.trim().toLocaleLowerCase() ?? '';
            const fullName = user.username?.toLowerCase() ?? '';
            return fullName.includes(searchedName);
          });
        })
      );
    })
  );

  constructor(public adminService: AdminService, private formBuilder: FormBuilder) {}
}
