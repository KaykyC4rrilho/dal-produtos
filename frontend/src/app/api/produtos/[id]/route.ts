import { NextResponse } from 'next/server';
import { mysqlClient } from '../../../../lib/Client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
  }

  const { data, error } = await mysqlClient.query(
    `
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
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  }

  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}
