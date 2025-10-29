document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/;
    
    function showMessage(text, type) {
        const existingMessages = formMessages.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        formMessages.appendChild(messageDiv);
    }
    
    function showFieldError(field, errorElement, message) {
        field.classList.add('error');
        field.classList.remove('success');
        errorElement.textContent = message;
    }
    
    function clearFieldError(field, errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
    
    function markFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
    }
    
    function validateName() {
        const value = nameInput.value.trim();
        
        if (!value) {
            showFieldError(nameInput, nameError, 'Поле обязательно для заполнения');
            return false;
        }
        
        if (!nameRegex.test(value)) {
            showFieldError(nameInput, nameError, 'Имя должно содержать только буквы и быть от 2 до 50 символов');
            return false;
        }
        
        clearFieldError(nameInput, nameError);
        markFieldSuccess(nameInput);
        return true;
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        
        if (!value) {
            showFieldError(emailInput, emailError, 'Поле обязательно для заполнения');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showFieldError(emailInput, emailError, 'Введите корректный email адрес');
            return false;
        }
        
        clearFieldError(emailInput, emailError);
        markFieldSuccess(emailInput);
        return true;
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        
        if (!value) {
            showFieldError(messageInput, messageError, 'Поле обязательно для заполнения');
            return false;
        }
        
        if (value.length < 10) {
            showFieldError(messageInput, messageError, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }
        
        if (value.length > 1000) {
            showFieldError(messageInput, messageError, 'Сообщение не должно превышать 1000 символов');
            return false;
        }
        
        clearFieldError(messageInput, messageError);
        markFieldSuccess(messageInput);
        return true;
    }
    
    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        return isNameValid && isEmailValid && isMessageValid;
    }
    
    function clearForm() {
        contactForm.reset();
        
        [nameInput, emailInput, messageInput].forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        [nameError, emailError, messageError].forEach(errorElement => {
            errorElement.textContent = '';
        });
    }
    
    function submitForm() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
    }
    
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(nameInput, nameError);
        }
    });
    
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(emailInput, emailError);
        }
    });
    
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(messageInput, messageError);
        }
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showMessage('Сообщение отправлено!', 'success');
        clearForm();
    });
    
    contactForm.addEventListener('input', function() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const allFieldsFilled = nameInput.value.trim() && 
                              emailInput.value.trim() && 
                              messageInput.value.trim();
        
        if (allFieldsFilled) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });
});