import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  const requestPath = req.url
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
  };
  cookies().set(options);
  const cookieStore = cookies();
  const getSession = cookieStore.get("session");
  return NextResponse.json({ isLogged: false, message: `success invalidate session`, path: `${requestPath}` }, { status: 200 });
}