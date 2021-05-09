import { ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { map, mapTo, startWith } from 'rxjs/operators';
import { DynConfigId } from './control-config.types';
import {
  DynControlCondition,
  DynControlConditionFn,
  DynControlMatchCondition,
  DynControlMatcher,
  DynControlMatcherFn,
} from './control-matchers.types';
import { DynControlFunction, DynControlFunctionFn } from './control-params.types';
import {
  DynControlErrors,
  DynControlValidator,
  DynErrorHandler,
  DynErrorHandlerFn,
  DynErrorMessage,
} from './control-validation.types';
import { DynTreeNode } from './tree.types';

/**
 * Base types
 */
export interface DynBaseProvider {
  priority?: number;
}

export type DynHandlerFactory<F> = (...args: any[]) => F;

export interface DynBaseHandler<F> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynHandlerFactory<F>;
}

/**
 * Mapper to add the incoming priority
 */
export function mapPriority<T extends DynBaseProvider>(priority?: number) {
  // TODO verify with real use-cases for the priority order
  return (item: T) => ({ ...item, priority: priority ?? item.priority ?? 0 });
}

/**
 * Default Angular validators
 */
export const defaultValidators: DynControlValidator[] = [
  { id: 'required', fn: () => Validators.required },
  { id: 'requiredTrue', fn: () => Validators.requiredTrue },
  { id: 'pattern', fn: Validators.pattern },
  { id: 'minLength', fn: Validators.minLength },
  { id: 'maxLength', fn: Validators.maxLength },
  { id: 'email', fn: () => Validators.email },
  { id: 'min', fn: Validators.min },
  { id: 'max', fn: Validators.max },
].map(
  mapPriority<DynControlValidator>()
);

/**
 * Default matchers
 */
export const defaultMatchers: DynControlMatcher[] = [
  {
    id: 'DISABLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.control.disable() : node.control.enable();
      }
    }
  },
  {
    id: 'ENABLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.control.enable() : node.control.disable();
      }
    }
  },
  {
    id: 'SHOW',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.visible() : node.hidden();
      }
    }
  },
  {
    id: 'INVISIBLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.invisible() : node.visible();
      }
    }
  },
  {
    id: 'HIDE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.hidden() : node.visible();
      }
    }
  },
  {
    id: 'VALIDATE',
    fn: (validator: ValidatorFn = Validators.required): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        const error = hasMatch
          ? validator(node.control)
          : null;
        error
          ? node.control.setErrors(error)
          : node.control.updateValueAndValidity();
      }
    }
  },
].map(
  mapPriority<DynControlMatcher>()
);


/**
 * Default condition handler
 */
export const defaultConditions: DynControlCondition[] = [
  {
    id: 'DEFAULT',
    fn: ({ path, value, negate }: DynControlMatchCondition): DynControlConditionFn => {
      return (node: DynTreeNode) => {
        const control = node.query(path);
        if (!control) {
          console.error(`Control '${path}' not found inside a Condition`)
          return of(true); // do not break AND matchers
        }
        if (value === undefined) {
          // triggers with any valueChange
          return control.valueChanges.pipe(mapTo(true));
        }
        return control.valueChanges.pipe(
          startWith(control.value),
          // compare the configured value
          map(controlValue => {
            return Array.isArray(value)
              ? value.includes(controlValue)
              : value === controlValue;
          }),
          // negate the result if needed
          map(result => negate ? !result : result),
        );
      }
    }
  },
].map(
  mapPriority<DynControlCondition>()
);

/**
 * Default error handler
 */
export const defaultErrorHandlers: DynErrorHandler[] = [
  {
    id: 'CONTROL',
    fn: (messages: DynControlErrors): DynErrorHandlerFn => {
      return ({ control }: DynTreeNode) => {
        // match the control errors with the configured messages
        return control.errors
          ? Object.keys(control.errors).reduce<DynErrorMessage>((result, error) => {
              return !result && messages[error] ? messages[error] : result;
            }, null)
          : null;
      }
    }
  },
].map(
  mapPriority<DynErrorHandler>()
);


/**
 * Default params functions
 */
export const defaultFunctions: DynControlFunction[] = [
  {
    id: 'formatYesNo',
    fn: (isBinary = true): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        return node.control.value === true
          ? 'Yes'
          : isBinary || node.control.value === false
            ? 'No'
            : '-';
      }
    },
  },
  {
    id: 'getOptionText',
    fn: (): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        const value = node.control.value;
        const option = node.params.options.find((o: any) => o.value === value);
        return value && option ? option.text : value;
      }
    },
  },
  {
    id: 'getParamsField',
    fn: (field = 'label', defaultText = '-'): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        return node.params[field] || defaultText;
      }
    },
  },
].map(
  mapPriority<DynControlCondition>()
);
