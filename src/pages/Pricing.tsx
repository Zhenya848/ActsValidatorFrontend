import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Building2, Rocket } from 'lucide-react';
import { Button } from '../shared/ui/button';

const plans = [
  {
    id: 'starter',
    name: 'Старт',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    badge: null,
    price: 490,
    credits: 10,
    features: [
      '10 кредитов (сверок)',
      'Файлы до 5 МБ',
      'Форматы Excel, CSV',
      'История на 30 дней',
      'Email-поддержка',
    ],
  },
  {
    id: 'pro',
    name: 'Про',
    icon: Star,
    color: 'from-indigo-500 to-violet-600',
    badge: 'Популярный',
    price: 1490,
    credits: 50,
    features: [
      '50 кредитов (сверок)',
      'Файлы до 25 МБ',
      'Все форматы файлов',
      'История без ограничений',
      'Приоритетная поддержка',
      'Экспорт PDF-отчётов',
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    icon: Building2,
    color: 'from-emerald-500 to-teal-600',
    badge: null,
    price: 3990,
    credits: 200,
    features: [
      '200 кредитов (сверок)',
      'Файлы до 100 МБ',
      'Все форматы файлов',
      'История без ограничений',
      'Персональный менеджер',
      'Экспорт PDF/Excel',
      'API-доступ',
    ],
  },
  {
    id: 'enterprise',
    name: 'Корпоратив',
    icon: Rocket,
    color: 'from-amber-500 to-orange-600',
    badge: 'Макс',
    price: null,
    credits: null,
    features: [
      'Неограниченные сверки',
      'Файлы любого размера',
      'Все форматы файлов',
      'История без ограничений',
      'Выделенный менеджер',
      'Кастомная интеграция',
      'SLA-гарантии',
      'Обучение команды',
    ],
  },
];

export default function Pricing() {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Тарифы и кредиты</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Простые цены
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            1 кредит = 1 сверка документов. Выберите тариф под ваши задачи.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isPro = plan.id === 'pro';
            const isEnterprise = plan.id === 'enterprise';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl border p-6 cursor-pointer transition-all ${
                  isPro
                    ? 'border-indigo-300 bg-gradient-to-b from-indigo-50/60 to-white shadow-lg shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                } ${selected === plan.id ? 'ring-2 ring-indigo-500' : ''}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${plan.color}`}>
                    {plan.badge}
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>

                <div className="mt-3 mb-5">
                  {plan.price ? (
                    <>
                      <span className="text-3xl font-bold text-slate-900">{plan.price.toLocaleString('ru-RU')} ₽</span>
                      <span className="text-sm text-slate-400 ml-1">/ месяц</span>
                      <div className="mt-1 text-sm text-indigo-600 font-medium">{plan.credits} кредитов</div>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-slate-900">По запросу</span>
                      <div className="mt-1 text-sm text-amber-600 font-medium">∞ кредитов</div>
                    </>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-xl text-sm h-10 ${
                    isPro
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
                      : isEnterprise
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isEnterprise ? 'Связаться с нами' : 'Выбрать тариф'}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-slate-800">Нужно больше кредитов?</p>
            <p className="text-sm text-slate-500 mt-0.5">Купите дополнительные кредиты в любое время без смены тарифа.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-slate-300 text-sm whitespace-nowrap">
            Купить кредиты
          </Button>
        </motion.div>
      </div>
    </div>
  );
}