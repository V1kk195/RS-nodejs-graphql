import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createLoaders, Loaders } from './loaders/loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const errors = validate(schema, parse(query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }

      const loader: Loaders = createLoaders(prisma);

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loader,
        },
      });
    },
  });
};

export default plugin;
