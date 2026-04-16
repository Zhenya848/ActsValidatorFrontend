import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreatePaymentMutation } from '../../../features/payments/api';
import { showError } from '../../../shared/helpers/showError';
import { GetCookies } from '../../../features/accounts/GetCookies';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: '5_collations',
    name: 'Пробный',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    badge: null,
    price: 190,
    period: null,
    credits: 5,
    unlimited: false,
    features: [
      '5 сверок',
      'История на 30 дней'
    ],
  },
  {
    id: 'subscribe_1_month',
    name: 'Подписка на месяц',
    icon: Star,
    color: 'from-indigo-500 to-violet-600',
    badge: 'Лучший выбор',
    price: 490,
    period: 'мес',
    credits: null,
    unlimited: true,
    features: [
      'Безлимитные сверки',
      'История без ограничений',
      'Экспорт PDF-отчётов',
    ],
  },
  {
    id: 'subscribe_12_month',
    name: 'Подписка на год',
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    badge: 'Выгодно',
    price: 4900,
    period: 'год',
    credits: null,
    unlimited: true,
    features: [
      'Безлимитные сверки',
      'История без ограничений',
      'Экспорт PDF/Excel',
      'Экономия 980 ₽',
    ],
  },
];

export function PricesLanding() {
    const [selected, setSelected] = useState(null);
    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const refreshToken = GetCookies("refreshToken");
    const navigate = useNavigate();

    const handleCreatePayment = async (productId: string) => {
        try {
          if (!refreshToken) {
            navigate("/login");
            return;
          }

          const paymentUrl = await createPayment({ productId: productId }).unwrap();
          window.open(paymentUrl.result!);
        }
        catch (error: unknown) {
          showError(error);
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isMonthly = plan.id === 'monthly';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl border p-6 cursor-pointer transition-all ${
                  isMonthly
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
                  <span className="text-3xl font-bold text-slate-900">{plan.price.toLocaleString('ru-RU')} ₽</span>
                  {plan.period && <span className="text-sm text-slate-400 ml-1">/ {plan.period}</span>}
                  <div className="mt-1 text-sm font-medium">
                    {plan.unlimited
                      ? <span className="text-violet-600 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Безлимитные сверки</span>
                      : <span className="text-indigo-600">{plan.credits} сверок</span>
                    }
                  </div>
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
                    isMonthly
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
                      : plan.id === 'yearly'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  onClick={() => handleCreatePayment(plan.id)}
                  disabled={isLoading}
                >
                  {plan.unlimited ? 'Оформить подписку' : 'Купить тариф'}
                </Button>
              </motion.div>
            );
          })}
        </div>
    )
}