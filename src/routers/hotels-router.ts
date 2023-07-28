import { Router } from "express";
import { authenticateToken} from "@/middlewares";
import { getHotelRooms, getHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router()

hotelsRouter.use(authenticateToken)
hotelsRouter.get("/", getHotels)
hotelsRouter.get("/:hotelId", getHotelRooms)



export default hotelsRouter