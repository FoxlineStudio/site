// ========== ТАЙТЛЫ ==========
const titlesDatabase = [
    {
        id: 'dandadan',
        name: 'ДанДаДан',
        nameEn: 'DanDaDan',
        // ВЕРТИКАЛЬНАЯ обложка (для карточек, списка тайтлов)
        imageVertical: 'images/dandadan_vert.jpg',
        // ГОРИЗОНТАЛЬНАЯ обложка (для страницы тайтла, баннеров)
        imageHorizontal: 'images/dandadan_horiz.jpg',
        type: 'Аниме',
        seasons: 1,
        episodes: 12,
        year: 2024,
        rating: 5,
        genres: ['Комедия', 'Экшен', 'Романтика'],
        description: 'Момо и Окарун — обычные старшеклассники, которые вдруг сталкиваются с пришельцами и духами. Их жизнь переворачивается с ног на голову!',
        episodesList: [
            { number: 1, title: 'Первая серия', url: 'https://drive.google.com/file/d/XXXXX1/preview', status: 'Озвучено' },
            { number: 2, title: 'Вторая серия', url: 'https://drive.google.com/file/d/XXXXX2/preview', status: 'Озвучено' },
            { number: 3, title: 'Третья серия', url: 'https://drive.google.com/file/d/XXXXX3/preview', status: 'Озвучено' },
            { number: 4, title: 'Четвёртая серия', url: 'https://drive.google.com/file/d/XXXXX4/preview', status: 'Озвучено' },
            { number: 5, title: 'Пятая серия', url: 'https://drive.google.com/file/d/XXXXX5/preview', status: 'Озвучено' },
            { number: 6, title: 'Шестая серия', url: 'https://drive.google.com/file/d/XXXXX6/preview', status: 'Озвучено' },
            { number: 7, title: 'Седьмая серия', url: 'https://drive.google.com/file/d/XXXXX7/preview', status: 'Озвучено' },
            { number: 8, title: 'Восьмая серия', url: '', status: 'Скоро' },
            { number: 9, title: 'Девятая серия', url: '', status: 'Скоро' },
            { number: 10, title: 'Десятая серия', url: '', status: 'Скоро' },
            { number: 11, title: 'Одиннадцатая серия', url: '', status: 'Скоро' },
            { number: 12, title: 'Двенадцатая серия', url: '', status: 'Скоро' },
        ]
    },
];

// ========== ДАББЕРЫ ==========
const voicesDatabase = [
    { 
        id: 'runi',
        name: 'Руни',
        nameEn: 'Runi',
        image: 'images/runi.jpg',
        roleType: 'dubber',
        status: 'Основатель студии, даббер',
        joinDate: '2025',
        bio: 'Основатель студии, даббер',
        social: { vk: 'id619472027', telegram: 'kkxzsyUwU' }
    },
    { 
        id: 'miki-angel',
        name: 'Miki-angel',
        nameRu: 'Мики',
        image: 'images/miki.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2025',
        bio: 'Даббер',
        social: { telegram: 'kadrzakadrommikiangel' }
    },
    { 
        id: 'chep',
        name: 'chep',
        nameRu: 'Чеп',
        image: 'images/chep.jpg',
        roleType: 'both',
        status: 'Даббер, веб-разработчик',
        joinDate: '2026',
        bio: 'Даббер, веб-разработчик',
        social: { telegram: 'chepsdub' }
    },
    { 
        id: 'diablo',
        name: 'Diablo',
        nameRu: 'Диабло',
        image: 'images/diablo.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'nik-gus',
        name: 'Никита Гусельников',
        nameEn: 'Nikita Guselnikov',
        image: 'images/nik-gus.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'libertea',
        name: 'LiberTea',
        nameRu: 'ЛиберТи',
        image: 'images/LiberTea.jpg',
        roleType: 'both',
        status: 'Даббер, звукорежиссёр',
        joinDate: '2026',
        bio: 'Даббер, звукорежиссёр',
        social: {}
    },
    { 
        id: 'noty',
        name: 'Noty',
        nameRu: 'Ноти',
        image: 'images/noty.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'roma',
        name: 'Рома',
        nameEn: 'Roma',
        image: 'images/roma.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'tenmag',
        name: 'Tenmag',
        nameRu: 'Тенмаг',
        image: 'images/tenmag.jpg',
        roleType: 'both',
        status: 'Даббер, звукорежиссёр',
        joinDate: '2026',
        bio: 'Даббер, звукорежиссёр',
        social: {}
    },
    { 
        id: 'hikkou',
        name: 'hikkou',
        nameRu: 'Хиккоу',
        image: 'images/hikkou.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'katsyri',
        name: 'Katsyri',
        nameRu: 'Кацури',
        image: 'images/katsyri.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2025',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'anonym8',
        name: 'Anonym8',
        nameRu: 'Аноним8',
        image: 'images/anonym8.jpg',
        roleType: 'dubber',
        status: 'Даббер',
        joinDate: '2026',
        bio: 'Даббер',
        social: {}
    },
    { 
        id: 'vadim',
        name: 'Вадим',
        nameEn: 'Vadim',
        image: 'images/vadim.jpg',
        roleType: 'tech',
        status: 'Звукорежиссёр',
        joinDate: '2026',
        bio: 'Звукорежиссёр',
        social: {}
    },
    { 
        id: 'persival',
        name: 'Persival',
        nameRu: 'Персиваль',
        image: 'images/persival.jpg',
        roleType: 'tech',
        status: 'Менеджер',
        joinDate: '2026',
        bio: 'Мое почтение дамы и господа, с вами Персиваль. На повестке дня я расскажу о себе как о человеке чья личность все же будет скрыта под богом "Секретно". Мне 23 года проживаю в Великой державе. Днями и ночами напролет этот прохиндей работает на множество структур. А так, кто захочет сам узнает обо мне, ведь я не скрываюсь)',
        social: { vk:'6ap_cuk' }
    },
];

// ========== РОЛИ ==========
const rolesDatabase = [
    { titleId: 'dandadan', voiceId: 'runi', character: 'Момо', characterImage: 'images/momo.jpg', episodes: '1-12', type: 'main' },
    { titleId: 'dandadan', voiceId: 'miki-angel', character: 'Окарун', characterImage: 'images/okarun.jpg', episodes: '1-12', type: 'main' },
    { titleId: 'molchalivaya_vedma', voiceId: 'runi', character: 'Моника', characterImage: 'images/monica.jpg', episodes: '1-13', type: 'main' },
    { titleId: 'molchalivaya_vedma', voiceId: 'miki-angel', character: 'Феликс', characterImage: 'images/felix.jpg', episodes: '1-13', type: 'main' },
    { titleId: 'molchalivaya_vedma', voiceId: 'chep', character: 'Неро', characterImage: 'images/nero.jpg', episodes: '1-13', type: 'main' },
    { titleId: 'zvezdnoe_ditya', voiceId: 'runi', character: 'Звёздный странник', characterImage: '', episodes: '1-35', type: 'main' },
    { titleId: 'zvezdnoe_ditya', voiceId: 'miki-angel', character: 'Лунная фея', characterImage: '', episodes: '1-35', type: 'main' },
    { titleId: 'hellsing', voiceId: 'runi', character: 'Алукард', characterImage: '', episodes: '1-13', type: 'main' },
    { titleId: 'hellsing', voiceId: 'miki-angel', character: 'Интегра', characterImage: '', episodes: '1-13', type: 'main' },
];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

function getVoiceById(id) {
    return voicesDatabase.find(v => v.id === id) || null;
}

function getVoiceByName(name) {
    return voicesDatabase.find(v => v.name === name || v.nameRu === name) || null;
}

function getRolesByVoiceId(voiceId) {
    return rolesDatabase.filter(r => r.voiceId === voiceId);
}

function getTitlesByVoiceId(voiceId) {
    const roles = getRolesByVoiceId(voiceId);
    const titleIds = [...new Set(roles.map(r => r.titleId))];
    
    return titleIds.map(titleId => {
        const title = titlesDatabase.find(t => t.id === titleId);
        if (!title) return null;
        const voiceRoles = roles.filter(r => r.titleId === titleId);
        return {
            ...title,
            roles: voiceRoles
        };
    }).filter(t => t);
}

function getVoicesByTitleId(titleId) {
    const roles = rolesDatabase.filter(r => r.titleId === titleId);
    const voiceIds = [...new Set(roles.map(r => r.voiceId))];
    
    return voiceIds.map(voiceId => {
        const voice = getVoiceById(voiceId);
        if (!voice) return null;
        const titleRoles = roles.filter(r => r.voiceId === voiceId);
        return {
            ...voice,
            roles: titleRoles
        };
    }).filter(v => v);
}

function getTitleById(id) {
    return titlesDatabase.find(t => t.id === id) || null;
}

function groupRolesByType(roles) {
    return {
        main: roles.filter(r => r.type === 'main'),
        recurring: roles.filter(r => r.type === 'recurring'),
        supporting: roles.filter(r => r.type === 'supporting'),
        guest: roles.filter(r => r.type === 'guest')
    };
}

function getVoiceStats(voiceId) {
    const roles = getRolesByVoiceId(voiceId);
    const titles = getTitlesByVoiceId(voiceId);
    const grouped = groupRolesByType(roles);
    
    return {
        totalTitles: titles.length,
        totalRoles: roles.length,
        mainRoles: grouped.main.length,
        recurringRoles: grouped.recurring.length,
        supportingRoles: grouped.supporting.length,
        guestRoles: grouped.guest.length
    };
}

function searchDatabase(query) {
    if (!query || query.trim() === '') return { titles: [], voices: [] };
    
    const lowerQuery = query.toLowerCase().trim();
    
    const titles = titlesDatabase.filter(title => 
        title.name.toLowerCase().includes(lowerQuery) || 
        (title.nameEn && title.nameEn.toLowerCase().includes(lowerQuery))
    );
    
    const voices = voicesDatabase.filter(voice => 
        voice.name.toLowerCase().includes(lowerQuery) ||
        (voice.nameRu && voice.nameRu.toLowerCase().includes(lowerQuery)) ||
        (voice.nameEn && voice.nameEn.toLowerCase().includes(lowerQuery))
    );
    
    return { titles, voices };
}

// ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
window.titlesDatabase = titlesDatabase;
window.voicesDatabase = voicesDatabase;
window.rolesDatabase = rolesDatabase;
window.getVoiceById = getVoiceById;
window.getVoiceByName = getVoiceByName;
window.getTitleById = getTitleById;
window.getRolesByVoiceId = getRolesByVoiceId;
window.getTitlesByVoiceId = getTitlesByVoiceId;
window.getVoicesByTitleId = getVoicesByTitleId;
window.groupRolesByType = groupRolesByType;
window.getVoiceStats = getVoiceStats;
window.searchDatabase = searchDatabase;

console.log('✅ data.js загружен | foxline Studio');
console.log(`📊 Тайтлов: ${titlesDatabase.length}`);
console.log(`🎭 Дабберов: ${voicesDatabase.length}`);
console.log(`🔗 Ролей: ${rolesDatabase.length}`);