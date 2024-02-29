import express, { Request, Response, json } from "express";
import z from "zod";
import {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../schema/schema";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
const { Router } = require("express");
import { AuthRequest, authMiddleware } from "../authMiddleware";

const router = Router();

const HTTP = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  LENGTH_REQUIRED: 411,
  FORBIDDEN: 403,
};

const signupBody = z.object({
  username: z.string().email(),
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
  console.log(req.body);
  const existingUser = await getUser(req.body.username);
  if (existingUser) {
    return res.json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const userCreate = await createUser(username, password, firstName, lastName);
  const uName = userCreate.username;
  const token = jwt.sign(uName, JWT_SECRET);
  res.json({
    message: "User created successfully",
    token: token,
  });
});

//Sign In
const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

let USER_NAME: string = "";

router.post("/signin", async (req: Request, res: Response) => {
  const { success } = signinBody.safeParse(req.body);
  const { username } = req.body;
  if (!success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const user = await getUser(req.body.username);
  console.log("akdsfhajkdshf");
  if (user) {
    const token = jwt.sign(username, JWT_SECRET);
    USER_NAME = req.body.username;
    res.json({
      token: token,
    });
    return;
  }

  res.json({
    message: "Error while logging in",
  });
});

//Update User
const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// type updateBodyInfer = z.infer<typeof updateBody>;

// type updateBodyType = Partial<updateBodyInfer>;

router.put("/update", authMiddleware, async (req: Request, res: Response) => {
  const { success } = updateBody.safeParse(req.body);
  const updatedFields = req.body;
  const userNameReq = req as AuthRequest;
  const userName = userNameReq.userId;
  if (!success) {
    res.json({
      message: "Error while updating information",
    });
  }
  try {
    const user = await updateUser(userName, updatedFields);
    if (user) {
      res.json({
        message: "Updated successfully",
      });
    }
  } catch (e) {
    res.json({ error: "Error in updating" });
  }
});

//get all users
router.get("/allusers", async (req: Request, res: Response) => {
  const allusers = await getAllUsers();
  res.json(allusers);
});

//Delete a user
const deleteZUser = z.object({
  username: z.string().email(),
});

router.delete(
  "/delete",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { success } = deleteZUser.safeParse(req.body);

    if (!success) {
      res.json({
        message: "User not found to delete",
      });
    }
    const user = await getUser(req.body.username);
    if (user) {
      const deletedUser = deleteUser(req.body.username);
      res.json({
        message: "User deleted",
      });
    } else {
      res.json({
        message: "User Not deleted",
      });
    }
  }
);

router.delete("/deleteAll", async (req: Request, res: Response) => {
  const deleted_Users = await deleteAllUsers();
  if (deleted_Users) {
    res.json({
      message: "Deleted All users",
    });
  }
  if (!deleted_Users) {
    res.json({
      message: "Couldn't delete all users",
    });
  }
});

export { router };
