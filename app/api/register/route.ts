import { NextRequest, NextResponse } from "next/server";
import querying from "../db/pool";
import { v4 as uuidv4 } from "uuid";

export async function POST(request:Request) {
    console.log('hello')
    const data = await request.formData();
    const username = data.get('username');
    const fullname = data.get('fullname');
    const isUser = data.get('type') == 'user';
    console.log(isUser);
    try {
      const walletId = uuidv4(); 
      const result = isUser
        ? await querying(`
            INSERT INTO "User" (username, wallet_id, fullname) VALUES
            ('${username}', '${walletId}', '${fullname}') RETURNING id;
          `)
        : await querying(``);
      console.log('haaahahha')
      return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'kenapa sih' });
    }
  }