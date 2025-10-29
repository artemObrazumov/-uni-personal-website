document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addEntryModal');
    const addBtn = document.getElementById('addEntryBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('addEntryForm');
    const diaryEntries = document.querySelector('.diary-entries');

    addBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
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
        
        const newEntry = document.createElement('div');
        newEntry.className = 'entry';
        newEntry.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${formattedDate}</span>
                <span class="entry-status ${statusClass}">${statusText}</span>
            </div>
            <p>${title}</p>
            <p>${description}</p>
        `;
        
        diaryEntries.append(newEntry, diaryEntries.firstChild);
        
        form.reset();
        modal.style.display = 'none';
    });
});