import { db } from "@/db/pool";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data) {
      return NextResponse.json(
        { message: "No form data provided" },
        { status: 400 }
      );
    }

    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email as string),
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    const newUserResult = await db
      .insert(users)
      .values({
        name: name as string,
        email: email as string,
        password: hashedPassword,
      })
      .returning({ insertedId: users.id });

    return NextResponse.json({ message: "User created successfully", userId: newUserResult[0].insertedId }, { status: 201 });

  } catch (e) {
    console.error("Error during Signup: ", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}