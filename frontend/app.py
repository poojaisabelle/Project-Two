# Import necessary libraries
from flask import Flask, jsonify, render_template
import pymongo

# Create instance of Flask app
app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and collections
db = client.animal_visual_db
vba_fauna = db.vba_fauna


# Create route that renders index.html template
@app.route("/")
def index():
    return render_template("index.html")

# Create route that renders dashboard.html template
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# Create route that renders datapage.html template
@app.route("/data")
def datapage():
    return render_template("datapage.html")

# Add api route to get vba fauna json
@app.route("/api/v1.0/vbafauna")
def vbafauna():
    # Convert all items in the vba_fauna collection to a list
    species = list(vba_fauna.find())

    # Convert mongo id object to string
    for record in species:
        record["_id"] = str(record["_id"])
    
    # Return the json representation of the species
    return jsonify(species)

if __name__ == "__main__":
    app.run(debug=True)