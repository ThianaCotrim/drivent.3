import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import hotelsService from "@/services/hotels-service";
import httpStatus from "http-status";

export async function getHotels (req: AuthenticatedRequest, res: Response){

    const {userId} = req;

    try {
        const hotels = await hotelsService.getHotels(userId);
        return res.send(hotels)
    } catch (error){
        if (error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND)
        }

        return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
    }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response){

    const {userId} = req;
    const hotelId = Number(req.params.hotelId)

    try {
        const hotel = await hotelsService.getHotelRooms(userId, hotelId)

        return res.send(hotel)

    } catch (error) {
        if (error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if (error.name === "CannotListHotelsError"){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }
        return res.sendStatus(httpStatus.BAD_REQUEST)

    }
    
}