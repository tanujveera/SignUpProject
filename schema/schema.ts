import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Creating user
export async function createUser(
  userName: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const user = await prisma.user.create({
    data: {
      username: userName,
      password: password,
      firstName: firstName,
      lastName: lastName,
    },
  });
  console.log("User created " + user);
  return user;
}
//Geting a specific user
export async function getUser(userName: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: userName,
    },
  });
  console.log("Got the user " + user);
  return user;
}
//Get all users
export async function getAllUsers() {
  const users = await prisma.user.findMany();
  const allusers = users.map(user=> user);
  console.log(allusers);
  return allusers;
}
//Delete user
export async function deleteUser(userName: string) {
  const user = await prisma.user.delete({
    where: {
      username: userName,
    },
  });
  console.log("Deleted user " + user);
  return user;
}
//Delete all users
export async function deleteAllUsers() {
  const users = await prisma.user.deleteMany();
  console.log("Deleted All users " + users);
  return users;
}
//Update user
export async function updateUser(userName: string, updatedData: any) {
  try {
    fieldToBeUpdated:string, fieldData:string
    let updateData: Record<string, string> = {};
    updateData[fieldToBeUpdated] = fieldData;

    const updatedUser = await prisma.user.update({
      where: {
        username: userName,
      },
      data: updatedData,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export * from "./schema.js";
