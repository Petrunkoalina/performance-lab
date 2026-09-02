export default {
  id:'m8', title:'Meta Ads', category:'meta', color:'lavender',
  short:'Campaign/Ad Set/Ad, аудитории, Pixel и креативная логика Meta',
  lessons:[
    {
      id:'m8-l1', title:'Структура Meta Ads: Campaign, Ad Set, Ad и цели', duration:18,
      intro:'Meta Ads устроен иначе, чем Google Ads: здесь реклама встраивается в ленту, а не отвечает на явный запрос — это меняет всю логику таргетинга и креатива.',
      explanation:'Иерархия: Campaign (задаёт Objective — цель) → Ad Set (аудитория, плейсменты, бюджет, оптимизация показа) → Ad (креатив и текст). Objectives сгруппированы по этапам воронки: Awareness, Traffic, Engagement, Leads, Sales — каждый объектив меняет то, под что оптимизируется алгоритм показа.\n\nAudiences: Core Audiences — таргетинг по интересам/демографии; Custom Audiences — аудитории на основе собственных данных бизнеса (email-базы, посетители сайта через Pixel, пользователи приложения); Lookalike Audiences — аудитории, похожие по поведению на уже существующих клиентов.',
      terms:[
        {term:'Ad Set', en:'Ad Set', def:'Уровень структуры Meta Ads, отвечающий за аудиторию, плейсменты и бюджет.'},
        {term:'Custom Audience', en:'Custom Audience', def:'Аудитория, построенная на собственных данных бизнеса.'},
        {term:'Lookalike Audience', en:'Lookalike Audience', def:'Аудитория, похожая по поведению на существующих клиентов.'},
      ],
      visualHtml:`<div class="callout term">Campaign (цель) → Ad Set (аудитория/бюджет/плейсменты) → Ad (креатив)</div>`,
      example:'Интернет-магазин загружает список email существующих покупателей как Custom Audience, а затем создаёт Lookalike 1% на основе этого списка, чтобы найти похожих новых клиентов.',
      mistake:'Создавать слишком много Ad Sets с маленьким бюджетом на каждый — алгоритму не хватает данных для оптимизации показа в рамках каждого отдельного Ad Set.',
      miniExercise:{ prompt:'Аудитория, похожая по поведению на текущих клиентов, называется:', options:['Custom Audience','Core Audience','Lookalike Audience','Saved Audience'], correct:2, hint:'Lookalike = «похожая аудитория».' },
      task:{ prompt:'Опишите структуру из 1 кампании, 2 ad sets (разные аудитории) и 3 объявлений для вашего проекта.', placeholder:'Campaign objective: ... Ad Set 1: ... Ad Set 2: ... Ads: ...' },
      quiz:[
        {q:'Objective задаётся на уровне:', options:['Ad','Ad Set','Campaign','Pixel'], correct:2, explain:'Цель (Objective) выбирается на уровне кампании.'},
        {q:'Custom Audience строится на основе:', options:['Случайного списка интересов','Собственных данных бизнеса (email, сайт, приложение)','Только географии','Только возраста'], correct:1, explain:'Custom Audience всегда опирается на данные, которыми владеет бизнес.'},
      ],
      summary:'Meta Ads строится вокруг иерархии Campaign→Ad Set→Ad и мощной системы аудиторий на основе собственных и похожих данных.',
      flashcards:[{front:'Custom → Lookalike', back:'Свои данные → похожая аудитория на их основе'}],
      chatgptLink:'В отличие от Meta, ChatGPT Ads пока не предлагает Custom/Lookalike Audiences в привычном виде — таргетинг строится в первую очередь через context hints и география.',
      nextUp:'Далее — Pixel, Conversions API, creative fatigue и отличия Meta от Google Ads и ChatGPT Ads.',
    },
    {
      id:'m8-l2', title:'Pixel, Conversions API, creative fatigue и отличия каналов', duration:16,
      intro:'Понимание того, чем Meta Ads принципиально отличается от Google Ads и ChatGPT Ads, — частый вопрос на собеседовании.',
      explanation:'Pixel — код на сайте, передающий события (просмотр страницы, добавление в корзину, покупка) в Meta для оптимизации и ремаркетинга. Conversions API (CAPI) — серверный способ передачи тех же событий напрямую с сервера бизнеса, снижающий потери данных из-за блокировщиков рекламы и ограничений браузеров.\n\nCreative fatigue — снижение эффективности объявления из-за многократного показа одной и той же аудитории (похоже на Frequency из модуля 2). Ключевое отличие каналов: Google Ads работает с явным намерением (человек сам ищет), Meta Ads — с прерыванием ленты по интересам/поведению, ChatGPT Ads — с намерением, раскрывающимся через естественный диалог.',
      terms:[
        {term:'Pixel', en:'Meta Pixel', def:'Код отслеживания событий на сайте для Meta Ads.'},
        {term:'Conversions API', en:'Conversions API', def:'Серверная передача событий в Meta, независимая от блокировщиков в браузере.'},
        {term:'Creative fatigue', en:'Creative fatigue', def:'Падение эффективности креатива из-за многократных повторных показов.'},
      ],
      visualHtml:`<table class="data-table"><tr><th>Канал</th><th>Логика взаимодействия</th></tr>
        <tr><td>Google Ads</td><td>Явный запрос пользователя</td></tr>
        <tr><td>Meta Ads</td><td>Прерывание ленты по интересам/поведению</td></tr>
        <tr><td>ChatGPT Ads</td><td>Намерение, раскрытое в диалоге</td></tr></table>`,
      example:'Одно и то же объявление показывается пользователю 15 раз за неделю — CTR падает с 2,5% до 0,4%: явный признак creative fatigue, требующий обновления креатива.',
      mistake:'Настраивать только Pixel и игнорировать Conversions API — часть конверсий теряется из-за блокировщиков рекламы и приватных настроек браузера, что искажает отчётность.',
      miniExercise:{ prompt:'Что решает Conversions API, чего не может обычный Pixel?', options:['Дизайн креатива','Потерю данных из-за блокировщиков рекламы в браузере','Оплату рекламы','Выбор аудитории'], correct:1, hint:'CAPI передаёт данные напрямую с сервера, минуя браузер.' },
      task:{ prompt:'Объясните разницу между Google Ads, Meta Ads и ChatGPT Ads одним предложением на каждый канал — как бы вы объяснили это клиенту.', placeholder:'Google Ads: ... Meta Ads: ... ChatGPT Ads: ...' },
      quiz:[
        {q:'Creative fatigue обычно проявляется как:', options:['Рост CTR со временем','Падение CTR при высокой частоте показов','Снижение бюджета','Рост Quality Score'], correct:1, explain:'Многократные показы одному человеку снижают эффективность объявления.'},
        {q:'Главное отличие ChatGPT Ads от Google Ads:', options:['ChatGPT Ads дешевле всегда','ChatGPT Ads таргетируется через контекст диалога, а не явный поисковый запрос','ChatGPT Ads не имеет бюджета','Различий нет'], correct:1, explain:'Google Ads отвечает на явный запрос, ChatGPT Ads — на раскрывающийся в диалоге контекст.'},
      ],
      summary:'Pixel и CAPI обеспечивают точность данных Meta Ads. Creative fatigue требует регулярного обновления креативов. Три канала различаются логикой взаимодействия с пользователем.',
      flashcards:[{front:'Pixel vs CAPI', back:'Pixel — в браузере, CAPI — напрямую с сервера, устойчивее к блокировщикам'}],
      chatgptLink:'Аналог Pixel в ChatGPT Ads — механизм Conversions на стороне рекламодателя, о котором подробно говорим в модуле 17 (Tracking).',
      nextUp:'Практика: подготовьте структуру кампании и пять creative angles для своего проекта.',
    },
  ],
};
