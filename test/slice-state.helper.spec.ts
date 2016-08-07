declare let expect;

import 'es6-shim';
import * as sinon from 'sinon';
import expect = require('must');
import { setSliceState } from '../src/slice-state.helper';

describe('slice state helper', function() {

    it('must add initial state information to a class', function() {
        class Component { initialState }
        setSliceState({count: 1}, Component);
        expect(Component.prototype.initialState.default).to.eql({ count: 1 });
    });

    it('must add initial state information to a method', function() {
        class Component {
            method() { }
            initialState
        }
        setSliceState({ count: 1 }, Component, 'method');
        const instance = new Component();
        expect(instance.initialState.method).to.eql({ count: 1 });
    });

    it('must support both class and method slice', function() {
        class Component {
            method1() { }
            method2() { }
            initialState
        }
        setSliceState({ count: 0 }, Component);
        setSliceState({ count1: 1 }, Component, 'method1');
        const instance = new Component();
        expect(Component.prototype.initialState.default).to.eql({ count: 0 });
        expect(instance.initialState.method1).to.eql({ count1: 1 });
        expect(instance.initialState.default).to.eql({ count: 0 });
    });

});
