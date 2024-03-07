const { Sprinkler } = require("../db/model");
const addSprinklers = async (layout) => {
    let sprinklers = [];
    await Promise.all(layout.map(async (item) => {
        let temp = [];
        for (let i = 0; i < item; i++) {
            temp.push(await addSprinkler());
        }
        sprinklers.push(temp);
    }));
    return sprinklers;
}

const addSprinkler = async () => {
    let farm = await Sprinkler.collection.insertOne({ sprinklerName: "", cropType: "", ifOn: false });
    return farm.insertedId.toString();

}
module.exports = { addSprinklers }