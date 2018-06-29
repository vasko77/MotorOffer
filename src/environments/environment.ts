// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,

  urlGetListItems: 'http://eh017ins74/MotorApiNoauth/api/Motor/GetListItems',
  urlGetPackageCovers: 'http://eh017ins74/MotorApiNoauth/api/Motor/GetPackageCovers',
  urlFastQuotation: 'http://eh017ins74/MotorApiNoauth/api/Motor/FastQuotation',
  urlApplication: 'http://eh017ins74/MotorApiNoauth/api/Motor/SaveProposal',

  urlMvpQuotation: 'http://eh017ins74/MvpApiAgent/quotation/',
  urlMvpContact: 'http://eh017ins74/MvpApiAgent/contact/',
  urlAuthentication: 'http://eh017ins74/MvpApiAgent/authentication',
  urlMvpNotification: 'http://eh017ins74/MvpApi/notifications'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
