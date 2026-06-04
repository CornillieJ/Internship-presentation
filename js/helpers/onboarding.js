

export function Initialize(){
    const onboardingOverlay = document.querySelector('.onboarding');
    if(!sessionStorage.getItem('onboarded')){
        // Show onboarding content
        onboardingOverlay.classList.remove('hidden');
    }else{
        onboardingOverlay.classList.add('hidden');
    }
}
export function completeOnboarding(){
    sessionStorage.setItem('onboarded', 'true');
    const onboardingOverlay = document.querySelector('.onboarding');
    onboardingOverlay.classList.add('hidden');
}