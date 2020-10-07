const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const PLAYER_STRONG_ATTACK_VALUE = 20;
const PLAYER_HEAL_VALUE = 20;
let enteredMax = prompt('ENTER MAX HEALTH FOR YOU AND MONSTER', '100');
let chosenMaxLife = parseInt(enteredMax);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
adjustHealthBars(chosenMaxLife); //INITIAL GAME STAGE

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}
function endRound() {
    let initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    if (currentPlayerHealth <= 0 && hasBonusLife === true) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert('BONUS LIFE SAVED YOU!!!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('YOU WON!!!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('YOU LOST!!');
    } else if (currentMonsterHealth < 0 && currentPlayerHealth < 0) {
        alert('MATCH DRAW');
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(attackMode) {
    let maxDamage;
    if (attackMode === 'ATTACK') {
        maxDamage = PLAYER_ATTACK_VALUE;
    } else if (attackMode === 'STRONG_ATTACK') {
        maxDamage = PLAYER_STRONG_ATTACK_VALUE;
    }
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;
    endRound();
}

function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function playerHealHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - PLAYER_HEAL_VALUE) {
        //WE CAN'T HEAL IF WE ARE HAVING ENOUGH HEALTH
        alert('YOU CAN NOT HEAL AS YOU HAVE ENOUGH HEALTH!');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = PLAYER_HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    endRound();
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', playerHealHandler);
