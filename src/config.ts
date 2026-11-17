export type Lang = 'uz' | 'en' | 'ru';

export type PieceCategory = 'clothing' | 'shoe' | 'one-size';

export type LocalizedText = Record<Lang, string>;

export interface Piece {
  id: string;
  name: LocalizedText;
  price: number; // in UZS (so'm)
  fabric: LocalizedText;
  category: PieceCategory;
}

export interface Look {
  id: string;
  image: string;
  aspectRatio: number;
  word: LocalizedText;
  title: LocalizedText;
  note: LocalizedText;
  tint: string;
  wordColor: string;
  pieces: [Piece, Piece, Piece];
}

export interface NavItem {
  id: 'collection' | 'atelier' | 'campaign' | 'stockists';
  label: LocalizedText;
}

export interface EditorialSection {
  id: Exclude<NavItem['id'], 'collection'>;
  heading: LocalizedText;
  subtitle: LocalizedText;
  body: LocalizedText;
  details: { label: LocalizedText; value: LocalizedText }[];
}

export const SIZE_OPTIONS: Record<PieceCategory, LocalizedText[]> = {
  clothing: [
    { uz: 'XS', en: 'XS', ru: 'XS' },
    { uz: 'S', en: 'S', ru: 'S' },
    { uz: 'M', en: 'M', ru: 'M' },
    { uz: 'L', en: 'L', ru: 'L' },
    { uz: 'XL', en: 'XL', ru: 'XL' },
  ],
  shoe: [
    { uz: '36', en: '36', ru: '36' },
    { uz: '37', en: '37', ru: '37' },
    { uz: '38', en: '38', ru: '38' },
    { uz: '39', en: '39', ru: '39' },
    { uz: '40', en: '40', ru: '40' },
    { uz: '41', en: '41', ru: '41' },
  ],
  'one-size': [{ uz: "Yagona o'lcham", en: 'One Size', ru: 'Единый' }],
};

export const UI_COPY: Record<
  Lang,
  {
    lookWord: string;
    lookTotal: string;
    completeLookTotal: string;
    shopTheLook: string;
    addToBag: string;
    addedToBag: string;
    bag: string;
    selectionBag: string;
    bagEmptyTitle: string;
    bagEmptyBody: string;
    subtotal: string;
    continueBrowsing: string;
    prevLook: string;
    nextLook: string;
    closeDetails: string;
    closeDialog: string;
    closeBag: string;
    removeFromBag: string;
    currencySuffix: string;
    inspectLook: string;
    bringToCenter: string;
    closeLookDetails: string;
    selectSizeFor: string;
  }
> = {
  uz: {
    lookWord: 'Obraz',
    lookTotal: 'Umumiy narx',
    completeLookTotal: "To'plam jami",
    shopTheLook: "Obrazni ko'rish",
    addToBag: "To'plamni savatchaga qo'shish",
    addedToBag: "Savatchaga qo'shildi",
    bag: 'Savatcha',
    selectionBag: 'Savatcha',
    bagEmptyTitle: "Savatchangiz bo'sh",
    bagEmptyBody:
      "Bichim tafsilotlarini ko'rish, o'lcham tanlash va to'plamni savatchaga qo'shish uchun markazdagi obrazni bosing.",
    subtotal: 'Jami',
    continueBrowsing: 'Obrazlarni ko‘rishda davom etish',
    prevLook: 'Oldingi obraz',
    nextLook: 'Keyingi obraz',
    closeDetails: 'Tafsilotlarni yopish',
    closeDialog: 'Oynani yopish',
    closeBag: 'Savatchani yopish',
    removeFromBag: 'Savatchadan olib tashlash',
    currencySuffix: "so'm",
    inspectLook: "tafsilotlarini ko'rish",
    bringToCenter: 'markazga chiqarish',
    closeLookDetails: 'tafsilotlarini yopish',
    selectSizeFor: "O'lcham tanlash:",
  },
  en: {
    lookWord: 'Look',
    lookTotal: 'Look Total',
    completeLookTotal: 'Complete Look Total',
    shopTheLook: 'Shop the look',
    addToBag: 'Add the look to bag',
    addedToBag: 'Added to bag',
    bag: 'Bag',
    selectionBag: 'Selection Bag',
    bagEmptyTitle: 'Your bag is empty',
    bagEmptyBody:
      'Select any figure on the lookbook rail to review tailoring, choose sizes, and add a complete look.',
    subtotal: 'Subtotal',
    continueBrowsing: 'Continue Browsing Looks',
    prevLook: 'Previous look',
    nextLook: 'Next look',
    closeDetails: 'Close product details',
    closeDialog: 'Close dialog',
    closeBag: 'Close bag',
    removeFromBag: 'Remove from bag',
    currencySuffix: "so'm",
    inspectLook: 'Inspect look',
    bringToCenter: 'Bring to center',
    closeLookDetails: 'Close details',
    selectSizeFor: 'Select size for',
  },
  ru: {
    lookWord: 'Образ',
    lookTotal: 'Стоимость образа',
    completeLookTotal: 'Итого за образ',
    shopTheLook: 'Смотреть образ',
    addToBag: 'Добавить образ в корзину',
    addedToBag: 'Добавлено в корзину',
    bag: 'Корзина',
    selectionBag: 'Корзина',
    bagEmptyTitle: 'Корзина пуста',
    bagEmptyBody:
      'Нажмите на центральный образ, чтобы изучить детали кроя, выбрать размеры и добавить весь комплект в корзину.',
    subtotal: 'Итого',
    continueBrowsing: 'Продолжить просмотр',
    prevLook: 'Предыдущий образ',
    nextLook: 'Следующий образ',
    closeDetails: 'Закрыть детали',
    closeDialog: 'Закрыть окно',
    closeBag: 'Закрыть корзину',
    removeFromBag: 'Удалить из корзины',
    currencySuffix: 'сум',
    inspectLook: 'Открыть детали',
    bringToCenter: 'Показать в центре',
    closeLookDetails: 'Закрыть детали',
    selectSizeFor: 'Выберите размер для',
  },
};

export const BRAND_CONFIG = {
  name: 'FIRDAVS',
  nav: [
    {
      id: 'collection',
      label: { uz: 'Kolleksiya', en: 'Collection', ru: 'Коллекция' },
    },
    {
      id: 'atelier',
      label: { uz: 'Atelye', en: 'Atelier', ru: 'Ателье' },
    },
    {
      id: 'campaign',
      label: { uz: 'Kampaniya', en: 'Campaign', ru: 'Кампания' },
    },
    {
      id: 'stockists',
      label: { uz: "Do'konlar", en: 'Stockists', ru: 'Бутики' },
    },
  ] as NavItem[],
  editorial: {
    atelier: {
      id: 'atelier',
      heading: {
        uz: 'Firdavs Atelyesi',
        en: 'The Firdavs Atelier',
        ru: 'Ателье Firdavs',
      },
      subtitle: {
        uz: 'Ikki qavatli italyan juni, yapon gabardini va tabiiy charmdan tikilgan me’moriy siluetlar.',
        en: 'Patterned in double-faced wool, Japanese gabardine, and vegetable-tanned hides.',
        ru: 'Архитектурный крой из двухсторонней шерсти, японского габардина и кожи растительного дубления.',
      },
      body: {
        uz: 'Firdavs uyining har bir libosi ortiqcha bezaksiz, qo‘lda yopiq chok usulida bichiladi. Paltolar astarsiz ishlangani bois ichki tomoni ham tashqi ko‘rinishi kabi mukammal turadi.',
        en: 'Every Firdavs silhouette begins on the tailor’s table without lining or superfluous hardware. Coats are hand-finished with blind-stitched seams so the interior wears as cleanly as the exterior.',
        ru: 'Каждый силуэт Firdavs создаётся без подкладки и лишней фурнитуры. Пальто сшиты потайными швами вручную, чтобы изнанка выглядела так же безупречно, как и лицевая сторона.',
      },
      details: [
        {
          label: { uz: 'Matolar', en: 'Mills', ru: 'Фабрики' },
          value: {
            uz: 'Biella, Kojima va Xouik',
            en: 'Biella, Kojima & Hawick',
            ru: 'Биелла, Кодзима и Хоик',
          },
        },
        {
          label: { uz: 'Bichim', en: 'Construction', ru: 'Пошив' },
          value: {
            uz: 'Astarsiz ikki qavatli qo‘l choki',
            en: 'Unlined double-face & hand-felled seams',
            ru: 'Двухсторонняя ткань и ручные швы',
          },
        },
        {
          label: { uz: 'Manzil', en: 'Appointments', ru: 'Адрес' },
          value: {
            uz: 'Toshkent · Amir Temur shoh ko‘chasi, 42',
            en: 'Tashkent · Amir Temur Avenue, 42',
            ru: 'Ташкент · проспект Амира Темура, 42',
          },
        },
      ],
    },
    campaign: {
      id: 'campaign',
      heading: {
        uz: 'Sokin Monolit',
        en: 'Quiet Monolith',
        ru: 'Тихий монолит',
      },
      subtitle: {
        uz: 'Nisbatlar, monoxrom drape va vazmin ustki kiyimlar bo‘yicha sakkizta etyud.',
        en: 'Eight studies in proportion, monochrome drape, and weighted outerwear.',
        ru: 'Восемь этюдов о пропорциях, монохромной драпировке и фактурной верхней одежде.',
      },
      body: {
        uz: 'Barcha obrazlar bir xil balandlikdagi tabiiy studiya yorug‘ligida suratga olingan bo‘lib, etak uzunligi, yelka chizig‘i va poyabzal hajmi o‘zaro aniq mutanosiblikda ko‘rinadi.',
        en: 'Photographed in flat northern daylight at a fixed camera horizon so hem lengths, shoulder lines, and footwear volumes read in true scale across the full season.',
        ru: 'Все образы сняты при ровном дневном свете с единой линии горизонта, чтобы длина подола, линия плеча и объём обуви читались в точном масштабе.',
      },
      details: [
        {
          label: { uz: 'Mavsum', en: 'Season', ru: 'Сезон' },
          value: {
            uz: 'Kuz / Qish 2026',
            en: 'Autumn / Winter 2026',
            ru: 'Осень / Зима 2026',
          },
        },
        {
          label: { uz: 'Obrazlar', en: 'Looks', ru: 'Образы' },
          value: {
            uz: '01 dan 08 gacha',
            en: '01 through 08',
            ru: 'С 01 по 08',
          },
        },
        {
          label: { uz: 'Ranglar', en: 'Palette', ru: 'Палитра' },
          value: {
            uz: 'Qumrang, Kulrang, Terrakota, Qaymoq, Shifer, Espresso, Zaytun, Qora',
            en: 'Camel, Charcoal, Rust, Ivory, Slate, Espresso, Moss, Obsidian',
            ru: 'Кэмел, Антрацит, Терракота, Айвори, Сланец, Эспрессо, Мох, Обсидиан',
          },
        },
      ],
    },
    stockists: {
      id: 'stockists',
      heading: {
        uz: 'Rasmiy Salonlar',
        en: 'Global Stockists',
        ru: 'Бутики и салоны',
      },
      subtitle: {
        uz: 'Kuz / Qish to‘plami taqdim etilgan asosiy Flagman zallari va butiklar.',
        en: 'Selected flagship rooms and architectural boutiques carrying Autumn / Winter.',
        ru: 'Избранные флагманские пространства и архитектурные бутики коллекции Осень / Зима.',
      },
      body: {
        uz: 'Mavsumiy kolleksiya cheklangan miqdorda Toshkent, Parij va Tokio salonlariga yetkaziladi. Shaxsiy kiyib ko‘rish uchrashuvini oldindan belgilash mumkin.',
        en: 'Full seasonal allocations arrive in staggered editions across Tashkent, Paris, and Tokyo. Private fittings may be arranged directly through each house.',
        ru: 'Сезонные капсулы поступают лимитированными партиями в салоны Ташкента, Парижа и Токио. Возможна запись на индивидуальную примерку.',
      },
      details: [
        {
          label: { uz: 'Toshkent', en: 'Tashkent', ru: 'Ташкент' },
          value: {
            uz: 'Firdavs Flagman Saloni',
            en: 'Firdavs Flagship Salon',
            ru: 'Флагманский салон Firdavs',
          },
        },
        {
          label: { uz: 'Parij', en: 'Paris', ru: 'Париж' },
          value: {
            uz: 'Rue Saint-Honoré — Le Cabinet',
            en: 'Rue Saint-Honoré — Le Cabinet',
            ru: 'Rue Saint-Honoré — Le Cabinet',
          },
        },
        {
          label: { uz: 'Tokio', en: 'Tokyo', ru: 'Токио' },
          value: {
            uz: 'Minami-Aoyama — Gallery Five',
            en: 'Minami-Aoyama — Gallery Five',
            ru: 'Minami-Aoyama — Gallery Five',
          },
        },
      ],
    },
  } satisfies Record<EditorialSection['id'], EditorialSection>,
  looks: [
    {
      id: 'look-01',
      image: '/src/assets/images/cutout_01_camel.png',
      aspectRatio: 320 / 1160,
      word: { uz: 'QUMRANG', en: 'CAMEL', ru: 'КЭМЕЛ' },
      title: {
        uz: 'Kamarli Jun Trench',
        en: 'Draped Wool Trench',
        ru: 'Шерстяной тренч с поясом',
      },
      note: {
        uz: 'Ikki qavatli italyan junidan tikilgan cho‘ziq yoqali trench, erkin bichimli shim va qo‘l ishlangan loferlar bilan.',
        en: 'Double-faced Italian virgin wool cut with an elongated storm lapel and self-tie belt over fluid wide-leg suiting.',
        ru: 'Двухсторонняя итальянская шерсть с удлинённым лацканом и поясом в сочетании со свободными брюками.',
      },
      tint: '#EAE0D5',
      wordColor: '#BBA58E',
      pieces: [
        {
          id: 'camel-trench',
          name: {
            uz: 'Kamarli Ikki Qavatli Trench',
            en: 'Belted Double-Faced Trench',
            ru: 'Двухсторонний тренч с поясом',
          },
          price: 18900000,
          fabric: {
            uz: '100% Bokira Jun',
            en: '100% Virgin Wool',
            ru: '100% Натуральная шерсть',
          },
          category: 'clothing',
        },
        {
          id: 'camel-trouser',
          name: {
            uz: 'Keng Bichimli Taxlamali Shim',
            en: 'Wide-Leg Pleated Trouser',
            ru: 'Широкие брюки со складками',
          },
          price: 7550000,
          fabric: {
            uz: 'Yumshoq Jun Tvil',
            en: 'Brushed Wool Twill',
            ru: 'Шерстяной твил',
          },
          category: 'clothing',
        },
        {
          id: 'camel-loafer',
          name: {
            uz: 'To‘rtburchak Uchli Charm Lofer',
            en: 'Square-Toe Calfskin Loafer',
            ru: 'Лоферы с квадратным мысом',
          },
          price: 8200000,
          fabric: {
            uz: 'Tabiiy Oshlangan Buzoq Terisi',
            en: 'Vegetable-Tanned Calf',
            ru: 'Телячья кожа дубления',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-02',
      image: '/src/assets/images/cutout_02_charcoal.png',
      aspectRatio: 305 / 1160,
      word: { uz: 'KULRANG', en: 'CHARCOAL', ru: 'АНТРАЦИТ' },
      title: {
        uz: 'Flanel Kostyum Ansambli',
        en: 'Structured Flannel Suiting',
        ru: 'Костюм из шерстяной фланели',
      },
      note: {
        uz: 'Qat’iy me’moriy yelka chizig‘iga ega kalta bleyzer va uzun flanel shimning mutanosib uyg‘unligi.',
        en: 'Sharp architectural shoulders tempered by a cropped boxy jacket and sweeping puddle-hem flannel trousers.',
        ru: 'Чёткая линия плеч укороченного жакета уравновешена длинными свободными брюками из фланели.',
      },
      tint: '#D9DCE0',
      wordColor: '#A9B0BA',
      pieces: [
        {
          id: 'charcoal-blazer',
          name: {
            uz: 'Kalta Boks Bleyzer',
            en: 'Cropped Box Blazer',
            ru: 'Укороченный прямой блейзер',
          },
          price: 14300000,
          fabric: {
            uz: 'Super 120s Jun Flanel',
            en: 'Super 120s Wool Flannel',
            ru: 'Шерстяная фланель Super 120s',
          },
          category: 'clothing',
        },
        {
          id: 'charcoal-trouser',
          name: {
            uz: 'Baland Belli Ustun Shim',
            en: 'High-Waist Column Trouser',
            ru: 'Прямые брюки с высокой посадкой',
          },
          price: 7900000,
          fabric: {
            uz: 'Super 120s Jun Flanel',
            en: 'Super 120s Wool Flannel',
            ru: 'Шерстяная фланель Super 120s',
          },
          category: 'clothing',
        },
        {
          id: 'charcoal-boot',
          name: {
            uz: 'Uchli Charm Botinka',
            en: 'Pointed Architectural Boot',
            ru: 'Ботильоны с острым мысом',
          },
          price: 9950000,
          fabric: {
            uz: 'Silliq Buzoq Terisi',
            en: 'Box Calf Leather',
            ru: 'Гладкая телячья кожа',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-03',
      image: '/src/assets/images/cutout_03_rust.png',
      aspectRatio: 329 / 1160,
      word: { uz: 'TERRAKOTA', en: 'RUST', ru: 'ТЕРРАКОТА' },
      title: {
        uz: 'Ipak va Tabiiy Charm',
        en: 'Burnished Silk & Leather',
        ru: 'Шёлк и мягкая кожа наппа',
      },
      note: {
        uz: 'Mayin nappa charm palto, xom ipak bluzka va uzun yubka orqali yaratilgan iliq fakturalar uyg‘unligi.',
        en: 'Tactile contrasts of crisp ivory habotai silk and vegetable-dyed nappa lambskin anchored by a bias column skirt.',
        ru: 'Контраст воздушного шёлка хаботай и эластичной кожи наппа в ансамбле с юбкой-колонной.',
      },
      tint: '#EAD7CF',
      wordColor: '#C59A89',
      pieces: [
        {
          id: 'rust-coat',
          name: {
            uz: 'Mayin Nappa Charm Palto',
            en: 'Supple Nappa Overcoat',
            ru: 'Пальто из мягкой кожи наппа',
          },
          price: 24200000,
          fabric: {
            uz: 'To‘liq Donli Qo‘zi Terisi',
            en: 'Full-Grain Lambskin',
            ru: 'Натуральная кожа ягнёнка',
          },
          category: 'clothing',
        },
        {
          id: 'rust-skirt',
          name: {
            uz: 'Qiyshiq Bichimli Uzun Yubka',
            en: 'Bias-Cut Column Skirt',
            ru: 'Юбка-колонна по косой',
          },
          price: 8200000,
          fabric: {
            uz: 'Zich Mat Viskoza',
            en: 'Heavy Matte Viscose',
            ru: 'Плотная матовая вискоза',
          },
          category: 'clothing',
        },
        {
          id: 'rust-mule',
          name: {
            uz: 'Zamsh Myuli Oyoq Kiyim',
            en: 'Sculpted Suede Mule',
            ru: 'Мюли из бархатистой замши',
          },
          price: 6900000,
          fabric: {
            uz: 'Yumshoq Tabiiy Zamsh',
            en: 'Brushed Kid Suede',
            ru: 'Мягкая козья замша',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-04',
      image: '/src/assets/images/cutout_04_ivory.png',
      aspectRatio: 306 / 1160,
      word: { uz: 'QAYMOQ', en: 'IVORY', ru: 'АЙВОРИ' },
      title: {
        uz: 'Kashmir Trikotaj Silueti',
        en: 'Monolith Knit Column',
        ru: 'Монолитный кашемир',
      },
      note: {
        uz: 'Qalin to‘qilgan Shotlandiya kashmiri va ipak-trikotaj ko‘ylakning sokin vertikal qiyofasi.',
        en: 'Heavy-gauge ribbed Scottish cashmere layered over a draped silk-knit dress for quiet volume and vertical poise.',
        ru: 'Фактурный шотландский кашемир в рубчик поверх драпированного платья из шёлкового трикотажа.',
      },
      tint: '#EFECE6',
      wordColor: '#C7BFB2',
      pieces: [
        {
          id: 'ivory-coat',
          name: {
            uz: 'Tik Yoqali Kashmir Palto',
            en: 'Ribbed Cashmere Funnel Coat',
            ru: 'Кашемировое пальто с высоким воротом',
          },
          price: 21100000,
          fabric: {
            uz: '100% Shotlandiya Kashmiri',
            en: '100% Scottish Cashmere',
            ru: '100% Шотландский кашемир',
          },
          category: 'clothing',
        },
        {
          id: 'ivory-dress',
          name: {
            uz: 'Ipak-Kashmir Ko‘ylak',
            en: 'Draped Silk-Knit Dress',
            ru: 'Драпированное платье из шёлка',
          },
          price: 10100000,
          fabric: {
            uz: '70% Ipak, 30% Kashmir',
            en: '70% Silk, 30% Cashmere',
            ru: '70% Шёлк, 30% Кашемир',
          },
          category: 'clothing',
        },
        {
          id: 'ivory-slingback',
          name: {
            uz: 'Minimalistik Charm Tufli',
            en: 'Minimalist Leather Slingback',
            ru: 'Лаконичные слингбэки из кожи',
          },
          price: 7400000,
          fabric: {
            uz: 'Mayin Nappa Buzoq Terisi',
            en: 'Soft Nappa Calf',
            ru: 'Мягкая кожа наппа',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-05',
      image: '/src/assets/images/cutout_05_slate.png',
      aspectRatio: 376 / 1160,
      word: { uz: 'SHIFER', en: 'SLATE', ru: 'СЛАНЕЦ' },
      title: {
        uz: 'Yomg‘irga Chidamli Gabardin',
        en: 'Storm-Proof Gabardine',
        ru: 'Непромокаемый габардин',
      },
      note: {
        uz: 'Suv o‘tkazmaydigan yapon paxta gabardinidan reglan yengli keng makintosh va organik poplin ko‘ylak.',
        en: 'Water-repellent Japanese cotton gabardine tailored into an enveloping raglan silhouette over crisp organic poplin.',
        ru: 'Водоотталкивающий японский хлопковый габардин с рукавом реглан поверх рубашки из поплина.',
      },
      tint: '#D5DEE4',
      wordColor: '#A1B3C0',
      pieces: [
        {
          id: 'slate-mac',
          name: {
            uz: 'Reglan Yengli Gabardin Plash',
            en: 'Raglan Storm Mac',
            ru: 'Плащ-макинтош реглан',
          },
          price: 16500000,
          fabric: {
            uz: 'Zich Yapon Paxta Gabardini',
            en: 'High-Density Cotton Gabardine',
            ru: 'Плотный хлопковый габардин',
          },
          category: 'clothing',
        },
        {
          id: 'slate-tunic',
          name: {
            uz: 'Poplin Tunika Ko‘ylak',
            en: 'Crisp Poplin Tunic Shirt',
            ru: 'Удлинённая рубашка из поплина',
          },
          price: 5250000,
          fabric: {
            uz: 'Organik Misr Paxtasi',
            en: 'Organic Egyptian Cotton',
            ru: 'Органический египетский хлопок',
          },
          category: 'clothing',
        },
        {
          id: 'slate-boot',
          name: {
            uz: 'Qalin Taglikli Chelsi Etik',
            en: 'Lug-Sole Chelsea Boot',
            ru: 'Ботинки челси на массивной подошве',
          },
          price: 8800000,
          fabric: {
            uz: 'Moylangan Bridl Charmi',
            en: 'Oiled Bridle Leather',
            ru: 'Вощёная седельная кожа',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-06',
      image: '/src/assets/images/cutout_06_espresso.png',
      aspectRatio: 396 / 1160,
      word: { uz: 'ESPRESSO', en: 'ESPRESSO', ru: 'ЭСПРЕССО' },
      title: {
        uz: 'Alpaka Palto va Baxmal',
        en: 'Belted Alpaca & Velvet',
        ru: 'Пальто из альпаки и бархат',
      },
      note: {
        uz: 'To‘q jigarrang alpaka palto, mayin paxta baxmal yubka va qo‘l ishlangan qattiq charm sumka.',
        en: 'Deep umber textures uniting brushed alpaca outerwear, fine-wale cotton velvet, and a structured saddle tote.',
        ru: 'Глубокие оттенки тёмного кофе: пальто из ворсистой альпаки, бархатная юбка и жёсткая кожаная сумка.',
      },
      tint: '#E2D8D1',
      wordColor: '#B59E90',
      pieces: [
        {
          id: 'espresso-coat',
          name: {
            uz: 'Kamarli Alpaka Palto',
            en: 'Belted Alpaca Wrap Coat',
            ru: 'Пальто-халат из альпаки',
          },
          price: 19700000,
          fabric: {
            uz: 'Alpaka va Bokira Jun Aralashmasi',
            en: 'Alpaca & Virgin Wool Blend',
            ru: 'Смесь альпаки и натуральной шерсти',
          },
          category: 'clothing',
        },
        {
          id: 'espresso-skirt',
          name: {
            uz: 'Mayin Baxmal Yubka',
            en: 'Fine-Wale Velvet Skirt',
            ru: 'Юбка из тонкого хлопкового бархата',
          },
          price: 6650000,
          fabric: {
            uz: '100% Paxta Baxmal',
            en: '100% Cotton Velvet',
            ru: '100% Хлопковый бархат',
          },
          category: 'clothing',
        },
        {
          id: 'espresso-tote',
          name: {
            uz: 'Shaklini Saqlovchi Charm Sumka',
            en: 'Structured Saddle Tote',
            ru: 'Структурная сумка-тоут',
          },
          price: 11000000,
          fabric: {
            uz: 'Qattiq Egar Charmi',
            en: 'Saddle-Grade Bridle',
            ru: 'Плотная седельная кожа',
          },
          category: 'one-size',
        },
      ],
    },
    {
      id: 'look-07',
      image: '/src/assets/images/cutout_07_moss.png',
      aspectRatio: 421 / 1160,
      word: { uz: 'ZAYTUN', en: 'MOSS', ru: 'МОХ' },
      title: {
        uz: 'Avstriya Loden Nakidkasi',
        en: 'Loden Field Silhouette',
        ru: 'Кейп из варёной шерсти лоден',
      },
      note: {
        uz: 'Shamolga chidamli qaynatilgan Avstriya loden juni, yumshoq merinos sviter va kordovan derbi poyabzali.',
        en: 'Austrian loden wool boiled for density and wind resistance, softened by a sweeping cape cut and merino knitwear.',
        ru: 'Плотный ветрозащитный австрийский лоден свободного кроя в паре со свитером из тонкой мериносовой шерсти.',
      },
      tint: '#D8DFD7',
      wordColor: '#A4B5A2',
      pieces: [
        {
          id: 'moss-cape',
          name: {
            uz: 'Qaynatilgan Loden Keyp Palto',
            en: 'Boiled Loden Cape Coat',
            ru: 'Пальто-кейп из варёного лодена',
          },
          price: 17650000,
          fabric: {
            uz: '100% Avstriya Loden Juni',
            en: '100% Austrian Loden Wool',
            ru: '100% Австрийский лоден',
          },
          category: 'clothing',
        },
        {
          id: 'moss-knit',
          name: {
            uz: 'Merinos Baland Yoqa Sviter',
            en: 'Merino Rollneck Layer',
            ru: 'Водолазка из шерсти мериноса',
          },
          price: 4600000,
          fabric: {
            uz: 'Mayin Merinos Juni',
            en: 'Extra-Fine Merino Wool',
            ru: 'Тончайшая шерсть мериноса',
          },
          category: 'clothing',
        },
        {
          id: 'moss-derby',
          name: {
            uz: 'Qalin Poshnali Derbi Tufli',
            en: 'Stacked-Heel Derby',
            ru: 'Дерби на наборном каблуке',
          },
          price: 7950000,
          fabric: {
            uz: 'Sayqallangan Kordovan Charmi',
            en: 'Polished Cordovan',
            ru: 'Полированная кожа кордован',
          },
          category: 'shoe',
        },
      ],
    },
    {
      id: 'look-08',
      image: '/src/assets/images/cutout_08_obsidian.png',
      aspectRatio: 336 / 1160,
      word: { uz: 'QORA', en: 'OBSIDIAN', ru: 'ОБСИДИАН' },
      title: {
        uz: 'Kechki Baratiya Kostyum',
        en: 'Evening Barathea Tailoring',
        ru: 'Вечерний крой из баратеи',
      },
      note: {
        uz: 'Mat qora baratiya junidan bir bortli kechki palto, ravon atlas shim va ipak klatch.',
        en: 'Matte obsidian barathea wool sculpted into a single-breasted evening coat with fluid palazzo trousers and satin clutch.',
        ru: 'Матовая шерсть баратея в силуэте однобортного вечернего пальто со струящимися шёлковыми брюками палаццо.',
      },
      tint: '#D9D8DC',
      wordColor: '#A3A1AA',
      pieces: [
        {
          id: 'obsidian-coat',
          name: {
            uz: 'Bir Bortli Kechki Palto',
            en: 'Single-Breasted Evening Coat',
            ru: 'Однобортное вечернее пальто',
          },
          price: 20700000,
          fabric: {
            uz: '100% Baratiya Juni',
            en: '100% Barathea Wool',
            ru: '100% Шерсть баратея',
          },
          category: 'clothing',
        },
        {
          id: 'obsidian-trouser',
          name: {
            uz: 'Ravon Krep-Atlas Shim',
            en: 'Fluid Crepe Satin Trouser',
            ru: 'Струящиеся брюки из креп-сатина',
          },
          price: 8700000,
          fabric: {
            uz: 'Og‘ir Krep-Atlas Ipak',
            en: 'Heavyweight Crepe Satin',
            ru: 'Плотный шёлковый креп-сатин',
          },
          category: 'clothing',
        },
        {
          id: 'obsidian-clutch',
          name: {
            uz: 'Atlas Taxlama Klatch',
            en: 'Satin Fold Clutch',
            ru: 'Складной атласный клатч',
          },
          price: 6250000,
          fabric: {
            uz: 'Dyushes Ipak Atlasi',
            en: 'Duchess Silk Satin',
            ru: 'Плотный шёлковый атлас',
          },
          category: 'one-size',
        },
      ],
    },
  ] as Look[],
};

export function formatPrice(amount: number, lang: Lang): string {
  const formattedNumber = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedNumber} ${UI_COPY[lang].currencySuffix}`;
}

export function getLookTotal(look: Look): number {
  return look.pieces.reduce((sum, piece) => sum + piece.price, 0);
}
