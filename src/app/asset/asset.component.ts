import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AssetService } from './asset.service';
import { MatTableModule } from '@angular/material/table';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AssetDto, AssetType } from '../../models/Api';
import { BehaviorSubject, Observable, first, map, shareReplay, take, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BalanceService } from '../balance/balance.service';

type AssetSourceType = 'INVESTMENT_BALANCE' | 'NEW';
interface AssetSource {
  type: AssetSourceType;
  label: string;
}

@Component({
  selector: 'glfm-asset',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [AssetService],
  host: { class: 'glfm-asset' },
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetComponent implements OnInit {
  columns: string[] = ['amount', 'name', 'assetType', 'maturityDate', 'interestRate', 'interestPaymentMonth', 'sell'];

  MONTH_LIST = [
    'Január',
    'Február',
    'Március',
    'Április',
    'Május',
    'Június',
    'Július',
    'Augusztus',
    'Szeptember',
    'Október',
    'November',
    'December',
  ];

  VALIDATION_VALUES = {
    amount: {
      MIN: 1,
      MAX: 1_000_000_000,
    },
    name: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 30,
    },
    maturityDate: {
      MIN: new Date(),
    },
    interestRate: {
      MIN: 0,
      MAX: 1000,
    },
  };

  assetSources = [
    { type: 'INVESTMENT_BALANCE', label: 'Befektetési egyenleg' },
    { type: 'NEW', label: 'Külső' },
  ] as AssetSource[];

  assetTypes: AssetType[] = [];

  addAssetForm = this.formBuilder.group(
    {
      id: this.formBuilder.control(null as number | null),
      amount: this.formBuilder.control(null as number | null, [
        Validators.required,
        Validators.min(this.VALIDATION_VALUES.amount.MIN),
        Validators.max(this.VALIDATION_VALUES.amount.MAX),
      ]),
      name: this.formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(this.VALIDATION_VALUES.name.MIN_LENGTH),
        Validators.maxLength(this.VALIDATION_VALUES.name.MAX_LENGTH),
      ]),
      source: this.formBuilder.nonNullable.control<AssetSource>(this.assetSources[0], Validators.required),
      assetType: this.formBuilder.control(null as AssetType | null, Validators.required),
      maturityDate: this.formBuilder.control(null as Date | null, Validators.required),
      interestRate: this.formBuilder.control(null as number | null, Validators.required),
      interestPaymentMonth: this.formBuilder.control(null as number | null, Validators.required),
    },
    {
      asyncValidators: [this.amountExceedsInvestmentBalanceValidator()],
    }
  );

  sellForm = this.formBuilder.group({
    amount: this.formBuilder.control(null as number | null),
  });

  underEdit$ = new BehaviorSubject(false);
  addAssetFormVisible$ = new BehaviorSubject(false);

  #assetToSell$ = new BehaviorSubject(null as AssetDto | null);
  assetToSell$ = this.#assetToSell$.pipe(
    tap((assetDto) => {
      this.sellForm.reset();
      const amountControl = this.sellForm.controls.amount;
      if (assetDto) {
        amountControl.setValidators([
          Validators.required,
          Validators.min(this.VALIDATION_VALUES.amount.MIN),
          Validators.max(assetDto.amount),
        ]);
        if (assetDto.assetType.type === 'Lekötött betét') {
          amountControl.setValue(assetDto.amount);
          amountControl.disable();
        }
        this.underEdit$.next(true);
      } else {
        amountControl.enable();
        this.underEdit$.next(false);
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    public assetService: AssetService,
    public balanceService: BalanceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.assetService.assetTypes$.pipe(first()).subscribe((assetTypes) => (this.assetTypes = assetTypes));
  }

  addNew() {
    this.addAssetFormVisible$.next(true);
    this.underEdit$.next(true);
  }

  resetAddNew() {
    this.addAssetFormVisible$.next(false);
    this.addAssetForm.reset();
    this.underEdit$.next(false);
  }

  createAsset() {
    if (!this.addAssetForm.valid) return;

    const formValue = this.addAssetForm.getRawValue();
    const saveObject: AssetDto = {
      id: formValue.id,
      amount: formValue.amount!,
      name: formValue.name,
      useInvestmentBalance: formValue.source.type === 'INVESTMENT_BALANCE',
      assetType: formValue.assetType!,
      maturityDate: formValue.maturityDate!.toLocaleDateString().replaceAll(' ', '-').replaceAll('.', ''),
      interestRate: formValue.interestRate!,
      interestPaymentMonth: formValue.interestPaymentMonth,
    };
    this.assetService.createAsset(saveObject).subscribe((savedAsset) => {
      this.assetService.addAsset(savedAsset);
      this.balanceService.reloadBalance();
      this.resetAddNew();
    });
  }

  assetTypeChanged(assetType: AssetType) {
    this.addAssetForm.controls.interestPaymentMonth.reset();
    if (assetType.type === 'Kötvény') {
      this.addAssetForm.controls.interestPaymentMonth.enable();
    } else {
      this.addAssetForm.controls.interestPaymentMonth.disable();
    }
  }

  amountExceedsInvestmentBalanceValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const formGroup = control as typeof this.addAssetForm;
      const sourceControl = formGroup.controls.source;
      const amountControl = formGroup.controls.amount;
      return this.balanceService.balance$.pipe(
        map((balance) => {
          if (sourceControl.value.type === 'INVESTMENT_BALANCE') {
            if (
              amountControl.value !== null &&
              balance?.investmentBalance !== undefined &&
              amountControl.value > balance?.investmentBalance
            ) {
              amountControl.setErrors({ amountExceedsInvestmentBalance: true });
              return { amountExceedsInvestmentBalance: true };
            }
          }
          amountControl.setErrors(null);
          return null;
        }),
        take(1)
      );
    };
  }

  showSellForm(sellAsset: AssetDto) {
    this.#assetToSell$.next(sellAsset);
  }

  resetSell() {
    this.#assetToSell$.next(null);
  }

  sellAsset(assetToSell: AssetDto) {
    if (!this.sellForm.valid) return;
    const amountDifference = assetToSell.amount - this.sellForm.controls.amount.value!;
    if (amountDifference > 1) {
      const saveObject = { ...assetToSell, amount: amountDifference };
      this.assetService.sellAsset(saveObject).subscribe((modifiedAsset) => {
        this.assetService.updateAsset(modifiedAsset);
        this.resetSell();
        this.balanceService.reloadBalance();
      });
    } else {
      this.assetService.deleteAsset(assetToSell.id!).subscribe(() => {
        this.assetService.removeAsset(assetToSell.id!);
        this.resetSell();
        this.balanceService.reloadBalance();
      });
    }
  }
}
