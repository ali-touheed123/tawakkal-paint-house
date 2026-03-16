export async function GET() {
  const key = "8f7b2c9e10a34b528c11e0f09a123456";
  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
