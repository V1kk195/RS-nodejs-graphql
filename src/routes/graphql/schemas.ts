import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { memberTypeQueryFields } from './types/memberType.js';
import { GraphQLObjectType } from 'graphql/type/index.js';
import { postsMutationFields, postsQueryFields } from './types/posts.js';
import { usersMutationFields, usersQueryFields } from './types/users.js';
import { profilesMutationFields, profilesQueryFields } from './types/profiles.js';

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

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...postsMutationFields,
    ...usersMutationFields,
    ...profilesMutationFields,
  }),
});

export const schema = new GraphQLSchema({
  query,
  mutation,
});
