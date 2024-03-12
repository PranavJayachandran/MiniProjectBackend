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
module.exports = { addSprinklers }