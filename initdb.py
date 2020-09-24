#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Import dependencies
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pymongo
import datetime as dt
from datetime import datetime


# ## Extract Victorian Biodiversity Atlas (VBA) fauna data

# In[2]:


# Read just the column names in fauna data csv
col_names = pd.read_csv("../data/VBA_2015_2020.csv", nrows = 0).columns
col_names


# In[3]:


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


# In[4]:


# Read in vic fauna csv from 2015 to 2020
fauna_data = pd.read_csv(
    "../data/VBA_2015_2020.csv",
    parse_dates = ["STARTDATE", "ENDDATE"],
    dtype = {col: str for col in col_names if col not in dtypes_dict})
fauna_data.head()


# ## Transform VBA fauna data

# In[5]:


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


# In[6]:


# Test record_id uniqueness
fauna_df.record_id.is_unique


# In[7]:


print(f"Number of unique record ids: {fauna_df.record_id.nunique()}")


# In[8]:


# Test survey_id uniqueness
fauna_df.survey_id.is_unique


# In[9]:


print(f"Number of unique survey ids: {fauna_df.survey_id.nunique()}")


# In[10]:


# Test site_id uniqueness
fauna_df.site_id.is_unique


# In[11]:


print(f"Number of unique site ids: {fauna_df.site_id.nunique()}")


# In[12]:


# Test project_id uniqueness
fauna_df.project_id.is_unique


# In[13]:


print(f"Number of unique project ids: {fauna_df.project_id.nunique()}")


# In[14]:


# Test taxon_id uniqueness
fauna_df.taxon_id.is_unique


# In[15]:


print(f"Number of unique taxon ids: {fauna_df.taxon_id.nunique()}")


# In[16]:


print(f"Number of unique taxon types: {fauna_df.taxon_type.nunique()}")


# In[17]:


# Reorder the columns
fauna_df = fauna_df[["record_id", "survey_id", "site_id", "project_id", "taxon_id", "taxon_type"
                     ,"comm_name", "sci_name", "totalcount", "location_desc", "long", "lat"
                     ,"end_year", "end_mth", "end_date", "start_year", "start_mth", "start_date"
                     ,"recordtype", "reliability"]]
fauna_df.head()


# In[18]:


# Overview of the fauna data
fauna_df.info()


# In[19]:


# We can see that the TOTALCOUNT of some records is 0. Let's have an overview of them
zero_totalcount = fauna_df[fauna_df["totalcount"] == 0]
zero_totalcount.head(10)


# In[20]:


# Percentage of number of rows with totalcount equal to 0 against total number of rows of the dataframe
(zero_totalcount.shape[0]/fauna_df.shape[0])*100


# ## Filter VBA fauna data against scraped data

# In[21]:


# Import the webscraped animal data
scraped_df = pd.read_csv("../data/animal_image_to_merge.csv", dtype="str")
scraped_df.head()


# In[22]:


# Extract list of unique animals of interest
species = scraped_df["animal_name"].unique().tolist()


# In[23]:


# Filter the fauna data with the species of interest
short_fauna_df = fauna_df[fauna_df["comm_name"].isin(species)]
short_fauna_df.head()


# In[24]:


# Overview of the fauna data after filtering
short_fauna_df.info()


# In[25]:


# Check for any extreme values
print(f"Maximum total count is: {short_fauna_df.totalcount.max()}")
print(f"Minimum total count is: {short_fauna_df.totalcount.min()}")
print(f"Maximum longitude is: {short_fauna_df.long.max()}")
print(f"Minimum longitude is: {short_fauna_df.long.min()}")
print(f"Maximum latitude is: {short_fauna_df.lat.max()}")
print(f"Minimum latitude is: {short_fauna_df.lat.min()}")
print(f"Maximum end year is: {short_fauna_df.end_year.max()}")
print(f"Minimum end year is: {short_fauna_df.end_year.min()}")
print(f"Maximum end month is: {short_fauna_df.end_mth.max()}")
print(f"Minimum end month is: {short_fauna_df.end_mth.min()}")
print(f"Maximum start year is: {short_fauna_df.start_year.max()}")
print(f"Minimum start year is: {short_fauna_df.start_year.min()}")
print(f"Maximum start month is: {short_fauna_df.start_mth.max()}")
print(f"Minimum start month is: {short_fauna_df.start_mth.min()}")
print(f"Maximum start date is: {short_fauna_df.start_date.max()}")
print(f"Minimum start date is: {short_fauna_df.start_date.min()}")


# As can be seen, there are a number of records with total count of 0. They are records of surveys with no sightings of a targeted specie. Hence, we'll remove them.
# 
# As there are a lot of null end_date values, their extracted end years and end months equal to 0. Hence we might use start date in our time series visualisation. The null end dates might indicate that a survey hasn't ended up to our group's data extraction.

# In[26]:


print(f"The number of records with totalcount of zero: {short_fauna_df[short_fauna_df.totalcount == 0].shape[0]}")


# In[27]:


# Values in location description column
short_fauna_df["location_desc"].unique()


# In[28]:


# Values in record types column
short_fauna_df["recordtype"].unique()


# In[29]:


# Values in reliability column
short_fauna_df["reliability"].unique()


# Values in the location description, record types and reliability columns do not seem to be informative enough. Hence we'll remove these columns. We'll also remove columns project_id and site_id as they are not required for our project's purpose.

# In[30]:


# Filter out the records with total count of 0 and remove end_year, end_date, end_mth, start_year, start_mth columns
final_fauna_df = short_fauna_df[short_fauna_df.totalcount > 0].drop([
    'site_id', 'project_id', 'location_desc', 'end_year', 'end_mth',\
    'end_date', 'start_year', 'start_mth', 'recordtype', 'reliability'], axis = 1)
final_fauna_df.info()


# In[31]:


# Sort the fauna dataframe by comm_name and start_date
final_fauna_df.sort_values(by=["comm_name", "start_date"], inplace=True)
final_fauna_df.head(10)


# In[32]:


# Add a new column month_year for aggregation purpose
final_fauna_df["year_month"] = final_fauna_df["start_date"].dt.strftime('%Y-%m')


# In[33]:


final_fauna_df.head()


# ## Filter webscraped animal image data against VBA fauna data 

# In[34]:


final_animal_list = final_fauna_df["comm_name"].unique().tolist()
final_animal_list


# In[35]:


# Number of final animals
len(final_animal_list)


# In[36]:


# Number of taxon ids
taxon_ids = final_fauna_df["taxon_id"].unique().tolist()
len(taxon_ids)


# The number of animals is equal to the number of taxon ids. For each animal of interest, there is only one corresponding taxon id.

# In[37]:


# Filter the webscraped data to have only the above animals
final_scraped_df = scraped_df[scraped_df["animal_name"].isin(final_animal_list)].copy()
final_scraped_df


# In[38]:


# Overview of the scraped data
final_scraped_df.info()


# In[39]:


# Fill the NaN values with None values for the json-converted file to work
final_scraped_df = final_scraped_df.where(final_scraped_df.notnull(), None)
final_scraped_df


# ## Load

# In[40]:


# Initialize PyMongo to work with MongoDBs
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# Define database and collections
db = client.animal_visual_db
vba_fauna = db.vba_fauna
scraped_fauna = db.scraped_fauna


# In[41]:


# Drops collections if available to remove duplicates
vba_fauna.drop()
scraped_fauna.drop()


# In[42]:


# Load vba fauna data into the vba_fauna collection
vba_fauna.insert_many(final_fauna_df.to_dict('records'))


# In[43]:


# Load scraped fauna image and info into the scraped_fauna collection
scraped_fauna.insert_many(final_scraped_df.to_dict('records'))


# In[44]:


from pprint import pprint

for record in vba_fauna.find():
    pprint(record)


# In[45]:


for record in scraped_fauna.find():
    pprint(record)


# In[46]:


type(vba_fauna.find())


# In[47]:


type(scraped_fauna.find())


# ## Test aggregations by animal names

# In[48]:


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
                      "total_sightings": { "$sum": "$totalcount" }
                  }
          }
    ]))

metadata


# In[49]:


# Aggregate records by animal name
records_by_animal = list(vba_fauna.aggregate([
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
]))

records_by_animal[2]


# In[50]:


# Aggregrate total sightings for each animal by month
sightings_by_month = list(vba_fauna.aggregate([
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
sightings_by_month[0:10]


# In[51]:


# Remove "_id" field in vba_fauna to make the table more presentable
data_table = list(vba_fauna.aggregate([ { "$unset": ["_id"] } ]))
data_table[0:2]


# In[ ]:




