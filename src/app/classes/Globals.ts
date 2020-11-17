import {inject, InjectionToken} from '@angular/core';
import {DOCUMENT} from '@angular/common';

export const WINDOW = new InjectionToken<Window>(
    'An abstraction over global window object',
    {
	factory: () => {
	    const {defaultView} = inject(DOCUMENT);
	    if (!defaultView) {
		throw new Error('Window is not available');
	    }
	    
	    return defaultView;
	},
    },
);
export const LOCATION = new InjectionToken<Location>(
    'An abstraction over window.location object',
    {
	factory: () => inject(WINDOW).location,
    },
);
export const NAVIGATOR = new InjectionToken<Navigator>(
    'An abstraction over window.navigator object',
    {
	factory: () => inject(WINDOW).navigator,
    },
);
export const LOCAL_STORAGE = new InjectionToken<Storage>(
    'An abstraction over window.localStorage object',
    {
	factory: () => inject(WINDOW).localStorage,
    },
);


