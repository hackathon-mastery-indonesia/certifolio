import { NextRequest, NextResponse } from "next/server";
import querying from "../db/pool";

export async function POST(request:Request) {
    console.log('hello')
    const data = await request.formData();
    
    try {
      const result = await querying(`
      SELECT * FROM USER;
      
      `);
      console.log('haaahahha')
      return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error });
    }
  }