# Import necessary libraries
from flask import Flask, jsonify, render_template
import pymongo
import os

# Create instance of Flask app
app = Flask(__name__)


# setup mongo connection
conn = os.environ.get('DATABASE_URL', '') or 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# connect to mongo db and collections
db = client.animal_visual_db
vba_fauna = db.vba_fauna
scraped_fauna = db.scraped_fauna


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


# Add api route to get VBA fauna json
@app.route("/api/v1.0/vbafauna")
def vbafauna():
    # Convert all documents in the vba_fauna collection to a list
    records = list(vba_fauna.find())

    # Convert mongo id object to string
    for record in records:
        record["_id"] = str(record["_id"])
    
    # Return the json representation of the records
    return jsonify(records)


# Add api route to get the scraped fauna json
@app.route("/api/v1.0/scrapedfauna")
def scrapedfauna():
    # Convert all documents in the scraped_fauna collection to a list
    species = list(scraped_fauna.find())

    # Convert mongo id object to string
    for specie in species:
        specie["_id"] = str(specie["_id"])
    
    # Return the json representation of the species
    return jsonify(species)


# Add api route to remove unnecessary fields for displaying table
@app.route("/api/v1.0/table")
def table():

		data_table = list(vba_fauna.aggregate([{ "$unset": ["_id"] }]))
		return jsonify(data_table)


# Add api route to get the vba fauna data aggregated by animal names
@app.route("/api/v1.0/aggregation")
def aggregation():
		# Aggregate total sightings by each animal (represented in common names, science names, taxon ids and taxon types) over 5 years
		metadata = list(
			vba_fauna.aggregate(
				[
					{
						"$group" : {
							"_id" :"$comm_name",
							"scientific_name": { "$first": "$sci_name" },
							"taxon_id": { "$first": "$taxon_id" },
							"taxon_type": { "$first": "$taxon_type" },
							"total_sightings": { "$sum": "$totalcount" },
						}
					}
				])
			)

		# Aggregate records by animal name
		records_by_animal = list(
			vba_fauna.aggregate(
				[
					{
						"$group" : {
							"_id" : "$comm_name",
							"record_id": { "$push": "$record_id" },
							"survey_id": { "$push": "$survey_id" },
							"number_sightings": { "$push": "$totalcount" },
							"long": { "$push": "$long" },
							"lat": { "$push": "$lat" },
							"start_date": { "$push": "$start_date" }
						}
					}
				])
			)

		# Aggregrate total sightings by animal by month
		sightings_by_month = list(
			vba_fauna.aggregate([
				{
						"$group": {
								"_id": {
										"animal_name": "$comm_name",
										"year_month": "$year_month"
								},
								"total_sightings": { "$sum": "$totalcount" }
						}
				}
			]))

		# Add an aggregation dictionary
		aggregation_dict = {
			"metadata": metadata,
			"records": records_by_animal,
			"sightings_by_month": sightings_by_month
		}

		return jsonify(aggregation_dict)


if __name__ == "__main__":
    app.run(debug=True)