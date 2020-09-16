from flask import Flask, jsonify
import pymongo

# Flask setup
app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and collection
db = client.animal_visual_db
collection = db.vba_fauna


@app.route("/api/v1.0/vbafauna")
def vbafauna():
    # Convert all items in the collection to a list
    species = list(collection.find())

    # Convert mongo record id object to string
    for record in species:
        record["_id"] = str(record["_id"])
    
    # Return the json representation of the dictionary
    return jsonify(species)

if __name__ == "__main__":
    app.run(debug=True)