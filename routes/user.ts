import express, { Request, Response } from "express";
import z from "zod";
import { createUser, getUser, updateUser } from "../schema/schema";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../config";
const { Router } = require("express");
const authMiddleware = require("../authMiddleware")

const router = Router();

const HTTP = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  LENGTH_REQUIRED: 411,
  FORBIDDEN:403
};

const signupBody = z.object({
  userName: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

router.post("/signup", async (req: Request, res: Response) => {
  const { success } = signupBody.safeParse(req.body);
  const { username, password, firstName, lastName } = req.body;
  if (!success) {
    res.json({
      message: "Please check input fields",
    });
  }

  const existingUser = await getUser(req.body.username);

  if (existingUser) {
    return res.json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const userCreate = await createUser(username, password, firstName, lastName);
  const uName = userCreate.username;
  const token = jwt.sign(
    uName, JWT_SECRET
  );
  res.json({
    message: "User created successfully",
    token: token
  })
});

//Sign In
const signinBody = z.object({
    username: z.string().email(),
    password: z.string()
})

router.post("/signin", async (req: Request, res:Response) => {
  const { success } = signinBody.safeParse(req.body);
  const { username } = req.body;
  if (!success) {
      return res.json({
          message: "Incorrect inputs"
      })
  }

  const user = await getUser(req.body.username);

  if (user) {
      const token = jwt.sign(username, JWT_SECRET);

      res.json({
          token: token
      })
      return;
  }

  res.json({
      message: "Error while logging in"
  })
})

//Update User
const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

// router.put("/update:username", authMiddleware, async (req: Request, res: Response) => {
//   const { success } = signupBody.safeParse(req.body);
//   const updatedFields = req.body;
//     if (!success) {
//         res.status(411).json({
//             message: "Error while updating information"
//         })
//     }

//     const updatedUser = updateUser(user,updatedFields)

//     res.json({
//         message: "Updated successfully"
//     })
// })


export {router, HTTP};