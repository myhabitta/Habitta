import { NextRequest, NextResponse } from 'next/server';
import { getPackagesByProject } from '@habitta/database';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  if (!projectId) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const packages = await getPackagesByProject(projectId);
    return NextResponse.json(packages);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
};
