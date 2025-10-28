import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "userdata", "users.txt");

export async function POST(req) {
  const { email, password } = await req.json();

  // read users
  let users = [];
  try {
    const data = await fs.readFile(filePath, "utf-8");
    users = JSON.parse(data);
  } catch (err) {
    return NextResponse.json({ error: "No users found" }, { status: 400 });
  }

  // find user
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return NextResponse.json(
      { success: true, username: user.username },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { error: "Wrong email or password" },
      { status: 401 }
    );
  }
}
