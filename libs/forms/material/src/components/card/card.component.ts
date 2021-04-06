import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlContext,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynFormContainer } from '@myndpm/dyn-forms/core';
import { DynMatCardParams } from './card.component.params';

@Component({
  selector: 'dyn-mat-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatCardComponent
  extends DynFormContainer<DynControlContext, DynMatCardParams, DynConfig>
  implements OnInit {
  static dynControl: 'CARD' = 'CARD';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynMatCardParams>
  ): DynConfig<C, DynMatCardParams> {
    return {
      ...partial,
      control: DynMatCardComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatCardParams>): DynMatCardParams {
    return params;
  }
}
