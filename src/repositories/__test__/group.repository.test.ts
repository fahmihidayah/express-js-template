import { Group, User } from "@prisma/client"
import { GroupRepository, GroupRepositoryImpl } from "../role.repository"

const prisma = jestPrisma.client

describe('Group Repository', () => {
    let group : Group

    let groupRepository : GroupRepository

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

        group = await prisma.group.create({
            data : {
                name : "group initial",
            }
        })

        groupRepository = new GroupRepositoryImpl(prisma)
    })

    afterEach(async () => {
        await prisma.group.deleteMany()
        await prisma.user.deleteMany()
    })

    test('create group success', async () => {
        const groupDto = {
            name : "group 1"
        }
        const newGroup = await groupRepository.create(groupDto)
        expect(newGroup?.name).toEqual("group 1")
    })

    test('find all group success', async () => {
        const groupDto = {
            name : "group 1"
        }
        const newGroup = await groupRepository.create(groupDto)
        const groups = await groupRepository.findAll({
            page : 1,
            take : 10,
            keyword : "",
            orderBy : "id",
            orderByDirection : "desc",
        })
        expect(groups.length).toEqual(2)
    })

    test('find group by id success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.findById(newGroup.id)
        expect(group?.name).toEqual("group test")
    })

    test('update group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.update(newGroup.id, {
            name : "group update"
        })
        expect(group?.name).toEqual("group update")
    })

    test('delete group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.delete(newGroup.id)
        expect(group?.name).toEqual("group test")
    })

    test('count group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.count()
        expect(group).toEqual(2)
    })

    test('count group by query success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.countByQuery({
            page : 1,
            take : 10,
            orderBy : "id",
            orderByDirection : "desc",
            keyword : ""
        })
        expect(group).toEqual(2)
    })

    test('find all group paginate success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const groups = await groupRepository.findAllPaginate({
            page : 1,
            take : 10,
            orderBy : "id",
            orderByDirection : "desc",
            keyword : ""
        })
        expect(groups.data.length).toEqual(2)
    })

    test('add user to group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        const group = await groupRepository.addUser(newGroup.id, user)
        const numberOfUserInGroup = await groupRepository.countGroupByUser(newGroup.id, user.id)
        expect(1).toEqual(numberOfUserInGroup)
    })

    test('remove user from group success', async () => {
        const groupDto = {
            name : "group test",
        }
        const newGroup = await groupRepository.create(groupDto) as Group
        await groupRepository.addUser(newGroup.id, user)
        await groupRepository.removeUser(newGroup.id, user.id)
        const numberOfUserInGroup = await groupRepository.countGroupByUser(newGroup.id, user.id)
        expect(0).toEqual(numberOfUserInGroup)
    });
})