
const mongoose = require('mongoose')

const liikuntapaikkaSchema = new mongoose.Schema({
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
    sportsPlaceId: { type: Number, required: true, unique: true }
})


liikuntapaikkaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        returnedObject.location.geometries.features.forEach(each => delete each._id)
    }
})

module.exports = mongoose.model('Liikuntapaikka', liikuntapaikkaSchema)