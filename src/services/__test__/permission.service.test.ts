import { PermissionRepository, PermissionRepositoryImpl } from "../../repositories/permission.repository"
import { RoleRepositoryImpl } from "../../repositories/role.repository"
import { UserRepository, UserRepositoryImpl } from "../../repositories/user.repository"
import { PermissionService, PermissionServiceImpl } from "../permission.service"

const prisma = jestPrisma.client
describe("Auth Permission Service", () => {
    let permissionRepository : PermissionRepositoryImpl
    let roleRepository : RoleRepositoryImpl
    let userRepository : UserRepositoryImpl
    let authPermissionService : PermissionServiceImpl


    beforeEach(async () => {
        permissionRepository = new PermissionRepositoryImpl(prisma)
        userRepository = new UserRepositoryImpl(prisma)
        roleRepository = new RoleRepositoryImpl(prisma)
        authPermissionService = new PermissionServiceImpl(
            permissionRepository, 
            userRepository,
            roleRepository)
    })


    afterEach(async () => {
        await prisma.permission.deleteMany()
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