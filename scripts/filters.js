// Функция для инициализации фильтрации
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Функция для фильтрации проектов
    function filterProjects(filter) {
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                if (card.classList.contains(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    }
    
    // Обработчики событий для кнопок фильтрации
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Останавливаем всплытие события, чтобы не мешать модалкам
            e.stopPropagation();
            
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Получаем фильтр из data-атрибута
            const filter = this.getAttribute('data-filter');
            
            // Применяем фильтрацию
            filterProjects(filter);
        });
    });
}

// Запускаем фильтрацию когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', initProjectFilters);