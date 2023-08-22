import { AuthPermissionRepositoryImpl } from "../../repositories/authPermission.repository"
import { UserRepository, UserRepositoryImpl } from "../../repositories/user.repository"
import { AuthPermissionService, AuthPermissionServiceImpl } from "../authPermission.service"

const prisma = jestPrisma.client
describe("Auth Permission Service", () => {
    let authPermissionRepository : AuthPermissionRepositoryImpl
    let userRepository : UserRepositoryImpl
    let authPermissionService : AuthPermissionService

    beforeEach(async () => {
        authPermissionRepository = new AuthPermissionRepositoryImpl(prisma)
        userRepository = new UserRepositoryImpl(prisma)
        authPermissionService = new AuthPermissionServiceImpl(authPermissionRepository, userRepository)
    })


    afterEach(async () => {
        await prisma.authPermission.deleteMany()
        await prisma.user.deleteMany()
    });

    test("create auth permission from name success", async () => {
        const authPermissionNameDto = {
            name : "test"
        }
        const authPermissions = await authPermissionService.createFromName(authPermissionNameDto)
        expect(authPermissions.length).toEqual(4)
    })

    test("delete auth permission from name success", async () => {
        const authPermissionNameDto = {
            name : "test"
        }
        const authPermissions = await authPermissionService.createFromName(authPermissionNameDto)
        const isDeleted = await authPermissionService.deleteByName("test")
        expect(isDeleted).toEqual(true)
    })
})