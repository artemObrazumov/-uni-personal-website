function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    
    function filterProjects(filter) {
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
                card.removeAttribute('aria-hidden');
                visibleCount++;
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.setAttribute('aria-hidden', 'true');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        if (projectsGrid) {
            const statusMessage = `Показано ${visibleCount} проектов`;
            projectsGrid.setAttribute('aria-label', statusMessage);
            
            const liveRegion = document.getElementById('filter-live-region');
            if (liveRegion) {
                liveRegion.textContent = statusMessage;
            }
        }
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
            
            this.focus();
        });

        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    if (!document.getElementById('filter-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'filter-live-region';
        liveRegion.className = 'visually-hidden';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
}

document.addEventListener('DOMContentLoaded', initProjectFilters);