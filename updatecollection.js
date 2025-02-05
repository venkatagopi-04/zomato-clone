const { MongoClient } = require("mongodb");

// MongoDB Connection URI
const uri = "mongodb+srv://venkatagopi198:Gopi198@cluster0.0olqa.mongodb.net/zomato-clone?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function updateDocuments() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");

        const database = client.db("zomato-clone");
        const collection = database.collection("file2");

        // Fetch all documents
        const documents = await collection.find({}).toArray();
        let updatedCount = 0;

        for (let doc of documents) {
            if (doc.restaurants) {
                let modified = false;

                for (let key in doc.restaurants) {
                    let restaurant = doc.restaurants[key].restaurant;
                    if (restaurant && restaurant.location) {
                        const { latitude, longitude } = restaurant.location;

                        // Ensure geoLocation is added
                        if (latitude && longitude) {
                            restaurant.geoLocation = {
                                type: "Point",
                                coordinates: [parseFloat(longitude), parseFloat(latitude)]
                            };
                            modified = true;
                        }
                    }
                }

                // Update document in DB if modified
                if (modified) {
                    await collection.updateOne({ _id: doc._id }, { $set: { restaurants: doc.restaurants } });
                    updatedCount++;
                }
            }
        }

        console.log(`✅ Successfully updated ${updatedCount} documents.`);
    } catch (error) {
        console.error("❌ Error updating documents:", error);
    } finally {
        await client.close();
        console.log("🔌 Disconnected from MongoDB.");
    }
}

// Run the update function
updateDocuments();
