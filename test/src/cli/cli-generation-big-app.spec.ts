const eol = require('os').EOL;

import { expect } from 'chai';
import { exists, read, shell, temporaryDir } from '../helpers';

const tmp = temporaryDir();

describe('CLI simple generation - big app', () => {
    let stdoutString = undefined;
    let interfaceIDATAFile;
    let searchFuncFile;

    let todoComponentFile,
        todoMVCComponentFile,
        homeComponentFile,
        aboutComponentFile,
        appComponentFile,
        listComponentFile,
        footerComponentFile,
        doNothingDirectiveFile,
        todoClassFile,
        tidiClassFile,
        aboutModuleFile,
        todoStoreFile,
        typeAliasesFile,
        functionsFile,
        contactInfoInterfaceFile;

    let routesIndex;

    const tmpFolder = tmp.name + '-big-app';
    const distFolder = tmpFolder + '/documentation';

    before(done => {
        tmp.create(tmpFolder);
        tmp.copy('./test/fixtures/todomvc-ng2/', tmpFolder);
        const ls = shell(
            'node',
            ['../bin/index-cli.js', '-p', './src/tsconfig.json', '-d', 'documentation'],
            { cwd: tmpFolder }
        );

        if (ls.stderr.toString() !== '') {
            console.error(`shell error: ${ls.stderr.toString()}`);
            done('error');
        }
        stdoutString = ls.stdout.toString();
        interfaceIDATAFile = read(`${distFolder}/interfaces/IDATA.html`);
        searchFuncFile = read(`${distFolder}/interfaces/SearchFunc.html`);

        routesIndex = read(`${distFolder}/js/routes/routes_index.js`);
        todoComponentFile = read(`${distFolder}/components/TodoComponent.html`);
        todoMVCComponentFile = read(`${distFolder}/components/TodoMVCComponent.html`);
        footerComponentFile = read(`${distFolder}/components/FooterComponent.html`);
        homeComponentFile = read(`${distFolder}/components/HomeComponent.html`);
        aboutComponentFile = read(`${distFolder}/components/AboutComponent.html`);
        appComponentFile = read(`${distFolder}/components/AppComponent.html`);
        listComponentFile = read(`${distFolder}/components/ListComponent.html`);

        doNothingDirectiveFile = read(`${distFolder}/directives/DoNothingDirective.html`);

        todoClassFile = read(`${distFolder}/classes/Todo.html`);
        tidiClassFile = read(`${distFolder}/classes/Tidi.html`);

        aboutModuleFile = read(`${distFolder}/modules/AboutModule.html`);

        todoStoreFile = read(`${distFolder}/injectables/TodoStore.html`);

        typeAliasesFile = read(`${distFolder}/miscellaneous/typealiases.html`);
        functionsFile = read(`${distFolder}/miscellaneous/functions.html`);

        contactInfoInterfaceFile = read(`${distFolder}/interfaces/ContactInfo.html`);

        done();
    });
    after(() => {
        // tmp.clean(distFolder);
    });

    it('should display generated message', () => {
        expect(stdoutString).to.contain('Documentation generated');
    });

    it('should have generated main folder', () => {
        const isFolderExists = exists(distFolder);
        expect(isFolderExists).to.be.true;
    });

    it('should have generated main pages', () => {
        const isIndexExists = exists(distFolder + '/index.html');
        expect(isIndexExists).to.be.true;
        const isModulesExists = exists(distFolder + '/modules.html');
        expect(isModulesExists).to.be.true;
        const isRoutesExists = exists(distFolder + '/routes.html');
        expect(isRoutesExists).to.be.true;
    });

    it('should have generated resources folder', () => {
        const isImagesExists = exists(distFolder + '/images');
        expect(isImagesExists).to.be.true;
        const isJSExists = exists(distFolder + '/js');
        expect(isJSExists).to.be.true;
        const isStylesExists = exists(distFolder + '/styles');
        expect(isStylesExists).to.be.true;
        const isFontsExists = exists(distFolder + '/fonts');
        expect(isFontsExists).to.be.true;
    });

    it('should add correct path to css', () => {
        const index = read(`${distFolder}/index.html`);
        expect(index).to.contain('href="./styles/style.css"');
    });

    /**
     * Dynamic imports for metadatas
     */
    it('should have metadatas - component', () => {
        expect(footerComponentFile).to.contain('footer.component.html');
    });
    it('should have metadatas - component with aliased import', () => {
        const file = read(`${distFolder}/components/HeaderComponent.html`);
        expect(file).to.contain('header.component.html');
    });
    it('should have metadatas - directive', () => {
        const file = read(`${distFolder}/directives/DoNothingDirective.html`);
        expect(file).to.contain('[donothing]');
    });

    /**
     * Import for component template
     */
    it('should have metadatas - component', () => {
        expect(aboutComponentFile).to.contain('example written using');
    });

    /**
     * Routing
     */

    it('should not have a toggled item menu', () => {
        expect(routesIndex).to.not.contain('fa-angle-down');
    });

    it('should have a route index', () => {
        const isFileExists = exists(`${distFolder}/js/routes/routes_index.js`);
        expect(isFileExists).to.be.true;
    });

    it('should have generated files', () => {
        expect(routesIndex).to.contain('AppModule');
        expect(routesIndex).to.contain('AppRoutingModule');
        expect(routesIndex).to.contain('HomeRoutingModule');
        expect(routesIndex).to.contain('AboutComponent');
    });

    it('should have a readme tab', () => {
        expect(todoComponentFile).to.contain('readme-tab');
        expect(listComponentFile).to.contain('readme-tab');
    });

    it('should have a decorator listed', () => {
        expect(footerComponentFile).to.contain('@LogProperty()<br');
    });

    /**
     * End Routing
     */

    it('should have generated search index json', () => {
        const isIndexExists = exists(`${distFolder}/js/search/search_index.js`);
        expect(isIndexExists).to.be.true;
    });

    it('should have excluded big file for search index json', () => {
        const searchIndexFile = read(`${distFolder}/js/search/search_index.js`);
        expect(searchIndexFile).to.not.contain('photo64_1');
    });

    it('should have generated extends information for todo class', () => {
        expect(todoClassFile).to.contain('Extends');
    });

    it('should have generated implements information for clock class', () => {
        const classFile = read(`${distFolder}/classes/Clock.html`);
        expect(classFile).to.contain('Implements');
    });

    it('should have generated interfaces', () => {
        const isInterfaceExists = exists(distFolder + '/interfaces/ClockInterface.html');
        expect(isInterfaceExists).to.be.true;
    });

    it('should have generated classes', () => {
        const clockFile = exists(distFolder + '/classes/Clock.html');
        expect(clockFile).to.be.true;
    });

    it('should have generated components', () => {
        const file = exists(distFolder + '/components/AboutComponent.html');
        expect(file).to.be.true;
    });

    it('should have generated directives', () => {
        const file = exists(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.be.true;
    });

    it('should have generated injectables', () => {
        const file = exists(distFolder + '/injectables/TodoStore.html');
        expect(file).to.be.true;
    });

    it('should have generated the not-injectable guards', () => {
        const file = exists(`${distFolder}/guards/AuthGuard.html`);
        expect(file).to.be.true;
    });

    it('should have generated the injectable guards', () => {
        const file = exists(`${distFolder}/guards/NotAuthGuard.html`);
        expect(file).to.be.true;
    });

    it(`shouldn't have generated classes for the corresponding guards`, () => {
        const file = exists(`${distFolder}/classes/AuthGuard.html`);
        expect(file).to.be.false;
    });

    it(`shouldn't have generated injectables for the corresponding guards`, () => {
        const file = exists(`${distFolder}/injectables/NotAuthGuard.html`);
        expect(file).to.be.false;
    });

    it('should have generated modules', () => {
        const file = exists(distFolder + '/modules/AboutModule.html');
        expect(file).to.be.true;
    });

    it('should have generated pipes', () => {
        const file = exists(distFolder + '/pipes/FirstUpperPipe.html');
        expect(file).to.be.true;

        const pipeFile = read(distFolder + '/pipes/FirstUpperPipe.html');
        expect(pipeFile).to.contain('<h3>Metadata');
        expect(pipeFile).to.contain('Example property');
        expect(pipeFile).to.contain('the transform function');
        expect(pipeFile).to.contain('<td class="col-md-9">true</td>');
        expect(pipeFile).to.contain('<td class="col-md-9">firstUpper</td>');
    });

    it('should have miscellaneous page', () => {
        const file = exists(distFolder + '/miscellaneous/enumerations.html');
        expect(file).to.be.true;
    });

    it('miscellaneous page should contain some things', () => {
        const miscFile = read(`${distFolder}/miscellaneous/enumerations.html`);
        expect(miscFile).to.contain('Directions of the app');
    });

    it('should have infos about SearchFunc interface', () => {
        expect(searchFuncFile).to.contain('A string');
    });

    it('should have infos about ClockInterface interface', () => {
        const file = read(`${distFolder}/interfaces/ClockInterface.html`);
        expect(file).to.contain('A simple reset method');
    });

    it('should have generated args and return informations for todo store', () => {
        expect(todoStoreFile).to.contain('Promise&lt;void&gt;');
        expect(todoStoreFile).to.contain('string | number');
        expect(todoStoreFile).to.contain('number[]');
        expect(todoStoreFile).to.contain(
            '<code>stopMonitoring(theTodo?: <a href="../interfaces/LabelledTodo.html" target="_self">LabelledTodo</a>)</code>'
        );
        expect(todoStoreFile).to.contain('service is a todo store');
        expect(todoStoreFile).to.contain('all todos status (completed');
        expect(todoStoreFile).to.contain('Local array of Todos');
    });

    it('should have correct types for todo model', () => {
        expect(todoClassFile).to.contain(
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/boolean'
        );
        expect(todoClassFile).to.contain(
            'testCommentFunction(dig: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number'
        );
    });

    it('should have correct spread support', () => {
        expect(todoStoreFile).to.contain('...theArgs');
    });

    it('should have an example tab', () => {
        expect(todoComponentFile).to.contain('data-link="example">Examples</a');
        expect(todoComponentFile).to.contain('iframe class="exampleContainer"');
    });

    it('should have managed array declaration in modules', () => {
        const file = read(distFolder + '/modules/TodoModule.html');
        expect(file).to.contain('<title>FirstUpperPipe</title>'); // Inside svg graph
        const file2 = read(distFolder + '/modules/ListModule.html');
        expect(file2).to.contain('<title>TodoModule</title>'); // Inside svg graph
    });

    it('should have README tabs for each types', () => {
        expect(todoComponentFile).to.contain('id="readme-tab"');
        expect(aboutModuleFile).to.contain('id="readme-tab"');
        let file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('id="readme-tab"');
        expect(todoStoreFile).to.contain('id="readme-tab"');
        file = read(distFolder + '/pipes/FirstUpperPipe.html');
        expect(file).to.contain('id="readme-tab"');

        expect(todoClassFile).to.contain('id="readme-tab"');

        file = read(distFolder + '/interfaces/ClockInterface.html');
        expect(file).to.contain('id="readme-tab"');
    });

    it('should support indexable for class', () => {
        expect(todoClassFile).to.contain('<code>[index: number]');
    });

    it('should have correct links for {@link into main description and constructor}', () => {
        expect(todoClassFile).to.contain('See <a href="../injectables/TodoStore');
        expect(todoClassFile).to.contain('Watch <a href="../injectables/TodoStore');
    });

    it('should support misc links', () => {
        expect(todoClassFile).to.contain('../miscellaneous/enumerations.html');
    });

    it('should have public function for component', () => {
        expect(homeComponentFile).to.contain('code>showTab(');
    });

    it('should have override types for arguments of function', () => {
        expect(todoStoreFile).to.contain('code><a href="../classes/Todo.html" target="_self" >To');
    });

    it('should have inherit return type', () => {
        expect(todoClassFile).to.contain(
            'code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number"'
        );
    });

    it('should have inherit input type', () => {
        expect(aboutComponentFile).to.contain(
            'code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string"'
        );
    });

    it('should support simple class with custom decorator', () => {
        expect(tidiClassFile).to.contain('completed</b>');
    });

    it('should support simple class with custom decorator()', () => {
        const file = read(distFolder + '/classes/DoNothing.html');
        expect(file).to.contain('aname</b>');
    });

    it('should support TypeLiteral', () => {
        expect(typeAliasesFile).to.contain(
            '&quot;creating&quot; | &quot;created&quot; | &quot;updating&quot; | &quot;updated&quot'
        );
    });

    it('should support return multiple with null & TypeLiteral', () => {
        expect(tidiClassFile).to.contain('<code>literal type | null');
    });

    it('should support @HostBindings', () => {
        const file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('style.color</b>');
    });

    it('should support @HostListener and multiple', () => {
        expect(aboutComponentFile).to.contain(
            "i>Arguments : </i><code>'$event.clientX' '$event.clientY'"
        );

        expect(doNothingDirectiveFile).to.contain(
            `<code>@HostListener(&#x27;focus&#x27;, [&#x27;$event&#x27;])<br />@HostListener(&#x27;click&#x27;, [&#x27;$event&#x27;])<br /></code>`
        );
    });

    it('should support extends for interface', () => {
        const file = read(distFolder + '/interfaces/ClockInterface.html');
        expect(file).to.contain('Extends');
    });

    it('should support optional', () => {
        expect(todoStoreFile).to.contain('Yes');
    });

    it('should support optional', () => {
        expect(aboutComponentFile).to.contain('<code>Subscription[]');
    });

    it('should support @link with anchor', () => {
        expect(todoStoreFile).to.contain('../classes/Todo.html#completed');
    });

    it('should support self-defined type', () => {
        expect(todoClassFile).to.contain('../miscellaneous/typealiases.html#PopupPosition');
        expect(typeAliasesFile).to.contain('<code>ElementRef | HTMLElement</code>');
    });

    it('should support accessors for class', () => {
        expect(todoClassFile).to.contain('<a href="#title" >title</a>');
        expect(todoClassFile).to.contain('Accessors');
        expect(todoClassFile).to.contain('Setter of _title');
        expect(todoClassFile).to.contain('<p>Returns the runtime path</p>');
        expect(todoClassFile).to.contain('<code>title(value');
    });

    it('should support accessors for injectables', () => {
        expect(todoStoreFile).to.contain('Accessors');
        expect(todoStoreFile).to.contain('Getter of _fullName');
        expect(todoStoreFile).to.contain('Setter of _fullName');
    });

    it('should support accessors for directives', () => {
        const file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('Accessors');
        expect(file).to.contain('Getter of _fullName');
        expect(file).to.contain('Setter of _fullName');
    });

    it('should support accessors for components with input', () => {
        let file = read(distFolder + '/components/HeaderComponent.html');
        expect(file).to.contain('Accessors');
        expect(file).to.contain('Getter of _fullName');
        expect(file).to.contain('Setter of _fullName');

        expect(file).to.contain('Inputs');

        file = read(distFolder + '/components/DumbComponent.html');
        expect(file).to.contain(
            '<code>visibleTodos(value: <a href="../classes/Todo.html" target="_self">Todo</a>)</code>'
        );
    });

    it('should support QualifiedName for type', () => {
        expect(aboutComponentFile).to.contain('Highcharts.Options');
    });

    it('should support namespace', () => {
        let file = read(distFolder + '/modules/AboutModule2.html');
        expect(file).to.contain('The about module');

        file = read(distFolder + '/components/AboutComponent2.html');
        expect(file).to.contain('The about component');

        file = read(distFolder + '/directives/DoNothingDirective2.html');
        expect(file).to.contain('This directive does nothing !');

        file = read(distFolder + '/classes/Todo2.html');
        expect(file).to.contain('The todo class');

        file = read(distFolder + '/injectables/TodoStore2.html');
        expect(file).to.contain('This service is a todo store');

        file = read(distFolder + '/interfaces/TimeInterface2.html');
        expect(file).to.contain('A time interface just for documentation purpose');

        file = read(distFolder + '/pipes/FirstUpperPipe2.html');
        expect(file).to.contain('Uppercase the first letter of the string');

        file = read(distFolder + '/miscellaneous/enumerations.html');
        expect(file).to.contain('PopupEffect2');

        expect(functionsFile).to.contain('foo2');

        expect(typeAliasesFile).to.contain('Name2');

        file = read(distFolder + '/miscellaneous/variables.html');
        expect(file).to.contain('PI2');
    });

    it('should support spread operator for modules metadatas', () => {
        const file = read(distFolder + '/modules/HomeModule.html');
        expect(file).to.contain('../modules/FooterModule.html');
    });

    it('should support interceptors', () => {
        const file = read(distFolder + '/modules/AppModule.html');
        expect(file).to.contain('../interceptors/NoopInterceptor.html');
        const fileTest = exists(distFolder + '/interceptors/NoopInterceptor.html');
        expect(fileTest).to.be.true;
    });

    it('should have DOM tree tab for component with inline template', () => {
        expect(homeComponentFile).to.contain('<header class="header"');
    });

    it('should have parsed correctly private, public, and static methods or properties', () => {
        expect(aboutComponentFile).to.contain('<code>privateStaticMethod()');
        expect(aboutComponentFile).to.contain(
            `<span class="modifier">Private</span>${eol}                                    <span class="modifier">Static</span>`
        );
        expect(aboutComponentFile).to.contain('<code>protectedStaticMethod()');
        expect(aboutComponentFile).to.contain(
            `<span class="modifier">Protected</span>${eol}                                    <span class="modifier">Static</span>`
        );
        expect(aboutComponentFile).to.contain('<code>publicMethod()');
        expect(aboutComponentFile).to.contain('<code>publicStaticMethod()');
        expect(aboutComponentFile).to.contain('<code>staticMethod()');
        expect(aboutComponentFile).to.contain('staticReadonlyVariable');
        expect(aboutComponentFile).to.contain(
            `<span class="modifier">Static</span>${eol}                                    <span class="modifier">Readonly</span>`
        );
        expect(aboutComponentFile).to.contain(
            `<span class="modifier">Public</span>${eol}                                    <span class="modifier">Async</span>`
        );
    });

    it('should support entryComponents for modules', () => {
        expect(aboutModuleFile).to.contain('<h3>EntryComponents');
        expect(aboutModuleFile).to.contain('href="../components/AboutComponent.html"');
    });

    it('should id for modules', () => {
        expect(aboutModuleFile).to.contain('<h3>Id');
    });

    it('should schemas for modules', () => {
        const file = read(distFolder + '/modules/FooterModule.html');
        expect(file).to.contain('<h3>Schemas');
    });

    it('should support dynamic path for routes', () => {
        const routesFile = read(distFolder + '/js/routes/routes_index.js');
        expect(routesFile).to.contain('homeimported');
        expect(routesFile).to.contain('homeenumimported');
        expect(routesFile).to.contain('homeenuminfile');
        expect(routesFile).to.contain('todomvcinstaticclass');
    });

    it('should support Object Literal Property Value Shorthand support for metadatas for modules', () => {
        expect(aboutModuleFile).to.contain('<h3>Declarations');
        expect(aboutModuleFile).to.contain('<h3>Imports');
        expect(aboutModuleFile).to.contain('<h3>EntryComponents');
        expect(aboutModuleFile).to.contain('<h3>Providers');
        expect(aboutModuleFile).to.contain('<h3>Bootstrap');
        expect(aboutModuleFile).to.contain('<h3>Schemas');
    });

    it('should support Object Literal Property Value Shorthand support for metadatas for components', () => {
        expect(homeComponentFile).to.contain('<h3>Metadata');
        expect(homeComponentFile).to.contain('<code>home</code>');
        expect(homeComponentFile).to.contain('<code>ChangeDetectionStrategy.OnPush</code>');
        expect(homeComponentFile).to.contain('<code>ViewEncapsulation.Emulated</code>');
        expect(homeComponentFile).to.contain('<code>./home.component.html</code>');
        expect(homeComponentFile).to.contain('<td class="col-md-3">template</td>');
    });

    it('should support @link to miscellaneous', () => {
        expect(aboutComponentFile).to.contain(
            '<a href="../miscellaneous/variables.html#PIT">PIT</a>'
        );
        expect(aboutComponentFile).to.contain(
            '<a href="../miscellaneous/enumerations.html#Direction">Direction</a>'
        );
        expect(aboutComponentFile).to.contain(
            '<a href="../miscellaneous/typealiases.html#ChartChange">ChartChange</a>'
        );
        expect(aboutComponentFile).to.contain(
            '<a href="../miscellaneous/functions.html#foo">foo</a>'
        );
    });

    it('should support default type on default value', () => {
        const file = read(distFolder + '/classes/TODO_STATUS.html');
        expect(file).to.contain(
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string"'
        );
    });

    it('should display project dependencies', () => {
        const file = exists(distFolder + '/dependencies.html');
        expect(file).to.be.true;
        const dependencies = read(distFolder + '/dependencies.html');
        expect(dependencies).to.contain('angular/forms');
    });

    it('should display project properties', () => {
        const file = exists(distFolder + '/properties.html');
        expect(file).to.be.true;
        const properties = read(distFolder + '/properties.html');
        expect(properties).to.contain('Demo for project');
        expect(properties).to.contain('The author');
        expect(properties).to.contain('https://github.com/just-a-repo');
        expect(properties).to.contain('documentation, angular');
    });

    it('should display project local TypeScript version', () => {
        expect(stdoutString).to.contain('TypeScript version of current project');
    });

    //it('should display project peerDependencies', () => {
    //  const file = exists(distFolder + '/dependencies.html');
    //  expect(file).to.be.true;
    //  let dependencies = read(distFolder + '/dependencies.html');
    //  expect(dependencies).to.contain('angular/forms');
    //});

    it('should support optional for classes', () => {
        expect(todoClassFile).to.contain('Optional');
    });

    it('should support optional for interfaces', () => {
        const file = read(distFolder + '/interfaces/LabelledTodo.html');
        expect(file).to.contain('Optional');
    });

    it('should support optional for interfaces / methods', () => {
        const file = read(distFolder + '/interfaces/TimeInterface.html');
        expect(file).to.contain('Optional');
    });

    it('should support private for constructor', () => {
        const file = read(distFolder + '/classes/PrivateConstructor.html');
        expect(file).to.contain('<span class="modifier">Private</span>');
    });

    it('should support union type with array', () => {
        expect(todoComponentFile).to.contain('>string[] | Todo</a>');
    });

    it('should support multiple union types with array', () => {
        expect(todoComponentFile).to.contain('<code>(string | number)[]</code>');
    });

    it('should support multiple union types with array again', () => {
        expect(typeAliasesFile).to.contain('<code>number | string | (number | string)[]</code>');
    });

    it('should support union type with generic', () => {
        expect(typeAliasesFile).to.contain(
            '<code>Type&lt;TableCellRendererBase&gt; | TemplateRef&lt;any&gt;</code>'
        );
    });

    it('should support literal type', () => {
        expect(typeAliasesFile).to.contain(
            '<code>Pick&lt;NavigationExtras | replaceUrl&gt;</code>'
        );
    });

    it('should support multiple union types with array', () => {
        expect(todoComponentFile).to.contain('<code>(string | number)[]</code>');
    });

    it('should support alone elements in their own entry menu', () => {
        const file = read(distFolder + '/js/menu-wc.js');
        expect(file).to.contain(
            '<a href="components/JigsawTab.html" data-type="entity-link" >JigsawTab</a>'
        );
        expect(file).to.contain(
            '<a href="directives/DoNothingDirective2.html" data-type="entity-link" >DoNothingDirective2</a>'
        );
        expect(file).to.contain(
            '<a href="injectables/EmitterService.html" data-type="entity-link" >EmitterService</a>'
        );
        expect(file).to.contain(
            '<a href="pipes/FirstUpperPipe2.html" data-type="entity-link" >FirstUpperPipe2</a>'
        );
    });

    it('should support component metadata preserveWhiteSpaces', () => {
        expect(aboutComponentFile).to.contain('<td class="col-md-3">preserveWhitespaces</td>');
    });

    it('should support component metadata entryComponents', () => {
        expect(aboutComponentFile).to.contain(
            '<code><a href="../components/TodoComponent.html" target="_self" >TodoComponent</a></code>'
        );
    });

    it('should support component metadata providers', () => {
        expect(aboutComponentFile).to.contain(
            '<code><a href="../injectables/EmitterService.html" target="_self" >EmitterService</a></code>'
        );
    });

    it('should support component inheritance with base class without @component decorator', () => {
        const file = read(distFolder + '/components/DumbComponent.html');
        expect(file).to.contain('parentInput</b>');
        expect(file).to.contain('parentoutput</b>');
        expect(file).to.contain('style.color</b>');
        expect(file).to.contain('<code>mouseup');
    });

    it('should display short filename + long filename in title for index of miscellaneous', () => {
        const file = read(distFolder + '/miscellaneous/variables.html');
        expect(file).to.contain('(src/.../about.module.ts)');
        expect(file).to.contain('title="src/app/about/about.module.ts"');
    });

    it('should display component even with no hostlisteners', () => {
        const file = read(distFolder + '/coverage.html');
        expect(file).to.contain('src/app/footer/footer.component.ts');
    });

    it('should display list of import/exports/declarations/providers in asc order', () => {
        const file = read(distFolder + '/modules/AboutRoutingModule.html');
        expect(file).to.contain(
            `<li class="list-group-item">${eol}                            <a href="../components/CompodocComponent.html">CompodocComponent</a>${eol}                        </li>${eol}                        <li class="list-group-item">${eol}                            <a href="../components/TodoMVCComponent.html">`
        );
    });

    it('should support Tuple types', () => {
        expect(typeAliasesFile).to.contain('<code>[number, number]</code>');
        expect(typeAliasesFile).to.contain('[Todo, Todo]</a>');
    });

    it('should support Generic array types', () => {
        expect(appComponentFile).to.contain(
            '<a href="../classes/Todo.html" target="_self" >Observable&lt;Todo[]&gt;</a>'
        );
    });

    it('should support Type parameters', () => {
        expect(appComponentFile).to.contain(`<li>T</li>`);
        expect(appComponentFile).to.contain(`<li>K</li>`);
    });

    it('should support spread elements with external variables', () => {
        const file = read(distFolder + '/modules/FooterModule.html');
        expect(file).to.contain('<h3>Declarations<a href=');
    });

    it('should support interfaces with custom variables names', () => {
        const file = read(distFolder + '/interfaces/ValueInRes.html');
        expect(file).to.contain('<a href="#__allAnd">');
    });

    it('correct support of generic type Map<K, V>', () => {
        expect(todoStoreFile).to.contain('Map&lt;string, number&gt;');
    });

    it('correct support of abstract and async modifiers', () => {
        expect(todoClassFile).to.contain('<span class="modifier">Abstract</span>');
        expect(todoClassFile).to.contain('<span class="modifier">Async</span>');
    });

    it('correct support function with empty typed arguments', () => {
        expect(appComponentFile).to.contain('<code>openSomeDialog(model,');
    });

    it('correct support unnamed function', () => {
        expect(functionsFile).to.contain('Unnamed');
    });

    it('correct display styles tab', () => {
        let file = read(distFolder + '/components/HeaderComponent.html');
        expect(file).to.contain('styleData-tab');
        expect(file).to.contain('language-scss');
        expect(appComponentFile).to.contain('styleData-tab');
        expect(appComponentFile).to.contain('font-size');
        file = read(distFolder + '/components/TodoMVCComponent.html');
        expect(file).to.contain('styleData-tab');
        expect(file).to.contain('pointer-events');
    });

    it('correct support symbol type', () => {
        expect(typeAliasesFile).to.contain('string | symbol | Array&lt;string | symbol&gt;');
    });

    it('correct support gorRoot & forChild methods for modules', () => {
        const file = read(distFolder + '/modules/AppModule.html');
        expect(file).to.contain('code>forChild(confi');
        expect(file).to.contain('code>forRoot(confi');
    });

    it('correct support returned type for miscellaneous function', () => {
        expect(functionsFile).to.contain(
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string'
        );
    });

    it('correct http reference for other classes using @link in description of a miscellaneous function', () => {
        expect(functionsFile).to.contain(
            '<a href="../components/ListComponent.html">ListComponent</a>'
        );
    });

    it('shorten long arrow function declaration for properties', () => {
        expect(todoClassFile).to.contain('() &#x3D;&gt; {...}</code>');
    });

    it('correct supports 1000 as PollingSpeed for decorator arguments', () => {
        const file = read(distFolder + '/classes/SomeFeature.html');
        expect(file).to.contain('code>@throttle(1000 as PollingSpeed');
    });

    it('correct supports JSdoc without comment for accessor', () => {
        expect(tidiClassFile).to.contain('b>emailAddress</b>');
    });

    it('correct supports ArrayType', () => {
        expect(interfaceIDATAFile).to.contain('<code>[number, string, number[]]</code>');
    });

    it('correct supports ArrayType with spread', () => {
        expect(interfaceIDATAFile).to.contain('<code>[string, string, ...boolean[]]</code>');
    });

    it('should support inheritance with abstract class', () => {
        const file = read(distFolder + '/components/SonComponent.html');
        expect(file).to.contain(
            'href="../components/MotherComponent.html#source" target="_self" >MotherComponent:20'
        );
        expect(file).to.contain(
            'href="../components/MotherComponent.html#source" target="_self" >MotherComponent:14'
        );
    });

    it('should support generic in function arguments', () => {
        const file = read(distFolder + '/components/GenericComponent.html');
        expect(file).to.contain(
            'code>getData(foo: <a href="../interfaces/Foo.html" target="_self">Foo&lt;object&gt;</a>)</code'
        );
        expect(file).to.contain(
            'code><a href="../interfaces/Foo.html" target="_self" >Foo&lt;object&gt;</a></code'
        );
    });

    it('should support inheritance between component and directive', () => {
        const file = read(distFolder + '/components/InheritDirComponent.html');
        expect(file).to.contain('BaseDirective.html" target="_self" >BaseDirective');
        expect(file).to.contain('b>testPropertyInBase</b');
    });

    it('should support ECMAScript Private Fields and methods', () => {
        const file = read(distFolder + '/classes/Todo.html');
        expect(file).to.contain('b>#newprivateproperty</b');
        expect(file).to.contain('p>Another private property</p');
    });

    it('should support type alias and template literal', () => {
        const file = read(distFolder + '/miscellaneous/typealiases.html');
        expect(file).to.contain('(min-width: ${Foo}px)&#x60;</a');
    });

    it('should support destructuring for functions', () => {
        const file = read(distFolder + '/miscellaneous/functions.html');
        expect(file).to.contain('<code>sumFunction(trackId, __namedParameters: {a');
        expect(file).to.contain('<code>2</code>');
    });

    it('should support default value for functions parameters', () => {
        const file = read(distFolder + '/miscellaneous/functions.html');
        expect(file).to.contain('<code>&#x27;toto&#x27;</code>');
    });

    it('should support destructuring for variables / array', () => {
        const file = read(distFolder + '/miscellaneous/variables.html');
        expect(file).to.contain('<code>&#x27;Gabriel&#x27;</code>');
    });

    it('should support JSDoc @link in JSDoc @param tag', () => {
        let file = read(distFolder + '/injectables/TodoStore.html');
        expect(file).to.contain(
            'all todos -&gt; see <a href="../components/FooterComponent.html">FooterComponent'
        );
        file = read(distFolder + '/components/FooterComponent.html');
        expect(file).to.contain(
            'A TodoStore -&gt; see <a href="../injectables/TodoStore.html">TodoStore'
        );
    });

    it('should support JSDoc @link in JSDoc @see tag', () => {
        const file = read(distFolder + '/injectables/TodoStore.html');
        expect(file).to.contain('See <a href="../classes/Todo.html">Todo</a> for details');
    });

    it('should support JSDoc @link for setters and getters', () => {
        const file = read(distFolder + '/injectables/TodoStore.html');
        expect(file).to.contain('or link to <a href="../classes/Todo.html">Todo');
        expect(file).to.contain('ore link to <a href="../classes/Todo.html">Todo');
    });

    it('should support JSDoc @link for inputs', () => {
        const file = read(distFolder + '/components/HeaderComponent.html');
        expect(file).to.contain('_fullName <a href="https://compodoc.app/">https://compodoc.app/');
    });

    it('should not crash with invalid JSDoc @link tags', () => {
        const file = read(distFolder + '/components/AboutComponent.html');
        expect(file).to.contain('if this {@link AboutComponent.fullName} does not crash');
        expect(file).to.contain('if this {@link undefined} does not crash');
    });

    it('should support multiple decorators for component for example', () => {
        const file = read(distFolder + '/components/AboutComponent.html');
        expect(file).to.contain('<code>src/app/about/about.component.ts</code>');
    });

    it('should not have bootstraped component in components menu entry', () => {
        const file = read(distFolder + '/js/menu-wc.js');
        expect(file).to.not.contain(
            '<a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>'
        );
    });

    it('should support @example', () => {
        expect(todoMVCComponentFile).to.contain(
            '">&lt;todomvc&gt;The example of the component&lt;'
        );
    });

    it('should support double layer spread for modules', () => {
        const file = read(distFolder + '/modules/HeaderModule.html');
        expect(file).to.contain('href="../components/HeaderComponent.html">HeaderComponent');
    });

    it('should support class name includes an interface name', () => {
        const file = read(distFolder + '/classes/Container.html');
        expect(file).to.contain('href="../classes/AaBb.html" target="_self" >AaBb');
    });

    it('should support service/injectable export in module providers', () => {
        const file = read(distFolder + '/modules/FooterModule.html');
        expect(file).to.contain('href="../injectables/EmitterService.html">EmitterService');
    });

    it('should support exportAs for directives', () => {
        const file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('<code>donothing</code>');
    });

    it('should support standalone for components, directives and pipes', () => {
        let file = read(distFolder + '/components/TodoComponent.html');
        expect(file).to.contain('<td class="col-md-3">standalone</td>');
        expect(file).to.contain('<td class="col-md-3">imports</td>');
        expect(file).to.contain(
            '<code><a href="../directives/DoNothingDirective.html" target="_self" >DoNothingDirective</a></code>'
        );
        expect(file).to.contain(
            '<code><a href="../modules/AboutModule.html" target="_self" >AboutModule</a></code>'
        );

        file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('<code>donothing</code>');
        expect(file).to.contain('<td class="col-md-3">Standalone</td>');

        file = read(distFolder + '/pipes/StandAlonePipe.html');
        expect(file).to.contain('<td class="col-md-3">Standalone</td>');
    });

    it('should support required for inputs', () => {
        const file = read(distFolder + '/components/TodoComponent.html');
        expect(file).to.contain('<i>Required : </i>&nbsp;<b>true</b>');
    });

    it('should support Host Directives for directives and components', () => {
        let file = read(distFolder + '/components/AboutComponent.html');
        expect(file).to.contain('<td class="col-md-3">HostDirectives</td>');
        expect(file).to.contain(
            '<code><a href="../directives/DoNothingDirective.html" target="_self" >DoNothingDirective</a></code>'
        );

        file = read(distFolder + '/directives/DoNothingDirective.html');
        expect(file).to.contain('<td class="col-md-3">HostDirectives</td>');
        expect(file).to.contain(
            '<code><a href="../directives/BorderDirective.html" target="_self" >BorderDirective</a></code>'
        );

        file = read(distFolder + '/directives/HighlightAndBorderDirective.html');
        expect(file).to.contain('<td class="col-md-3">HostDirectives</td>');
        expect(file).to.contain(
            '<code><a href="../directives/HighlightDirective.html" target="_self" >HighlightDirective</a></code>'
        );
        expect(file).to.contain('<div><i>&nbsp;Inputs</i> : color&nbsp;</div>');
    });

    it('should support inputs and outputs signals and model', () => {
        const file = read(distFolder + '/classes/DumbParentComponent.html');
        expect(file).to.contain('<a href="#label" >label</a>');
        expect(file).to.contain('<a href="#currentChange" >currentChange</a>');
    });

    it('should support component styles url/urls', () => {
        let file = read(distFolder + '/components/CompodocComponent.html');
        expect(file).to.contain('<code>./compodoc.component.css</code>');
        file = read(distFolder + '/components/AboutComponent.html');
        expect(file).to.contain(`<code>
        a {
            color: #03a9f4;
        }
    </code>`);
    });

    it('should support aliases', () => {
        let file = read(distFolder + '/components/DumbImportComponent.html');
        expect(file).to.contain(
            '<a href="../classes/DumbParentComponent.html" target="_self" >PapaComponent</a>'
        );
        file = read(distFolder + '/components/DumbWithExportComponent.html');
        expect(file).to.contain(
            '<a href="../classes/DumbParentComponent.html" target="_self" >LegacyPapaComponent</a>'
        );
    });

    it('should support string Indexed Access Types', () => {
        expect(contactInfoInterfaceFile).to.contain(
            `<a href="../interfaces/Person.html#age" target="_self" >Person['age']</a>`
        );
    });

    describe('input signals', () => {
        it('should support input signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignal"></a>
                        <b>inputSignal</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="18" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:18</a></div>
                            </td>
                        </tr>
                <tr>
                    <td class="col-md-4">
                        <div class="io-description"><p>Input Signals</p>
</div>
                    </td>
                </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with a default value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithDefaultValue"></a>
                        <b>inputSignalWithDefaultValue</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>this.defaultValue</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="19" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:19</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals a default quoted value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithDefaultStringValue"></a>
                        <b>inputSignalWithDefaultStringValue</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="20" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:20</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with an alias', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="aliasedSignal"></a>
                        <b>aliasedSignal</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>0</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="21" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:21</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support required input signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                ` <table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="requiredInputSignal"></a>
                        <b>requiredInputSignal</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Required : </i>&nbsp;<b>true</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="23" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:23</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support required input signals with a type ', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="requiredInputSignalWithType"></a>
                        <b>requiredInputSignalWithType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>        <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number" target="_blank" >number</a></code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Required : </i>&nbsp;<b>true</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="24" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:24</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with a type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithType"></a>
                        <b>inputSignalWithType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>        <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string" target="_blank" >string</a></code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="26" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:26</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with a quoted type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithStringType"></a>
                        <b>inputSignalWithStringType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>&#x27;value&#x27;</code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="27" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:27</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with multiple types', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithMultipleTypes"></a>
                        <b>inputSignalWithMultipleTypes</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>string | number</code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>0</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="28" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:28</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support input signals with multiple types, quoted and standard', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="inputSignalWithMultipleMixedTypes"></a>
                        <b>inputSignalWithMultipleMixedTypes</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>&#x27;asc&#x27; | &#x27;dsc&#x27; | number</code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;asc&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="29" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:29</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });
    });

    describe('output signals', () => {
        it('should support output signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="outputSignal"></a>
                        <b>outputSignal</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="52" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:52</a></div>
                            </td>
                        </tr>
                <tr>
                    <td class="col-md-4">
                        <div class="io-description"><p>Output Signals</p>
</div>
                    </td>
                </tr>
            </tbody>
        </table>`
            );
        });

        it('should support output signals with a default value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<tbody>
            <tr>
                <td class="col-md-4">
                    <a name="outputSignalWithDefaultValue"></a>
                    <span class="name">
                        <span ><b>outputSignalWithDefaultValue</b></span>
                        <a href="#outputSignalWithDefaultValue"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output(this.defaultValue)</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="53" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:53</a></div>
                        </td>
                    </tr>


        </tbody>`
            );
        });

        it('should support output signals a default quoted value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="outputSignalWithDefaultStringValue"></a>
                    <span class="name">
                        <span ><b>outputSignalWithDefaultStringValue</b></span>
                        <a href="#outputSignalWithDefaultStringValue"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output(&#x27;value&#x27;)</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="54" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:54</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });

        it('should support output signals with an alias', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="aliasedSignal"></a>
                        <b>aliasedSignal</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>0</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="21" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:21</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support required output signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="requiredOutputSignal"></a>
                    <span class="name">
                        <span ><b>requiredOutputSignal</b></span>
                        <a href="#requiredOutputSignal"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output.required()</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="57" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:57</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });

        it('should support required output signals with a type ', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="requiredOutputSignalWithType"></a>
                    <span class="name">
                        <span ><b>requiredOutputSignalWithType</b></span>
                        <a href="#requiredOutputSignalWithType"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output.required&lt;number&gt;()</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="58" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:58</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });

        it('should support output signals with a type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="outputSignalWithType"></a>
                        <b>outputSignalWithType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>        <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string" target="_blank" >string</a></code>

                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="60" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:60</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support output signals with a quoted type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="outputSignalWithStringType"></a>
                    <span class="name">
                        <span ><b>outputSignalWithStringType</b></span>
                        <a href="#outputSignalWithStringType"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output&lt;&#x27;value&#x27;&gt;(&#x27;value&#x27;)</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="61" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:61</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });

        it('should support output signals with multiple types', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="outputSignalWithMultipleTypes"></a>
                        <b>outputSignalWithMultipleTypes</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>string | number</code>

                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="62" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:62</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support output signals with multiple types, quoted and standard', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                ` <table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="outputSignalWithMultipleMixedTypes"></a>
                    <span class="name">
                        <span ><b>outputSignalWithMultipleMixedTypes</b></span>
                        <a href="#outputSignalWithMultipleMixedTypes"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>output&lt;&#x27;asc&#x27; | &#x27;dsc&#x27; | number&gt;(&#x27;asc&#x27;)</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="63" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:63</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });
    });

    describe('model signals', () => {
        it('should support model signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignal"></a>
                        <b>modelSignal</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="35" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:35</a></div>
                            </td>
                        </tr>
                <tr>
                    <td class="col-md-4">
                        <div class="io-description"><p>Model Signals</p>
</div>
                    </td>
                </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with a default value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignalWithDefaultValue"></a>
                        <b>modelSignalWithDefaultValue</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>this.defaultValue</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="36" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:36</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals a default quoted value', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignalWithDefaultStringValue"></a>
                        <b>modelSignalWithDefaultStringValue</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="37" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:37</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with an alias', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="aliasedSignal"></a>
                        <b>aliasedSignal</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>0</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="21" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:21</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support required model signals', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="requiredModelSignal"></a>
                        <b>requiredModelSignal</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Required : </i>&nbsp;<b>true</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="40" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:40</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support required model signals with a type ', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="requiredModelSignalWithType"></a>
                        <b>requiredModelSignalWithType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>        <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number" target="_blank" >number</a></code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Required : </i>&nbsp;<b>true</b>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="41" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:41</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with a type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignalWithType"></a>
                        <b>modelSignalWithType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>        <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string" target="_blank" >string</a></code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="43" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:43</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with a quoted type', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignalWithStringType"></a>
                        <b>modelSignalWithStringType</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>&#x27;value&#x27;</code>

                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>&#x27;value&#x27;</code>
                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="44" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:44</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with multiple types', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
            <tbody>
                <tr>
                    <td class="col-md-4">
                        <a name="modelSignalWithMultipleTypes"></a>
                        <b>modelSignalWithMultipleTypes</b>
                    </td>
                </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Type : </i>    <code>string | number</code>

                    </td>
                </tr>
                        <tr>
                            <td class="col-md-2" colspan="2">
                                    <div class="io-line">Defined in <a href="" data-line="45" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:45</a></div>
                            </td>
                        </tr>
            </tbody>
        </table>`
            );
        });

        it('should support model signals with multiple types, quoted and standard', () => {
            const file = read(distFolder + '/components/CompodocComponent.html');

            expect(file).to.contain(
                `<table class="table table-sm table-bordered">
        <tbody>
            <tr>
                <td class="col-md-4">
                    <a name="modelSignalWithMultipleMixedTypes"></a>
                    <span class="name">
                        <span ><b>modelSignalWithMultipleMixedTypes</b></span>
                        <a href="#modelSignalWithMultipleMixedTypes"><span class="icon ion-ios-link"></span></a>
                    </span>
                </td>
            </tr>
                <tr>
                    <td class="col-md-4">
                        <i>Default value : </i><code>model&lt;&#x27;asc&#x27; | &#x27;dsc&#x27; | number&gt;(&#x27;asc&#x27;)</code>
                    </td>
                </tr>
                    <tr>
                        <td class="col-md-4">
                                <div class="io-line">Defined in <a href="" data-line="46" class="link-to-prism">src/app/about/compodoc/compodoc.component.ts:46</a></div>
                        </td>
                    </tr>


        </tbody>
    </table>`
            );
        });
    });
});
