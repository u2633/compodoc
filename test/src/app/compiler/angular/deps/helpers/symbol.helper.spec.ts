import {expect} from 'chai';
import {ts, Project, SourceFile} from 'ts-morph';

import {SymbolHelper} from '../../../../../../../src/app/compiler/angular/deps/helpers/symbol-helper';

describe(SymbolHelper.name, () => {
    let helper: SymbolHelper;

    const sourceFileName = 'SymbolHelper.test.ts';
    let sourceFile: SourceFile;

    const project = new Project();

    beforeEach(() => {
        helper = new SymbolHelper();
    });

    afterEach(() => {
        sourceFile.delete();
    })

    describe('parseProviderConfiguration', () => {
        it('should return identifier for basic provider config', () => {
            sourceFile = project.createSourceFile(sourceFileName, `const provider = TestProvider;`);

            const providerConfig = sourceFile.getVariableDeclaration("provider")!.getInitializer()!.compilerNode as ts.ObjectLiteralExpression;
            const result = helper.parseProviderConfiguration(providerConfig);

            expect(result).to.equal('TestProvider');
        });

        it('should return identifier for "useClass" provider config', () => {
            sourceFile = project.createSourceFile(sourceFileName, `const provider = {provide: 'test', useClass: TestProvider};`);

            const providerConfig = sourceFile.getVariableDeclaration("provider")!.getInitializer()!.compilerNode as ts.ObjectLiteralExpression;
            const result = helper.parseProviderConfiguration(providerConfig);

            expect(result).to.equal('TestProvider');
        });

        it('should return identifier for "useValue" provider config', () => {
            sourceFile = project.createSourceFile(sourceFileName, `const provider = {provide: 'test', useValue: TestProvider};`);

            const providerConfig = sourceFile.getVariableDeclaration("provider")!.getInitializer()!.compilerNode as ts.ObjectLiteralExpression;
            const result = helper.parseProviderConfiguration(providerConfig);

            expect(result).to.equal('TestProvider');
        });

        it('should return identifier for "useFactory" provider config', () => {
            sourceFile = project.createSourceFile(sourceFileName, `const provider = {provide: 'test', useFactory: () => TestProvider};`);

            const providerConfig = sourceFile.getVariableDeclaration("provider")!.getInitializer()!.compilerNode as ts.ObjectLiteralExpression;
            const result = helper.parseProviderConfiguration(providerConfig);

            expect(result).to.equal('TestProvider');
        });

        it('should return identifier for "useExisting" provider config', () => {
            sourceFile = project.createSourceFile(sourceFileName, `const provider = {provide: 'test', useExisting: TestProvider};`);

            const providerConfig = sourceFile.getVariableDeclaration("provider")!.getInitializer()!.compilerNode as ts.ObjectLiteralExpression;
            const result = helper.parseProviderConfiguration(providerConfig);

            expect(result).to.equal('TestProvider');
        });
    });
});
