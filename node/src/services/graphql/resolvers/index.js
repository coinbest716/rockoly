import {GraphQLJSON} from 'graphql-type-json';
import {queryResolvers} from './resolvers.query';
import {mutationResolvers} from './resolvers.mutation';
import {subscriptionResolvers} from './resolvers.subscription';

const resolvers = {
  JSON: GraphQLJSON,
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers
};

export {resolvers};