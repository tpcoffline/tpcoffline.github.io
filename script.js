// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Get theme from localStorage or default to dark
let currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    }
});

// Data Management
let organizationsData = [];
let projectsData = [];
let socialLinksData = [];
let categoriesData = [];

// Load all data on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, starting initialization...');
    
    await loadData();
    
    console.log('Rendering components...');
    renderOrganizations();
    renderSocialLinks();
    renderCategories();
    renderProjects();
    initializeParticles();
    initializeAnimations();
    
    console.log('Initialization complete');
    
    // Event delegation for category buttons
    document.addEventListener('click', (event) => {
        if (event.target.closest('.category-btn')) {
            const button = event.target.closest('.category-btn');
            toggleCategory(button);
        }
    });
});

// Load data from JSON files
async function loadData() {
    try {
        console.log('Starting to load JSON data...');
        
        const [orgsResponse, projectsResponse, socialResponse, categoriesResponse] = await Promise.all([
            fetch('./data/organizations.json'),
            fetch('./data/projects.json'),
            fetch('./data/social-links.json'),
            fetch('./data/categories.json')
        ]);

        console.log('Fetch responses received:', {
            orgs: orgsResponse.status,
            projects: projectsResponse.status,
            social: socialResponse.status,
            categories: categoriesResponse.status
        });

        organizationsData = await orgsResponse.json();
        projectsData = await projectsResponse.json();
        socialLinksData = await socialResponse.json();
        categoriesData = await categoriesResponse.json();
        
        console.log('Data loaded successfully:', {
            organizations: organizationsData.length,
            projects: projectsData.length,
            socialLinks: socialLinksData.length,
            categories: categoriesData.length
        });
    } catch (error) {
        console.error('Error loading data:', error);
        // Use fallback data if JSON files fail to load
        loadFallbackData();
    }
}

// Fallback data in case JSON files are not available
function loadFallbackData() {
    organizationsData = [
       
    ];

    projectsData = [
        
    ];

    socialLinksData = [
        
    ];

    categoriesData = [
        
    ];
}

// Render Organizations
function renderOrganizations() {
    console.log('Rendering organizations...', organizationsData);
    const grid = document.getElementById('organizationsGrid');
    if (!grid) {
        console.error('Organizations grid element not found');
        return;
    }

    grid.innerHTML = organizationsData.map(org => `
        <div class="organization-card ${!org.active ? 'inactive' : ''}">
            <div class="org-status ${!org.active ? 'inactive' : ''}"></div>
            <img src="${org.logo}" alt="${org.title}" class="org-logo">
            <h3 class="org-title">${org.title}</h3>
            <p class="org-detail">${org.detail}</p>
        </div>
    `).join('');
    console.log('Organizations rendered successfully');
}

// Render Social Links
function renderSocialLinks() {
    const container = document.getElementById('socialLinks');
    if (!container) return;

    container.innerHTML = socialLinksData.map(social => `
        <a href="${social.link}" class="social-link" target="_blank" rel="noopener noreferrer" title="${social.hoverText}">
            <i class="social-icon ${social.icon}"></i>
            <span class="social-text">${social.title}</span>
        </a>
    `).join('');
}

// Render Categories
function renderCategories() {
    console.log('Rendering categories...', categoriesData);
    const container = document.getElementById('categoryButtons');
    if (!container) {
        console.error('Category buttons container not found');
        return;
    }

    // Only add categories from JSON (HTML already has "Tümü" button)
    container.innerHTML = categoriesData.map(category => `
        <button class="category-btn" data-category="${category.name}">
            <i class="${category.icon}"></i>
            ${category.name}
        </button>
    `).join('');
    
    console.log('Categories rendered successfully');

    // Event listeners will be handled by event delegation in DOMContentLoaded
}

// Project filtering
let selectedCategories = ['all'];

function toggleCategory(button) {
    const category = button.dataset.category;
    
    if (category === 'all') {
        // If "All" is clicked, deselect all other categories
        selectedCategories = ['all'];
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    } else {
        // Remove "All" if another category is selected
        selectedCategories = selectedCategories.filter(cat => cat !== 'all');
        document.querySelector('.category-btn[data-category="all"]').classList.remove('active');
        
        // Toggle current category
        if (selectedCategories.includes(category)) {
            selectedCategories = selectedCategories.filter(cat => cat !== category);
            button.classList.remove('active');
        } else {
            selectedCategories.push(category);
            button.classList.add('active');
        }
        
        // If no categories selected, select "All"
        if (selectedCategories.length === 0) {
            selectedCategories = ['all'];
            document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        }
    }
    
    renderProjects();
}

// Render Projects
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    let filteredProjects = projectsData;
    
    if (!selectedCategories.includes('all')) {
        filteredProjects = projectsData.filter(project => {
            // G�venli kategori kontrol�
            if (!project || !project.categories || !Array.isArray(project.categories)) {
                return false; // Kategorisi olmayan projeleri g�sterme
            }
            return project.categories.some(cat => selectedCategories.includes(cat));
        });
    }

    grid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" onclick="openProjectModal(${project.id})">
            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                ${(project.downloadLink || project.videoLink) ? `
                    <div class="project-links">
                        ${project.downloadLink ? `
                            <a href="${project.downloadLink}" class="project-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                                <i class="fas fa-download"></i> �ndir
                            </a>
                        ` : ''}
                        ${project.videoLink ? `
                            <a href="${ensureAbsoluteUrl(project.videoLink)}" class="project-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                                <i class="fas fa-play"></i> Video
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Project Modal
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');

    // Generate video content
    const videoContent = generateVideoEmbed(project.videoLink);

    modalBody.innerHTML = `
        <h2 style="color: var(--minecraft-green); margin-bottom: 1rem;">${project.title}</h2>
        ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : ''}
        
        ${videoContent}
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                ${(project.details || project.description) ? `
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Proje Detaylar�</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${project.details || project.description}</p>
                ` : ''}
                
                ${project.features && project.features.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">�zellikler</h4>
                        <ul style="color: var(--text-secondary); margin-left: 1rem;">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div>
                ${(project.version || (project.downloads !== undefined && project.downloads !== null) || (project.categories && project.categories.length > 0) || (project.tags && project.tags.length > 0)) ? `
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Bilgiler</h3>
                    ${project.version ? `<p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>Versiyon:</strong> ${project.version}</p>` : ''}
                    ${(project.downloads !== undefined && project.downloads !== null) ? `<p style="color: var(--text-secondary); margin-bottom: 1rem;"><strong>�ndirme:</strong> ${project.downloads.toLocaleString()}</p>` : ''}
                    
                    ${project.categories && project.categories.length > 0 ? `
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Kategoriler</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${project.categories.map(cat => `<span class="project-tag">${cat}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${project.tags && project.tags.length > 0 ? `
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Etiketler</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                ` : ''}
            </div>
        </div>
        
        ${(project.downloadLink || project.videoLink) ? `
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                ${project.downloadLink ? `
                    <a href="${project.downloadLink}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-download"></i> Projeyi �ndir
                    </a>
                ` : ''}
                ${project.videoLink ? `
                    <a href="${ensureAbsoluteUrl(project.videoLink)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> Video'yu A�
                    </a>
                ` : ''}
            </div>
        ` : ''}
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Generate embedded video content for multiple platforms
function generateVideoEmbed(videoLink) {
    if (!videoLink) return '';
    
    const videoData = detectVideoSource(videoLink);
    
    if (!videoData) {
        return `
            <div class="video-placeholder">
                <div style="text-align: center;">
                    <i class="fas fa-video"></i>
                    <p style="color: var(--text-muted); margin: 0;">Video format� desteklenmiyor</p>
                    <small style="color: var(--text-muted);">Desteklenen: YouTube, Twitch, Vimeo, Streamable, Tixte, Facebook, MP4</small>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="video-container">
            <iframe 
                src="${videoData.embedUrl}" 
                title="${videoData.platform} video player" 
                frameborder="0" 
                ${videoData.allowFeatures}
                allowfullscreen>
            </iframe>
        </div>
    `;
}

// Detect video source and return embed data
function detectVideoSource(url) {
    if (!url) return null;
    
    // Ensure URL has protocol for proper detection
    const processedUrl = ensureAbsoluteUrl(url);
    
    // YouTube
    const youtubeId = extractYouTubeId(processedUrl);
    if (youtubeId) {
        return {
            platform: 'YouTube',
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
            allowFeatures: 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"'
        };
    }
    
    // Twitch
    const twitchData = extractTwitchData(processedUrl);
    if (twitchData) {
        return {
            platform: 'Twitch',
            embedUrl: twitchData.embedUrl,
            allowFeatures: 'allow="autoplay; fullscreen"'
        };
    }
    
    // Vimeo
    const vimeoId = extractVimeoId(processedUrl);
    if (vimeoId) {
        return {
            platform: 'Vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&dnt=1`,
            allowFeatures: 'allow="autoplay; fullscreen; picture-in-picture; web-share"'
        };
    }
    
    // Streamable
    const streamableId = extractStreamableId(processedUrl);
    if (streamableId) {
        return {
            platform: 'Streamable',
            embedUrl: `https://streamable.com/e/${streamableId}`,
            allowFeatures: 'allow="autoplay; fullscreen"'
        };
    }
    
    // Facebook
    const facebookData = extractFacebookData(processedUrl);
    if (facebookData) {
        return {
            platform: 'Facebook',
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(processedUrl)}&show_text=0&width=560`,
            allowFeatures: 'allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"'
        };
    }
    
    // DailyMotion
    const dailymotionId = extractDailymotionId(processedUrl);
    if (dailymotionId) {
        return {
            platform: 'DailyMotion',
            embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionId}`,
            allowFeatures: 'allow="autoplay; fullscreen"'
        };
    }
    
    // Tixte
    const tixteData = extractTixteData(processedUrl);
    if (tixteData) {
        return {
            platform: 'Tixte',
            embedUrl: createDirectVideoEmbed(tixteData.directUrl),
            allowFeatures: 'allow="autoplay; fullscreen"'
        };
    }
    
    // Direct video files (MP4, WebM, etc.)
    if (isDirectVideoFile(processedUrl)) {
        return {
            platform: 'Direct Video',
            embedUrl: createDirectVideoEmbed(processedUrl),
            allowFeatures: 'allow="autoplay; fullscreen"'
        };
    }
    
    return null;
}

// YouTube ID extraction
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/user\/[^\/]+#p\/[^\/]+\/[^\/]+\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

// Twitch data extraction
function extractTwitchData(url) {
    // Twitch video
    const videoMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
    if (videoMatch) {
        return {
            embedUrl: `https://player.twitch.tv/?video=${videoMatch[1]}&parent=${window.location.hostname}&autoplay=false`
        };
    }
    
    // Twitch clip
    const clipMatch = url.match(/twitch\.tv\/\w+\/clip\/(\w+)/);
    if (clipMatch) {
        return {
            embedUrl: `https://clips.twitch.tv/embed?clip=${clipMatch[1]}&parent=${window.location.hostname}&autoplay=false`
        };
    }
    
    // Twitch live stream
    const channelMatch = url.match(/twitch\.tv\/(\w+)$/);
    if (channelMatch) {
        return {
            embedUrl: `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}&autoplay=false`
        };
    }
    
    return null;
}

// Vimeo ID extraction
function extractVimeoId(url) {
    // Ensure URL has protocol
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        processedUrl = 'https://' + url;
    }
    
    const patterns = [
        // Standard Vimeo URLs
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
        // Vimeo with hash/private link
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)\/[a-f0-9]+/,
        // Channel videos
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/channels\/[\w-]+\/(\d+)/,
        // Group videos
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/groups\/[\w-]+\/videos\/(\d+)/,
        // Player embed URLs
        /(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/,
        // Vimeo private/unlisted videos
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/video\/(\d+)/,
        // Portfolio showcase
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/user\d+\/review\/(\d+)/,
        // Event videos
        /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/event\/\d+\/videos\/(\d+)/
    ];
    
    for (const pattern of patterns) {
        const match = processedUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

// Streamable ID extraction
function extractStreamableId(url) {
    const match = url.match(/streamable\.com\/(\w+)/);
    return match ? match[1] : null;
}

// Facebook video detection
function extractFacebookData(url) {
    const patterns = [
        /facebook\.com.*\/videos?\/(\d+)/,
        /fb\.watch\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return { videoId: match[1] };
        }
    }
    return null;
}

// DailyMotion ID extraction
function extractDailymotionId(url) {
    const patterns = [
        /dailymotion\.com\/video\/([^_\?]+)/,
        /dai\.ly\/([^_\?]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

// Tixte data extraction
function extractTixteData(url) {
    const patterns = [
        /tixte\.com\/([^\/\?]+)/,
        /d\.tixte\.co\/([^\/\?]+)/,
        /cdn\.tixte\.co\/([^\/\?]+)/,
        /media\.tixte\.co\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            // Check if it's a video file by extension
            const fileName = match[1];
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
            const hasVideoExtension = videoExtensions.some(ext => fileName.toLowerCase().includes(ext));
            
            if (hasVideoExtension) {
                return {
                    directUrl: url,
                    fileName: fileName
                };
            }
        }
    }
    return null;
}

// Check if URL is a direct video file
function isDirectVideoFile(url) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const urlLower = url.toLowerCase();
    return videoExtensions.some(ext => urlLower.includes(ext));
}

// Ensure URL is absolute
function ensureAbsoluteUrl(url) {
    if (!url) return '';
    
    // If URL already has protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Add https:// for relative URLs
    return 'https://' + url;
}

// Create direct video embed
function createDirectVideoEmbed(url) {
    // For security, ensure the URL is properly formatted
    const safeUrl = url.startsWith('http') ? url : '';
    
    return `data:text/html;charset=utf-8,
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 0; background: #000; }
                video { width: 100%; height: 100%; object-fit: contain; }
            </style>
        </head>
        <body>
            <video controls autoplay muted style="width: 100%; height: 100%;">
                <source src="${encodeURIComponent(safeUrl)}" type="video/mp4">
                <source src="${encodeURIComponent(safeUrl)}" type="video/webm">
                <p style="color: white; text-align: center; padding: 20px;">
                    Taray�c�n�z bu video format�n� desteklemiyor.
                </p>
            </video>
        </body>
        </html>`;
}

// Close modal
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target.id === 'projectModal') closeModal();
});

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Particles animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'var(--minecraft-green)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0.6';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(particle);
}

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.organization-card, .project-card, .stat-item, .social-link').forEach(el => {
        observer.observe(el);
    });
}

// Utility function to safely handle image errors
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMkEyQTJBIi8+CjxwYXRoIGQ9Ik0xNzUgNzBMMTk1IDEwMEgxNTVMMTc1IDcwWiIgZmlsbD0iIzU1RkY1NSIvPgo8cGF0aCBkPSJNMTc1IDEzMEwxOTUgMTAwSDE1NUwxNzUgMTMwWiIgZmlsbD0iIzU1RkY1NSIvPgo8dGV4dCB4PSIxNzUiIHk9IjE1MCIgZmlsbD0iIzU1RkY1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9qZSBHw7Zyc2VsaTwvdGV4dD4KPC9zdmc+';
    }
}, true);

