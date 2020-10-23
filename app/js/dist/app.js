var minLoan = 1;
var maxLoan = 10000;
var minRepayment = 10;
var adminFeePercent = 5;
var lowerThreshold = 80;
var lowerThresholdFee = 500;
var higherThreshold = 90;
var higherThresholdFee = 500;
var fieldGroups = document.querySelectorAll('.fieldGroup');
var submit = document.querySelector('.submit');
window.addEventListener('load', function () {
    submit.disabled = true;
});
fieldGroups.forEach(function (group) {
    group.querySelector('.input').addEventListener('input', function () {
        validateOne(group);
        if (checkComplete(fieldGroups)) {
            submit.disabled = false;
        }
    });
});
document.querySelectorAll('.repaymentType').forEach(function (radio) {
    radio.addEventListener('input', function () {
        var repaymentType = document.querySelector('input[name="repaymentType"]:checked').value;
        var expectedSalaryGroup = document.querySelector('#expectedSalaryGroup');
        var repaymentAmountGroup = document.querySelector('#repaymentAmountGroup');
        var repaymentAmountText = document.querySelector('#repaymentAmountText');
        var repaymentAmountInput = document.querySelector('#repaymentAmount');
        if (repaymentType === '%') {
            repaymentAmountText.textContent = 'Monthly repayment %';
            repaymentAmountInput.placeholder = 'e.g. 10%';
            expectedSalaryGroup.hidden = false;
            repaymentAmountGroup.hidden = false;
        }
        else {
            repaymentAmountText.textContent = 'Monthly repayment £';
            repaymentAmountInput.placeholder = 'e.g. 100';
            expectedSalaryGroup.hidden = true;
            repaymentAmountGroup.hidden = false;
        }
    });
});
submit.addEventListener('click', function () {
    submitForm();
});
window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitForm();
    }
});
var showError = function (field, errorContainer, message) {
    field.style.borderColor = '#FF0000';
    errorContainer.innerHTML = "<span class='error' style='color: #FF0000'>" + message + "</span>";
    var firstError = document.querySelector('.error');
    firstError.parentElement.parentElement.scrollIntoView();
};
var hideError = function (group) {
    var field = group.querySelector('.input');
    var errorContainer = group.querySelector('.errorContainer');
    field.removeAttribute('style');
    errorContainer.innerHTML = "";
};
var validateLoan = function () {
    var group = document.querySelector('#loanGroup');
    var field = group.querySelector('.input');
    var val = parseInt(field.value);
    var errorContainer = group.querySelector('.errorContainer');
    if (val < minLoan || val > maxLoan) {
        showError(field, errorContainer, "Please enter a value between " + minLoan + " and " + maxLoan);
        return false;
    }
    else {
        hideError(group);
        return true;
    }
};
var validateRadios = function () {
    var radios = document.querySelectorAll('.repaymentType');
    var checked = false;
    radios.forEach(function (radio) {
        if (radio.checked) {
            checked = true;
        }
    });
    return checked;
};
var validateRepaymentAmount = function () {
    var group = document.querySelector('#repaymentAmountGroup');
    var field = group.querySelector('.input');
    var val = parseInt(field.value);
    var errorContainer = group.querySelector('.errorContainer');
    var repaymentType = document.querySelector('input[name="repaymentType"]:checked').value;
    switch (repaymentType) {
        case '%':
            if (val < minRepayment || val > 100) {
                showError(field, errorContainer, "Please enter a value between 10 and 100");
                return false;
            }
            else {
                hideError(group);
                return true;
            }
        case '£':
            if (val < 0) {
                showError(field, errorContainer, "Please enter a value greater than 0");
                return false;
            }
            else {
                hideError(group);
                return true;
            }
        default:
            hideError(group);
            return true;
    }
};
var validateExpectedSalary = function () {
    var group = document.querySelector('#expectedSalaryGroup');
    var field = group.querySelector('.input');
    var val = parseInt(field.value);
    var errorContainer = group.querySelector('.errorContainer');
    var repaymentType = document.querySelector('input[name="repaymentType"]:checked').value;
    if (repaymentType === '%' && val < 0) {
        showError(field, errorContainer, "Please enter a value greater than 0");
        return false;
    }
    else {
        hideError(group);
        return true;
    }
};
var checkComplete = function (groups) {
    var complete = true;
    var checked = validateRadios();
    if (checked) {
        var repaymentType_1 = document.querySelector('input[name="repaymentType"]:checked').value;
        groups.forEach(function (group) {
            var field = group.querySelector('.input');
            switch (group.id) {
                case 'loanGroup':
                    if (field.value === '') {
                        complete = false;
                    }
                    break;
                case 'repaymentAmountGroup':
                    if (checked && field.value === '') {
                        complete = false;
                    }
                    break;
                case 'expectedSalaryGroup':
                    if (checked && repaymentType_1 === '%' && field.value === '') {
                        complete = false;
                    }
                    break;
            }
        });
    }
    else {
        complete = false;
    }
    return complete;
};
var validateOne = function (group) {
    switch (group.id) {
        case 'loanGroup':
            return validateLoan();
        case 'repaymentTypeGroup':
            return validateRadios();
        case 'repaymentAmountGroup':
            return validateRepaymentAmount();
        case 'expectedSalaryGroup':
            return validateExpectedSalary();
        default:
            hideError(group);
            return true;
    }
};
var validateAll = function () {
    var loanResult = validateLoan();
    var radiosResult = validateRadios();
    if (radiosResult) {
        var repaymentType = document.querySelector('input[name="repaymentType"]:checked').value;
        var repaymentAmountResult = validateRepaymentAmount();
        if (repaymentType === '%') {
            var expectedSalaryResult = validateExpectedSalary();
        }
        else {
            expectedSalaryResult = true;
        }
    }
    else {
        repaymentAmountResult = false;
        expectedSalaryResult = false;
    }
    return loanResult && radiosResult && repaymentAmountResult && expectedSalaryResult;
};
var calculateAdditionalFee = function (loan) {
    var additionalFee;
    var ratio = (loan / maxLoan) * 100;
    if (ratio > higherThreshold) {
        additionalFee = lowerThresholdFee + higherThresholdFee;
    }
    else if (ratio > lowerThreshold) {
        additionalFee = lowerThresholdFee;
    }
    else {
        additionalFee = 0;
    }
    return additionalFee;
};
var calculateUpfrontFee = function (totalLoan, adminFeePercent) {
    return Math.round(totalLoan * (adminFeePercent / 100));
};
var calculateTimeToRepay = function (totalLoan, upfrontFee) {
    var radios = document.querySelectorAll('.repaymentType');
    var checked = false;
    var repaymentType = null;
    radios.forEach(function (radio) {
        if (radio.checked) {
            checked = true;
            repaymentType = radio.value;
        }
    });
    var repaymentAmount = parseInt(document.querySelector('.repaymentAmount').value);
    var expectedSalary = parseInt(document.querySelector('.expectedSalary').value);
    if (repaymentType === '%') {
        repaymentAmount = (expectedSalary / 12) * (repaymentAmount / 100);
    }
    return Math.round((totalLoan - upfrontFee) / repaymentAmount);
};
var displayResults = function (totalAmount, adminFee, timeToRepay) {
    var totalAmountSpan = document.querySelector('.totalAmount');
    var adminFeeSpan = document.querySelector('.adminFee');
    var timeToRepaySpan = document.querySelector('.timeToRepay');
    var resultsDiv = document.querySelector('.results');
    var years = Math.floor(timeToRepay / 12);
    if (years > 0) {
        var months = timeToRepay - (years * 12);
    }
    else {
        months = timeToRepay;
    }
    var monthsString;
    switch (true) {
        case months === 1:
            monthsString = months + " month";
            break;
        case months === 0 && years > 0:
            monthsString = '';
            break;
        default:
            monthsString = months + " months";
    }
    var yearsString;
    switch (true) {
        case years === 0:
            yearsString = "";
            break;
        case years === 1:
            yearsString = years + " year";
            break;
        default:
            yearsString = years + " years";
    }
    if (monthsString === '' || yearsString === '') {
        var concat = '';
    }
    else {
        concat = ' and ';
    }
    totalAmountSpan.textContent = "\u00A3" + totalAmount;
    adminFeeSpan.textContent = "\u00A3" + adminFee;
    timeToRepaySpan.textContent = "" + yearsString + concat + monthsString;
    resultsDiv.hidden = false;
};
var submitForm = function () {
    if (validateAll()) {
        var loan = parseInt(document.querySelector('.loan').value);
        var additionalFee = calculateAdditionalFee(loan);
        var totalLoan = Math.round(additionalFee + loan);
        var upfrontFee = calculateUpfrontFee(totalLoan, adminFeePercent);
        var timeToRepay = calculateTimeToRepay(totalLoan, upfrontFee);
        displayResults(totalLoan, upfrontFee, timeToRepay);
    }
};
