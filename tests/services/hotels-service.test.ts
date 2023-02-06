import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createEnrollmentWithAddress,createTicketType, createTicket, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/config";
import { createHotel, createRoom } from "../factories/hotels-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    test("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user ticket doesnt includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
      await prisma.room.deleteMany({})
      await prisma.hotel.deleteMany({});

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 when ticket type is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true,true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
    

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 402 when ticket type doesnt includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false,false);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 402 when status isnt PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false,true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 200 returning a body with all hotels list", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
      const hotel = await createHotel();
      const rooms = await createRoom(hotel.id)

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString()
        }]
      )
    })
  })
})

describe("GET /hotels/:hotelId", () => {
    it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    test("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user ticket doesnt includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
      await prisma.room.deleteMany({})
      await prisma.hotel.deleteMany({});

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 when ticket type is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true,true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
    

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 402 when ticket type doesnt includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false,false);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 402 when status isnt PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false,true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it("should respond with status 200 returning a body with all hotels list", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
      const hotel = await createHotel();
      const rooms = await createRoom(hotel.id)

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
            Rooms: [{
            id: rooms.id,
            name: rooms.name,
            capacity: rooms.capacity,
            hotelId: rooms.hotelId,
            createdAt: rooms.createdAt.toISOString(),
            updatedAt: rooms.updatedAt.toISOString(),
            }]
        }
      )
    })
  })
})