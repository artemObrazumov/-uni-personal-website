document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addEntryModal');
    const addBtn = document.getElementById('addEntryBtn');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('addEntryForm');
    const diaryEntries = document.querySelector('.diary-entries');
    let previousActiveElement = null;

    function openModal() {
        previousActiveElement = document.activeElement;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        document.querySelectorAll('body > *:not(.modal):not(header):not(footer)')
            .forEach(el => {
                if (!modal.contains(el)) {
                    el.setAttribute('aria-hidden', 'true');
                }
            });

        modal.setAttribute('tabindex', '-1');
        modal.focus();
        document.addEventListener('keydown', handleEscape);
        trapFocus(modal);
        
        addBtn.setAttribute('aria-expanded', 'true');
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';

        document.querySelectorAll('[aria-hidden="true"]')
            .forEach(el => el.removeAttribute('aria-hidden'));

        if (previousActiveElement) {
            previousActiveElement.focus();
            addBtn.setAttribute('aria-expanded', 'false');
        }

        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });

        if (firstElement) {
            firstElement.focus();
        }
    }

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    addBtn.setAttribute('aria-haspopup', 'dialog');
    addBtn.setAttribute('aria-expanded', 'false');
    addBtn.setAttribute('aria-controls', 'addEntryModal');

    closeBtn.setAttribute('aria-label', 'Закрыть диалоговое окно');
    closeBtn.setAttribute('tabindex', '0');

    addBtn.addEventListener('click', openModal);

    closeBtn.addEventListener('click', closeModal);

    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('entryDate').value;
        const title = document.getElementById('entryTitle').value;
        const description = document.getElementById('entryDescription').value;
        const status = document.getElementById('entryStatus').value;
        
        const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const statusText = status === 'completed' ? 'Завершено ✓' : 'В процессе ⏳';
        const statusClass = status === 'completed' ? 'status-completed' : 'status-in-progress';
        
        const newEntry = document.createElement('article');
        newEntry.className = 'entry';
        newEntry.setAttribute('role', 'listitem');
        newEntry.innerHTML = `
            <div class="entry-header">
                <time class="entry-date" datetime="${date}">${formattedDate}</time>
                <span class="entry-status ${statusClass}" aria-label="Статус: ${status === 'completed' ? 'Завершено' : 'В процессе'}">${statusText}</span>
            </div>
            <h3 class="entry-title">${title}</h3>
            <p class="entry-description">${description}</p>
        `;
        
        diaryEntries.insertBefore(newEntry, diaryEntries.firstChild);
        
        const liveRegion = document.getElementById('diary-live-region');
        if (liveRegion) {
            liveRegion.textContent = `Добавлена новая запись: ${title}`;
        }
        
        form.reset();
        closeModal();
    });

    if (!document.getElementById('diary-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'diary-live-region';
        liveRegion.className = 'visually-hidden';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
});