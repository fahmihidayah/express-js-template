import { Role, User } from "@prisma/client"
import { RoleRepository, RoleRepositoryImpl } from "../role.repository"
import { BaseQuery } from "../base"

const prisma = jestPrisma.client

describe('Group Repository', () => {
    let role : Role

    let roleRepository : RoleRepositoryImpl

    let user : User

    beforeEach(async () => {
        user = await prisma.user.create({
            data : {
                first_name : "fahmi",
                last_name : "hidayah",
                email : "fahmi@group.com",
                password : "Test@1234",
                email_verification_code : "123456789"
            }
        })

        role = await prisma.role.create({
            data : {
                name : "group initial",
            }
        })

        roleRepository = new RoleRepositoryImpl(prisma)
    })

    afterEach(async () => {
        await prisma.role.deleteMany()
        await prisma.user.deleteMany()
    })

    test('create group success', async () => {
        const groupDto = {
            name : "group 1"
        }
        const newGroup = await roleRepository.create(groupDto)
        expect(newGroup?.name).toEqual("group 1")
    })

    test('find all group success', async () => {
        const groupDto = {
            name : "group 1"
        }
        const newGroup = await roleRepository.create(groupDto)
        const groups = await roleRepository.findAll(new BaseQuery())
        expect(groups.length).toEqual(2)
    })

    test('find group by id success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.findById(newGroup?.id)
        expect(group?.name).toEqual("group test")
    })

    test('update group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.update(newGroup.id, {
            name : "group update"
        })
        expect(group?.name).toEqual("group update")
    })

    test('delete group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.delete(newGroup.id)
        expect(group?.name).toEqual("group test")
    })

    test('count group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.count()
        expect(group).toEqual(2)
    })

    test('count group by query success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.countByQuery(new BaseQuery())
        expect(group).toEqual(2)
    })

    test('find all group paginate success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const groups = await roleRepository.findAllPaginate(new BaseQuery())
        expect(groups.data.length).toEqual(2)
    })

    test('add user to group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        const group = await roleRepository.addUser(newGroup.id, user)
        const numberOfUserInGroup = await roleRepository.countRoleByUser(newGroup.id, user.id)
        expect(1).toEqual(numberOfUserInGroup)
    })

    test('remove user from group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await roleRepository.create(groupDto) as Role
        await roleRepository.addUser(newGroup.id, user)
        await roleRepository.removeUser(newGroup.id, user.id)
        const numberOfUserInGroup = await roleRepository.countRoleByUser(newGroup.id, user.id)
        expect(0).toEqual(numberOfUserInGroup)
    });
})