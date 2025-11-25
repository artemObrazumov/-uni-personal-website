document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    let previousActiveElement = null;
    let currentModal = null;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            previousActiveElement = document.activeElement;
            
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            currentModal = modal;

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
            
            const triggeringCard = document.querySelector(`[data-modal="${modalId}"]`);
            if (triggeringCard) {
                triggeringCard.setAttribute('aria-expanded', 'true');
            }
        }
    }
    
    function closeModal(modal) {
        if (!modal) return;
        
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        currentModal = null;

        document.querySelectorAll('[aria-hidden="true"]')
            .forEach(el => el.removeAttribute('aria-hidden'));

        if (previousActiveElement) {
            previousActiveElement.focus();
            previousActiveElement.setAttribute('aria-expanded', 'false');
        }

        document.removeEventListener('keydown', handleEscape);
    }
    
    function handleEscape(event) {
        if (event.key === 'Escape' && currentModal) {
            closeModal(currentModal);
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

    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');
        
        const title = modal.querySelector('h2');
        if (title) {
            const titleId = title.id || `modal-title-${modal.id}`;
            title.id = titleId;
            modal.setAttribute('aria-labelledby', titleId);
        }
    });

    projectCards.forEach(card => {
        const title = card.querySelector('h3');
        const modalId = card.getAttribute('data-modal');
        
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-controls', modalId);
        card.setAttribute('aria-label', `Открыть детали проекта: ${title ? title.textContent : 'Проект'}`);
        
        card.addEventListener('click', function() {
            openModal(modalId);
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modalId);
            }
        });
    });

    closeButtons.forEach(button => {
        button.setAttribute('aria-label', 'Закрыть диалоговое окно');
        button.setAttribute('tabindex', '0');
        
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
        
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modal = this.closest('.modal');
                closeModal(modal);
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }

        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal(currentModal);
        }
    });

    modals.forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
});