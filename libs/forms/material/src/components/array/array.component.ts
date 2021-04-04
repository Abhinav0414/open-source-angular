import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynConfig,
  DynFormArray,
  DynInstanceType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynArrayParams } from './array.component.params';

@Component({
  selector: 'dyn-mat-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynArrayComponent
  extends DynFormArray<DynArrayParams, DynConfig>
  implements OnInit, AfterViewInit {
  static dynControl: 'ARRAY' = 'ARRAY';

  dynInstanceType = DynInstanceType;

  static createConfig(
    partial: DynPartialControlConfig<DynArrayParams>
  ): DynConfig<DynArrayParams> {
    return {
      ...partial,
      control: DynArrayComponent.dynControl,
      instance: DynArrayComponent.dynInstance,
    };
  }

  get items(): FormGroup[] {
    return this.control.controls as FormGroup[];
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    if (this.params.initItem && !this.control.length) {
      this.addItem();
      this._ref.markForCheck();
    }
  }

  completeParams(params: Partial<DynArrayParams>): DynArrayParams {
    return {
      ...params,
      addButton: params.addButton || 'Add Item',
      addColor: params.addColor || 'accent',
      removeIcon: params.removeIcon || 'close',
      removeColor: params.removeColor || 'accent',
    };
  }
}
