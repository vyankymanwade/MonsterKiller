const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const PLAYER_STRONG_ATTACK_VALUE = 20;
const PLAYER_HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let enteredMax = prompt('ENTER MAX HEALTH FOR YOU AND MONSTER', '100');
let chosenMaxLife = parseInt(enteredMax);
let battleLog = [];
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife); //INITIAL GAME STAGE

function writeToLog(event, value, playerHealth, monsterHealth) {
    logEntry = {
        event: event,
        value: value,
        finalPlayerHealth: playerHealth,
        finalMonsterHealth: monsterHealth,
    };
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        default:
            logEntry = {};
            break;
    }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    let initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentPlayerHealth,
        currentMonsterHealth
    );
    if (currentPlayerHealth <= 0 && hasBonusLife === true) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert('BONUS LIFE SAVED YOU!!!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('YOU WON!!!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentPlayerHealth,
            currentMonsterHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('YOU LOST!!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER LOST',
            currentPlayerHealth,
            currentMonsterHealth
        );
    } else if (currentMonsterHealth < 0 && currentPlayerHealth < 0) {
        alert('MATCH DRAW');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentPlayerHealth,
            currentMonsterHealth
        );
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(attackMode) {
    let maxDamage;
    let event;
    if (attackMode === MODE_ATTACK) {
        maxDamage = PLAYER_ATTACK_VALUE;
        event = LOG_EVENT_PLAYER_ATTACK;
    } else if (attackMode === MODE_STRONG_ATTACK) {
        maxDamage = PLAYER_STRONG_ATTACK_VALUE;
        event = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;
    writeToLog(event, maxDamage, currentPlayerHealth, currentMonsterHealth);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
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
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentPlayerHealth,
        currentMonsterHealth
    );
    endRound();
}

function logHandler() {
    for (const log of battleLog) {
        for (const key in log) {
            console.log(`${key} => ${log[key]}`);
        }
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', playerHealHandler);
logBtn.addEventListener('click', logHandler);
