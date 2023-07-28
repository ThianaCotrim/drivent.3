import { prisma } from "@/config";

async function findHotels(){
    return prisma.hotel.findMany()
}

async function findRoomsHotelById(hotelId: number){
    return prisma.hotel.findFirst({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })

}

const hotelRepository = {
    findHotels,
    findRoomsHotelById
}

export default hotelRepository