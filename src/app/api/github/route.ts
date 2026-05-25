import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch user details for repositories count and profile URL
    const userRes = await fetch("https://api.github.com/users/Stewy8506", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    let public_repos = 0;
    let html_url = "https://github.com/Stewy8506";
    
    if (userRes.ok) {
      const userData = await userRes.json();
      public_repos = userData.public_repos;
      html_url = userData.html_url;
    }

    // Fetch total commits of all time using the Search API
    const commitsRes = await fetch(`https://api.github.com/search/commits?q=author:Stewy8506`, {
      headers: {
        Accept: 'application/vnd.github.cloak-preview',
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    let totalCommits = 0;
    if (commitsRes.ok) {
      const searchData = await commitsRes.json();
      totalCommits = searchData.total_count || 0;
    }
    
    return NextResponse.json({
      total_commits: totalCommits,
      public_repos,
      html_url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

