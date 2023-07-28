import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list.-hotels";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotels-repository"
import ticketsRepository from "@/repositories/tickets-repository";


async function getHotels (userId: number) {

    await listHotels(userId)

    const hotels = await hotelRepository.findHotels()
    return hotels;
}

async function listHotels(userId: number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw notFoundError()

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) throw notFoundError()

    //rever 
    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
        throw cannotListHotelsError();
    }
}

async function getHotelRooms(userId: number, hotelId: number){

    await listHotels(userId)
    const hotel = await hotelRepository.findRoomsHotelById(hotelId);
    if (!hotel) throw notFoundError();
    
    return hotel;
}


export default {getHotels, getHotelRooms}  