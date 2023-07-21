import { PrismaClient } from '@prisma/client'

import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

const prisma = new PrismaClient()
export default prisma
