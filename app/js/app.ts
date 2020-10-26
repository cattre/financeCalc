// MA fixed variables
const minLoan: number = 1 // £
const maxLoan: number = 10000 // £
const minRepayment: number = 10 // %
const adminFeePercent: number = 5 // %
const lowerThreshold: number = 80 // %
const lowerThresholdFee: number = 500 // £
const higherThreshold: number = 90 // %
const higherThresholdFee: number = 500 // £

// Display intro text
document.querySelector('.intro').innerHTML =
`<p>You can use this calculator to get a rough idea of the length of time it will take to repay your loan.</p>
<p>You can borrow anything up to the full amount of the course (£${maxLoan}). An addiitonal fee of £${lowerThresholdFee} is payable for loans above ${lowerThreshold}%, a further fee of £${higherThresholdFee} is payable for loans above ${higherThreshold}%.</p>
<p>Please note, the details you provide in this form are not actually submitted and therefore are not accessible by us or anyone else.</p>`


let fieldGroups = document.querySelectorAll('.fieldGroup')
let submit = <HTMLInputElement>document.querySelector('.submit')

window.addEventListener('load', (): void => {
    submit.disabled = true
})

// Validate after each field change
fieldGroups.forEach((group: HTMLElement): void => {
    group.querySelector('.input').addEventListener('input', () => {
        validateOne(group)
        if (checkComplete(fieldGroups)) {
            submit.disabled = false
        }
    })
})

// Change visibility of repayment fields
document.querySelectorAll('.repaymentType').forEach(radio => {
    radio.addEventListener('input', (): void => {
        let repaymentType: string = (<HTMLInputElement>document.querySelector('input[name="repaymentType"]:checked')).value
        let expectedSalaryGroup: HTMLElement = document.querySelector('#expectedSalaryGroup')
        let repaymentAmountGroup: HTMLElement = document.querySelector('#repaymentAmountGroup')
        let repaymentAmountText: HTMLElement = document.querySelector('#repaymentAmountText')
        let repaymentAmountInput: HTMLInputElement = document.querySelector('#repaymentAmount')

        if (repaymentType === '%') {
            repaymentAmountText.textContent = 'Monthly repayment %'
            repaymentAmountInput.placeholder = 'e.g. 10%'
            expectedSalaryGroup.hidden = false
            repaymentAmountGroup.hidden = false
        } else {
            repaymentAmountText.textContent = 'Monthly repayment £'
            repaymentAmountInput.placeholder = 'e.g. 100'
            expectedSalaryGroup.hidden = true
            repaymentAmountGroup.hidden = false
        }
    })
})

// Submit form
submit.addEventListener('click', (): void => {
    submitForm()
})

window.addEventListener('keypress', (e): void => {
    if (e.key === 'Enter') {
        submitForm()
    }
})

/**
 * Shows error against field
 *
 * @param field
 *              Specific field
 * @param errorContainer
 *              Error container
 * @param message
 *              Error message
 */
let showError = (field: HTMLElement, errorContainer: HTMLElement, message: string): void => {
    field.style.borderColor = '#FF0000'
    errorContainer.innerHTML = `<span class='error' style='color: #FF0000'>${message}</span>`
    let firstError: HTMLElement = document.querySelector('.error')
    firstError.parentElement.parentElement.scrollIntoView()
}

/**
 * Hides error from field
 *
 * @param group
 *              Field group
 */
let hideError = (group: HTMLElement): void => {
    let field: HTMLInputElement = group.querySelector('.input')
    let errorContainer: HTMLElement = group.querySelector('.errorContainer')

    field.removeAttribute('style')
    errorContainer.innerHTML = ``
}

/**
 * Validates loan field
 */
let validateLoan = (): boolean => {

    let group: HTMLElement = document.querySelector('#loanGroup')
    let field: HTMLInputElement = group.querySelector('.input')
    let val: number = parseInt(field.value)
    let errorContainer: HTMLElement = group.querySelector('.errorContainer')

    if (val < minLoan || val > maxLoan) {
        showError(field, errorContainer, `Please enter a value between ${minLoan} and ${maxLoan}`)
        return false
    } else {
        hideError(group)
        return true
    }
}

/**
 * Validates radio buttons
 */
let validateRadios = (): boolean => {

    let radios: NodeList = document.querySelectorAll('.repaymentType')
    var checked: boolean = false

    radios.forEach((radio: HTMLInputElement) => {
        if (radio.checked) {
            checked = true
        }
    })

    return checked
}

/**
 * Validates repayment amount field
 */
let validateRepaymentAmount = (): boolean => {

    let group: HTMLElement = document.querySelector('#repaymentAmountGroup')
    let field: HTMLInputElement = group.querySelector('.input')
    let val: number = <number>parseInt(field.value)
    let errorContainer: HTMLElement = group.querySelector('.errorContainer')
    let repaymentType: string = (<HTMLInputElement>document.querySelector('input[name="repaymentType"]:checked')).value

    switch (repaymentType) {
        case '%':
            if (val < minRepayment || val > 100) {
                showError(field, errorContainer, `Please enter a value between 10 and 100`)
                return false
            } else {
                hideError(group)
                return true
            }
        case '£':
            if (val < 0) {
                showError(field, errorContainer, `Please enter a value greater than 0`)
                return false
            } else {
                hideError(group)
                return true
            }
        default:
            hideError(group)
            return true
    }
}

/**
 * Validates expected salary field
 *
 */
let validateExpectedSalary = (): boolean => {

    let group: HTMLElement = document.querySelector('#expectedSalaryGroup')
    let field: HTMLInputElement = group.querySelector('.input')
    let val: number = <number>parseInt(field.value)
    let errorContainer: HTMLElement = group.querySelector('.errorContainer')
    let repaymentType: string = (<HTMLInputElement>document.querySelector('input[name="repaymentType"]:checked')).value

    if (repaymentType === '%' && val < 0) {
        showError(field, errorContainer, `Please enter a value greater than 0`)
        return false
    } else {
        hideError(group)
        return true
    }
}

/**
 * Checks all fields completed
 *
 * @param groups
 *              Field groups
 */
let checkComplete = (groups: NodeList): boolean => {
    let complete: boolean = true
    let checked: boolean = validateRadios()

    if (checked) {
        let repaymentType: string = (<HTMLInputElement>document.querySelector('input[name="repaymentType"]:checked')).value

        groups.forEach((group: HTMLElement) => {
            let field: HTMLInputElement = group.querySelector('.input')
            switch (group.id) {
                case 'loanGroup':
                    if (field.value === '') {
                        complete = false
                    }
                    break
                case 'repaymentAmountGroup':
                    if (checked && field.value === '') {
                        complete = false
                    }
                    break
                case 'expectedSalaryGroup':
                    if (checked && repaymentType === '%' && field.value === '') {
                        complete = false
                    }
                    break
            }
        })
    } else {
        complete = false
    }
    return complete
}

/**
 * Validate input field within specified field group
 *
 * @param group
 *              Field group
 */
let validateOne = (group:HTMLElement): boolean => {
    switch (group.id) {
        case 'loanGroup':
            return validateLoan()
        case 'repaymentTypeGroup':
            return validateRadios()
        case 'repaymentAmountGroup':
            return validateRepaymentAmount()
        case 'expectedSalaryGroup':
            return validateExpectedSalary()
        default:
            hideError(group)
            return true
    }
}

/**
 * Calls validation functions for all groups
 *
 * @returns {boolean}
 *                  Overall validation result
 */
let validateAll = (): boolean => {
    var loanResult: boolean = validateLoan()
    var radiosResult: boolean = validateRadios()

    if (radiosResult) {
        var repaymentType: string = (<HTMLInputElement>document.querySelector('input[name="repaymentType"]:checked')).value
        var repaymentAmountResult: boolean = validateRepaymentAmount()

        if (repaymentType === '%') {
            var expectedSalaryResult: boolean = validateExpectedSalary()
        } else {
            expectedSalaryResult = true
        }
    } else {
        repaymentAmountResult = false
        expectedSalaryResult = false
    }

    return loanResult && radiosResult && repaymentAmountResult && expectedSalaryResult;
}

/**
 * Calculates additional admin fee payable
 *
 * @param loan
 *                  Loan requested
 * @returns {number}
 *                  Additional admin fee
 */
let calculateAdditionalFee = (loan: number): number => {
    let additionalFee: number
    let ratio: number = (loan/maxLoan) * 100

    if (ratio > higherThreshold) {
        additionalFee = lowerThresholdFee + higherThresholdFee
    } else if (ratio > lowerThreshold) {
        additionalFee = lowerThresholdFee
    } else {
        additionalFee = 0
    }
    return additionalFee
}

/**
 * Calculates upfront admin fee payable
 *
 * @param totalLoan
 *                      Total loan repayable
 * @param adminFeePercent
 *                      Admin fee percentage
 * @returns {number}
 *                      Upfront admin fee
 */
let calculateUpfrontFee = (totalLoan: number, adminFeePercent: number): number => {
    return Math.round(totalLoan * (adminFeePercent / 100))
}

/**
 * Calculates total time in months to repay loan
 *
 * @param totalLoan
 *                  Total loan amount
 * @param upfrontFee
 *                  Upfront admin fee
 * @returns {number}
 *                  Duration until fully repaid (months)
 */
let calculateTimeToRepay = (totalLoan: number, upfrontFee: number): number => {

    let radios: NodeList = document.querySelectorAll('.repaymentType')
    var checked: boolean = false
    var repaymentType: string = null

    radios.forEach((radio: HTMLInputElement) => {
        if (radio.checked) {
            checked = true
            repaymentType = radio.value
        }
    })

    let repaymentAmount: number = parseInt((<HTMLInputElement>document.querySelector('.repaymentAmount')).value)
    let expectedSalary: number = parseInt((<HTMLInputElement>document.querySelector('.expectedSalary')).value)

    if (repaymentType === '%') {
        repaymentAmount = (expectedSalary / 12) * (repaymentAmount / 100)
    }

    return Math.round((totalLoan - upfrontFee) / repaymentAmount)
}

/**
 * Display results on page
 *
 * @param additionalFee
 *                  Additional fee to add to loan
 * @param totalAmount
 *                  Total amount of loan
 * @param adminFee
 *                  Upfront admin fee payable
 * @param timeToRepay
 *                  Time to repay total loan
 */
let displayResults = (additionalFee: number, totalAmount: number, adminFee: number, timeToRepay: number): void => {
    let additionalFeeSpan: HTMLElement = document.querySelector('.additionalFee')
    let totalAmountSpan: HTMLElement = document.querySelector('.totalAmount')
    let adminFeeSpan: HTMLElement = document.querySelector('.adminFee')
    let timeToRepaySpan: HTMLElement = document.querySelector('.timeToRepay')
    let resultsDiv: HTMLElement = document.querySelector('.results')

    // Get values
    var years: number = Math.floor(timeToRepay / 12)

    if (years > 0) {
        var months: number = timeToRepay - (years * 12)
    } else {
        months = timeToRepay
    }

    // Get month string
    var monthsString: string
    switch (true) {
        case months === 1:
            monthsString = `${months} month`
            break
        case months === 0 && years > 0:
            monthsString = ''
            break
        default:
            monthsString = `${months} months`
    }

    // Get year string
    var yearsString: string
    switch (true) {
        case years === 0:
            yearsString = ``
            break
        case years === 1:
            yearsString = `${years} year`
            break
        default:
            yearsString = `${years} years`
    }

    // Get concat string
    if (monthsString === '' || yearsString === '') {
        var concat: string = ''
    } else {
        concat = ' and '
    }

    additionalFeeSpan.textContent = `£${additionalFee}`
    totalAmountSpan.textContent = `£${totalAmount}`
    adminFeeSpan.textContent = `£${adminFee}`
    timeToRepaySpan.textContent = `${yearsString}${concat}${monthsString}`

    resultsDiv.hidden = false
}

/**
 * Runs separate functions to generate results
 *
 */
let submitForm = (): void => {
    if (validateAll()) {

        let loan = parseInt((<HTMLInputElement>document.querySelector('.loan')).value)
        let additionalFee = calculateAdditionalFee(loan)
        let totalLoan = Math.round(additionalFee + loan)
        let upfrontFee = calculateUpfrontFee(totalLoan, adminFeePercent)
        let timeToRepay = calculateTimeToRepay(totalLoan, upfrontFee)

        displayResults(additionalFee, totalLoan, upfrontFee, timeToRepay)
    }
}