import { Component, input, model, output } from '@angular/core';

/**
 * The compodoc component
 */
@Component({
    selector: 'compodoc',
    templateUrl: './compodoc.component.html',
    styleUrl: './compodoc.component.css'
})
export class CompodocComponent {
    defaultValue = 'value';

    /**
     * Input Signals
     */

    inputSignal = input();
    inputSignalWithDefaultValue = input(this.defaultValue);
    inputSignalWithDefaultStringValue = input('value');
    inputSignalWithAlias = input(0, { alias: 'aliasedSignal' });

    requiredInputSignal = input.required();
    requiredInputSignalWithType = input.required<number>();

    inputSignalWithType = input<string>('value');
    inputSignalWithStringType = input<'value'>('value');
    inputSignalWithMultipleTypes = input<string | number>(0);
    inputSignalWithMultipleMixedTypes = input<'asc' | 'dsc' | number>('asc');

    /**
     * Model Signals
     */

    modelSignal = model();
    modelSignalWithDefaultValue = model(this.defaultValue);
    modelSignalWithDefaultStringValue = model('value');
    modelSignalWithAlias = model(0, { alias: 'aliasedSignal' });

    requiredModelSignal = model.required();
    requiredModelSignalWithType = model.required<number>();

    modelSignalWithType = model<string>('value');
    modelSignalWithStringType = model<'value'>('value');
    modelSignalWithMultipleTypes = model<string | number>(0);
    modelSignalWithMultipleMixedTypes = model<'asc' | 'dsc' | number>('asc');

    /**
     * Output Signals
     */

    outputSignal = output();
    outputSignalWithDefaultValue = output(this.defaultValue);
    outputSignalWithDefaultStringValue = output('value');
    outputSignalWithAlias = output(0, { alias: 'aliasedSignal' });

    requiredOutputSignal = output.required();
    requiredOutputSignalWithType = output.required<number>();

    outputSignalWithType = output<string>('value');
    outputSignalWithStringType = output<'value'>('value');
    outputSignalWithMultipleTypes = output<string | number>(0);
    outputSignalWithMultipleMixedTypes = output<'asc' | 'dsc' | number>('asc');
}
