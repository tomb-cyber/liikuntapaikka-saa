const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://liikuntaDBUser:${password}@liikunta.y69b6.mongodb.net/liikuntapaikat?retryWrites=true&w=majority`

mongoose.connect(url)

const liikuntaPaikkaSchema = new mongoose.Schema({
    location: {
        geometries: {
            type: { type: String, default: 'FeatureCollection' },
            features: [
                {
                    type: { type: String, default: 'Feature' },
                    geometry: {
                        type: { type: String },
                        coordinates: []
                    },
                    properties: {
                        pointId: Number,

                        areaId: Number,
                        areaName: String,
                        areaSegmentId: Number,
                        areaSegmentName: String,

                        routeCollectionId: Number,
                        routeCollectionName: String,
                        routeId: Number,
                        routeName: String,
                        routeSegmentId: Number,
                        routeSegmentName: String
                    }
                }
            ]
        }
    },
    name: { type: String, required: true },
    sportsPlaceId: { type: Number, required: true }
})

const LiikuntaPaikka = mongoose.model('LiikuntaPaikka', liikuntaPaikkaSchema)


const liikuntaPaikka = new LiikuntaPaikka({
    location: {
        geometries: {
            //type: 'FeatureCollection',
            features: [
                {
                    //type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            24.7051081551397,
                            62.2613211721703
                        ]
                    }
                }
            ]
        }
    },
    name: 'Keuruun Koulukeskuksen lähiliikunta-alue /ala-aste',
    sportsPlaceId: 72269

})


const liikuntaPaikka2 = new LiikuntaPaikka({
    location: {
        geometries: {
            //type: 'FeatureCollection',
            features: [
                {
                    //type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                25.7002433004755,
                                62.2442666548058
                            ],
                            [
                                25.7031923187176,
                                62.2448524226203
                            ],
                            [
                                25.7048284052874,
                                62.2447889125564
                            ],
                            [
                                25.7051661996642,
                                62.2461054396293
                            ],
                            [
                                25.7046200022112,
                                62.247019697403
                            ],
                            [
                                25.704010451706,
                                62.2478546825675
                            ],
                            [
                                25.7034870789996,
                                62.2484801082897
                            ],
                            [
                                25.7029863779967,
                                62.2492946397322
                            ],
                            [
                                25.7021794202193,
                                62.2500702103621
                            ],
                            [
                                25.7003336311925,
                                62.2497640074625
                            ],
                            [
                                25.6971036152245,
                                62.2541203976843
                            ],
                            [
                                25.6986072157502,
                                62.2545285230708
                            ],
                            [
                                25.6977080285504,
                                62.255780938814
                            ],
                            [
                                25.6968662536298,
                                62.2570076065281
                            ],
                            [
                                25.6963839000982,
                                62.2577385728462
                            ],
                            [
                                25.6991403935837,
                                62.2578432390905
                            ],
                            [
                                25.7004899252122,
                                62.2579084051778
                            ],
                            [
                                25.7007874249452,
                                62.2591395992026
                            ],
                            [
                                25.7018639613559,
                                62.2600226732435
                            ],
                            [
                                25.7026716378431,
                                62.2608970509775
                            ],
                            [
                                25.7025034898274,
                                62.2622606248271
                            ],
                            [
                                25.702071854,
                                62.2643587544424
                            ],
                            [
                                25.7010975290828,
                                62.265697677169
                            ],
                            [
                                25.7005446085523,
                                62.266519651282
                            ],
                            [
                                25.6995936009336,
                                62.2669360471283
                            ],
                            [
                                25.6973679511802,
                                62.2675718710786
                            ],
                            [
                                25.696453980607,
                                62.2678522423207
                            ],
                            [
                                25.6953214345375,
                                62.2679729389089
                            ],
                            [
                                25.6940853088326,
                                62.2678825108616
                            ],
                            [
                                25.6935855967604,
                                62.2682147088811
                            ],
                            [
                                25.693773589773,
                                62.2690096994168
                            ],
                            [
                                25.6941786208927,
                                62.2699096694632
                            ],
                            [
                                25.6942305310061,
                                62.2704277181984
                            ],
                            [
                                25.6933095774161,
                                62.2711786805026
                            ],
                            [
                                25.692419652832,
                                62.2728946969789
                            ],
                            [
                                25.6918761634142,
                                62.273191667969
                            ],
                            [
                                25.691679568686,
                                62.2731135629844
                            ],
                            [
                                25.6891890500624,
                                62.2726261813324
                            ],
                            [
                                25.6863578726043,
                                62.2730537115393
                            ],
                            [
                                25.683835166397,
                                62.2734836306635
                            ],
                            [
                                25.6819156519173,
                                62.2732165407659
                            ],
                            [
                                25.6799260129433,
                                62.2727509477532
                            ],
                            [
                                25.677542487324,
                                62.2725161057383
                            ],
                            [
                                25.6752110051216,
                                62.2719037793968
                            ],
                            [
                                25.6775749196773,
                                62.2694215707018
                            ],
                            [
                                25.6749556469768,
                                62.266054026841
                            ],
                            [
                                25.6527254663851,
                                62.2675124751036
                            ]
                        ]
                    },
                    properties: {
                        areaId: 1348,
                        areaName: 'area_1',
                        areaSegmentId: 511079,
                        areaSegmentName: 'segment_0'
                    }
                }
            ]
        }
    },
    name: 'Laajavuoren ulkoilualue',
    sportsPlaceId: 72348

})


LiikuntaPaikka.collection.insertMany([liikuntaPaikka, liikuntaPaikka2]).then(() => {
    console.log('liikuntapaikka saved!')
    mongoose.connection.close()
})

// liikuntaPaikka2.save().then(() => {
//     console.log('liikuntapaikka saved!')
//     mongoose.connection.close()
// })
