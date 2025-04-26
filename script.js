// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const testTypeSelect = document.getElementById('testType');
    const testType2Select = document.getElementById('testType2');
    const universityTypeSelect = document.getElementById('universityType');
    const scoreInput = document.getElementById('score');
    const score2Input = document.getElementById('score2');
    const gpaInput = document.getElementById('gpa');
    const calculateButton = document.getElementById('calculateButton');
    const dialogOverlay = document.getElementById('dialogOverlay');
    const dialogContent = document.getElementById('dialogContent');
    const testTypeLabel = document.getElementById('testTypeLabel');
    const testType2Label = document.getElementById('testType2Label');
    
    // Initial values
    let testType = 'SAT';
    let testType2 = 'ACT';
    let universityType = 'public';
    let score = 0;
    let score2 = 0;
    let gpa = 0;
    
    // Helper function to get score range
    function getScoreRange(type) {
        return type === "ACT" ? "0-36" : "0-1600";
    }
    
    // Update test type labels when selection changes
    testTypeSelect.addEventListener('change', function(e) {
        testType = e.target.value;
        testTypeLabel.innerHTML = `${testType} Score <span class="text-gray-500 text-sm">(${getScoreRange(testType)})</span>`;
        scoreInput.placeholder = `Enter your ${testType} score`;
    });
    
    testType2Select.addEventListener('change', function(e) {
        testType2 = e.target.value;
        testType2Label.innerHTML = `${testType2} Score <span class="text-gray-500 text-sm">(${getScoreRange(testType2)})</span>`;
        score2Input.placeholder = `Enter your ${testType2} score`;
    });
    
    universityTypeSelect.addEventListener('change', function(e) {
        universityType = e.target.value;
    });
    
    scoreInput.addEventListener('input', function(e) {
        score = Number(e.target.value);
    });
    
    score2Input.addEventListener('input', function(e) {
        score2 = Number(e.target.value);
    });
    
    gpaInput.addEventListener('input', function(e) {
        gpa = Number(e.target.value);
    });
    
    // Show dialog function
    function showDialog() {
        dialogOverlay.classList.add('active');
    }
    
    // Hide dialog function
    function hideDialog() {
        dialogOverlay.classList.remove('active');
    }
    
    // Close dialog when clicking outside
    dialogOverlay.addEventListener('click', function(e) {
        if (e.target === dialogOverlay) {
            hideDialog();
        }
    });
    
    // Calculate function
    calculateButton.addEventListener('click', function() {
        let error = '';
        let valid = true;
        
        // Validate first test score
        if (testType === "SAT" || testType === "EST") {
            if (score < 0 || score > 1600) {
                valid = false;
            }
        } else if (testType === "ACT") {
            if (score < 0 || score > 36) {
                valid = false;
            }
        }
        
        // Validate second test score
        if (testType2 === "SAT" || testType2 === "EST") {
            if (score2 < 0 || score2 > 1600) {
                valid = false;
            }
        } else if (testType2 === "ACT") {
            if (score2 < 0 || score2 > 36) {
                valid = false;
            }
        }
        
        if (gpa < 0 || gpa > 4.0) {
            valid = false;
        }
        
        if (!valid) {
            error = "Please enter valid scores within allowed ranges.";
            dialogContent.innerHTML = `
                <div class="flex flex-col items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle mb-2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p class="text-red-500 font-semibold">${error}</p>
                </div>
            `;
            showDialog();
            return;
        }
        
        let weight;
        if ((testType === "SAT" || testType === "EST") && score < 1090) {
            weight = 60;
        } else if ((testType === "SAT" || testType === "EST") && score >= 1090) {
            weight = universityType === "public" ? 69 : 75;
        } else if (testType === "ACT" && score < 21) {
            weight = 60;
        } else if (testType === "ACT" && score >= 21) {
            weight = universityType === "public" ? 69 : 75;
        }
        
        let finalScore = 0;
        
        // Calculate for first test
        if (testType === "SAT" || testType === "EST") {
            finalScore += (score / 1600) * weight;
        } else if (testType === "ACT") {
            finalScore += (score / 36) * weight;
        }
        
        // Calculate for second test
        if (testType2 === "SAT" || testType2 === "EST") {
            finalScore += (score2 / 1600) * 15;
        } else if (testType2 === "ACT") {
            finalScore += (score2 / 36) * 15;
        }
        
        // Add GPA: divide by 4 then multiply by 40
        const adjustedGpa = (gpa / 4) * 40;
        finalScore += adjustedGpa;
        
        const result = finalScore.toFixed(2);
        
        dialogContent.innerHTML = `
            <div class="flex flex-col items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle mb-2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h1>Dr. Mohamed Samy wishes you success </h1>
                <h3 class="text-xl font-bold mb-2">Your Score has been calculated!</h3>
                <div class="p-4 bg-blue-50 rounded-lg w-full">
                    <p class="text-lg">Final Score: <span class="text-blue-600 font-bold text-2xl">${result}</span></p>
                    <div class="text-sm text-gray-600 mt-2">
                        <p>Based on your ${testType} score, ${testType2} score, and GPA</p>
                        <p class="mt-1 text-xs">GPA contribution: ${((gpa / 4) * 40).toFixed(2)} points</p>
                    </div>
                </div>
            </div>
        `;
        
        showDialog();
    });
});
