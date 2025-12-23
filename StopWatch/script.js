let startTime = 0, elapsed = 0, timer;
let laps = [];
let rounds = [];
let isRunning = false;
let currentRoundId = null;

const time = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const lapList = document.getElementById("laps");
const recordsDiv = document.getElementById('records');

function format(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const ms3 = Math.floor(ms % 1000);
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(ms3).padStart(3,"0")}`;
}

startBtn.onclick = () => {
    startTime = Date.now() - elapsed;
    timer = setInterval(() => {
        elapsed = Date.now() - startTime;
        time.textContent = format(elapsed);
    }, 10);
    startBtn.disabled = true;
    resetBtn.disabled = true; 
    stopBtn.disabled = lapBtn.disabled = false;
    isRunning = true;
    
    currentRoundId = null;
};

stopBtn.onclick = () => {
    clearInterval(timer);
    stopBtn.disabled = lapBtn.disabled = true;
    resetBtn.disabled = false;
    startBtn.disabled = false; 
    
    saveRound();
  
    elapsed = 0;
    laps = [];
    lapList.innerHTML = '';
    time.textContent = '00:00:00.000';
    isRunning = false;
};

lapBtn.onclick = () => {
    
    if (!isRunning) return;
    laps.push(elapsed);
    renderLaps();
    
    if (!currentRoundId) {
        
        const newId = Date.now() + Math.random().toString(36).slice(2,7);
        currentRoundId = newId;
        const round = { id: newId, date: new Date(), laps: [...laps], total: laps[laps.length - 1] };
        rounds.unshift(round);
    } else {
       
        const idx = rounds.findIndex(r => r.id === currentRoundId);
        if (idx !== -1) {
            rounds[idx].laps = [...laps];
            rounds[idx].total = laps[laps.length - 1];
        }
    }
    renderRecords();
};

resetBtn.onclick = () => {
    
    elapsed = 0;
    laps = [];
    lapList.innerHTML = "";
    time.textContent = "00:00:00.000";
    startBtn.disabled = false;
    stopBtn.disabled = lapBtn.disabled = resetBtn.disabled = true;
  
    rounds = [];
    currentRoundId = null;
    renderRecords();
};

function renderLaps() {
    lapList.innerHTML = "";
    if (laps.length === 0) return;
    const durations = laps.map((v,i) => i === 0 ? v : v - laps[i-1]);
    const fast = Math.min(...durations);
    const slow = Math.max(...durations);

    durations.forEach((l,i)=>{
        const li = document.createElement("li");
        li.className = 'lap-item';
        const badge = document.createElement('span');
        badge.className = 'badge';
        if (l === fast) { badge.textContent = 'Fastest'; badge.classList.add('fast'); }
        else if (l === slow) { badge.textContent = 'Slowest'; badge.classList.add('slow'); }

        li.innerHTML = `<span>Lap ${i+1}</span><span>${format(l)}</span>`;
        if (badge.textContent) li.appendChild(badge);
        lapList.appendChild(li);
    });
}

function saveRound(){
    
    const recordedLaps = laps.length ? [...laps] : (elapsed ? [elapsed] : []);
    if (recordedLaps.length === 0) return; 

    
    if (currentRoundId) {
        const idx = rounds.findIndex(rr => rr.id === currentRoundId);
        if (idx !== -1) {
            rounds[idx].laps = recordedLaps;
            rounds[idx].total = recordedLaps[recordedLaps.length - 1];
        } else {
            const round = { id: currentRoundId, date: new Date(), laps: recordedLaps, total: recordedLaps[recordedLaps.length - 1] };
            rounds.unshift(round);
        }
    } else {
        const round = { id: Date.now() + Math.random().toString(36).slice(2,7), date: new Date(), laps: recordedLaps, total: recordedLaps[recordedLaps.length - 1] };
        rounds.unshift(round);
    }
    
    currentRoundId = null;
    renderRecords();
}

function renderRecords(){
    recordsDiv.innerHTML = '';
    if (rounds.length === 0){
        recordsDiv.innerHTML = '<p class="muted">No Records Yet</p>';
        return;
    }

    rounds.forEach((r, idx) => {
        const card = document.createElement('article');
        card.className = 'record-card';

       

        const ul = document.createElement('ul');
        ul.className = 'record-laps';

       
        const cum = r.laps;
        const fast = Math.min(...cum);
        const slow = Math.max(...cum);

        cum.forEach((lapVal, i)=>{
            const li = document.createElement('li');
            li.innerHTML = `<span>Lap ${i+1}:</span><span>${format(lapVal)}</span>`;
            if (lapVal === fast) {
                const b = document.createElement('span'); b.className = 'badge fast'; b.textContent = 'Fastest'; li.appendChild(b);
            }
            if (lapVal === slow) {
                const b = document.createElement('span'); b.className = 'badge slow'; b.textContent = 'Slowest'; li.appendChild(b);
            }
            ul.appendChild(li);
        });

        card.appendChild(ul);
       
        const del = document.createElement('button');
        del.className = 'delete-record';
        del.textContent = 'Delete Record';
        del.dataset.id = r.id;
        del.onclick = () => {
            rounds = rounds.filter(rr => rr.id !== r.id);
            if (currentRoundId === r.id) currentRoundId = null;
            renderRecords();
            if (rounds.length === 0) doFullReset();
        };
        card.appendChild(del);
        recordsDiv.appendChild(card);
    });
}



function doFullReset(){
   
    clearInterval(timer);
    elapsed = 0; laps = [];
    time.textContent = '00:00:00.000';
    lapList.innerHTML = '';
    startBtn.disabled = false;
    stopBtn.disabled = lapBtn.disabled = resetBtn.disabled = true;
}
