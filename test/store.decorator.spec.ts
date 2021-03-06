declare let expect;

import 'es6-shim';
import expect = require('must');
import {getStore, Store} from '../src/store.decorator';
import {updateStateProperties} from '../src/store.decorator/general.binding';
import {setInitialState} from '../src/reducer.decorator';

describe('@Store', function() {

    it('must allow multiple state properties to be bound with @State', function() {

        @Store('one', 'two', 'three')
        class StoreComponent {stateProperties}
        expect(StoreComponent.prototype.stateProperties).to.contain('one');
        expect(StoreComponent.prototype.stateProperties).to.contain('two');
        expect(StoreComponent.prototype.stateProperties).to.contain('three');

    });

    it('must update local properties to match state', function() {

        let state = {one: 1, two: 2, three: 3};
        @Store('one', 'two', 'three')
        class StoreComponent {one; two; three;}
        updateStateProperties(StoreComponent.prototype, state)
        expect(StoreComponent.prototype.one).to.equal(state.one);
        expect(StoreComponent.prototype.two).to.equal(state.two);
        expect(StoreComponent.prototype.three).to.equal(state.three);

    });

});
