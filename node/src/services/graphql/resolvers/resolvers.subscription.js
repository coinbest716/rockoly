import {withFilter} from 'graphql-subscriptions';
import {doSubscribe} from '../subscriptions';
import * as subs from '../schema/schema.subscription';

const subscriptionResolvers = {
  chefProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefProfile);
    }),
  },
  chefProfileExtended: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefProfileExtended'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefProfileExtended);
    }),
  },
  chefAttachmentProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefAttachmentProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefAttachmentProfile);
    }),
  },
  chefAvailabilityProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefAvailabilityProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefAvailabilityProfile);
    }),
  },
  chefNotAvailabilityProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefNotAvailabilityProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefNotAvailabilityProfile);
    }),
  },
  chefSpecializationProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefSpecializationProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefSpecializationProfile);
    }),
  },
  chefBankProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefBankProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefBankProfile);
    }),
  },
  customerProfile: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('customerProfile'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsCustomerProfile);
    }),
  },
  customerProfileExtended: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('customerProfileExtended'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsCustomerProfileExtended);
    }),
  },
  customerFollowChef: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('customerFollowChef'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsCustomerFollowChef);
    }),
  },
  notificationHistory: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('notificationHistory'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsNotificationHistory);
    }),
  },
  bankTransferHistory: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('bankTransferHistory'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsbankTransferHistory);
    }),
  },
  chefBookingHistory: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('chefBookingHistory'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsChefBookingHistory);
    }),
  },
  paymentHistory: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('paymentHistory'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsPaymentHistory);
    }),
  },
  messageHistory: {
    subscribe: withFilter((_, args, {pubsub}) => pubsub.asyncIterator('messageHistory'), (payload, variables) => {
      return doSubscribe(payload, variables, subs.subsMessageHistory);
    }),
  },
};

export {
  subscriptionResolvers
};
