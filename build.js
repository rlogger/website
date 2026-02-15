const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const PROJECTS_DIR = path.join(__dirname, 'projects');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITE_URL = 'https://raj-singh.com';

// Shared CSS from existing pages
const baseCSS = `body{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;margin:0;padding:0;background:#fff;color:#000}a{color:inherit;text-decoration:none}a:hover{color:#374151}.max-w-xl{max-width:36rem}.mx-auto{margin-left:auto;margin-right:auto}.mx-1{margin-left:.25rem;margin-right:.25rem}.px-8{padding-left:2rem;padding-right:2rem}.py-12{padding-top:3rem;padding-bottom:3rem}.pt-4{padding-top:1rem}.mb-12{margin-bottom:3rem}.flex{display:flex}.justify-between{justify-content:space-between}.items-center{align-items:center}.space-x-6>*+*{margin-left:1.5rem}.space-y-8>*+*{margin-top:2rem}.text-xs{font-size:.75rem}.text-sm{font-size:.875rem}.text-lg{font-size:1.125rem}.font-bold{font-weight:700}.text-gray-400{color:#9ca3af}.text-gray-500{color:#6b7280}.hover\\:text-gray-700:hover{color:#374151}.hover\\:underline:hover{text-decoration:underline}ul{list-style:none;padding:0;margin:0}li{margin-bottom:1rem;font-size:.875rem}.book-row{display:flex;justify-content:space-between;align-items:baseline;padding:.75rem 0}.book-title{font-weight:500;font-size:.875rem}.book-author{color:#6b7280;font-size:.75rem;margin-top:.125rem}.book-date{color:#9ca3af;font-size:.6875rem;flex-shrink:0;margin-left:1rem}`;

// Project-specific CSS
const projectCSS = `.project-card{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border-radius:.25rem}.project-card:hover{background:#f3f4f6}.project-title{font-weight:500;font-size:.875rem}.project-tags{display:flex;flex-wrap:wrap;gap:.375rem;flex-shrink:0}.tag{font-size:.6875rem;color:#6b7280;padding:.125rem .5rem;text-transform:uppercase;letter-spacing:.025em}.tag:hover{background:#f3f4f6}.project-content{font-size:.875rem;line-height:1.7}.project-content h2{font-size:1rem;font-weight:600;margin-top:1.5rem;margin-bottom:.5rem}.project-content h3{font-size:.9375rem;font-weight:600;margin-top:1.25rem;margin-bottom:.5rem}.project-content p{margin:.75rem 0}.project-content a{color:#374151;text-decoration:underline}.project-content code{font-size:.8125rem;background:#f3f4f6;padding:.125rem .375rem;border-radius:.25rem}.project-content pre{background:#f3f4f6;padding:1rem;border-radius:.375rem;overflow-x:auto;font-size:.8125rem}.project-content pre code{background:none;padding:0}.project-content ul,.project-content ol{padding-left:1.25rem;list-style:disc}.project-content ol{list-style:decimal}.project-content li{font-size:.875rem;margin-bottom:.375rem}.back-link{font-size:.75rem;color:#6b7280;display:inline-block;margin-bottom:1.5rem}.back-link:hover{color:#374151}`;

// Dark mode CSS
const darkCSS = `@media(prefers-color-scheme:dark){body{background:#000;color:#fff}.text-gray-400{color:#9ca3af}.text-gray-500{color:#9ca3af}.hover\\:text-gray-700:hover,a:hover{color:#d1d5db}.book-author{color:#9ca3af}.book-date{color:#6b7280}.project-card:hover{background:#1f2937}.tag{color:#9ca3af}.tag:hover{background:#1f2937}.project-content a{color:#d1d5db}.project-content code{background:#1f2937}.project-content pre{background:#1f2937}.back-link{color:#9ca3af}.back-link:hover{color:#d1d5db}}`;

function nav(activePage) {
    const booksClass = activePage === 'books' ? 'font-bold' : 'text-gray-500 hover:text-gray-700';
    const showClass = activePage === 'show' ? 'font-bold' : 'text-gray-500 hover:text-gray-700';
    return `<nav class="space-x-6 text-xs">
                <a href="/projects" class="${showClass}">Show</a>
                <a href="/books" class="${booksClass}">Books</a>
            </nav>`;
}

function htmlHead(title, description, canonicalPath) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Rajdeep Singh">

    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}${canonicalPath}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@smsrajdeepsingh">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">

    <link rel="canonical" href="${SITE_URL}${canonicalPath}">
    <link rel="icon" href="data:,">
    <style>${baseCSS}${projectCSS}${darkCSS}</style>
</head>`;
}

function header(activePage) {
    return `    <div class="max-w-xl mx-auto px-8 py-12">
        <header class="flex justify-between items-center mb-12">
            <h1 class="text-lg font-bold">
                <a href="/" class="hover:text-gray-700">Rajdeep Singh</a>
            </h1>
            ${nav(activePage)}
        </header>`;
}

function loadProjects() {
    if (!fs.existsSync(PROJECTS_DIR)) return [];

    return fs.readdirSync(PROJECTS_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const raw = fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf-8');
            const { data, content } = matter(raw);
            const slug = path.basename(f, '.md');
            return {
                slug,
                title: data.title || slug,
                tags: data.tags || [],
                date: data.date ? new Date(data.date) : new Date(),
                html: marked(content),
            };
        })
        .sort((a, b) => b.date - a.date);
}

function buildListingPage(projects) {
    const cards = projects.map(p => {
        const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
        return `                <a href="/projects/${p.slug}" class="project-card">
                    <div class="project-title">${p.title}</div>
                    <div class="project-tags">${tags}</div>
                </a>`;
    }).join('\n');

    const html = `${htmlHead('Show - Rajdeep Singh', "Rajdeep Singh's projects - AI, physics-informed learning, and more.", '/projects')}
<body>
${header('show')}

        <main>
            <ul>
${cards}
            </ul>
        </main>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'projects.html'), html);
    console.log('Generated public/projects.html');
}

function buildProjectPages(projects) {
    const outDir = path.join(PUBLIC_DIR, 'projects');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (const p of projects) {
        const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
        const html = `${htmlHead(`${p.title} - Rajdeep Singh`, p.title, `/projects/${p.slug}`)}
<body>
${header('show')}

        <main>
            <a href="/projects" class="back-link">&larr; Back to show</a>
            <h2 style="font-size:1.125rem;font-weight:700;margin:0 0 .5rem">${p.title}</h2>
            <div class="project-tags" style="margin-bottom:1.5rem">${tags}</div>
            <div class="project-content">
                ${p.html}
            </div>
        </main>
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join(outDir, `${p.slug}.html`), html);
        console.log(`Generated public/projects/${p.slug}.html`);
    }
}

function buildSitemap(projects) {
    const today = new Date().toISOString().split('T')[0];
    const projectUrls = projects.map(p =>
        `  <url>
    <loc>${SITE_URL}/projects/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/books</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
${projectUrls}
</urlset>
`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
    console.log('Generated public/sitemap.xml');
}

function build404Page() {
    const html = `${htmlHead('404 - Rajdeep Singh', 'Page not found.', '/404')}
<body>
${header('')}

        <main>
            <p class="text-sm">Page not found.</p>
            <section class="pt-4 text-xs">
                <a href="/" class="text-gray-500 hover:underline">Go home</a>
            </section>
        </main>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, '404.html'), html);
    console.log('Generated public/404.html');
}

// Run
const projects = loadProjects();
console.log(`Found ${projects.length} project(s)`);
buildListingPage(projects);
buildProjectPages(projects);
build404Page();
buildSitemap(projects);
console.log('Build complete.');
