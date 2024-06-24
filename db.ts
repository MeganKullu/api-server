import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const {
    user: users,
    message : messages,
    friendRequest : friendRequests, 
} = prisma

export default prisma;

