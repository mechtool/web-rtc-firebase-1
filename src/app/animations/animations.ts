import {trigger, animate, style, state, group, query, stagger, transition, animateChild} from '@angular/animations';

export const notificationAppearance = trigger('notificationAppearance', [
    transition('* <=> *', [ // each time the binding value changes
	query(':leave', [
		animate(300, style({ opacity : 0,  transform : 'translateX(-100%)' }))
	],  { optional: true }),
	query(':enter', [
	    style({ opacity : 0, transform: 'translateX(100%)'}),
		animate(300, style({opacity : 1, transform : 'translateX(0)' }))
	],  { optional: true })
    ])
])  ;
export const slideAnimation = trigger('slideAnimation', [
    transition('void <=> *', []),
    transition('* <=> *', [
	query(':enter, :leave', style({ position: "absolute", width:'100%'})
	    , { optional: true }),
	group([  // block executes in parallel
	    query(':enter', [
		style({ transform: 'translateX(100%)' }),
		animate('400ms ease-in-out', style({ transform: 'translateX(0%)' }))
	    ], { optional: true }),
	    query(':leave', [
		style({ transform: 'translateX(0%)' }),
		animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' }))
	    ], { optional: true })
	])
    ])
])

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
	query(':enter', [
		style({ opacity: 0 })
	    ], { optional: true }
	),
	group([
	    query(':leave', [
		    animate(700, style({ opacity: 0 }))
		],
		{ optional: true }
	    ),
	    query(':enter', [
		    style({ opacity: 0 }),
		    animate(700, style({ opacity: 1 }))
		],
		{ optional: true }
	    )
	])
    ])
])

