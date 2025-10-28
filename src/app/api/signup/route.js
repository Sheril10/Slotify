import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "userdata", "users.txt");

export async function POST(req) {
  const { email, password, username } = await req.json();

  // read users
  let users = [];
  try {
    const data = await fs.readFile(filePath, "utf-8");
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }

  // check if user already exists
  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // add new user
  users.push({ email, password, username });
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json({ success: true }, { status: 200 });
}
