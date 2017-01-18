export class StationsModel {

    constructor(){

    }

    public stationsList: Array<string> = [
    'Miami Airport',
    'Hialeah Market',
    'Metrorail Transfer',
    'Opa-Locka',
    'Golden Glades',
    'Hollywood Street',
    'Sheridan Street',
    'Ft. Lauderdale Airport',
    'Ft. Lauderdale',
    'Cypress Creek',
    'Pompano Beach',
    'Deerfield Beach',
    'Boca Raton',
    'Delray Beach',
    'Boynton Beach',
    'Lake Worth',
    'West Palm Beach',   
    'Mangonia Park'
    ];

    public stationsIndex: any = {
        'Miami Airport': 0,
        'Hialeah Market': 1,
        'Metrorail Transfer': 2,
        'Opa-Locka': 3,
        'Golden Glades': 4,
        'Hollywood Street': 5,
        'Sheridan Street': 6,
        'Ft. Lauderdale Airport': 7,
        'Ft. Lauderdale': 8,
        'Cypress Creek': 9,
        'Pompano Beach': 10,
        'Deerfield Beach': 11,
        'Boca Raton': 12,
        'Delray Beach': 13,
        'Boynton Beach': 14,
        'Lake Worth': 15,
        'West Palm Beach': 16,   
        'Mangonia Park': 17
    }

    // [lat, lon]
    public stationsCoordinates: Array<{lat: number, lng: number}> = [ 
    {lat: 25.795941, lng: -80.258335}, // 0 Miami Airport
    {lat: 25.811239, lng: -80.258703}, // 1 Hialeah Market
    {lat: 25.846394, lng: -80.25961699999999}, // 2 Metrorail Transfer
    {lat: 25.900036, lng: -80.25269399999999}, // 3 Opa-Locka
    {lat: 25.92155, lng: -80.216917}, // 4 Golden Glades
    {lat: 26.01174, lng: -80.167833}, // 5 Hollywood Street
    {lat: 26.032217, lng: -80.168086}, // 6 'Sheridan Street',
    {lat: 26.061653, lng: -80.165683}, // 7 'Ft. Lauderdale Airport',
    {lat: 26.119942, lng: -80.169808}, // 8 'Ft. Lauderdale',
    {lat: 26.201194, lng: -80.150369}, // 9 'Cypress Creek',
    {lat: 26.272286, lng: -80.13481399999999}, // 10 'Pompano Beach',
    {lat: 26.316863, lng: -80.122553}, // 11 'Deerfield Beach',
    {lat: 26.3927, lng: -80.09903299999999}, // 12 'Boca Raton',
    {lat: 26.454242, lng: -80.09096699999999}, // 13 'Delray Beach',
    {lat: 26.553783, lng: -80.07059699999999}, // 14 'Boynton Beach',
    {lat: 26.616142, lng: -80.069133}, // 15 'Lake Worth',
    {lat: 26.713299, lng: -80.062539}, // 16 'West Palm Beach',
    {lat: 26.758744, lng: -80.076933}, // 17 'Mangonia Park' 
    ];

}
