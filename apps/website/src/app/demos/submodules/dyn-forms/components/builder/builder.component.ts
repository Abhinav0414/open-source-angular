import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynFormComponent, DynFormConfig } from '@myndpm/dyn-forms';
import { startWith } from 'rxjs/operators';
import { markAsUntouched } from '../../../../../layout';
import { actions, badges } from '../../constants/dyn-forms.links';
import { buildConfig, unitConfig } from './builder.form';
import { MyndUnitType } from './business.types';

@Component({
  selector: 'app-form-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  // ref links
  badges = badges;
  actions = [
    {
      link: "https://github.com/myndpm/open-source/blob/master/apps/website/src/app/demos/submodules/dyn-forms/components/builder/builder.form.ts",
      icon: 'code',
      tooltip: 'See source code',
    },
    ...actions,
  ];

  // unit state
  unit = new FormGroup({ unitType: new FormControl(MyndUnitType.Normal) });
  unitConfig = unitConfig;

  // dyn-form inputs
  config: DynFormConfig;
  form = new FormGroup({});
  mode = 'edit';

  @ViewChildren(DynFormComponent)
  dynForms: QueryList<DynFormComponent>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.config = buildConfig(
      this.unit.valueChanges.pipe(startWith(this.unit.value)),
      this.dialog,
    );
  }

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForms.forEach(
      dynForm => dynForm.valueChanges().subscribe(console.log),
    );

    // listen submit
    this.dynForms.get(1).addHookListener('Submit', () => {
      this.form.markAllAsTouched();

      if (this.form.valid) {
        console.log('Valid Form Submitted');
        this.toggleMode();
      }
    })
  }

  ngOnDestroy(): void {
    console.clear();
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';

    if (this.mode === 'display') {
      // reset invalid styles on display
      markAsUntouched(this.form);
    }
  }
}