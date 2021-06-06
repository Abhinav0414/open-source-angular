import { Directive, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynConfig } from './config.types';
import { DynControlHook } from './control-events.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormArray<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, FormArray>
implements OnInit {

  static dynInstance = DynInstanceType.Array;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name && this.node.parent.instance !== DynInstanceType.Array) {
      throw this._logger.unnamedArray(this.config.control);
    }

    // initialize the node
    this.node.onInit(DynInstanceType.Array, this.config);

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-array', this.node.path, this.config.control);
  }

  // hook propagated to child DynControls
  callChildHooks({ hook, payload, plain }: DynControlHook): void {
    if (!plain && !Array.isArray(payload)) {
      return;
    }

    this.node.children.forEach((node, i) => {
      if (plain || payload?.length >= i - 1) {
        node.callHook({
          hook,
          payload: !plain ? payload[i] : payload,
          plain,
        });
      }
    });
  }

  addItem(): void {
    // FIXME the node is not the one of the child
    const { control } = this._factory.build(DynInstanceType.Group, this.node, this.config, true);
    this.control.push(control);
  }

  removeItem(index: number): void {
    this.control.removeAt(index);
  }
}
