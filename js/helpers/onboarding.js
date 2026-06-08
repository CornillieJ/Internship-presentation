

export function initialize(){
    const onboardingOverlay = document.querySelector('.onboarding');
    if(!sessionStorage.getItem('onboarded')){
        // Show onboarding content
        onboardingOverlay.classList.remove('hidden');
    }else{
        onboardingOverlay.classList.add('hidden');
    }
    const resetButton = document.querySelector('.reset-onboarding');
    resetButton.addEventListener('click', resetOnboarding);
}
export function completeOnboarding(){
    sessionStorage.setItem('onboarded', 'true');
    const onboardingOverlay = document.querySelector('.onboarding');
    onboardingOverlay.classList.add('hidden');
}
export function resetOnboarding(){
    sessionStorage.removeItem('onboarded');
    const onboardingOverlay = document.querySelector('.onboarding');
    onboardingOverlay.classList.remove('hidden');
}