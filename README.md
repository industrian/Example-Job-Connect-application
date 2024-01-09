This repository contains an example Connect application for an `job` [application type](https://docs.commercetools.com/connect/overview#connect-applications).

## What does this Connect application do?

This Connect application runs based on the `schedule` [defined in connect.yaml](https://github.com/industrian/ConnectorTest/blob/main/connect.yaml#L6) and unassigns a Category from Products created over 30 days ago.

This Category is ideally used for defining "new additions", and this Connect application would ensure that Products that are no-longer considered new are automatically unassigned from this Category.

The code can be found at [removefromcategory/src/controllers/job.controller.ts
](https://github.com/industrian/ConnectorTest/blob/main/removefromcategory/src/controllers/job.controller.ts).

## Pre-requisites

You must have a Category that is assigned to Products. The `id` of this Category should be used as `new_arrivals_category_id` as [defined in connect.yaml](https://github.com/industrian/ConnectorTest/blob/main/connect.yaml#L25)

## Notes/Disclaimer

This Connect application was created as a proof of concept and should be used for evaluation purposes only.
