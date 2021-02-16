import { trigger, animate, transition, style, query } from '@angular/animations';

// fadeAnimation: credit to https://coryrylan.com
export const fadeAnimation = trigger('fadeAnimation', [
  // The '* => *' will trigger the animation to change between any two states
  transition('* => *', [
    // The query function has three params.
    // First is the event, so this will apply on entering or when the element is added to the DOM.
    // Second is a list of styles or animations to apply.
    // Third we add a config object with optional set to true, this is to signal
    // angular that the animation may not apply as it may or may not be in the DOM.
    query(
      ':enter', [style({ opacity: 0 })], { optional: true }
    ),
    query(
      ':leave', [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))], { optional: true }
    ),
    query(
      ':enter', [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))], { optional: true }
    )
  ])
]);