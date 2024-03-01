import { PrismaClient } from '@prisma/client';
import { DefaultArgs, PrismaClientOptions } from '@prisma/client/runtime/library.js';

export type Context = {
  prisma: PrismaClient<PrismaClientOptions, never, DefaultArgs>;
};
