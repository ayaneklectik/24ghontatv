export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    service: '24ghonta-frontend',
    timestamp: new Date().toISOString(),
  });
}
