declare let expect;

import 'es6-shim';
import expect = require('must');
import {Slice} from '../src/slice.decorator';

describe('@Slice', function() {

    it('must add slice information to a class', function() {
        @Slice('class-slice')
        class Component {stateSliceAffected}
        expect(Component.prototype.stateSliceAffected.default).to.equal('class-slice');
    });

    it('must add slice information to a method', function() {
        class Component {
            @Slice('method-slice')
            method() {}
            stateSliceAffected
        }
        const instance = new Component();
        expect(instance.stateSliceAffected.method).to.equal('method-slice');
    });

    it('must support both class and method slice', function() {
        @Slice('class-slice')
        class Component {
            @Slice('method-slice')
            method1() {}
            method2() {}
            stateSliceAffected
        }
        const instance = new Component();
        expect(Component.prototype.stateSliceAffected.default).to.equal('class-slice');
        expect(instance.stateSliceAffected.method1).to.equal('method-slice');
        expect(instance.stateSliceAffected.default).to.equal('class-slice');
    });

    it('must allow an initial value to be passed as the 2nd argument (class)', () => {

        @Slice('default', 0)
        class Component {
            stateSliceAffected
            getInitialState
        }
        expect(Component.prototype.stateSliceAffected.default).to.equal('default');
        expect(Component.prototype.getInitialState('default')).to.equal(0);

    });

    it('must allow an initial value to be passed as the 2nd argument (method)', () => {

        class Component {
            @Slice('default', 0)
            method() {}
            getInitialState
            stateSliceAffected
        }
        expect(Component.prototype.stateSliceAffected['method']).to.equal('default');
        expect(Component.prototype.getInitialState('method')).to.equal(0);

    });

});
