import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { memberTypeQueryFields } from './types/memberType.js';
import { GraphQLObjectType } from 'graphql/type/index.js';
import { postsQueryFields } from './types/posts.js';
import { usersQueryFields } from './types/users.js';
import { profilesQueryFields } from './types/profiles.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...memberTypeQueryFields,
    ...postsQueryFields,
    ...usersQueryFields,
    ...profilesQueryFields,
  }),
});

export const schema = new GraphQLSchema({
  query,
  // mutation: mutation,
});
