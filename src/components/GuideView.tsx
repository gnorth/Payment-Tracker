import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  Award,
  AlertTriangle,
  Flame,
  Crosshair,
  UserPlus,
  HeartPulse,
  Banknote,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  Clock
} from 'lucide-react';

interface GuideSection {
  id: string;
  category: 'zonal' | 'assault' | 'combat' | 'general' | 'health' | 'annual' | 'action';
  title: string;
  badge: string;
  badgeColor: string;
  amount: string;
  summary: string;
  details: string[];
  documents: string[];
  normativeBase: string;
}

const GUIDE_DATA: GuideSection[] = [
  {
    id: 'zone_170k',
    category: 'zonal',
    title: 'Зональна винагорода 170 000 грн (ВОП / Наступ / ТОТ / Сіра зона)',
    badge: '170 000 грн/міс',
    badgeColor: 'bg-red-100 text-red-900 border-red-300 font-extrabold',
    amount: '~5 666 грн / день (30 дн.) або ~5 483 грн / день (31 дн.)',
    summary: 'Введена з червня 2026 року: прив’язана до відстані від лінії зіткнення — за завдання на відстані до взводного опорного пункту (ВОП) включно, наступ, сіру зону та ТОТ.',
    details: [
      'Виплачується за виконання завдань на лінії бойового зіткнення на відстані до взводного опорного пункту (ВОП) включно.',
      'Поширюється на участь у наступі, контрнаступі, контратаці.',
      'Діє при виконанні завдань на тимчасово окупованій території України (ТОТ), у «сірій» зоні та на території противника.',
      'Нараховується пропорційно кількості фактичних днів перебування у відповідній зоні.'
    ],
    documents: [
      'Бойове розпорядження (БР) із зазначенням координат рубежів/ВОП',
      'Журнал бойових дій (ЖБД) або бойове донесення',
      'Наказ командира військової частини по стройовій частині'
    ],
    normativeBase: 'Офіційне роз’яснення МОУ (серпень 2026), наказ МОУ про нову систему бойових виплат'
  },
  {
    id: 'assault_daily',
    category: 'assault',
    title: 'Добові за штурм та активні бойові дії (20 000 – 40 000 грн / доба)',
    badge: '20 000 – 40 000 грн / доба',
    badgeColor: 'bg-rose-100 text-rose-950 border-rose-400 font-black',
    amount: '40 000 грн/доба (штурм) або 20 000 грн/доба (відновлення позицій)',
    summary: 'Окремі щоденні виплати за активні штурмові операції та відновлення контролю над рубежами оборони.',
    details: [
      '40 000 грн / доба — за штурмові дії безпосередньо на лінії бойового зіткнення або в глибині оборони противника.',
      '20 000 грн / доба — за операції з відновлення втрачених позицій у глибині власної оборони.',
      'Ці суми додаються як фіксовані добові до основного забезпечення.'
    ],
    documents: [
      'Бойовий наказ командира на проведення штурмових дій',
      'Підсумковий звіт/донесення про виконання штурмової операції'
    ],
    normativeBase: 'Офіційний гайд МОУ по виплатах у 2026 році'
  },
  {
    id: 'result_bonuses',
    category: 'assault',
    title: 'Бонуси за результат операцій (Полонені та ліквідація ворога)',
    badge: '15 000 – 100 000 грн бонус',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-400 font-black',
    amount: '100 000 грн (за полоненого) / 15 000 грн (за ліквідованого)',
    summary: 'Спеціальні винагороди військовослужбовцям за відчутний бойовий результат у контактних боях.',
    details: [
      '100 000 гривень — за кожного захопленого противника в полон для поповнення обмінного фонду.',
      '15 000 гривень — за кожного ліквідованого противника в контактному бою.',
      'Підтвердження ліквідації окупанта в контактному бою здійснюється за допомогою матеріалів відеофіксації (дрон, бодікам тощо).'
    ],
    documents: [
      'Акт фіксації взяття в полон або матеріали відеофіксації контактного бою',
      'Рапорт командира підрозділу'
    ],
    normativeBase: 'Рішення МОУ від 2026 року про преміювання за результат'
  },
  {
    id: 'zone_70k',
    category: 'zonal',
    title: 'Зональна винагорода 70 000 грн (РОП / Ротний опорний пункт)',
    badge: '70 000 грн/міс',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    amount: '~2 333 грн / день (30 дн.) або ~2 258 грн / день (31 дн.)',
    summary: 'Зональна щомісячна виплата за виконання бойових завдань на відстані до ротного опорного пункту (РОП) включно.',
    details: [
      'Нараховується пропорційно кількості фактичних днів виконання завдань на глибину РОП.',
      'Якщо протягом місяця військовий перебував у різних районах (наприклад, частину днів на ВОП, частину на РОП) — нарахування здійснюється окремо за кожну зону.'
    ],
    documents: [
      'Бойове розпорядження із закріпленими рубежами ротних опорних пунктів',
      'Наказ командира військової частини'
    ],
    normativeBase: 'Порядок зональних бойових виплат МОУ'
  },
  {
    id: 'combat_100k',
    category: 'combat',
    title: 'Додаткова винагорода 100 000 грн (Лінія зіткнення / Вогневе ураження)',
    badge: '100 000 грн/міс',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
    amount: '~3 333 грн / день (30 дн.) або ~3 225 грн / день (31 дн.)',
    summary: 'Виплата за безпосередню участь у бойових діях на лінії зіткнення та виконання завдань із вогневого ураження противника.',
    details: [
      'Нараховується пропорційно дням безпосередньої участі в бойових діях.',
      'Охоплює ведення вогню по ворогу, артилерійські та мінометні розрахунки, піхоту на передових рубежах, операторів БПЛА на передовій.'
    ],
    documents: [
      'Бойове розпорядження (БР)',
      'Журнал бойових дій (ЖБД)',
      'Наказ командира частини по стройовій частині'
    ],
    normativeBase: 'Постанова КМУ №168, Наказ МОУ №260'
  },
  {
    id: 'rear_10k',
    category: 'general',
    title: 'Додаткова винагорода 10 000 грн для небойових частин (Тил)',
    badge: '10 000 грн/міс',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-300 font-bold',
    amount: '10 000 грн щомісяця (сумарно з базою — від 30 000 грн/міс)',
    summary: 'Передбачена для військовослужбовців, які не беруть участі в бойових діях і не виконують завдання на пунктах управління.',
    details: [
      'Виплачується усім, хто не отримує інших бойових винагород (30 000, 50 000, 70 000 чи 100 000 грн).',
      'Гарантує, що сукупний дохід військового за виконання обов’язків становить не менше 30 000 грн/місяць.',
      'Зберігається під час лікування, але не виплачується під час основної відпустки.'
    ],
    documents: [
      'Наказ командира військової частини про виплату додаткової винагороди'
    ],
    normativeBase: 'Постанова КМУ №168, роз’яснення МОУ 2026'
  },
  {
    id: 'special_50k',
    category: 'combat',
    title: 'Винагорода 50 000 грн (Органи військового управління / Штаби ОУВ)',
    badge: '50 000 грн/міс',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    amount: '~1 666 грн / день',
    summary: 'Для керівного складу та військових у складі органів військового управління, які управляють підрозділами в зоні бойових дій.',
    details: [
      'Оперативне управління військами на командних пунктах та штабах угруповань.',
      'Перелік затверджується Головнокомандувачем або Генштабом ЗСУ.'
    ],
    documents: ['Наказ про включення до складу ОУВ/штабу', 'Бойові графіки чергування'],
    normativeBase: 'Постанова КМУ №168'
  },
  {
    id: 'duty_30k',
    category: 'combat',
    title: 'Винагорода 30 000 грн (Зона бойових дій / ППО / Забезпечення)',
    badge: '30 000 грн/міс',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    amount: '~1 000 грн / день',
    summary: 'За виконання бойових завдань у зоні бойових дій поза лінією безпосереднього зіткнення.',
    details: [
      'Інженерне фортифікаційне обладнання оборони, розмінування.',
      'Бойове чергування мобільних вогневих груп ППО.',
      'Логістика, підвезення БК, ПММ та медична евакуація.'
    ],
    documents: ['Бойове розпорядження (БР)', 'Наказ по стройовій частині'],
    normativeBase: 'Постанова КМУ №168'
  },
  {
    id: 'health_injury',
    category: 'health',
    title: 'Виплати при пораненні / лікуванні (100 000 грн)',
    badge: '100 000 грн/міс + ОГЗ',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 font-bold',
    amount: '100 000 грн на місяць протягом усього стаціонарного лікування',
    summary: 'Збереження грошового забезпечення та виплата 100 000 грн під час лікування після поранення або контузії.',
    details: [
      'Виплачується за весь час безперервного лікування в лікарнях та шпиталях (включно із закордонними).',
      'Виплачується під час відпустки для лікування після тяжкого поранення за рішенням ВЛК.'
    ],
    documents: [
      'Довідка про обставини травми (Додаток 5)',
      'Виписний епікриз із шпиталю',
      'Постанова ВЛК про причинний зв’язок поранення'
    ],
    normativeBase: 'Постанова КМУ №168, Наказ МОУ №260'
  },
  {
    id: 'contract_signing',
    category: 'annual',
    title: 'Одноразова допомога при укладенні першого контракту (2026 рік)',
    badge: '26 624 – 33 280 грн',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
    amount: 'Рядовий: 26 624 грн | Сержант: 29 952 грн | Офіцер: 33 280 грн',
    summary: 'Обчислюється від прожиткового мінімуму (3 328 грн на 1 січня 2026 року) і виплачується після набрання чинності першим контрактом.',
    details: [
      'Рядовий склад: 8 прожиткових мінімумів = 26 624 грн.',
      'Сержантський і старшинський склад: 9 прожиткових мінімумів = 29 952 грн.',
      'Офіцерський склад: 10 прожиткових мінімумів = 33 280 грн.'
    ],
    documents: ['Витяг із наказу про зарахування до списків частини на підставі першого контракту'],
    normativeBase: 'Закон України №2011-XII, Держбюджет України на 2026 рік'
  },
  {
    id: 'cap_limit',
    category: 'general',
    title: 'Максимальний щомісячний ліміт виплат (460 000 грн)',
    badge: 'Ліміт: 460 000 грн/міс',
    badgeColor: 'bg-slate-900 text-white font-extrabold',
    amount: 'До 460 000 грн/місяць бойових виплат',
    summary: 'Офіційне обмеження МОУ: сума щомісячних бойових виплат не може перевищувати 460 000 грн.',
    details: [
      'Базове грошове забезпечення, бонуси за полонених/ліквідацію та допомога за перший контракт додаються до цієї суми окремо.'
    ],
    documents: ['Розрахунковий лист військової частини'],
    normativeBase: 'Офіційний гайд МОУ по виплатах у 2026 році'
  },
  {
    id: 'action_dispute',
    category: 'action',
    title: 'Терміни виплат та що робити при недоплаті',
    badge: 'До 20 числа кожного місяця',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    amount: 'Термін виплат: до 20 числа поточного місяця за минулий',
    summary: 'Офіційний термін виплат — до 20 числа. Якщо кошти надійшли до частини пізніше — виплата протягом 3 днів.',
    details: [
      'Згідно з роз’ясненням МОУ, грошове забезпечення виплачується до 20 числа поточного місяця за минулий.',
      'Якщо вам не нарахували бойові: візьміть у фіно розрахунковий лист, перевірте наявність вашого прізвища в БР та ЖБД, подайте рапорт командиру на перерахунок.',
      'Гаряча лінія Міністерства оборони України: 1512 або 0 800 500 442.'
    ],
    documents: [
      'Розрахунковий лист із фінансової служби',
      'Рапорт на ім’я командира частини про перерахунок'
    ],
    normativeBase: 'Офіційне роз’яснення МОУ (серпень 2026)'
  }
];

export const GuideView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('zone_170k');

  const filteredGuides = GUIDE_DATA.filter((item) => {
    const matchesFilter =
      selectedFilter === 'all' || item.category === selectedFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Official 2026 MoD Sync Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                Гайд по виплатах у 2026 році
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  Синхронізовано з МОУ
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                За офіційним роз’ясненням Міністерства оборони України (серпень 2026)
              </p>
            </div>
          </div>
        </div>

        {/* Source link badge */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Виплата ГЗ здійснюється щомісяця <strong>до 20 числа</strong>
          </span>
          <a
            href="https://mod.gov.ua/explanation/hroshove-zabezpechennia-viiskovosluzhbovtsia-haid-po-vyplatakh-u-2026-rotsi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <span>Джерело mod.gov.ua</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Шукати: 170к, штурм 40к, полонені 100к, тил 10к, поранення..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Всі виплати
          </button>
          <button
            onClick={() => setSelectedFilter('zonal')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'zonal'
                ? 'bg-red-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Зональні (170к ВОП, 70к РОП)
          </button>
          <button
            onClick={() => setSelectedFilter('assault')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'assault'
                ? 'bg-rose-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Штурмові (40к/20к) і Бонуси
          </button>
          <button
            onClick={() => setSelectedFilter('combat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'combat'
                ? 'bg-amber-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Бойові (100к, 50к, 30к)
          </button>
          <button
            onClick={() => setSelectedFilter('health')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'health'
                ? 'bg-purple-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Поранення (100к)
          </button>
          <button
            onClick={() => setSelectedFilter('general')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'general'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Тил (10к) і Ліміт 460к
          </button>
          <button
            onClick={() => setSelectedFilter('action')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'action'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Терміни та скарги
          </button>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-3">
        {filteredGuides.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all"
            >
              {/* Accordion Toggle */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-1.5 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                      Розмір виплати (затверджено МОУ):
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {item.amount}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Умови нарахування та критерії:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                      {item.details.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Підстави та необхідні документи:
                    </h4>
                    <div className="space-y-1">
                      {item.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl text-xs text-slate-700 font-medium flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="font-semibold text-slate-500">Офіційна база: </span>
                    <span>{item.normativeBase}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Official Hotlines Contact Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900">
          <Phone className="w-4 h-4 text-emerald-700" />
          Гарячі лінії правової підтримки та скарг МОУ
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium pt-1">
          <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-slate-500 block text-[10px]">Гаряча лінія Міністерства оборони:</span>
            <strong className="text-slate-900 font-bold text-sm">1512</strong> або <strong>0 800 500 442</strong>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-slate-500 block text-[10px]">Безоплатна правова допомога:</span>
            <strong className="text-slate-900 font-bold text-sm">0 800 213 103</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
