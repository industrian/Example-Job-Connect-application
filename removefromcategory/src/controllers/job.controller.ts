import { Request, Response } from 'express';

import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';
import { createApiRoot } from '../client/create.client';
import { readConfiguration } from '../utils/config.utils';

/**
 * Exposed job endpoint.
 *
 * @param {Request} _request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (_request: Request, response: Response) => {
  try {

    logger.info(`Running job to remove Products from Category.`);

    const categoryId:string =readConfiguration().new_arrivals_category_id;
    const today = new Date();
    const toDate = new Date(new Date().setDate(today.getDate() - 30));

    logger.info(`Checking Products created before ${toDate.toDateString()} in category: ${categoryId}`);

    // Filter query used by Product Projection Search
    const filterQuery:string[] = [
      `categories.id:"${categoryId}"`,
      `createdAt:range (* to "${toDate.toISOString()}")`,
    ]

    const productsInCategory = await getProductsInCategory(filterQuery);

    logger.info(`Found ${productsInCategory.results.length} Products.`);

    
    for (const product of productsInCategory.results)
    {
    await removeCategoryFromProduct(product.id,product.version,categoryId);
    }

    logger.info(`Finished removing Products created before ${toDate.toDateString()} in category: ${categoryId}`);

    response.status(200).send();
  } catch (error) {
    throw new CustomError(
      500,
      `Internal Server Error - Error retrieving all orders from the commercetools SDK`
    );
  }
};


const getProductsInCategory = async(filterQuery:string[]) =>{
  const {body} = await createApiRoot()
  .productProjections()
  .search()
  .get({
    queryArgs: {
      "filter.query": filterQuery,
      limit: 500,
    },
  })
  .execute();
  return body; 
}

const removeCategoryFromProduct = async(
  productId: string,
  productVersion: number,
  categoryId: string
)=>{
  const {body} =  await createApiRoot()
    .products()
    .withId({ ID: productId })
    .post({
      body: {
        version: productVersion,
        actions: [
          {
            action: "removeFromCategory",
            category: {
              typeId: "category",
              id: categoryId,
            },
            staged:false
          },
        ],
      },
    })
    .execute();
    logger.info(`Removing: ${productId}`)
    return body; 
};