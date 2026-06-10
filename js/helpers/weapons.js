import * as UTILS from './utils.js';

class Weapon {
    element = null;
    ammoElement = null;
    currentAmmo = 0;
    maxAmmo = 0;
    isActive = false;
    isPickaxe = false;
    isReloading = false;
    isShooting = false;
    reloadTime = 2000; // 2 seconds reload time
    reloadingTimeOut = null;
    shootTime = 500; // 0.5 seconds shooting time

    constructor(element){
        this.element = element;
        this.ammoElement = element.querySelector('.ammo');
        if(this.ammoElement){
            this.maxAmmo = parseInt(this.ammoElement.textContent);
            this.currentAmmo = this.maxAmmo;
        }else{
            this.isPickaxe = true;
        }
        this.element.addEventListener('click', () => this.toggleActive());
    }
    shoot(){
        if(this.isPickaxe) return true; // pickaxe doesn't shoot, but it hits
        if(this.isReloading) return false; // can't shoot while reloading
        if(this.isShooting) return false;
        if(this.currentAmmo <= 0) return false; // no ammo to shoot
        this.isShooting = true;

        this.currentAmmo--;
        this.ammoElement.textContent = this.currentAmmo;
        if(this.currentAmmo <= 0){
            this.reload();
        }
        crosshair.classList.add('shot');
        setTimeout(() => {
            crosshair.classList.remove('shot');
            this.isShooting = false;
        }, this.shootTime);
        return true;
    }
    reload(){
        if(this.isPickaxe) return;
        this.isReloading = true;
        this.ammoElement.textContent = 'Reloading...';
        this.ammoElement.classList.remove('has-ammo');
        crosshair.classList.add('reloading');
        this.reloadingTimeOut = setTimeout(() => {
            this.currentAmmo = this.maxAmmo;
            this.ammoElement.textContent = this.currentAmmo;
            this.isReloading = false;
            this.resetReloadVisuals();
        }, this.reloadTime);
    }

    resetReloadVisuals(){
        this.ammoElement.classList.add('has-ammo');
        crosshair.classList.remove('reloading');
    }

    toggleActive() {
        weapons.forEach(w => {if(w !== this) w.deactivate();});
        this.isActive = !this.isActive;
        this.element.classList.toggle('active-weapon', this.isActive);

        if(this.isPickaxe) return;

        document.body.classList.add('equipped');
        crosshair.classList.add('tracking');
        if(this.isReloading){
            crosshair.classList.add('reloading');
            this.reload();
        }
    }
    deactivate() {
        this.isActive = false;
        this.element.classList.remove('active-weapon');
        document.body.classList.remove('equipped');
        crosshair.classList.remove('tracking');
        crosshair.classList.remove('reloading');
        if(this.isReloading){
            clearTimeout(this.reloadingTimeOut);
            this.resetReloadVisuals();
            this.ammoElement.textContent = this.currentAmmo;
        }
    }
}

const weapons = [];
let crosshair;

export function initialize(){
    const foundWeapons = document.querySelectorAll('.hud-weapon');
    const canvas = document.querySelector('#ripple-canvas');

    foundWeapons.forEach((element, index) => {
        const weapon = new Weapon(element);
        if(index === 2) weapon.shootTime = 100;
        weapons.push(weapon);
    });
    crosshair = document.createElement('div');
    crosshair.classList.add('crosshair');
    document.body.appendChild(crosshair);
    crosshair.addEventListener('click', shootActiveWeapon);
    window.addEventListener('wheel', activateWeaponOnScroll);
    window.addEventListener('mousedown', shootActiveWeapon);
    window.addEventListener('mousemove', showCrosshair);
}

function showCrosshair(e){
    if(!document.body.classList.contains('equipped')) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    crosshair.style.left = `${mouseX}px`;
    crosshair.style.top = `${mouseY}px`;
    crosshair.style.cursor = 'none';
}
function getActiveWeapon(){
    return weapons.find(w => w.isActive);
}
function shootActiveWeapon(e){
    if(UTILS.isDescendentOfClass(e.target, 'hud-weapon')) return;
    const activeWeapon = getActiveWeapon();
    if(!activeWeapon) return;
    const shot = activeWeapon.shoot();
}
function activateWeaponOnScroll(e){
    if(UTILS.isDescendentOfClass(e.target, 'card-visual')) return;
    const activeWeapon = getActiveWeapon();
    if(e.deltaY > 0){
        if(activeWeapon){
            const currentIndex = weapons.indexOf(activeWeapon);
            const nextIndex = (currentIndex + 1) % weapons.length;
            weapons[nextIndex].toggleActive();
        }else{
            weapons[0].toggleActive();
        }
    }else if(e.deltaY < 0){
        if(activeWeapon){
            const currentIndex = weapons.indexOf(activeWeapon);
            const nextIndex = (currentIndex - 1 + weapons.length) % weapons.length;
            weapons[nextIndex].toggleActive();
        }else{
            weapons[0].toggleActive();
        }
    }
}