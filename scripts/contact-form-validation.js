document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/;

    formMessages.setAttribute('aria-live', 'polite');
    formMessages.setAttribute('role', 'status');

    function showMessage(text, type) {
        const existingMessages = formMessages.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.setAttribute('role', 'alert');
        formMessages.appendChild(messageDiv);

        if (type === 'success') {
            formMessages.setAttribute('aria-live', 'assertive');
        }
    }
    
    function showFieldError(field, errorElement, message) {
        field.classList.add('error');
        field.classList.remove('success');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
    
    function clearFieldError(field, errorElement) {
        field.classList.remove('error');
        field.classList.remove('success');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        errorElement.textContent = '';
        errorElement.removeAttribute('role');
    }
    
    function markFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
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
    
    function updateSubmitButton() {
        const allFieldsFilled = nameInput.value.trim() && 
                              emailInput.value.trim() && 
                              messageInput.value.trim();
        
        if (allFieldsFilled) {
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-describedby', 'submitReady');
        } else {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-describedby', 'submitHelp');
        }
    }
    
    function clearForm() {
        contactForm.reset();
        
        [nameInput, emailInput, messageInput].forEach(field => {
            field.classList.remove('error', 'success');
            field.setAttribute('aria-invalid', 'false');
        });
        
        [nameError, emailError, messageError].forEach(errorElement => {
            errorElement.textContent = '';
            errorElement.removeAttribute('role');
        });
        
        updateSubmitButton();
    }
    
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(nameInput, nameError);
        }
        updateSubmitButton();
    });
    
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(emailInput, emailError);
        }
        updateSubmitButton();
    });
    
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', function() {
        if (this.value.trim()) {
            clearFieldError(messageInput, messageError);
        }
        updateSubmitButton();
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Отправка...';
            
            setTimeout(function() {
                showMessage('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                clearForm();
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Отправить сообщение';
                
                contactForm.querySelector('fieldset').setAttribute('aria-disabled', 'true');
                setTimeout(() => {
                    contactForm.querySelector('fieldset').removeAttribute('aria-disabled');
                }, 100);
                
            }, 1500);
        } else {
            showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
            const firstErrorField = contactForm.querySelector('[aria-invalid="true"]');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
    });

    contactForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
        }
    });

    updateSubmitButton();
});