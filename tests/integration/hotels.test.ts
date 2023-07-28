import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import {faker} from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createPayment, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";
import * as jwt from "jsonwebtoken"
import { TicketStatus } from "@prisma/client";

const server = supertest(app);

beforeAll( async () => {
    await init();
    await cleanDb()
})

beforeEach( async () => {
    await cleanDb()

})

describe("GET hotels/", () => {
    it("should respond with status 401 if no token is given", async () => {
       const {status} =  await server.get("/hotels")
       expect(status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word()
        const {status} =  await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userSession = await createUser()
        const token = jwt.sign({
            userId: userSession.id
        }, process.env.JWT_SECRET)

        const {status} =  await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 402 when user ticket is remote", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket (enrollment.id, ticketType.id, TicketStatus.PAID)
        await createPayment(ticket.id, ticketType.price)

        const {status} =  await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.PAYMENT_REQUIRED)
    })


    it("should respond with status 404 when user has no enrollment", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        await createTicketTypeRemote()

        const {status} =  await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.NOT_FOUND)


    })
    it("should respond with status 200 and a list of hotels", async () => {

        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()

        await createTicket (enrollment.id, ticketType.id, TicketStatus.PAID)

        const hotel = await createHotel()
        const {status, body} =  await server.get("/hotels").set("Authorization", `Bearer ${token}`)

        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual([
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updateAt: hotel.updatedAt.toISOString(),
            }
        ])
    })
})

describe("GET hotels/:id", () => {
    
})