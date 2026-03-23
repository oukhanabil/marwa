// GESTION DES DONNÉES (LOCALSTORAGE) - VERSION CORRIGÉE

function loadData() {
    agents = JSON.parse(localStorage.getItem('sga_agents') || '[]');
    planningData = JSON.parse(localStorage.getItem('sga_planning') || '{}');
    holidays = JSON.parse(localStorage.getItem('sga_holidays') || '[]');
    panicCodes = JSON.parse(localStorage.getItem('sga_panic_codes') || '[]');
    radios = JSON.parse(localStorage.getItem('sga_radios') || '[]');
    
    // Uniforms peut être un objet avec uniforms et history
    const uniformsData = JSON.parse(localStorage.getItem('sga_uniforms') || '{"uniforms":[],"history":[]}');
    uniforms = uniformsData.uniforms || [];
    uniformsHistory = uniformsData.history || [];
    
    warnings = JSON.parse(localStorage.getItem('sga_warnings') || '[]');
    leaves = JSON.parse(localStorage.getItem('sga_leaves') || '[]');
    radioHistory = JSON.parse(localStorage.getItem('sga_radio_history') || '[]');
    auditLog = JSON.parse(localStorage.getItem('sga_audit_log') || '[]');
    
    if (holidays.length === 0) initializeHolidays();
}

function saveData() {
    localStorage.setItem('sga_agents', JSON.stringify(agents));
    localStorage.setItem('sga_planning', JSON.stringify(planningData));
    localStorage.setItem('sga_holidays', JSON.stringify(holidays));
    localStorage.setItem('sga_panic_codes', JSON.stringify(panicCodes));
    localStorage.setItem('sga_radios', JSON.stringify(radios));
    localStorage.setItem('sga_uniforms', JSON.stringify({ uniforms: uniforms, history: uniformsHistory }));
    localStorage.setItem('sga_warnings', JSON.stringify(warnings));
    localStorage.setItem('sga_leaves', JSON.stringify(leaves));
    localStorage.setItem('sga_radio_history', JSON.stringify(radioHistory));
    localStorage.setItem('sga_audit_log', JSON.stringify(auditLog));
}

// ============ FONCTIONS GETTERS ============

function getAgents() {
    return agents;
}

function getActiveAgents() {
    return agents.filter(a => a.statut === 'actif');
}

function getAgent(agentCode) {
    return agents.find(a => a.code === agentCode);
}

function getAgentsByGroup(group) {
    return agents.filter(a => a.groupe === group && a.statut === 'actif');
}

function getPlanningData() {
    return planningData;
}

function getHolidays() {
    return holidays;
}

function getPanicCodes() {
    return panicCodes;
}

function getRadios() {
    return radios;
}

function getUniformsData() {
    return { uniforms, history: uniformsHistory };
}

function getWarnings() {
    return warnings;
}

function getLeaves() {
    return leaves;
}

// ============ FONCTIONS DE VÉRIFICATION ============

function isHoliday(date) {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(h => h.date === dateStr);
}

function getHolidaysForMonth(year, month) {
    const monthStr = (month + 1).toString().padStart(2, '0');
    return holidays.filter(h => {
        const [hYear, hMonth] = h.date.split('-');
        return parseInt(hYear) === year && hMonth === monthStr;
    });
}

function isAgentOnLeave(agentCode, dateStr) {
    const leaveRecords = leaves.filter(l => l.agent_code === agentCode);
    return leaveRecords.some(leave => {
        if (leave.start_date && leave.end_date) {
            return dateStr >= leave.start_date && dateStr <= leave.end_date;
        }
        return leave.date === dateStr;
    });
}

// ============ DONNÉES DES SHIFTS ============

function getShiftData(shiftCode = null) {
    const SHIFT_DATA = {
        '1': { label: 'Matin', color: '#3498db', hours: 8, type: 'morning', class: 'shift-morning' },
        '2': { label: 'Après-midi', color: '#e74c3c', hours: 8, type: 'afternoon', class: 'shift-afternoon' },
        '3': { label: 'Nuit', color: '#9b59b6', hours: 12, type: 'night', class: 'shift-night' },
        'R': { label: 'Repos', color: '#2ecc71', hours: 0, type: 'rest', class: 'shift-rest' },
        'C': { label: 'Congé', color: '#f39c12', hours: 0, type: 'leave', class: 'shift-leave' },
        'M': { label: 'Maladie', color: '#e67e22', hours: 0, type: 'sick', class: 'shift-sick' },
        'A': { label: 'Autre absence', color: '#95a5a6', hours: 0, type: 'absence', class: 'shift-absence' },
        '-': { label: 'Non défini', color: '#7f8c8d', hours: 0, type: 'undefined', class: 'shift-undefined' }
    };
    return shiftCode ? SHIFT_DATA[shiftCode] : SHIFT_DATA;
}

function getShiftLabels() {
    const data = getShiftData();
    const labels = {};
    Object.keys(data).forEach(key => {
        labels[key] = data[key].label;
    });
    return labels;
}

function getDefaultShift(agent, dateStr) {
    if (!agent || agent.statut !== 'actif') return '-';
    
    const date = new Date(dateStr);
    const day = date.getDay();
    const group = agent.groupe;
    
    // Groupe E : rotation spéciale
    if (group === 'E') {
        if (day === 0 || day === 6) return 'R';
        const dayNum = date.getDate();
        return dayNum % 2 === 0 ? '1' : '2';
    }
    
    // Groupes A-D : rotation cyclique
    const daysSinceStart = Math.floor((date - DATE_AFFECTATION_BASE) / (1000 * 60 * 60 * 24));
    let groupOffset = 0;
    switch(group) {
        case 'A': groupOffset = 0; break;
        case 'B': groupOffset = 2; break;
        case 'C': groupOffset = 4; break;
        case 'D': groupOffset = 6; break;
        default: groupOffset = 0;
    }
    const cycleDay = (daysSinceStart + groupOffset) % 8;
    
    switch(cycleDay) {
        case 0: case 1: return '1';
        case 2: case 3: return '2';
        case 4: case 5: return '3';
        case 6: case 7: return 'R';
        default: return '-';
    }
}

// ============ DONNÉES DE TEST ============

function initializeTestData() {
    agents = [
        { code: 'A01', nom: 'Dupont', prenom: 'Alice', groupe: 'A', matricule: 'MAT001', cin: 'AA123456', tel: '0601-010101', poste: 'Agent de sécurité', date_entree: '2024-01-01', date_sortie: null, statut: 'actif' },
        { code: 'B02', nom: 'Martin', prenom: 'Bob', groupe: 'B', matricule: 'MAT002', cin: 'BB654321', tel: '0602-020202', poste: 'Superviseur', date_entree: '2024-01-01', date_sortie: null, statut: 'actif' },
        { code: 'C03', nom: 'Lefevre', prenom: 'Carole', groupe: 'C', matricule: 'MAT003', cin: 'CC789012', tel: '0603-030303', poste: 'Agent de sécurité', date_entree: '2024-01-01', date_sortie: null, statut: 'actif' },
        { code: 'D04', nom: 'Dubois', prenom: 'David', groupe: 'D', matricule: 'MAT004', cin: 'DD345678', tel: '0604-040404', poste: "Chef d'équipe", date_entree: '2024-01-01', date_sortie: null, statut: 'actif' },
        { code: 'E01', nom: 'Zahiri', prenom: 'Ahmed', groupe: 'E', matricule: 'MAT005', cin: 'EE901234', tel: '0605-050505', poste: 'Agent spécial', date_entree: '2024-01-01', date_sortie: null, statut: 'actif' },
        { code: 'E02', nom: 'Zarrouk', prenom: 'Benoit', groupe: 'E', matricule: 'MAT006', cin: 'FF567890', tel: '0606-060606', poste: 'Agent spécial', date_entree: '2024-01-01', date_sortie: null, statut: 'actif' }
    ];
    
    initializeHolidays();
    saveData();
}

function initializeHolidays() {
    const year = new Date().getFullYear();
    holidays = [
        { id: 'h1', date: `${year}-01-01`, name: 'Nouvel An', description: 'Nouvel An', type: 'fixe', recurring: true },
        { id: 'h2', date: `${year}-01-11`, name: "Manifeste de l'Indépendance", description: "Manifeste de l'Indépendance", type: 'fixe', recurring: true },
        { id: 'h3', date: `${year}-05-01`, name: 'Fête du Travail', description: 'Fête du Travail', type: 'fixe', recurring: true },
        { id: 'h4', date: `${year}-07-30`, name: 'Fête du Trône', description: 'Fête du Trône', type: 'fixe', recurring: true },
        { id: 'h5', date: `${year}-08-14`, name: 'Allégeance Oued Eddahab', description: 'Allégeance Oued Eddahab', type: 'fixe', recurring: true },
        { id: 'h6', date: `${year}-08-20`, name: 'Révolution du Roi et du Peuple', description: 'Révolution du Roi et du Peuple', type: 'fixe', recurring: true },
        { id: 'h7', date: `${year}-08-21`, name: 'Fête de la Jeunesse', description: 'Fête de la Jeunesse', type: 'fixe', recurring: true },
        { id: 'h8', date: `${year}-11-06`, name: 'Marche Verte', description: 'Marche Verte', type: 'fixe', recurring: true },
        { id: 'h9', date: `${year}-11-18`, name: "Fête de l'Indépendance", description: "Fête de l'Indépendance", type: 'fixe', recurring: true }
    ];
}
