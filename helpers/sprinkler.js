const { Sprinkler } = require("../db/model");
const addSprinklers = async (layout, userId) => {
    console.log("Ome", userId);
    let sprinklers = [];
    await Promise.all(layout.map(async (item) => {
        let temp = [];
        for (let i = 0; i < item; i++) {
            temp.push(await addSprinkler(userId));
        }
        sprinklers.push(temp);
    }));
    return sprinklers;
}

const addSprinkler = async (userId) => {
    console.log("Two", userId);

    let farm = await Sprinkler.collection.insertOne({ sprinklerName: "", cropType: "", ifOn: false, userId: userId });
    return farm.insertedId.toString();

}
const MapWeatherToWeatherCondition = (weather) => {
    let weather_id = weather
    if (weather_id >= 200 && weather_id <= 232)
        return 3
    else if (weather_id >= 300 && weather_id <= 321)
        return 4
    else if (weather_id >= 500 && weather_id <= 531)
        return 4
    else if (weather_id == 800)
        return 2
    else (weather_id >= 801 && weather_id <= 804)
    return 4
}
const mapCropType = (cropType) => {
    console.log(cropType);
    if (cropType == "Cabbage")
        return 1;
    if (cropType == "Melon")
        return 2;
    if (cropType == "Bean")
        return 3;
    if (cropType == "Tomato")
        return 4;
    else 
        return 5;
}
const mapRegionType = (region) => {
    if (region == "Humid")
        return 1;
    if (region == "Semi Humid")
        return 2;
    if (region == "Semi Arid")
        return 3;
    if (region == "Desert")
        return 4;
}
const mapSoilType = (soilType) => {
    if (soilType == "Wet")
        return 1;
    if (soilType == "Humid")
        return 2;
    if (soilType == "Dry")
        return 3;
}
const mapTemperature = (temperature) => {
    if (temperature >= 40)
        return 4;
    else if (temperature >= 30)
        return 3;
    else if (temperature >= 20)
        return 2;
    else if (temperature >= 10)
        return 1;
}
const amountToTime=(water)=>{
    return (water/30)*1000;
}
module.exports = {mapTemperature, addSprinklers, mapSoilType, mapRegionType, MapWeatherToWeatherCondition, mapCropType,amountToTime }