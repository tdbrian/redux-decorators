import {createStore, Store} from 'redux';
import {getReducer} from './../reducer.decorator';

let appStore: Store<any>;

declare let window;
const ENVIRONMENT = typeof window !== 'undefined' ? window || this : null;

export function getStore(): Promise<Store<any>>  {
    return new Promise((resolve, reject) => {
        if(appStore) {
            resolve(appStore);
        } else {
            var interval = setInterval(() => {
                if (getReducer()) {
                    clearInterval(interval);
                    appStore = createStore(getReducer(), ENVIRONMENT && ENVIRONMENT.devToolsExtension && ENVIRONMENT.devToolsExtension());
                    resolve(appStore);
                } else {
                    reject("There is no reducer setup to create a new store with");
                }
            });
        }
    });
}

export function updateStateProperties(target: any, state: any, properties: string = 'stateProperties'): void {
    target[properties].forEach(prop => {
        target[prop] = state[prop];
    });
}

export function generalBinding(target: any, stateProperties?: string[]): any {

    // Add stateProperties to the target
    if (target.prototype.stateProperties === undefined) {
        target.prototype.stateProperties = [];
    }
    target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);

    // Add a dispatch method to the target
    target.prototype.dispatch = function(action, ...data) {
        this.getStore
            .then(store => store.dispatch({type: action, data: data}))
            .catch(err => console.error("Unable to dispatch messsage without a Redux store. Please ensure there is a root reducer."));
    };

    // Add a generic store update handler
    target.prototype.storeUpdateHandler = function() {
        updateStateProperties(this, this.appStore.getState());
    };

    // Add a generic storeInit method
    target.prototype.storeInit = function() {
        return this.getStore().then(() => {
            this.unsubscribe = this.appStore.subscribe(this.storeUpdateHandler.bind(this));
            // Apply the default state to all listeners
            this.storeUpdateHandler();
        }).catch(() => console.error("Unable to initialize store without a root reducer."));
    }

    // Add a generic storeDestroy method
    target.prototype.storeDestroy = function() {
        this.unsubscribe();
    };

    // Add a get store method
    target.prototype.getStore = function(): Promise<Store<any>> {
        return getStore()
            .catch(err => console.error("Unable to dispatch messsage without a Redux store. Please ensure there is a root reducer."));;
    };

    // Add a set store method for testing purposes
    target.prototype.setStore = function(store) {
        this.appStore = store;
    };

    return target;
}
