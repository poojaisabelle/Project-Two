# Import dependencies
import pandas as pd
import numpy as np
import pymongo
import datetime as dt
from datetime import datetime
import os


# ## Extract Victorian Biodiversity Atlas (VBA) fauna data
# Read just the column names in fauna data csv
col_names = pd.read_csv("data/VBA_2015_2020.csv", nrows = 0).columns

# Set data types for columns with data types other than strings
dtypes_dict = {
    "TOTALCOUNT": int,
    "START_YEAR": int,
    "START_MTH": int,
    "END_YEAR": int,
    "END_MTH": int,
    "LONG_DD94": float,
    "LAT_DD94": float
}

# Read in vic fauna csv from 2015 to 2020
fauna_data = pd.read_csv(
    "data/VBA_2015_2020.csv",
    parse_dates = ["STARTDATE", "ENDDATE"],
    dtype = {col: str for col in col_names if col not in dtypes_dict})


# ## Transform VBA fauna data

# Column Renaming
fauna_df = fauna_data.rename(columns={
    "RECORD_ID": "record_id",
    "SITE_ID": "site_id",
    "SURVEY_ID": "survey_id",
    "PROJECT_ID": "project_id",
    "TAXON_ID": "taxon_id",
    "SCI_NAME": "sci_name",
    "COMM_NAME": "comm_name",
    "RECORDTYPE": "recordtype",
    "RELIABILTY": "reliability",
    "TOTALCOUNT": "totalcount",
    "STARTDATE": "start_date",
    "START_YEAR": "start_year",
    "START_MTH": "start_mth",
    "ENDDATE": "end_date",
    "END_YEAR": "end_year",
    "END_MTH": "end_mth",
    "LOCN_DESC": "location_desc",
    "TAXON_TYPE": "taxon_type",
    "LONG_DD94": "long",
    "LAT_DD94": "lat"})


# Reorder the columns
fauna_df = fauna_df[["record_id", "survey_id", "site_id", "project_id", "taxon_id", "taxon_type"
                     ,"comm_name", "sci_name", "totalcount", "location_desc", "long", "lat"
                     ,"end_year", "end_mth", "end_date", "start_year", "start_mth", "start_date"
                     ,"recordtype", "reliability"]]


# ## Filter VBA fauna data against scraped data

# Import the webscraped animal data
scraped_df = pd.read_csv("data/animal_image_to_merge.csv", dtype="str")

# Extract list of unique animals of interest
species = scraped_df["animal_name"].unique().tolist()

# Filter the fauna data with the species of interest
short_fauna_df = fauna_df[fauna_df["comm_name"].isin(species)]


# Filter out the records with total count of 0 and remove end_year, end_date, end_mth, start_year, start_mth columns
final_fauna_df = short_fauna_df[short_fauna_df.totalcount > 0].drop([
    'site_id', 'project_id', 'location_desc', 'end_year', 'end_mth',
    'end_date', 'start_year', 'start_mth', 'recordtype', 'reliability'], axis = 1)

# Sort the fauna dataframe by comm_name and start_date
final_fauna_df.sort_values(by=["comm_name", "start_date"], inplace=True)

# Add a new column month_year for aggregation purpose
final_fauna_df["year_month"] = final_fauna_df["start_date"].dt.strftime('%Y-%m')


# ## Filter webscraped animal image data against VBA fauna data 

final_animal_list = final_fauna_df["comm_name"].unique().tolist()

# Filter the webscraped data to have only the above animals
final_scraped_df = scraped_df[scraped_df["animal_name"].isin(final_animal_list)].copy()

# Fill the NaN values with None values for the json-converted file to work
final_scraped_df = final_scraped_df.where(final_scraped_df.notnull(), None)


# ## Load

# Initialize PyMongo to work with MongoDBs
# conn = 'mongodb://localhost:27017'

conn = os.environ.get('DATABASE_URL', '') or 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# Define database and collections
db = client.animal_visual_db
vba_fauna = db.vba_fauna
scraped_fauna = db.scraped_fauna

# Drops collections if available to remove duplicates
vba_fauna.drop()
scraped_fauna.drop()

# Load vba fauna data into the vba_fauna collection
vba_fauna.insert_many(final_fauna_df.to_dict('records'))

# Load scraped fauna image and info into the scraped_fauna collection
scraped_fauna.insert_many(final_scraped_df.to_dict('records'))