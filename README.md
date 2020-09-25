# Project II Monash Data Bootcamp - Tell a Story through Data Visualisations
---

### Attention!!!

This repository is for development phase of our web app only. For final version of files please refer to this repo https://github.com/momcancode/project-two-bootcamp.

## What is this project about?

Victoria is home to a number of threatened species. Some of these are rare to see in the wild but well worth the effort for avid animal lovers, families looking for an adventure, or those who are staycationing at Victoria's national parks, coastal towns, and regional towns.

**[Our web app](https://cool-cats-project-two.herokuapp.com/)** is built up using fauna sightings data from 2015 to 2020 provided by Victorian Biodiversity Atlas (VBA). The VBA fauna observations are a foundation dataset that feeds into many biodiversity tools used in government's everyday decision making for nature conservation - showing where wildlife is now and how this has changed over time. This makes it a core input to the majority of the government's processes and programs that impact native species.

Our [interactive map](https://cool-cats-project-two.herokuapp.com/) is designed to help you identify what type of threatened species has been seen in a particular area. If you want to learn more about some of the threatened species, please check out our [dashboard](https://cool-cats-project-two.herokuapp.com/dashboard) and [data](https://cool-cats-project-two.herokuapp.com/data) pages.

## Where is the data from?

1. **[VBA_FAUNA25](https://services.land.vic.gov.au/SpatialDatamart/dataSearchViewMetadata.html?anzlicId=ANZVI0803004161&extractionProviderId=1)** provided by Department of Environment, Land, Water & Planning

    This dataset is Victorian Biodiversity Atlas fauna records (unrestricted) for sites with high spatial accuracy. Although this is a point layer, the actual accuracy of the site can range from +/- 1m to +/- 500m.

    Its original file is in ESRI shapefile format. We converted it to csv using QGIS.

2. Threatened species images have been scraped from https://www.zoo.org.au/fighting-extinction/local-threatened-species/ and https://www.environment.vic.gov.au/conserving-threatened-species/threatened-species

    Please refer to our webscraping work [here](database/extract_webscraped_fauna_image.ipynb).

## TO DO:

1. Add map layers for local government area boundaries and national parks.

2. Explore other mapping choices and leaflet plugins, e.g. heatmap, animal markers, time dimension

2. Add scraped information on each animal on dashboarding page.

3. Create a multi-choice filter for the data page.

4. Add additional threatened animals (expand dataset).

5. Add more styles to our webpages

---
We make no claims as the ownership of the data. Hence, please do what you'd love with the data but credit the appropriate people.