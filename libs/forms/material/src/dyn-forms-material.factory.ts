import {
  DynConfig,
  DynControlType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynCardComponent,
  DynCardParams,
  DynInputComponent,
  DynInputParams,
} from './components';
import { DynArrayComponent } from './components/array/array.component';
import { DynArrayParams } from './components/array/array.component.params';
import { DynRadioComponent } from './components/radio/radio.component';
import { DynRadioParams } from './components/radio/radio.component.params';
import { DynSelectComponent } from './components/select/select.component';
import { DynSelectParams } from './components/select/select.component.params';

// type overloads
export function createConfig(
  type: typeof DynArrayComponent.dynControl,
  partial: DynPartialControlConfig<Partial<DynArrayParams>>
): DynConfig;
export function createConfig(
  type: typeof DynCardComponent.dynControl,
  partial: DynPartialControlConfig<Partial<DynCardParams>>
): DynConfig;
export function createConfig(
  type: typeof DynInputComponent.dynControl,
  partial: DynPartialControlConfig<Partial<DynInputParams>>
): DynConfig;
export function createConfig(
  type: typeof DynRadioComponent.dynControl,
  partial: DynPartialControlConfig<Partial<DynRadioParams>>
): DynConfig;
export function createConfig(
  type: typeof DynSelectComponent.dynControl,
  partial: DynPartialControlConfig<Partial<DynSelectParams>>
): DynConfig;

// factory
export function createConfig(
  type: DynControlType,
  partial: DynPartialControlConfig<any>
): DynConfig {
  switch (type) {
    // containers
    case DynArrayComponent.dynControl:
      return DynArrayComponent.createConfig(partial);

    case DynCardComponent.dynControl:
      return DynCardComponent.createConfig(partial);

    // controls
    case DynSelectComponent.dynControl:
      return DynSelectComponent.createConfig(partial);

    case DynRadioComponent.dynControl:
      return DynRadioComponent.createConfig(partial);

    case DynInputComponent.dynControl:
    default:
      return DynInputComponent.createConfig(partial);
  }
}
