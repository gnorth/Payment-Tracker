import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  Award,
  AlertTriangle,
  HeartPulse,
  Banknote,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone
} from 'lucide-react';

interface GuideSection {
  id: string;
  category: 'combat' | 'general' | 'health' | 'annual' | 'action';
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
    id: 'combat_100k',
    category: 'combat',
    title: 'Додаткова винагорода 100 000 грн («Бойові / на нулі»)',
    badge: '100 000 грн/міс',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    amount: '~3 333 грн / день (30 дн.) або ~3 225 грн / день (31 дн.)',
    summary: 'Виплачується військовослужбовцям, які беруть безпосередню участь у бойових діях на лінії бойового зіткнення на глибину ротних опорних пунктів першого ешелону.',
    details: [
      'Виплата нараховується пропорційно кількості днів фактичного виконання бойових завдань за звітний місяць.',
      'Охоплює ведення бойових дій на передовій, вогневе ураження противника, розвідку на лінії зіткнення, відбиття штурмів, розмінування під вогнем.',
      'Виплачується щомісяця у поточному місяці за попередній (зазвичай у 10-20 числах разом із грошовим забезпеченням).'
    ],
    documents: [
      'Бойовий наказ (БО) або Бойове розпорядження (БР)',
      'Журнал бойових дій (ЖБД) або підсумкове бойове донесення',
      'Рапорт командира підрозділу про виконання завдань',
      'Наказ командира військової частини по стройовій частині'
    ],
    normativeBase: 'Постанова КМУ №168 від 28.02.2022, Наказ МОУ №260 від 07.06.2018'
  },
  {
    id: 'bonus_70k',
    category: 'combat',
    title: 'Одноразова винагорода 70 000 грн (за кожні 30 днів на передовій)',
    badge: '70 000 грн одноразово',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    amount: '70 000 грн за кожні сумарні 30 днів на першій лінії',
    summary: 'Нова виплата (запроваджена з квітня 2024 року) за безпосереднє перебування на лінії зіткнення з противником на відстані першого ешелону або на території ворога.',
    details: [
      'Головна особливість — дні є накопичувальними. Вони не згорають у кінці місяця! Наприклад: 12 днів у вересні + 18 днів у жовтні = 30 днів -> виникає право на виплату 70 000 грн.',
      'Виплачується на додаток до стандартних 100 000 грн (не замість них!).',
      'Враховуються дні на лінії зіткнення з противником на глибину РВП, на території противника (в т.ч. на ТОТ), а також між позиціями сил оборони та військ РФ.'
    ],
    documents: [
      'Витяги з бойових розпоряджень (БР) із зазначенням координат позицій',
      'Довідка штабу частини про дні безпосереднього виконання завдань на нулі',
      'Рапорт військовослужбовця або подання командира роти/батальйону'
    ],
    normativeBase: 'Постанова Кабінету Міністрів України №401 від 12.04.2024'
  },
  {
    id: 'special_50k',
    category: 'combat',
    title: 'Винагорода 50 000 грн (Органи військового управління / Спецрубежі)',
    badge: '50 000 грн/міс',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    amount: '~1 666 грн / день',
    summary: 'Для військовослужбовців, які виконують завдання у складі органів військового управління (ОУВ, штаби угруповань, командні пункти бригад), що управляють військами в зоні бойових дій.',
    details: [
      'Нараховується пропорційно дням виконання завдань.',
      'Стосується штабів та пунктів управління, які здійснюють оперативне (бойове) керівництво частинами першого ешелону.',
      'Перелік органів військового управління затверджується Головнокомандувачем або Генштабом ЗСУ.'
    ],
    documents: [
      'Наказ про включення до складу оперативного угруповання/органу управління',
      'Бойове розпорядження та графік чергування на КП/ПУ'
    ],
    normativeBase: 'Постанова КМУ №168, Наказ МОУ №260'
  },
  {
    id: 'duty_30k',
    category: 'combat',
    title: 'Винагорода 30 000 грн (Зона бойових дій / Завдання забезпечення)',
    badge: '30 000 грн/міс',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    amount: '~1 000 грн / день',
    summary: 'Виплачується за виконання завдань у зоні бойових дій поза лінією бойового зіткнення.',
    details: [
      'Інженерне обладнання оборонних рубежів, мостів, мінно-вибухових загороджень.',
      'Протиповітряне прикриття об’єктів у зоні бойових дій, бойове чергування мобільних вогневих груп ППО.',
      'Логістичне забезпечення, підвезення БК, ПММ, евакуація техніки та поранених у визначених районах бойових дій.'
    ],
    documents: [
      'Бойове розпорядження (БР) на виконання робіт чи чергування',
      'Наказ командира військової частини по стройовій частині'
    ],
    normativeBase: 'Постанова КМУ №168'
  },
  {
    id: 'base_ogz',
    category: 'general',
    title: 'Основне Грошове Забезпечення (ОГЗ / База)',
    badge: 'від 20 100 грн/міс',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amount: 'Мінімум 20 100 грн (для солдата/стрільця без посадових надбавок)',
    summary: 'Гарантована щомісячна основа, яку отримує кожен військовослужбовець за контрактом чи мобілізацією незалежно від зони перебування.',
    details: [
      'Посадовий оклад (залежить від тарифного розряду посади).',
      'Оклад за військовим званням (солдат, сержант, лейтенант тощо).',
      'Надбавка за вислугу років (від 25% до 50% залежно від стажу служби).',
      'Щомісячні надбавки за особливості проходження служби (65% або 100%) та щомісячна премія (залежно від дисципліни).'
    ],
    documents: [
      'Наказ про призначення на посаду та зарахування до списків особового складу частини'
    ],
    normativeBase: 'Закон України №2011-XII, Наказ МОУ №260'
  },
  {
    id: 'health_injury',
    category: 'health',
    title: 'Виплати при пораненні, контузії та лікуванні (100 000 грн)',
    badge: '100 000 грн + ОГЗ',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    amount: '100 000 грн на місяць протягом усього часу безперервного лікування',
    summary: 'Збереження грошового забезпечення та виплата 100к під час стаціонарного лікування в госпіталі після поранення, травми або контузії.',
    details: [
      'Виплачується за весь час перебування на стаціонарному лікуванні в закладах охорони здоров’я (включаючи закордонні клініки).',
      'Виплачується під час відпустки для лікування після тяжкого поранення за рішенням ВЛК.',
      'При контузії (ЧМТ, акубаротравмі) обов’язково вимагайте запис про первинний огляд на медпункті батальйону (Ф-100 або картка передового району).'
    ],
    documents: [
      'Довідка про обставини травми (поранення, контузії, каліцтва) — Додаток 5',
      'Виписний епікриз із шпиталю / медичного закладу',
      'Постанова ВЛК про причинний зв’язок поранення («Поранення пов’язане із захистом Батьківщини»)'
    ],
    normativeBase: 'Постанова КМУ №168, Наказ МОУ №260'
  },
  {
    id: 'annual_wellness',
    category: 'annual',
    title: 'Оздоровчі (Грошова допомога на оздоровлення)',
    badge: '1 місячне ОГЗ (раз на рік)',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    amount: 'У розмірі місячного грошового забезпечення (від 20 100 грн)',
    summary: 'Щорічна одноразова державна виплата, яка надається кожному військовослужбовцю при вибутті у щорічну основну відпустку.',
    details: [
      'Виплачується один раз на календарний рік.',
      'Якщо ви не берете відпустку або берете її частинами, допомога все одно виплачується на підставі окремого рапорту на оздоровлення.',
      'Розмір розраховується з місячного ОГЗ на день підписання наказу командира частини.'
    ],
    documents: [
      'Рапорт на надання частини щорічної основної відпустки з виплатою грошової допомоги на оздоровлення'
    ],
    normativeBase: 'Закон України №2011-XII, Наказ МОУ №260 (Розділ XXII)'
  },
  {
    id: 'annual_material',
    category: 'annual',
    title: 'Матеріальна допомога на соціально-побутові потреби',
    badge: '1 місячне ОГЗ (раз на рік)',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    amount: 'У розмірі місячного грошового забезпечення',
    summary: 'Додаткова щорічна допомога, яка виплачується військовослужбовцям за наявності соціально-побутових підстав.',
    details: [
      'Виплачується за рапортом військового один раз на рік.',
      'Підстави: поранення або хвороба військового чи членів сім’ї, народження дитини, одруження, смерть близьких родичів, порушення житлових умов внаслідок бойових дій.',
      'Рішення про виплату ухвалює командир військової частини в межах затвердженого фонду.'
    ],
    documents: [
      'Рапорт на матеріальну допомогу для вирішення соціально-побутових питань',
      'Документи, що підтверджують підстави (свідоцтво про шлюб/народження, довідка про поранення тощо)'
    ],
    normativeBase: 'Наказ МОУ №260 (Розділ XXIII)'
  },
  {
    id: 'action_dispute',
    category: 'action',
    title: 'Алгоритм дій: Що робити, якщо не нарахували бойові або є недоплата?',
    badge: 'Інструкція захисту прав',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    amount: 'Покроковий план дій',
    summary: 'Чіткі юридичні та стройові кроки для військовослужбовця, якщо фіно нарахувало менше коштів або дні не врахували в наказ.',
    details: [
      'Крок 1: Зверніться до командира взводу / роти й уточніть, чи подали вас у щомісячний Рапорт про участь у бойових діях та Журнал бойових дій (ЖБД).',
      'Крок 2: Зверніться до фінансової служби (фініка) або стройової частини частини та попросіть надати розрахунковий лист або виписку, за скільки саме днів нараховано бойові.',
      'Крок 3: Якщо дні пропущені помилково — подайте письмовий Рапорт на ім’я командира військової частини про проведення службової перевірки та донарахування додаткової винагороди за відповідний місяць, зазначивши номери БР.',
      'Крок 4: Якщо питання ігнорується — звертайтеся на гарячу лінію Міністерства оборони (1512) або до Військової служби правопорядку (ВСП).'
    ],
    documents: [
      'Копія військового квитка та довідки про безпосередню участь у бойових діях',
      'Письмовий рапорт на проведення службового розслідування / донарахування',
      'Виписка з банківської картки про фактично зараховану суму'
    ],
    normativeBase: 'Дисциплінарний статут ЗСУ, Закон України «Про звернення громадян»'
  }
];

export const GuideView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('combat_100k');

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
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Довідник виплат ЗСУ
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Офіційні норми, підстави, тарифи та захист прав військовослужбовця
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Пошук виплати (наприклад: 70 000, оздоровчі, поранення)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Filter Pills */}
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
            onClick={() => setSelectedFilter('combat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'combat'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Бойові (100к, 70к, 50к, 30к)
          </button>
          <button
            onClick={() => setSelectedFilter('health')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'health'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Поранення / ВЛК
          </button>
          <button
            onClick={() => setSelectedFilter('annual')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'annual'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Оздоровчі та соцпобут
          </button>
          <button
            onClick={() => setSelectedFilter('action')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              selectedFilter === 'action'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Що робити при недоплаті
          </button>
        </div>
      </div>

      {/* Guide Cards List */}
      <div className="space-y-3">
        {filteredGuides.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all"
            >
              {/* Card Header Accordion Toggle */}
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

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                  {/* Amount / Rate Callout */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                      Розрахункова сума:
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {item.amount}
                    </span>
                  </div>

                  {/* Conditions & Details */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Умови нарахування та особливості:
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

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Які документи мають бути оформлені (підстави):
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

                  {/* Normative Base Law */}
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="font-semibold text-slate-500">Законодавча база: </span>
                    <span>{item.normativeBase}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helpful Hotline Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900">
          <Phone className="w-4 h-4 text-emerald-700" />
          Гарячі лінії правової підтримки військовослужбовців
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium pt-1">
          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-slate-500 block text-[10px]">Міністерство оборони України:</span>
            <strong className="text-slate-900 font-bold">1512</strong> або <strong>0 800 500 442</strong>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-slate-500 block text-[10px]">Безоплатна правова допомога:</span>
            <strong className="text-slate-900 font-bold">0 800 213 103</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
