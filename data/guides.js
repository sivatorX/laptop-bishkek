// Guide pages for visitors (SEO): short answers to questions people type into Google.
// `npm run guides` turns this file into HTML pages in guide/ (Russian) and guide/en/ (English).
// Section texts are HTML. Links to other guides: "money.html". Link to the main site: "{site}".
// Facts checked online on CHECKED (prices and rules change, so the pages say "check before you go").

export const CHECKED = "2026-11-13";

export const GUIDES = [
  {
    slug: "airport",
    emoji: "✈️",
    ru: {
      title: "Из аэропорта Манас в Бишкек: такси и маршрутка 380",
      description: "Как доехать из аэропорта Манас до центра Бишкека: такси через приложение, маршрутка 380, ночью, сколько ехать и что сделать сразу после прилёта.",
      intro: "Аэропорт «Манас» находится примерно в 25–30 км к северу от центра Бишкека. На машине без пробок это 30–40 минут.",
      sections: [
        {
          h: "Такси через приложение (самый простой способ)",
          html: "<p>В Бишкеке пользуются приложениями <b>Yandex Go</b> (бывшее Яндекс Такси) и <b>inDrive</b>. Цена видна заранее, и обычно она ниже, чем у таксистов в зале прилёта.</p><p>Для приложения нужен интернет. Можно купить SIM-карту прямо в аэропорту: <a href=\"sim-card.html\">как купить SIM-карту</a>.</p>",
        },
        {
          h: "Таксисты в зале прилёта",
          html: "<p>Если берёте машину на месте, <b>договоритесь о цене до посадки</b>: счётчиком пользуются не всегда. Сравните цену с приложением, это займёт минуту.</p>",
        },
        {
          h: "Маршрутка № 380 (дёшево, но дольше)",
          html: "<p>Маршрутка 380 идёт от аэропорта до Западного автовокзала Бишкека. Ходит в основном днём, вечером и ночью на неё лучше не рассчитывать.</p><p>Платят обычно наличными водителю, держите мелкие купюры. По отзывам туристов в 2025 году проезд стоил около 50–70 сом, но цена может измениться.</p>",
        },
        {
          h: "Что сделать сразу после прилёта",
          html: "<ul><li>Поменять немного денег или снять сом в банкомате: <a href=\"money.html\">деньги в Бишкеке</a>.</li><li>Купить SIM-карту или включить eSIM.</li><li>Поставить приложение 2GIS: в нём карты, маршруты транспорта и часы работы мест.</li></ul>",
        },
      ],
      ask: "Как доехать из Манаса до площади Ала-Тоо ночью?",
    },
    en: {
      title: "Manas Airport to Bishkek: taxi and minibus 380",
      description: "How to get from Manas Airport to central Bishkek: taxi apps, minibus 380, arriving at night, travel time and what to do right after landing.",
      intro: "Manas Airport is about 25–30 km north of central Bishkek. By car, without traffic, it takes 30–40 minutes.",
      sections: [
        {
          h: "Taxi app (the easiest way)",
          html: "<p>Locals use <b>Yandex Go</b> (formerly Yandex Taxi) and <b>inDrive</b>. You see the price before the ride, and it is usually lower than what drivers in the arrivals hall ask.</p><p>The apps need mobile data. You can buy a SIM card right at the airport: <a href=\"sim-card.html\">how to get a SIM card</a>.</p>",
        },
        {
          h: "Drivers in the arrivals hall",
          html: "<p>If you take a car on the spot, <b>agree on the price before you get in</b>: meters are not always used. Compare it with a taxi app first, it takes a minute.</p>",
        },
        {
          h: "Minibus 380 (cheap but slower)",
          html: "<p>Minibus (marshrutka) 380 runs from the airport to Bishkek's Western Bus Station. It runs mostly in daytime, so don't count on it in the evening or at night.</p><p>You usually pay the driver in cash, so keep small notes. Travellers reported about 50–70 som in 2025, but the fare can change.</p>",
        },
        {
          h: "What to do right after landing",
          html: "<ul><li>Change a little money or take som from an ATM: <a href=\"money.html\">money in Bishkek</a>.</li><li>Buy a SIM card or turn on your eSIM.</li><li>Install 2GIS: maps, public transport routes and opening hours, all in one app.</li></ul>",
        },
      ],
      ask: "How do I get from Manas to Ala-Too Square at night?",
    },
  },
  {
    slug: "transport",
    emoji: "🚌",
    ru: {
      title: "Транспорт в Бишкеке: автобусы, маршрутки, такси и карта «Тулпар»",
      description: "Как ездить по Бишкеку: как оплатить автобус и троллейбус (карта «Тулпар», банковская карта, QR), маршрутки, такси через приложение и час пик.",
      intro: "Бишкек удобно объезжать на автобусах, маршрутках и такси, а центр небольшой и зелёный: многое можно обойти пешком.",
      sections: [
        {
          h: "Как найти маршрут",
          html: "<p>Все пользуются приложением <b>2GIS</b>. Там есть автобусы, троллейбусы и маршрутки с номерами и остановками.</p>",
        },
        {
          h: "Автобусы и троллейбусы: оплата без наличных",
          html: "<p>С 2025 года в городских автобусах и троллейбусах платят <b>без наличных</b>: транспортной картой «Тулпар», банковской картой или QR-кодом через банковское приложение. Правила за последние годы менялись несколько раз, так что лучше уточнить на месте.</p><p>Карту «Тулпар» продают у водителя, в почтовых отделениях и в офисах мобильных операторов. С 2026 года с ней действуют бесплатные пересадки в течение часа.</p>",
        },
        {
          h: "Маршрутки",
          html: "<p>Маршрутки — это небольшие автобусы, их много, и они ходят почти везде. Платят обычно наличными, держите мелкие купюры. Чтобы выйти, скажите водителю заранее.</p>",
        },
        {
          h: "Такси",
          html: "<p>Удобнее всего через приложения <b>Yandex Go</b> (бывшее Яндекс Такси) и <b>inDrive</b>: цена видна заранее и обычно ниже, чем у машины, пойманной на улице.</p>",
        },
        {
          h: "Час пик",
          html: "<p>Примерно с 8 до 10 утра и с 17 до 19 вечера на главных проспектах (Чуй, Манаса, Жибек Жолу) пробки. В это время пешком по центру часто быстрее.</p>",
        },
      ],
      ask: "Как доехать на автобусе от Ошского базара до Дубового парка?",
    },
    en: {
      title: "Getting around Bishkek: buses, marshrutkas, taxis and the Tulpar card",
      description: "How to get around Bishkek: paying for buses and trolleybuses (Tulpar card, bank card, QR), marshrutka minibuses, taxi apps and rush hours.",
      intro: "Buses, minibuses and taxis cover the whole city, and the centre is small and green: you can walk to a lot of places.",
      sections: [
        {
          h: "Finding a route",
          html: "<p>Everyone uses the <b>2GIS</b> app. It has buses, trolleybuses and minibuses with route numbers and stops.</p>",
        },
        {
          h: "Buses and trolleybuses: no cash",
          html: "<p>Since 2025, city buses and trolleybuses are <b>cashless</b>: pay with the Tulpar transport card, a bank card or a QR code in a banking app. The rules have changed several times in recent years, so check when you arrive.</p><p>Tulpar cards are sold by drivers, at post offices and at mobile operator shops. Since 2026, the card gives free transfers within an hour.</p>",
        },
        {
          h: "Marshrutkas (minibuses)",
          html: "<p>Marshrutkas are small private minibuses. There are many of them, and they go almost everywhere. You usually pay in cash, so keep small notes. Tell the driver in advance where you want to get off.</p>",
        },
        {
          h: "Taxis",
          html: "<p>The easiest way is a taxi app: <b>Yandex Go</b> (formerly Yandex Taxi) or <b>inDrive</b>. You see the price first, and it is usually lower than a car you stop on the street.</p>",
        },
        {
          h: "Rush hours",
          html: "<p>Roughly 8–10 am and 5–7 pm the main avenues (Chuy, Manas, Zhibek Zholu) are busy. In the centre, walking is often faster then.</p>",
        },
      ],
      ask: "Which bus goes from Osh Bazaar to Oak Park?",
    },
  },
  {
    slug: "money",
    emoji: "💵",
    ru: {
      title: "Деньги в Бишкеке: сом, обмен валюты, карты и чаевые",
      description: "Деньги в Бишкеке для гостей: курс сома, где поменять валюту, работают ли карты Visa и Mastercard, где нужны наличные и сколько оставлять чаевых.",
      intro: "Местная валюта — кыргызский сом (KGS). В центре почти везде можно платить картой, но наличные всё равно понадобятся.",
      sections: [
        {
          h: "Курс сома",
          html: "<p>Официальный курс каждый день публикует Национальный банк Кыргызстана. В обменниках курс немного отличается, сравните пару мест рядом.</p>",
        },
        {
          h: "Где поменять деньги",
          html: "<p>Обменники есть по всему центру и в торговых центрах. Доллары, евро, рубли и тенге меняют без проблем. Берите <b>чистые и целые купюры</b>: мятые или надорванные могут не взять или поменять по худшему курсу.</p>",
        },
        {
          h: "Карты",
          html: "<p>В кафе, магазинах и торговых центрах центра обычно принимают карты. Иностранные Visa и Mastercard, как правило, работают в банкоматах и крупных магазинах, но не везде, поэтому имейте запас наличных.</p><p>Местные часто платят по QR-коду через приложение банка. Без местного банка этот способ обычно недоступен.</p>",
        },
        {
          h: "Где нужны наличные",
          html: "<ul><li>Базары (Ошский, Дордой).</li><li>Маршрутки: <a href=\"transport.html\">транспорт в Бишкеке</a>.</li><li>Маленькие кафе и уличная еда.</li></ul>",
        },
        {
          h: "Чаевые",
          html: "<p>Во многих кафе и ресторанах в счёт уже включено «обслуживание», часто 10–15%. Посмотрите в чек, прежде чем оставлять что-то сверху.</p>",
        },
      ],
      ask: "Какой сегодня курс доллара?",
    },
    en: {
      title: "Money in Bishkek: som, currency exchange, cards and tips",
      description: "Money in Bishkek for visitors: the som exchange rate, where to change currency, whether Visa and Mastercard work, when you need cash and how much to tip.",
      intro: "The local currency is the Kyrgyz som (KGS). In the centre you can pay by card almost everywhere, but you will still need some cash.",
      sections: [
        {
          h: "Exchange rate",
          html: "<p>The National Bank of the Kyrgyz Republic publishes the official rate every day. Exchange offices give slightly different rates, so compare a couple nearby.</p>",
        },
        {
          h: "Where to change money",
          html: "<p>There are exchange offices all over the centre and in shopping malls. US dollars, euros, Russian roubles and Kazakh tenge are easy to change. Bring <b>clean, undamaged notes</b>: worn or torn ones may be refused or get a worse rate.</p>",
        },
        {
          h: "Cards",
          html: "<p>Cafes, shops and malls in the centre usually take cards. Foreign Visa and Mastercard generally work at ATMs and bigger shops, but not everywhere, so keep some cash.</p><p>Locals often pay with a QR code in their banking app. Without a local bank account this is usually not an option.</p>",
        },
        {
          h: "When you need cash",
          html: "<ul><li>Bazaars (Osh Bazaar, Dordoi).</li><li>Marshrutka minibuses: <a href=\"transport.html\">getting around Bishkek</a>.</li><li>Small cafes and street food.</li></ul>",
        },
        {
          h: "Tipping",
          html: "<p>Many cafes and restaurants already add a service charge to the bill, often 10–15%. Check the receipt before leaving extra.</p>",
        },
      ],
      ask: "What is the dollar rate today?",
    },
  },
  {
    slug: "sim-card",
    emoji: "📱",
    ru: {
      title: "SIM-карта в Бишкеке для туриста: Beeline, MegaCom, O! или eSIM",
      description: "Как купить SIM-карту в Бишкеке: операторы Beeline, MegaCom и O!, покупка в аэропорту Манас, нужен ли паспорт, eSIM и где найти бесплатный Wi-Fi.",
      intro: "Мобильный интернет в Кыргызстане недорогой, а в городе хорошо работают все три оператора: Beeline, MegaCom и O!.",
      sections: [
        {
          h: "Где купить",
          html: "<p>В офисах операторов по всему городу и на стойках в аэропорту «Манас». В аэропорту стойки работают не круглосуточно, и иногда там платят только наличными, так что держите немного сом.</p>",
        },
        {
          h: "Нужен паспорт",
          html: "<p>SIM-карту регистрируют на человека, поэтому возьмите с собой паспорт.</p>",
        },
        {
          h: "Какого оператора выбрать",
          html: "<p>В Бишкеке разницы почти нет. Если едете в горы или в сёла, связь у операторов разная: спросите в офисе про покрытие в нужном месте.</p>",
        },
        {
          h: "eSIM",
          html: "<p>eSIM можно купить онлайн ещё до поездки, тогда интернет работает сразу после посадки. Это удобно, но обычно дороже местной SIM-карты.</p>",
        },
        {
          h: "Бесплатный Wi-Fi",
          html: "<p>Во многих кафе есть Wi-Fi. Где он быстрый и можно спокойно поработать с ноутбуком, мы собрали на <a href=\"{site}\">главной странице Laptop Bishkek</a>.</p>",
        },
      ],
      ask: "Какой оператор лучше ловит на Иссык-Куле?",
    },
    en: {
      title: "SIM card in Bishkek for travellers: Beeline, MegaCom, O! or eSIM",
      description: "How to get a SIM card in Bishkek: Beeline, MegaCom and O!, buying one at Manas Airport, passport rules, eSIM and where to find free Wi-Fi.",
      intro: "Mobile data in Kyrgyzstan is cheap, and in the city all three operators work well: Beeline, MegaCom and O!.",
      sections: [
        {
          h: "Where to buy",
          html: "<p>At operator shops all over the city and at the counters in Manas Airport. The airport counters are not always open, and some take cash only, so keep a little som.</p>",
        },
        {
          h: "Bring your passport",
          html: "<p>SIM cards are registered to a person, so take your passport with you.</p>",
        },
        {
          h: "Which operator",
          html: "<p>In Bishkek there is little difference. If you go to the mountains or villages, coverage differs: ask in the shop about the places you plan to visit.</p>",
        },
        {
          h: "eSIM",
          html: "<p>You can buy an eSIM online before the trip, so you have data as soon as you land. It is convenient, but usually more expensive than a local SIM.</p>",
        },
        {
          h: "Free Wi-Fi",
          html: "<p>Many cafes have Wi-Fi. We collected the ones with fast Wi-Fi where you can work with a laptop on the <a href=\"{site}\">Laptop Bishkek main page</a>.</p>",
        },
      ],
      ask: "Which operator works best at Issyk-Kul?",
    },
  },
  {
    slug: "food",
    emoji: "🍲",
    ru: {
      title: "Что попробовать в Бишкеке: кыргызская еда и напитки",
      description: "Что попробовать в Бишкеке: бешбармак, лагман, плов, манты, самса, куурдак, кымыз и максым. Где поесть недорого и что делать вегетарианцам.",
      intro: "Кыргызская кухня сытная и мясная. Вот что стоит попробовать в первые дни.",
      sections: [
        {
          h: "Блюда",
          html: "<ul><li><b>Бешбармак</b>: лапша с варёным мясом, национальное блюдо.</li><li><b>Лагман</b>: тянутая лапша с мясом и овощами.</li><li><b>Плов</b>: рис с мясом и морковью. Его готовят утром, к вечеру может закончиться.</li><li><b>Манты</b>: большие пельмени на пару.</li><li><b>Самса</b>: пирожок с мясом из тандыра.</li><li><b>Куурдак</b>: жареное мясо с картошкой и луком.</li><li><b>Шорпо</b>: наваристый суп с мясом.</li><li><b>Боорсоки</b>: жареные кусочки теста к чаю.</li></ul>",
        },
        {
          h: "Напитки",
          html: "<ul><li><b>Кымыз</b>: кобылье молоко, летний напиток.</li><li><b>Максым</b>: прохладный напиток из злаков.</li><li><b>Чалап</b>: кисломолочный напиток, хорошо освежает в жару.</li></ul>",
        },
        {
          h: "Где поесть",
          html: "<p>В городе много кафе национальной кухни, в том числе сетевых, например «Нават» и «Фаиза». Недорого и вкусно на <b>Ошском базаре</b>: самса, фрукты, сухофрукты. Держите сумку и телефон ближе к себе.</p><p>Адреса и часы работы смотрите в 2GIS. Про счёт и чаевые: <a href=\"money.html\">деньги в Бишкеке</a>.</p>",
        },
        {
          h: "Вегетарианцам",
          html: "<p>В национальных кафе почти всё с мясом. Проще в кафе в центре: там есть салаты, овощные блюда и европейское меню.</p>",
        },
        {
          h: "Кофе и работа",
          html: "<p>Ищете кофейню, где можно посидеть с ноутбуком? Смотрите <a href=\"{site}\">кафе с быстрым Wi-Fi на главной странице</a>.</p>",
        },
      ],
      ask: "Где вкусный лагман недалеко от площади Ала-Тоо?",
    },
    en: {
      title: "What to eat in Bishkek: Kyrgyz food and drinks to try",
      description: "What to eat in Bishkek: beshbarmak, lagman, plov, manty, samsa, kuurdak, kymyz and maksym. Where to eat cheaply and tips for vegetarians.",
      intro: "Kyrgyz food is hearty and full of meat. Here is what to try in your first days.",
      sections: [
        {
          h: "Dishes",
          html: "<ul><li><b>Beshbarmak</b>: noodles with boiled meat, the national dish.</li><li><b>Lagman</b>: hand-pulled noodles with meat and vegetables.</li><li><b>Plov</b>: rice with meat and carrots. It is cooked in the morning and can sell out by evening.</li><li><b>Manty</b>: big steamed dumplings.</li><li><b>Samsa</b>: a meat pastry baked in a tandoor oven.</li><li><b>Kuurdak</b>: fried meat with potatoes and onions.</li><li><b>Shorpo</b>: a rich meat soup.</li><li><b>Boorsok</b>: fried pieces of dough, served with tea.</li></ul>",
        },
        {
          h: "Drinks",
          html: "<ul><li><b>Kymyz</b>: fermented mare's milk, a summer drink.</li><li><b>Maksym</b>: a cold drink made from grains.</li><li><b>Chalap</b>: a sour milk drink, refreshing in the heat.</li></ul>",
        },
        {
          h: "Where to eat",
          html: "<p>The city has many cafes with local food, including chains like Navat and Faiza. For cheap and tasty food, go to <b>Osh Bazaar</b>: samsa, fruit, dried fruit. Keep your bag and phone close.</p><p>Find addresses and opening hours in 2GIS. About the bill and tips: <a href=\"money.html\">money in Bishkek</a>.</p>",
        },
        {
          h: "For vegetarians",
          html: "<p>In traditional cafes almost everything has meat. It is easier in cafes in the centre: they have salads, vegetable dishes and European menus.</p>",
        },
        {
          h: "Coffee and work",
          html: "<p>Looking for a cafe where you can sit with a laptop? See <a href=\"{site}\">cafes with fast Wi-Fi on the main page</a>.</p>",
        },
      ],
      ask: "Where can I get good lagman near Ala-Too Square?",
    },
  },
];
