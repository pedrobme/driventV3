import { prisma } from "@/config"
import faker from "@faker-js/faker"
import dayjs from "dayjs"

export const createHotel = () => {
    return prisma.hotel.create({
        data: {
            name: faker.lorem.word(),
            image: faker.image.imageUrl(),
        }
    })
}

export const createRoom = (hotelId:number) => {
    return prisma.room.create({
        data:{
            name: faker.lorem.word(),
            capacity: faker.datatype.number({min:1, max:50}),
            hotelId: hotelId,
        }
    })
}