export default {
  id:'m1', title:'Профессия Performance Marketing Specialist', category:'career', color:'yellow',
  short:'Как устроена профессия и где в ней место ChatGPT Ads',
  lessons:[
    {
      id:'m1-l1', title:'Что такое performance marketing', duration:16,
      intro:'Прежде чем настраивать любую рекламу, специалист должен понимать, чем performance marketing отличается от рекламы «для узнаваемости» — иначе легко тратить бюджет клиента не на то, что ему нужно.',
      explanation:'Performance marketing (перформанс-маркетинг) — это подход к рекламе, в котором каждая гривна/евро/доллар бюджета привязана к измеримому действию: клику, лиду, заявке, установке, покупке. Специалист отвечает не за «показы» и не за «красивую картинку», а за результат, который можно посчитать в цифрах и сравнить со стоимостью.\n\nPerformance-реклама всегда крутится вокруг трёх вопросов: сколько мы потратили, сколько получили целевых действий, и сколько стоило одно действие. Если на эти три вопроса нет ответа — это не performance-кампания, а имиджевая активность.',
      terms:[
        {term:'Performance marketing', en:'Performance marketing', def:'Маркетинг, оптимизируемый под измеримые действия пользователя, а не только под охват.'},
        {term:'Brand marketing', en:'Brand marketing', def:'Маркетинг, направленный на узнаваемость и восприятие бренда в долгосрочной перспективе.'},
        {term:'KPI', en:'Key Performance Indicator', def:'Ключевой измеримый показатель, по которому оценивают успех кампании.'},
      ],
      visualHtml:`<div style="display:flex;gap:12px;flex-wrap:wrap">
        <div class="callout term" style="flex:1;min-width:200px"><b>Brand marketing</b><br>Цель: запомниться<br>Метрика: Reach, Awareness Lift<br>Горизонт: месяцы/годы</div>
        <div class="callout example" style="flex:1;min-width:200px"><b>Performance marketing</b><br>Цель: действие<br>Метрика: CPA, ROAS, конверсии<br>Горизонт: дни/недели</div>
      </div>`,
      example:'Ролик на YouTube, который просто показывает новый вкус йогурта — это brand marketing: успех измеряется тем, сколько людей его увидели и запомнили. Реклама этого же йогурта в Google Shopping с целью «купить сейчас» — это performance marketing: успех измеряется числом покупок и их стоимостью.',
      mistake:'Новички часто оценивают performance-кампанию по «красоте» креатива или количеству лайков, забывая спросить: а сколько эти лайки стоили и привели ли они к заявкам.',
      miniExercise:{ prompt:'Выберите, что из перечисленного является performance-метрикой, а не brand-метрикой.', options:['Reach','Brand Lift','CPA (стоимость заявки)','Awareness'], correct:2, hint:'Performance-метрика всегда привязана к действию и его стоимости.' },
      task:{ prompt:'Опишите одним абзацем: чем отличается ваша будущая работа performance-специалиста от работы бренд-маркетолога? Приведите пример из знакомой вам ниши.', placeholder:'Например: в отличие от бренд-маркетолога, я буду отвечать за то, чтобы каждый евро бюджета...' },
      quiz:[
        {q:'Главный признак performance-кампании — это:', options:['Высокий охват','Привязка бюджета к измеримому действию','Использование видео','Присутствие в соцсетях'], correct:1, explain:'Performance-маркетинг всегда меряется через действие и его стоимость, а не только через охват.'},
        {q:'Какой KPI типичен для performance, а не brand-кампании?', options:['Ad recall','CPA','Impressions','Brand sentiment'], correct:1, explain:'CPA (стоимость целевого действия) — классическая performance-метрика.'},
      ],
      summary:'Performance marketing — это реклама, которую можно измерить в деньгах и действиях. Специалист всегда должен уметь ответить: сколько потрачено, что получено, сколько это стоило.',
      flashcards:[
        {front:'Performance marketing', back:'Маркетинг, где успех измеряется конкретными действиями и их стоимостью'},
        {front:'Чем performance отличается от brand', back:'Performance — про действие и деньги, brand — про запоминаемость и восприятие'},
      ],
      chatgptLink:'ChatGPT Ads — это performance-канал: рекламодатель платит за клики или конверсии внутри разговора, поэтому все принципы этого урока напрямую применимы к работе в Ads Manager.',
      nextUp:'Далее разберём различия между ролями PPC specialist, media buyer, growth marketer и digital strategist — чтобы вы понимали, где именно в этой карте находится performance marketing specialist.',
    },
    {
      id:'m1-l2', title:'Роли в перформансе: PPC, media buyer, growth, strategist', duration:14,
      intro:'На собеседовании вас обязательно спросят, чем вы отличаетесь от media buyer или growth-маркетолога — важно четко разграничивать зоны ответственности.',
      explanation:'PPC specialist фокусируется на управлении конкретными рекламными кабинетами (Google Ads, Meta Ads, ChatGPT Ads): структура кампаний, ставки, объявления, оптимизация. Media buyer — более широкое понятие, часто включает переговоры о размещениях и работу с несколькими каналами, включая programmatic. Growth marketer смотрит на всю воронку целиком, включая продукт, retention и эксперименты, а не только на платный трафик. Digital strategist формирует общую стратегию присутствия бренда в цифровых каналах, часто не погружаясь в операционную настройку кабинетов.\n\nPerformance Marketing Specialist уровня Junior+/Middle — это, по сути, PPC specialist с более широким пониманием экономики и аналитики, способный работать в нескольких кабинетах одновременно и разговаривать с клиентом на языке бизнеса.',
      terms:[
        {term:'PPC specialist', en:'PPC specialist', def:'Специалист, управляющий кампаниями с оплатой за клик в конкретных рекламных кабинетах.'},
        {term:'Media buyer', en:'Media buyer', def:'Специалист по закупке рекламных размещений, часто в нескольких каналах и форматах.'},
        {term:'Growth marketer', en:'Growth marketer', def:'Специалист, работающий над ростом через эксперименты во всей воронке, включая продукт.'},
      ],
      visualHtml:`<table class="data-table"><tr><th>Роль</th><th>Фокус</th></tr>
        <tr><td>PPC specialist</td><td>Конкретные кабинеты: структура, ставки, объявления</td></tr>
        <tr><td>Media buyer</td><td>Закупка размещений в разных каналах</td></tr>
        <tr><td>Growth marketer</td><td>Вся воронка + продукт + эксперименты</td></tr>
        <tr><td>Digital strategist</td><td>Общая стратегия каналов</td></tr></table>`,
      example:'Если агентство ищет человека, который «настроит и будет вести Google Ads и ChatGPT Ads для трёх клиентов» — это вакансия PPC/Performance specialist, а не growth marketer.',
      mistake:'Называть себя growth-маркетологом, если весь опыт — это настройка объявлений в одном кабинете. Это разные наборы навыков и ожиданий.',
      miniExercise:{ prompt:'Вакансия: «Нужен человек, который будет тестировать разные onboarding-экраны в приложении и одновременно настраивать платный трафик». Это ближе к роли:', options:['PPC specialist','Growth marketer','Digital strategist','Media buyer'], correct:1, hint:'Ключевое слово — работа с продуктом (onboarding), а не только с кабинетами.' },
      task:{ prompt:'Опишите, какой набор из 3–5 навыков вы бы указали в резюме на позицию Performance Marketing Specialist (ChatGPT Ads фокус) прямо сейчас, и что хотите добавить после курса.', placeholder:'Сейчас: ... После курса: ...' },
      quiz:[
        {q:'Кто чаще всего работает с несколькими каналами и ведёт переговоры о размещениях?', options:['PPC specialist','Media buyer','Growth marketer','HR-менеджер'], correct:1, explain:'Media buyer исторически ближе к закупке и переговорам о размещениях.'},
        {q:'Growth marketer отличается от PPC specialist тем, что:', options:['Не работает с рекламой вообще','Смотрит на всю воронку, включая продукт','Работает только с email','Всегда более junior'], correct:1, explain:'Growth marketer шире PPC specialist — включает продукт и retention.'},
      ],
      summary:'Performance Marketing Specialist ближе всего к PPC specialist, но с более широким пониманием экономики, аналитики и клиентской коммуникации — и именно этому учит курс.',
      flashcards:[{front:'PPC specialist vs Growth marketer', back:'PPC — конкретные кабинеты; Growth — вся воронка и продукт'}],
      chatgptLink:'В ChatGPT Ads вы будете выступать именно в роли PPC/Performance specialist: структура кампаний, context hints, ставки, объявления — операционная работа в конкретном кабинете.',
      nextUp:'Дальше — рекламные каналы и модель paid/owned/earned media.',
    },
    {
      id:'m1-l3', title:'Каналы, paid/owned/earned media и роль оффера', duration:15,
      intro:'Специалист должен понимать место платной рекламы среди других каналов, иначе легко переоценить или недооценить её роль в результатах бизнеса.',
      explanation:'Все каналы принято делить на три группы. Paid media — то, за что бизнес платит напрямую: Google Ads, Meta Ads, ChatGPT Ads, programmatic. Owned media — каналы, которыми бизнес владеет: сайт, email-база, соцсети бренда, продукт. Earned media — упоминания, которые бизнес не купил напрямую: органический охват, рекомендации, PR, отзывы.\n\nДаже самая точная настройка рекламы не спасёт слабый оффер или плохой landing page — реклама лишь приводит трафик к точке конверсии, а конвертирует уже продукт, цена, оффер и сама страница.',
      terms:[
        {term:'Paid media', en:'Paid media', def:'Платные рекламные каналы.'},
        {term:'Owned media', en:'Owned media', def:'Каналы, принадлежащие бизнесу: сайт, база подписчиков.'},
        {term:'Earned media', en:'Earned media', def:'Неоплаченные упоминания: PR, отзывы, органические рекомендации.'},
        {term:'Offer', en:'Offer', def:'Конкретное предложение бизнеса: продукт + цена + условия.'},
      ],
      visualHtml:`<div class="grid grid-3">
        <div class="callout term"><b>Paid</b><br>Google Ads, Meta Ads, ChatGPT Ads</div>
        <div class="callout example"><b>Owned</b><br>Сайт, email, продукт</div>
        <div class="callout mistake"><b>Earned</b><br>PR, отзывы, сарафан</div>
      </div>`,
      example:'Интернет-магазин косметики тратит €500 на ChatGPT Ads (paid), приводит трафик на свой сайт (owned), а довольные покупатели пишут отзывы в соцсетях (earned) — все три типа работают вместе.',
      mistake:'Списывать плохие результаты рекламы только на «неправильные настройки», хотя часто проблема в оффере или landing page, к которым реклама не имеет отношения.',
      miniExercise:{ prompt:'Отзывы клиентов в Google Maps — это пример:', options:['Paid media','Owned media','Earned media','Performance media'], correct:2, hint:'Бизнес не платил напрямую за эти отзывы.' },
      task:{ prompt:'Для знакомого вам бизнеса перечислите минимум по одному примеру paid, owned и earned media.', placeholder:'Paid: ... Owned: ... Earned: ...' },
      quiz:[
        {q:'Landing page — это пример:', options:['Paid media','Owned media','Earned media','Ни один вариант не подходит'], correct:1, explain:'Сайт принадлежит бизнесу — это owned media.'},
        {q:'Если оффер слабый, а настройка рекламы идеальна, конверсии будут:', options:['Всегда высокими','Зависеть в первую очередь от оффера, а не только от настройки','Не зависеть от оффера','Автоматически расти'], correct:1, explain:'Реклама доводит трафик до точки конверсии, но конвертирует оффер и страница.'},
      ],
      summary:'Реклама — только один из трёх типов медиа и лишь часть пути клиента. Результат всегда зависит от связки: канал + оффер + landing page.',
      flashcards:[{front:'Paid / Owned / Earned', back:'Платное / своё / заслуженное медиа'}],
      chatgptLink:'При запуске ChatGPT Ads специалист обязательно проверяет, ведёт ли объявление на сильную landing page (owned media) — иначе даже точные context hints не дадут результата.',
      nextUp:'Дальше — customer journey и маркетинговая воронка: как этапы пути клиента определяют выбор канала и цели.',
    },
    {
      id:'m1-l4', title:'Customer journey, воронка и рабочая неделя специалиста', duration:18,
      intro:'Чтобы правильно ставить рекламные цели, нужно видеть весь путь клиента целиком, а не только момент клика по объявлению.',
      explanation:'Customer journey — это путь, который проходит человек от первого контакта с проблемой до покупки и удержания. Классическая воронка делит этот путь на этапы: Awareness (узнал о проблеме/бренде) → Consideration (сравнивает варианты) → Conversion (покупает) → Retention (возвращается, рекомендует).\n\nКаждому этапу соответствуют разные цели рекламы и разные метрики: на Awareness важны охват и стоимость показа, на Consideration — вовлечённость и клики, на Conversion — CPA и ROAS, на Retention — LTV и повторные покупки. Бизнес-задача переводится в рекламную цель именно через определение того, на каком этапе воронки сейчас находится основная масса аудитории.\n\nТипичная рабочая неделя junior+/middle performance-специалиста включает: анализ вчерашних/недельных результатов, оптимизацию 2–4 кампаний, написание/тестирование новых объявлений или context hints, созвон с клиентом или тимлидом, подготовку отчёта, изучение новых функций рекламных кабинетов.',
      terms:[
        {term:'Customer journey', en:'Customer journey', def:'Путь клиента от осознания потребности до покупки и удержания.'},
        {term:'Marketing funnel', en:'Marketing funnel', def:'Модель этапов пути клиента: Awareness → Consideration → Conversion → Retention.'},
        {term:'Retention', en:'Retention', def:'Удержание клиента, повторные покупки и лояльность.'},
      ],
      visualHtml:`<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <div class="pill tag-career">Awareness</div><span>→</span>
        <div class="pill tag-ppc">Consideration</div><span>→</span>
        <div class="pill tag-chatgpt">Conversion</div><span>→</span>
        <div class="pill tag-analytics">Retention</div>
      </div>`,
      example:'Пользователь спрашивает у ChatGPT «как выбрать увлажняющий крем для сухой кожи» (Awareness/Consideration) — здесь уместна реклама, которая помогает сравнить варианты, а не агрессивный CTA «купить сейчас».',
      mistake:'Ставить всем кампаниям одну и ту же цель «максимум конверсий», не учитывая, что часть аудитории ещё находится на этапе осознания проблемы и не готова покупать.',
      miniExercise:{ prompt:'Пользователь читает сравнение «ChatGPT Ads vs Google Ads для малого бизнеса». На каком этапе воронки он находится?', options:['Awareness','Consideration','Conversion','Retention'], correct:1, hint:'Он уже знает о проблеме и сравнивает варианты решения.' },
      task:{ prompt:'Постройте воронку для выбранного вами проекта (из 4 этапов) и укажите, какая рекламная цель подходит каждому этапу.', placeholder:'Awareness: цель — ... Consideration: цель — ... и т.д.' },
      quiz:[
        {q:'На этапе Retention важнее всего метрика:', options:['CPM','LTV','CTR','Reach'], correct:1, explain:'LTV измеряет ценность клиента во времени — ключевая метрика удержания.'},
        {q:'Перевод бизнес-цели «увеличить продажи» в рекламную цель обычно означает выбор:', options:['Objective на Reach','Objective на Conversions/Sales','Objective на Awareness','Отказ от рекламы'], correct:1, explain:'Продажи — это конверсионная цель, соответствующая нижней части воронки.'},
      ],
      summary:'Каждый этап воронки требует своей рекламной цели и метрики. Хороший специалист сначала определяет этап, а потом уже настройки кампании.',
      flashcards:[{front:'4 этапа воронки', back:'Awareness, Consideration, Conversion, Retention'}],
      chatgptLink:'В ChatGPT Ads объективы (Reach, Clicks, Conversions) подбираются именно под этап воронки — это разберём подробно в модуле про цели и бюджеты.',
      nextUp:'Модуль 2: ключевые показатели рекламы и калькуляторы — база для всех дальнейших решений.',
    },
  ],
};
