import { prisma } from "@/config";

const findALLHotels = async () => {
    return prisma.hotel.findMany()
}

const findHotelWithRoomsByHotelId = async (hotelId:number) => {
    return prisma.hotel.findFirst({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })
}

const hotelsRepository = {
    findALLHotels,
    findHotelWithRoomsByHotelId
}

export default  hotelsRepository