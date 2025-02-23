const medications = {
    acetaminophen: {
        name: 'Acétaminophène 500mg',
        times: ['6h', '12h', '18h', '0h'],
        max: 8
    },
    emolax: {
        name: 'Emolax',
        times: ['8h'],
        max: 1
    },
    statex: {
        name: 'Statex 5mg',
        times: ['4h', '8h', '12h', '16h', '20h', '0h'],
        warning: 'Attention: Peut causer de la somnolence'
    },
    fer: {
        name: 'Fer 300mg',
        times: ['8h'],
        alternateDay: true
    },
    naproxen: {
        name: 'Naproxen 500mg',
        times: ['8h', '20h']
    }
};

function createCalendar() {
    const today = new Date('2025-02-23');
    const calendar = document.getElementById('calendar');
    document.getElementById('currentDate').textContent = today.toLocaleDateString('fr-FR');

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';

    // Grouper les médicaments par heure
    const timeGroups = {};
    
    for (const [medId, med] of Object.entries(medications)) {
        med.times.forEach(time => {
            if (!timeGroups[time]) {
                timeGroups[time] = [];
            }
            
            if (medId === 'fer' && today.getDate() % 2 === 0) {
                return; // Sauter le fer les jours pairs
            }
            
            timeGroups[time].push({
                id: medId,
                ...med
            });
        });
    }

    // Trier les heures et créer les groupes
    Object.keys(timeGroups).sort().forEach(time => {
        const timeGroup = document.createElement('div');
        timeGroup.className = 'time-group';
        
        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-header';
        timeHeader.textContent = `${time}`;
        timeGroup.appendChild(timeHeader);

        timeGroups[time].forEach(med => {
            const medDiv = document.createElement('div');
            medDiv.className = 'medication';
            medDiv.id = `${med.id}-${time}`;

            const checkbox = document.createElement('span');
            checkbox.className = 'checkbox';
            
            const medName = document.createElement('span');
            medName.textContent = med.name;

            medDiv.appendChild(checkbox);
            medDiv.appendChild(medName);

            if (med.warning) {
                const warning = document.createElement('div');
                warning.className = 'warning';
                warning.textContent = med.warning;
                medDiv.appendChild(warning);
            }

            // Restaurer l'état depuis le localStorage
            const taken = localStorage.getItem(`${med.id}-${time}-${today.toISOString().split('T')[0]}`);
            if (taken === 'true') {
                medDiv.classList.add('taken');
            }

            medDiv.addEventListener('click', function() {
                const isNowTaken = !this.classList.contains('taken');
                this.classList.toggle('taken');
                localStorage.setItem(
                    `${med.id}-${time}-${today.toISOString().split('T')[0]}`,
                    isNowTaken
                );
            });

            timeGroup.appendChild(medDiv);
        });

        dayDiv.appendChild(timeGroup);
    });

    calendar.appendChild(dayDiv);
}

// Initialiser le calendrier au chargement de la page
document.addEventListener('DOMContentLoaded', createCalendar);
