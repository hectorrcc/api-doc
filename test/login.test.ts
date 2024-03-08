import { app } from "../src/app";
import request from "supertest";

describe("auth / login", () => {
  it("should response whit a 200 status code", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@apidoc.com",
      password: "admin123",
    });
  
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("ok");
  });


});
