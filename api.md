# Endpoint for buildings [/apibuildings]
This endpoint will provide all the required methods available for buildings

+ Attributes
    + _id (object)
    + name (string, required)
    + code (string, required)
    + label (string)
    + downtown (boolean)
        + Default: ''
    + desc (string)
    + location.number (string)
    + location.name (string)
    + location.street1 (string)
    + location.street2 (string)
    + location.street3 (string)
    + location.suburb (string)
    + location.state (string)
    + location.postcode (string)
    + location.country (string)
    + location.geo (array)
    + default (object, required)
        + Reference: Scene
    + scenes (array)
    + __v (number)



## List all buildings [GET /apibuildings]
Retrieves the list of buildings

+ Response 200 (application/json)

## Retrieve buildings [GET /apibuildings/{id}]
Retrieves item with the id

+ Response 200 (application/json)

## Create a buildings [POST /apibuildings]

+ Attributes
    + _id (object)
    + name (string, required)
    + code (string, required)
    + label (string)
    + downtown (boolean)
        + Default: ''
    + desc (string)
    + location.number (string)
    + location.name (string)
    + location.street1 (string)
    + location.street2 (string)
    + location.street3 (string)
    + location.suburb (string)
    + location.state (string)
    + location.postcode (string)
    + location.country (string)
    + location.geo (array)
    + default (object, required)
        + Reference: Scene
    + scenes (array)
    + __v (number)

+ Response 200 (application/json)

## Updates a buildings [PUT /apibuildings]

+ Attributes
    + _id (object)
    + name (string, required)
    + code (string, required)
    + label (string)
    + downtown (boolean)
        + Default: ''
    + desc (string)
    + location.number (string)
    + location.name (string)
    + location.street1 (string)
    + location.street2 (string)
    + location.street3 (string)
    + location.suburb (string)
    + location.state (string)
    + location.postcode (string)
    + location.country (string)
    + location.geo (array)
    + default (object, required)
        + Reference: Scene
    + scenes (array)
    + __v (number)

+ Response 200 (application/json)

## Deletes an item from buildings [DELETE /apibuildings/{id}]
Delete a buildings. **Warning:** This action **permanently** removes the buildings from the database.

+ Response 200 (application/json)