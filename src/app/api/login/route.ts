// import { db } from "@/db/pool";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import { users } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function POST(request: Request) {
//     try {
//         const data = await request.json()
//         if (!data) {
//             return NextResponse.json(
//                 { message: "No form data provided" },
//                 { status: 400 }
//             );
//         }
//         const { email, password } = data;
//         if (!email || !password) {
//             return NextResponse.json(
//                 { message: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         const existingUser = await db.query.users.findFirst({
//             where: eq(users.email, email as string),
//         });

//         if (!existingUser) {
//             return NextResponse.json({ message: "User not exists" }, { status: 400 });
//         }
//         if (!existingUser.password) {
//             return NextResponse.json({ message: "Password not set" }, { status: 400 });
//         }
        
//         const isValid = await bcrypt.compare(password as string, existingUser.password!);
//         if (!isValid) {
//             return NextResponse.json({ message: "Invalid password" }, { status: 400 });
//         }

//         return NextResponse.json({ message: "Login successful", userId: existingUser.id }, { status: 200 });
//     } catch (e) {
//         console.error("Error during Signup: ", e);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }