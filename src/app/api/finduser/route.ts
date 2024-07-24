import { NextResponse, NextRequest } from "next/server";
import { users } from "@/src/db/db";

// export async function POST(req: NextRequest, res: NextResponse) {
//   try {
//     const { username } = await req.json();

//     let userslist = await users.findMany({
//       where: {
//         username: {
//           contains: username,
//           mode: "insensitive",
//         },
//       },
//     });

//     //convert avatar bytes to Base64
//     userslist = userslist.map((user) => {
//       if (user.avatar) {
//         const avatarBase64 = Buffer.from(user.avatar).toString("base64");
//         return { ...user, avatar: `data:image/jpeg;base64,${avatarBase64}` };
//       }
//       return user;
//     });

//     if (userslist.length > 0) {
//       return NextResponse.json(
//         { Message: "User found", users: userslist },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json({ Message: "User not found" }, { status: 404 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { Message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// Define the original user type (assuming its structure based on your code)
type User = {
  id: number;
  firebaseId: string;
  username: string;
  language: string;
  avatar: Buffer | null;
  status: string;
};

// Define the transformed user type with avatar as a string
type TransformedUser = Omit<User, 'avatar'> & { avatar: string | null };

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { username } = await req.json();

    let userslist = await users.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
    });

    // Convert avatar bytes to Base64 and apply the TransformedUser type
    const transformedUsersList: TransformedUser[] = userslist.map((user) => {
      if (user.avatar) {
        const avatarBase64 = Buffer.from(user.avatar).toString("base64");
        return { ...user, avatar: `data:image/jpeg;base64,${avatarBase64}` };
      }
      return { ...user, avatar: null };
    });

    if (transformedUsersList.length > 0) {
      return NextResponse.json(
        { Message: "User found", users: transformedUsersList },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ Message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Internal Server Error" },
      { status: 500 }
    );
  }
}