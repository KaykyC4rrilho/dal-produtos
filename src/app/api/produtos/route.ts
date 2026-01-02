// DAL-PRODUTOS/src/app/api/produtos/route.ts
import { NextResponse } from 'next/server';
import { mysqlClient } from '@/lib/Client';

export async function GET() {
  const { data, error } = await mysqlClient.query(`
    SELECT 
      id,
      model,
      brand,
      item_condition AS \`condition\`,
      original_price,
      sale_price,
      image_url,
      purchase_link,
      in_stock
    FROM scanners
    WHERE in_stock = 1
    ORDER BY created_date DESC
  `);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
