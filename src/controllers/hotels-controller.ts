import { AuthenticatedRequest } from "@/middlewares"
import { hotelService } from "@/services/hotel-service"
import { Request, Response } from "express"
import httpStatus from "http-status"

async function getAllHotels(req:AuthenticatedRequest, res:Response){
    try {
        const userId = req.userId
        await hotelService.verifyValidTicketExistenceByUserId(userId)
        const allHotelsList = await hotelService.getListOfAllHotels()
        
        res.status(200).send(allHotelsList)
    } catch (error) {

    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
        res.status(500).send("Unexpected Error")
    }    
}

const getHotelRoomsByHotelId = async (req:AuthenticatedRequest, res: Response) => {

    try{
        const userId = req.userId
        const {hotelId} = req.params

        await hotelService.verifyValidTicketExistenceByUserId(userId)
        const foundHotelbById = await hotelService.getHotelWithRoomsByHotelId(Number(hotelId))

        res.status(200).send(foundHotelbById)
    } catch (error) {
        if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
        res.status(500).send("Unexpected Error")
    }   
}

const hotelsController = {
    getAllHotels,
    getHotelRoomsByHotelId
}

export default hotelsController