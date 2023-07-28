import { Router } from "express";
import { authenticateToken} from "@/middlewares";
import { getHotelRooms, getHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router()

hotelsRouter.use(authenticateToken)
hotelsRouter.get("/hotels", getHotels)
hotelsRouter.get("/hotels/:id", getHotelRooms)



export default hotelsRouter