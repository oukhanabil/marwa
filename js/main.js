// POINT D'ENTRÉE PRINCIPAL - VERSION CORRIGÉE

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    displayMainMenu();
    checkExpiredWarnings();
    console.log("SGA initialisé - Version Corrigée");
});

// Initialisation de l'application
function initApp() {
    loadData();
    if (agents.length === 0) {
        initializeTestData();
    }
}

// ============ FONCTIONS DE VÉRIFICATION ============

function checkExpiredWarnings() {
    const today = new Date().toISOString().split('T')[0];
    warnings.forEach(warning => {
        if (warning.end_date && warning.end_date < today && warning.status === 'active') {
            warning.status = 'expired';
        }
    });
    saveData();
}

// ============ REDIRECTIONS VERS LES MODULES ============

// Statistiques
function showGlobalStats() {
    if (typeof StatisticsModule !== 'undefined' && StatisticsModule.showGlobalStats) {
        StatisticsModule.showGlobalStats();
    } else if (typeof runClassement !== 'undefined') {
        runClassement();
    } else {
        showSnackbar("📈 Module Statistiques en cours de chargement");
    }
}

function showAgentStatsSelection() {
    if (typeof StatisticsModule !== 'undefined' && StatisticsModule.showAgentStatsSelection) {
        StatisticsModule.showAgentStatsSelection();
    } else {
        showSnackbar("👤 Statistiques par Agent - Utilisez le menu Classement");
    }
}

function showWorkedDaysMenu() {
    showSnackbar("📊 Jours Travaillés - Fonctionnalité disponible dans Statistiques Mensuelles");
}

function showGroupStatsSelection() {
    showSnackbar("📉 Statistiques par Groupe - Disponible dans le planning par groupe");
}

function showMonthlyStats() {
    if (typeof exportStatsExcel !== 'undefined') {
        exportStatsExcel();
    } else {
        showSnackbar("📅 Statistiques Mensuelles - Utilisez l'export Excel");
    }
}

function generateFullReport() {
    if (typeof exportFullReport !== 'undefined') {
        exportFullReport();
    } else {
        showSnackbar("📋 Rapport Complet - Utilisez la sauvegarde complète");
    }
}

// Congés
function showDeleteLeaveForm() {
    showSnackbar("🗑️ Supprimer Congé - Sélectionnez un congé dans la liste");
}

function showGroupLeavesSelection() {
    showSnackbar("📊 Congés par Groupe - Utilisez le filtre dans la liste des congés");
}

// Import/Export
function showImportExcelForm() {
    showSnackbar("📁 Importer Excel - Fonctionnalité à venir");
}

function showImportCSVForm() {
    showSnackbar("📥 Importer CSV - Fonctionnalité à venir");
}

function exportAgentsData() {
    if (typeof exportAgentsCSV !== 'undefined') {
        exportAgentsCSV();
    } else {
        showSnackbar("📤 Export Agents - Utilisez l'option dans Gestion des Agents");
    }
}

function exportLeavesPDF() {
    if (typeof exportLeavesReport !== 'undefined') {
        exportLeavesReport();
    } else {
        showSnackbar("📋 Export Congés - Utilisez l'export CSV");
    }
}

function exportFullReport() {
    if (typeof backupAllData !== 'undefined') {
        backupAllData();
    } else {
        showSnackbar("📊 Export Rapport Complet - Utilisez la sauvegarde");
    }
}

function exportPlanningExcel() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    if (typeof exportPlanningToExcel !== 'undefined') {
        exportPlanningToExcel(month, year);
    } else {
        showSnackbar("📅 Export Planning - Utilisez l'export dans le planning");
    }
}

// Planning
function showTrimestrialPlanning() {
    showSnackbar("📊 Planning Trimestriel - Fonctionnalité à venir");
}

function showShiftModificationForm() {
    showSnackbar("✏️ Modifier Shift - Accédez d'abord au planning mensuel");
}

function showShiftExchangeForm() {
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showShiftExchangeForm) {
        PlanningModule.showShiftExchangeForm();
    } else {
        showSnackbar("🔄 Échange de Shifts - Fonctionnalité dans le planning");
    }
}

function showAbsenceForm() {
    if (typeof showAddLeaveForm !== 'undefined') {
        showAddLeaveForm();
    } else {
        showSnackbar("➕ Ajouter Absence - Utilisez le menu Congés");
    }
}

function generatePlanning() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showGeneratePlanningModal) {
        PlanningModule.showGeneratePlanningModal(month, year);
    } else {
        showSnackbar("🔄 Génération Planning - Fonctionnalité dans le planning mensuel");
    }
}

function showAgentPlanningSelection() {
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showAgentPlanningSelection) {
        PlanningModule.showAgentPlanningSelection();
    } else {
        showSnackbar("👤 Planning Agent - Accédez au planning mensuel");
    }
}

function showGroupPlanningSelection() {
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showGroupPlanningSelection) {
        PlanningModule.showGroupPlanningSelection();
    } else {
        showSnackbar("👥 Planning Groupe - Accédez au planning mensuel");
    }
}

function showMonthlyPlanning() {
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showMonthlyPlanning) {
        PlanningModule.showMonthlyPlanning();
    } else {
        showSnackbar("📅 Planning Mensuel - Fonctionnalité dans le planning");
    }
}

// Fonctions de compatibilité
function showShiftModification(agentCode, dateStr, currentShift) {
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showShiftModification) {
        PlanningModule.showShiftModification(agentCode, dateStr, currentShift);
    } else {
        showSnackbar(`✏️ Modification de shift pour ${agentCode} - Utilisez le planning`);
    }
}

function showAbsenceFormForDate(agentCode, dateStr) {
    if (typeof showAddLeaveForm !== 'undefined') {
        showAddLeaveForm();
    } else {
        showSnackbar(`🚫 Absence pour ${agentCode} - Utilisez le menu Congés`);
    }
}

function showAddLeaveForAgent(agentCode) {
    if (typeof showAddLeaveForm !== 'undefined') {
        showAddLeaveForm();
    } else {
        showSnackbar(`🏖️ Congé pour ${agentCode} - Utilisez le menu Congés`);
    }
}

function showAgentPlanning(agentCode) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    if (typeof PlanningModule !== 'undefined' && PlanningModule.showAgentPlanning) {
        PlanningModule.showAgentPlanning(agentCode, month, year);
    } else {
        showSnackbar(`📅 Planning ${agentCode} - Utilisez le planning mensuel`);
    }
}

function showAgentStats(agentCode) {
    showSnackbar(`📊 Stats ${agentCode} - Utilisez le classement`);
}

function printPlanning() {
    window.print();
    showSnackbar("🖨️ Impression - Utilisez Ctrl+P");
}

function printAgentPlanning(agentCode, month, year) {
    window.print();
    showSnackbar(`🖨️ Impression planning ${agentCode}`);
}

function previewShiftExchange() {
    showSnackbar("👁️ Prévisualisation échange - Fonctionnalité dans le planning");
}

function showGroupStats(group, month, year) {
    showSnackbar(`📊 Stats groupe ${group} - Utilisez le classement`);
}

function generatePlanningForGroup(group, month, year) {
    showSnackbar(`🔄 Génération groupe ${group} - Fonctionnalité dans le planning`);
}

function showTrimesterDetailed(startMonth, year) {
    showSnackbar("📊 Détail trimestriel - Fonctionnalité à venir");
}

function previewLeave() {
    showSnackbar("👁️ Prévisualisation congé - Fonctionnalité à venir");
}

// ============ ANIMATIONS ============

const style = document.createElement('style');
style.textContent = `
    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }
    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
