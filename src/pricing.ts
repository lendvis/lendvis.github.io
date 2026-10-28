/**
 * Все деньги студии живут здесь и больше нигде.
 *
 * Цены считаются из часов, а не назначаются: часы × ставка. Поэтому чтобы
 * поднять или опустить цену, правится ЛИБО ставка, ЛИБО вилка часов у уровня —
 * и вся страница пересчитывается сама. Логику калькулятора трогать не нужно.
 * Те же цифры стоят в карточках на Avito и Kwork: меняешь здесь — меняй и там.
 */

/** Ставка за обычную работу, ₽/час: сайты, боты, приложения, починка. */
export const RATE = 750

/** Ставка там, где правила диктует чужая система или ошибка стоит дорого:
 *  интеграции с чужими API, 1С, блокчейн. */
export const RATE_HIGH = 1000

/** Минимальный заказ — час работы: мелкая правка не должна стоить как проект. */
export const MIN_ORDER = 750

/** Платный разбор с письменным планом — только для крупных задач, от DIAGNOSTIC_FROM.
 *  Вычитается из стоимости работ, если заказ состоялся. Мелкие оцениваем бесплатно. */
export const DIAGNOSTIC = 1_500
export const DIAGNOSTIC_FROM = 30_000

/** Поддержка после запуска, ₽/месяц: сервер, присмотр, мелкие правки. */
export const SUPPORT_FROM = 500

export type Tier = {
  id: string
  ru: string
  en: string
  /** Вилка трудоёмкости в часах: [минимум, максимум] */
  hours: [number, number]
  /** Срок в календарных днях: [минимум, максимум] */
  days: [number, number]
}

export type Kind = {
  id: string
  ru: string
  en: string
  /** Одной строкой: кому и зачем — чтобы выбирать не по названию, а по своей ситуации */
  hintRu: string
  hintEn: string
  rate?: number
  /** Работа непредсказуема, пока не откроешь чужой код: считаем и показываем по часам.
   *  У остального цена фиксируется за результат — сколько часов он занял, дело студии. */
  hourly?: boolean
  tiers: Tier[]
}

/**
 * Порядок намеренный. Первым идёт то, с чего заказчик реально начинает
 * знакомство со студией: починить то, что уже есть. Крупные работы стоят ниже —
 * они якорят цену и показывают, что со студией можно расти.
 */
export const KINDS: Kind[] = [
  {
    id: 'fix',
    ru: 'Починить то, что уже есть',
    en: 'Fix what you already have',
    hintRu: 'Сайт работает не так, отвалилась форма, поехала вёрстка, прошлый подрядчик пропал',
    hintEn: 'The site misbehaves, a form broke, the layout slipped, the previous contractor vanished',
    hourly: true,
    tiers: [
      { id: 'spot', ru: 'Точечно: один-два конкретных бага', en: 'Spot fix: one or two specific bugs', hours: [1, 3], days: [1, 1] },
      { id: 'list', ru: 'Список правок или переделка блока', en: 'A list of fixes or one section rebuilt', hours: [4, 10], days: [1, 3] },
      { id: 'deep', ru: 'Разобраться в чужом коде и привести в порядок', en: 'Take over someone else’s code and clean it up', hours: [15, 30], days: [5, 10] },
    ],
  },
  {
    id: 'bot',
    ru: 'Телеграм-бот',
    en: 'Telegram bot',
    hintRu: 'Приём заявок, ответы на частые вопросы, запись клиентов на время',
    hintEn: 'Taking requests, answering common questions, booking clients into time slots',
    tiers: [
      { id: 'card', ru: 'Меню, ответы, заявка владельцу в чат', en: 'Menu, answers, a request sent to the owner', hours: [3, 4], days: [1, 1] },
      { id: 'booking', ru: 'Запись на время, напоминания клиенту', en: 'Time-slot booking with client reminders', hours: [7, 10], days: [1, 2] },
      { id: 'full', ru: 'Админка с выручкой, оплата, интеграции', en: 'Admin panel with revenue, payments, integrations', hours: [12, 20], days: [3, 5] },
    ],
  },
  {
    id: 'site',
    ru: 'Сайт',
    en: 'Website',
    hintRu: 'От одной страницы до магазина с оплатой и складом',
    hintEn: 'From a single page to a shop with payments and stock',
    tiers: [
      { id: 'landing', ru: 'Лендинг: одна страница, форма заявки', en: 'Landing page with a request form', hours: [7, 12], days: [2, 4] },
      { id: 'cms', ru: 'Сайт с админкой и каталогом', en: 'Site with an admin panel and a catalogue', hours: [25, 45], days: [7, 14] },
      { id: 'shop', ru: 'Магазин: оплата, склад, доставка', en: 'Shop: payments, stock, delivery', hours: [60, 120], days: [21, 42] },
    ],
  },
  {
    id: 'mobile',
    ru: 'Мобильное приложение',
    en: 'Mobile app',
    hintRu: 'Android и iOS — одной кодовой базой, если нужны обе платформы',
    hintEn: 'Android and iOS from one codebase when both are needed',
    tiers: [
      { id: 'demo', ru: 'Витрина или каталог на готовых данных', en: 'A showcase or catalogue on prepared data', hours: [30, 50], days: [10, 20] },
      { id: 'app', ru: 'Приложение с бекендом и входом', en: 'An app with a backend and sign-in', hours: [60, 100], days: [21, 35] },
      { id: 'pro', ru: 'Офлайн-режим, платежи, интеграции', en: 'Offline mode, payments, integrations', hours: [110, 180], days: [42, 70] },
    ],
  },
  {
    id: 'backend',
    ru: 'Бекенд и интеграции',
    en: 'Backend and integrations',
    hintRu: 'Связать вашу систему с чужой: касса, склад, CRM, доставка, платежи',
    hintEn: 'Wiring your system to someone else’s: till, stock, CRM, delivery, payments',
    rate: RATE_HIGH,
    tiers: [
      { id: 'one', ru: 'Одна интеграция с чужой системой', en: 'One integration with an external system', hours: [6, 15], days: [2, 4] },
      { id: 'api', ru: 'API с базой и авторизацией', en: 'An API with a database and auth', hours: [20, 40], days: [7, 14] },
      { id: 'load', ru: 'Сервис с очередями и нагрузкой', en: 'A service with queues, built for load', hours: [50, 100], days: [21, 35] },
    ],
  },
  {
    id: 'blockchain',
    ru: 'Блокчейн и смарт-контракты',
    en: 'Blockchain and smart contracts',
    hintRu: 'Ошибку в контракте не откатишь, поэтому здесь дороже час и больше тестов',
    hintEn: 'A contract cannot be patched after deploy, so the hour costs more and the tests run deeper',
    rate: RATE_HIGH,
    tiers: [
      { id: 'token', ru: 'Токен по стандарту сети', en: 'A token following the network standard', hours: [20, 35], days: [7, 14] },
      { id: 'logic', ru: 'Контракт со своей логикой и тестами', en: 'A contract with custom logic and tests', hours: [40, 70], days: [14, 28] },
      { id: 'system', ru: 'Система из нескольких контрактов', en: 'A system of several contracts', hours: [90, 160], days: [35, 60] },
    ],
  },
  {
    id: 'odinc',
    ru: '1С',
    en: '1C',
    hintRu: 'Доработки типовой конфигурации так, чтобы обновления вендора не ломали их',
    hintEn: 'Customising a standard configuration so vendor updates do not break it',
    rate: RATE_HIGH,
    hourly: true,
    tiers: [
      { id: 'form', ru: 'Печатная форма или отчёт', en: 'A printed form or a report', hours: [3, 8], days: [1, 2] },
      { id: 'ext', ru: 'Расширение конфигурации', en: 'A configuration extension', hours: [12, 30], days: [3, 10] },
      { id: 'merge', ru: 'Слияние доработок к новому релизу', en: 'Merging customisations into a new release', hours: [30, 60], days: [10, 20] },
    ],
  },
]

/** Округление вверх до «человеческого» шага. Мелкие суммы — до 250 ₽, чтобы час
 *  по 750 ₽ так и оставался кратным часу; крупные — до тысячи и до пяти. */
export function roundPrice(value: number): number {
  const step = value >= 200_000 ? 5_000 : value >= 10_000 ? 1_000 : 250
  return Math.ceil(value / step) * step
}

/** «1 день», «2 дня», «5 дней» — форма по последнему числу диапазона. */
function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

/** Срок по-человечески: до 10 дней — в днях, дальше — в неделях. */
export function termLabel(days: [number, number], ru: boolean): string {
  const weeks = days[1] > 10
  const [a, b] = weeks ? [Math.ceil(days[0] / 7), Math.ceil(days[1] / 7)] : days
  const span = a === b ? `${a}` : `${a}–${b}`
  if (!ru) return `${span} ${weeks ? 'week' : 'day'}${b > 1 ? 's' : ''}`
  return `${span} ${weeks ? plural(b, 'неделя', 'недели', 'недель') : plural(b, 'день', 'дня', 'дней')}`
}

export function priceRange(kind: Kind, tier: Tier): [number, number] {
  const rate = kind.rate ?? RATE
  const low = Math.max(MIN_ORDER, roundPrice(tier.hours[0] * rate))
  const high = Math.max(low, roundPrice(tier.hours[1] * rate))
  return [low, high]
}

/** 137000 → «137 000» с неразрывными пробелами, чтобы число не переносилось. */
export function money(value: number): string {
  return value.toLocaleString('ru-RU').replace(/\s/g, ' ')
}
