document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const nextStepBtn = document.getElementById('nextStepBtn');

    function nextStep() {
        // Validácia aktuálneho kroku
        if (!validateCurrentStep()) {
            return;
        }

        // Ak sme na poslednom kroku, odošleme formulár
        if (currentStep === 3) {
            submitForm();
            return;
        }

        // Prejdeme na ďalší krok
        currentStep++;
        updateUI();
    }

    function validateCurrentStep() {
        switch(currentStep) {
            case 1:
                const selectedSize = document.querySelector('input[name="size"]:checked');
                if (!selectedSize) {
                    alert('Prosím, vyberte rozmer postele.');
                    return false;
                }
                return true;

            case 2:
                const selectedMaterial = document.querySelector('input[name="material"]:checked');
                if (!selectedMaterial) {
                    alert('Prosím, vyberte materiál.');
                    return false;
                }
                return true;

            case 3:
                const form = document.getElementById('contactForm');
                return form.checkValidity();
        }
        return false;
    }

    function updateUI() {
        // Aktualizácia krokov
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        // Aktualizácia obsahu
        document.querySelectorAll('.step-content').forEach((content) => {
            content.classList.remove('active');
        });
        document.getElementById(`step${currentStep}`).classList.add('active');

        // Aktualizácia textu tlačidla
        nextStepBtn.textContent = currentStep === 3 ? 'Odoslať' : 'Pokračovať';
    }

    function submitForm() {
        const form = document.getElementById('contactForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = {
            size: document.querySelector('input[name="size"]:checked').value,
            material: document.querySelector('input[name="material"]:checked').value,
            contact: Object.fromEntries(formData)
        };

        fetch('/api/submit-configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            alert('Vaša konfigurácia bola úspešne odoslaná!');
            window.location.href = '/dakujeme';
        })
        .catch(() => {
            alert('Nastala chyba pri odosielaní. Skúste prosím znova.');
        });
    }

    // Pridanie event listenera na tlačidlo
    nextStepBtn.addEventListener('click', nextStep);

    // Inicializácia UI
    updateUI();
}); 