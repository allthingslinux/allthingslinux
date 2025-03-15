import { NextResponse } from 'next/server';

// Access the temporaryFiles from the form handler
// In production, use a database or shared state instead
declare const temporaryFiles: Record<
  string,
  {
    content: string;
    fileName: string;
    created: Date;
  }
>;

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  if (!temporaryFiles[fileId]) {
    return NextResponse.json(
      { error: 'File not found or expired' },
      { status: 404 }
    );
  }

  const file = temporaryFiles[fileId];
  return new Response(file.content, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    },
  });
}
