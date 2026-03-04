Agrow – Agricultural Field Observation Web App
Overview

Agrow is a web-based mapping application designed to help farmers and landowners log spatial observations directly on an interactive map. The application allows users to draw land boundaries, record field observations, and explore information visually through a web map interface.

The primary goal of this project was to build a simple and intuitive tool that helps users keep track of what is happening on their land. Instead of just recording notes somewhere, observations can be tied to specific locations and viewed spatially on the map.

While this project focuses mainly on agricultural use cases, realistically any land owner could use an application like this to log spatial information about their property.

This project was developed as part of GEOG 576 – Mobile Web Mapping.

Concept and Inspiration

In some ways, this application is conceptually similar to tools like Esri Field Maps, where users can collect spatial data and store it in a hosted database. However, my goal for this project was to create something that feels more tailored toward agriculture and farm management.

Instead of being a general data collection tool, the interface is designed to guide users through logging specific types of field observations such as crop issues, pest sightings, irrigation concerns, or other field conditions.

The idea is to provide a more guided workflow that could realistically fit into how farmers might want to record information while working in the field.

How the Application Works

The application is built using the ArcGIS Maps SDK for JavaScript and uses ArcGIS Online hosted feature layers as the backend database.

Users interact with the map in several ways:

Drawing Land Boundaries

Users can draw polygons representing their land or fields using the Editor widget. When a polygon is created, the application automatically calculates the geometry area and converts it into acres.

Attributes recorded for land polygons include:

Land Name

Owner

Crop Type

Acres (automatically calculated)

Recording Field Observations

Users can also create point features to log observations occurring in the field.

Observation attributes include:

Title

Observation Type

Status

Severity

Crop Type

Notes

These observations are symbolized on the map using different colors and sizes to help quickly identify issues.

Example Data

The application includes several example observations to demonstrate what typical user inputs might look like. These examples help show how farmers or landowners could use the application to track issues occurring across different parts of their land.

Example observations include things like:

pest sightings

crop stress

irrigation problems

monitoring conditions

resolved issues

These example entries help illustrate how spatial logging could be used as a field management tool.

Filtering and Map Tools

The interface includes a sidebar that allows users to filter observations based on several attributes:

Observation Type

Status

Severity

Crop Type

This allows users to quickly find specific types of issues or monitor how conditions are changing over time.

Additional map tools include:

Search widget

Locate Me button

Basemap selection

Layer visibility controls

Feature editing tools

Technology Used

This application was built using the following tools and technologies:

ArcGIS Maps SDK for JavaScript

ArcGIS Online hosted feature layers

HTML

CSS

JavaScript

GitHub Pages for hosting

For this project I tried to focus on tools and workflows that I felt comfortable implementing through code, while still demonstrating how a full-stack web mapping application can interact with a spatial database.

Potential Applications and Future Ideas

Although this project is relatively simple, I think a concept like this has a lot of potential when combined with other spatial data sources.

For example, applications like this could be paired with:

remote sensing imagery

UAV/drone data

soil datasets

weather data

crop health indices such as NDVI

Combining field observations with other spatial datasets could provide useful insights for land management and decision making.

I am especially interested in how tools like this could support modern agricultural practices such as precision agriculture and regenerative agriculture, where spatial information and monitoring play a large role in how land is managed.

Author

Ray Weigand
University of Wisconsin–Madison
GEOG 576 – Mobile Web Mapping

Live Application

GitHub Pages Link:
https://rtweigand-code.github.io/geog576_midterm/
