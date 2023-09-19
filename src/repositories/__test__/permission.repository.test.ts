import { Permission, Role, User } from "@prisma/client"
import { PermissionRepository, PermissionRepositoryImpl } from "../permission.repository"
import { after } from "node:test"
import { BaseQuery } from "../base"

const prisma = jestPrisma.client

describe('Auth Permission Repository', () => {
    let authPermission : Permission
    let role : Role
    let user : User
    let authPermissionRepository : PermissionRepositoryImpl

    beforeEach(async () => {
        user = await prisma.user.create({   
            data : {
                first_name : "fahmi",
                last_name : "hidayah",
                email : "fahmi@authPermission.com",
                password : "Test@1234",
                email_verification_code : "123456789"
            }
        })

        role = await prisma.role.create({
            data : {
                name : "USER"
            }
        })

        authPermission = await prisma.permission.create({
            data : {
                code_name : "create_user",
                name : "User",
                role : {
                    connect : role
                }
            }
        })

        authPermissionRepository = new PermissionRepositoryImpl(prisma)
    })
    
    afterEach(async () => { 
        await prisma.user.deleteMany()
        await prisma.permission.deleteMany()
    })




    test('create auth permission success', async () => {
        const authPermissionDto = {
            code_name : "create_user_test",
            name : "User Test",
            role : role
        }
        const authPermissionRepository = new PermissionRepositoryImpl(prisma)
        const newAuthPermission = await authPermissionRepository.create(authPermissionDto)
        expect(newAuthPermission?.code_name).toEqual("create_user_test")
    })

    test('find all auth permission success', async () => {
        const authPermissions = await authPermissionRepository.findAll(new BaseQuery())
        expect(authPermissions.length).toEqual(1)
    })

    test('find auth permission by id success', async () => {
        const foundAuthPermission = await authPermissionRepository.findById(authPermission.id)
        expect(foundAuthPermission?.name).toEqual("User")
    })

    test('update auth permission success', async () => {
        const updatedAuthPermission = await authPermissionRepository.update(authPermission.id, {
            name : "User Test Updated",
            code_name : "create_user_test_updated"
        })
        expect(updatedAuthPermission?.name).toEqual("User Test Updated")
    })

    test('delete auth permission success', async () => {
        const isDeleted = await authPermissionRepository.delete(authPermission.id)
        const count = await prisma.permission.count()
        expect(0).toEqual(count)
    })

    test('count auth permission success', async () => {
        const count = await authPermissionRepository.count()
        expect(count).toEqual(1)
    })

    test('add user to auth permission success', async () => {
        await authPermissionRepository.addUser(authPermission.id, user)
        const count = await authPermissionRepository.countByUser(authPermission.id, user.id)
        expect(1).toEqual(count)
    })

    test('remove user from auth permission success', async () => {
        await authPermissionRepository.addUser(authPermission.id, user)
        await authPermissionRepository.removeUser(authPermission.id, user.id)
        const count = await authPermissionRepository.countByUser(authPermission.id, user.id)
        expect(0).toEqual(count)
    })

    test('delete by name success', async () => {
        await authPermissionRepository.deleteByName(authPermission.name)
        const count = await authPermissionRepository.count()
        expect(0).toEqual(count)
    })

    test('count names by user', async () => {
        await authPermissionRepository.addUser(authPermission.id, user)
        const count = await authPermissionRepository.countNamesByUser([authPermission.name],user.id)
        expect(1).toEqual(count)
    })

    test('count code names by user', async () => {
        await authPermissionRepository.addUser(authPermission.id, user)
        const count = await authPermissionRepository.countCodeNamesByUser([authPermission.code_name],user.id)
        expect(1).toEqual(count)
    })
    
    
})