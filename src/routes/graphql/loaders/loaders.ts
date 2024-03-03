import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export type Loaders = {
  users: DataLoader<any, any>;
  profiles: DataLoader<any, any>;
  posts: DataLoader<any, any>;
  memberTypes: DataLoader<any, any>;
};

export const createLoaders = (prisma: PrismaClient): Loaders => {
  return {
    users: new DataLoader(async (ids) => {
      const users = await prisma.user.findMany({
        where: {
          id: { in: ids as string[] },
        },
        include: {
          subscribedToUser: true,
          userSubscribedTo: true,
        },
      });
      return ids.map(
        (id) => users.find((user) => user.id === id) || new Error(`No result for ${id}`),
      );
    }),
    profiles: new DataLoader(async (ids) => {
      const profiles = await prisma.profile.findMany({
        where: {
          userId: { in: ids as string[] },
        },
        include: {
          memberType: true,
        },
      });
      return ids.map(
        (id) =>
          profiles.find((profile) => profile.id === id) ||
          new Error(`No result for ${id}`),
      );
    }),
    posts: new DataLoader(async (ids) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: ids as string[] },
        },
      });
      return ids.map(
        (id) =>
          posts.filter((post) => post.authorId === id) ||
          new Error(`No result for ${id}`),
      );
    }),
    memberTypes: new DataLoader(async (ids) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: { in: ids as string[] },
        },
      });
      return ids.map(
        (id) =>
          memberTypes.find((memberType) => memberType.id === id) ||
          new Error(`No result for ${id}`),
      );
    }),
  };
};
