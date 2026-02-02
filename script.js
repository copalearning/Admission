document.addEventListener('DOMContentLoaded', () => {
    const traineeForm = document.getElementById('trainee-form');
    const traineeTableBody = document.querySelector('#trainee-table tbody');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const modifyBtn = document.getElementById('modify-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const exportBtn = document.getElementById('export-btn');
    const printBtn = document.getElementById('print-btn');
    const exitBtn = document.getElementById('exit-btn');
    const regNoInput = document.getElementById('reg-no');
    const photoInput = document.getElementById('photo-input');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const photoPreview = document.getElementById('photo-preview');

    let trainees = JSON.parse(localStorage.getItem('traineesV2')) || [];
    let selectedRegNo = null;
    let photoDataUrl = null;

    const renderTable = () => {
        traineeTableBody.innerHTML = '';
        trainees.forEach(trainee => {
            const row = document.createElement('tr');
            row.dataset.regNo = trainee.regNo;
            row.innerHTML = `
                <td><img src="${trainee.photo || ''}" alt="Photo" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${trainee.regNo}</td>
                <td>${trainee.fullName}</td>
                <td>${trainee.fatherName}</td>
                <td>${trainee.dob}</td>
                <td>${trainee.address}</td>
                <td>${trainee.religion}</td>
                <td>${trainee.subcaste}</td>
                <td>${trainee.caste}</td>
                <td>${trainee.admissionDate}</td>
                <td>${trainee.trade}</td>
                <td>${trainee.bankName}</td>
                <td>${trainee.accountNumber}</td>
                <td>${trainee.ifscCode}</td>
                <td>${trainee.adhaarNumber}</td>
            `;
            traineeTableBody.appendChild(row);
        });
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('traineesV2', JSON.stringify(trainees));
    };

    const clearForm = () => {
        traineeForm.reset();
        selectedRegNo = null;
        regNoInput.disabled = false;
        photoPreview.src = '';
        photoDataUrl = null;
    };

    addPhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoDataUrl = event.target.result;
                photoPreview.src = photoDataUrl;
            };
            reader.readAsDataURL(file);
        }
    });

    traineeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTrainee = {
            regNo: regNoInput.value,
            fullName: document.getElementById('full-name').value,
            fatherName: document.getElementById('father-name').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            religion: document.getElementById('religion').value,
            subcaste: document.getElementById('subcaste').value,
            caste: document.getElementById('caste').value,
            admissionDate: document.getElementById('admission-date').value,
            trade: document.getElementById('trade').value,
            bankName: document.getElementById('bank-name').value,
            accountNumber: document.getElementById('account-number').value,
            ifscCode: document.getElementById('ifsc-code').value,
            adhaarNumber: document.getElementById('adhaar-number').value,
            photo: photoDataUrl
        };

        if (trainees.some(t => t.regNo === newTrainee.regNo)) {
            alert('A trainee with this registration number already exists.');
            return;
        }

        trainees.push(newTrainee);
        saveToLocalStorage();
        renderTable();
        clearForm();
    });

    clearBtn.addEventListener('click', clearForm);

    traineeTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        selectedRegNo = row.dataset.regNo;
        const trainee = trainees.find(t => t.regNo === selectedRegNo);

        if (trainee) {
            regNoInput.value = trainee.regNo;
            document.getElementById('full-name').value = trainee.fullName;
            document.getElementById('father-name').value = trainee.fatherName;
            document.getElementById('dob').value = trainee.dob;
            document.getElementById('address').value = trainee.address;
            document.getElementById('religion').value = trainee.religion;
            document.getElementById('subcaste').value = trainee.subcaste;
            document.getElementById('caste').value = trainee.caste;
            document.getElementById('admission-date').value = trainee.admissionDate;
            document.getElementById('trade').value = trainee.trade;
            document.getElementById('bank-name').value = trainee.bankName;
            document.getElementById('account-number').value = trainee.accountNumber;
            document.getElementById('ifsc-code').value = trainee.ifscCode;
            document.getElementById('adhaar-number').value = trainee.adhaarNumber;
            photoPreview.src = trainee.photo || '';
            photoDataUrl = trainee.photo;
            regNoInput.disabled = true;
        }
    });

    modifyBtn.addEventListener('click', () => {
        if (!selectedRegNo) {
            alert('Please select a record to modify.');
            return;
        }

        const index = trainees.findIndex(t => t.regNo === selectedRegNo);
        if (index !== -1) {
            trainees[index] = {
                regNo: selectedRegNo,
                fullName: document.getElementById('full-name').value,
                fatherName: document.getElementById('father-name').value,
                dob: document.getElementById('dob').value,
                address: document.getElementById('address').value,
                religion: document.getElementById('religion').value,
                subcaste: document.getElementById('subcaste').value,
                caste: document.getElementById('caste').value,
                admissionDate: document.getElementById('admission-date').value,
                trade: document.getElementById('trade').value,
                bankName: document.getElementById('bank-name').value,
                accountNumber: document.getElementById('account-number').value,
                ifscCode: document.getElementById('ifsc-code').value,
                adhaarNumber: document.getElementById('adhaar-number').value,
                photo: photoDataUrl
            };
            saveToLocalStorage();
            renderTable();
            clearForm();
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (!selectedRegNo) {
            alert('Please select a record to delete.');
            return;
        }

        if (confirm('Are you sure you want to delete this record?')) {
            trainees = trainees.filter(t => t.regNo !== selectedRegNo);
            saveToLocalStorage();
            renderTable();
            clearForm();
        }
    });

    const exportToCsv = () => {
        const headers = [
            "Registration No.",
            "Full Name",
            "Father's Name",
            "Date of Birth",
            "Address",
            "Religion",
            "Sub-caste",
            "Caste",
            "Admission Date",
            "Trade",
            "Bank Name",
            "Account No.",
            "IFSC Code",
            "Aadhaar No."
        ];

        const csvRows = [headers.join(',')];

        for (const trainee of trainees) {
            const values = [
                trainee.regNo,
                trainee.fullName,
                trainee.fatherName,
                trainee.dob,
                trainee.address,
                trainee.religion,
                trainee.subcaste,
                trainee.caste,
                trainee.admissionDate,
                trainee.trade,
                trainee.bankName,
                trainee.accountNumber,
                trainee.ifscCode,
                trainee.adhaarNumber
            ].map(value => {
                const stringValue = String(value || '');
                if (stringValue.includes(',')) {
                    return `"${stringValue}"`;
                }
                return stringValue;
            });
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'trainee_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    exportBtn.addEventListener('click', exportToCsv);

    printBtn.addEventListener('click', () => {
        window.print();
    });

    exitBtn.addEventListener('click', () => {
        window.close();
    });

    renderTable();
});