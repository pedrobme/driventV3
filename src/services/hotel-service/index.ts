import { notFoundError, PaymentRequiredError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository"

const verifyValidTicketExistenceByUserId = async (userId: number) => {

const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);

if(!userEnrollment) throw notFoundError()

const enrollmentTicket = await ticketRepository.findTicketByEnrollmentId(userEnrollment.id);

if(!enrollmentTicket) throw notFoundError()

if(enrollmentTicket.TicketType.includesHotel===false || enrollmentTicket.TicketType.isRemote===true || enrollmentTicket.status!='PAID') throw PaymentRequiredError()
}

const getListOfAllHotels = async () =>{
    const allHotelsList = await hotelsRepository.findALLHotels()

    if(!allHotelsList || allHotelsList.length === 0) throw notFoundError()
    return allHotelsList
}

const getHotelWithRoomsByHotelId = async (hotelId:number) =>{
    const HotelRoomsByHotelId = await hotelsRepository.findHotelWithRoomsByHotelId(hotelId)

    if(!HotelRoomsByHotelId) throw notFoundError()
    
    return HotelRoomsByHotelId
}

const hotelService = {
    verifyValidTicketExistenceByUserId,
    getListOfAllHotels,
    getHotelWithRoomsByHotelId
}

export {hotelService}