import { Check, Zap, Star, Sparkles, CheckCircle2, MailWarning } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreatePaymentMutation } from '../../../features/payments/api';
import { showError } from '../../../shared/helpers/showError';
import { useNavigate } from 'react-router-dom';
import { selectAuthStatus, selectUser } from '../../../app/auth.slice';
import { useSendVerificationCodeMutation } from '../../../features/accounts/api';
import { useAppSelector } from '../../../app/store';

const creditPacks = [
  { id: '2_collations', credits: 2, price: 109 },
  { id: '5_collations', credits: 5, price: 195 },
  { id: '10_collations', credits: 10, price: 289 },
];

const plans = [
  {
    id: '5_collations',
    name: 'Пакет - мини',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    badge: null,
    price: 195,
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
    price: 390,
    period: 'мес',
    credits: null,
    unlimited: true,
    features: [
      'Безлимитные сверки',
      'История без ограничений'
    ],
  },
  {
    id: 'subscribe_3_month',
    name: 'Подписка на квартал',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
    badge: '3 месяца',
    price: 1090,
    period: 'квартал',
    credits: null,
    unlimited: true,
    features: [
      'Безлимитные сверки',
      'История без ограничений',
      'Экономия 80 ₽'
    ],
  },
];

export function PricesLayout() {
    const [selected, setSelected] = useState("");
    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const isUserAuthorized = useAppSelector(selectAuthStatus) == "succeeded";
    const navigate = useNavigate();
    const [selectedCredit, setSelectedCredit] = useState('credits-5');
    const user = useAppSelector(selectUser);
    const [sendVerificationCode, { isLoading: isSendVerificationCodeLoading, isSuccess: isSendVerificationCodeSuccess }] = useSendVerificationCodeMutation();

    const send = async () => {
        try {
            await sendVerificationCode().unwrap();
        }
        catch (error: unknown) {
            showError(error);
        }
    }

    const handleCreatePayment = async (productId: string) => {
        try {
          if (!isUserAuthorized) {
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
        <div>
          {user?.emailVerified === false && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 flex items-start gap-3 border rounded-xl px-5 py-4 ${
                isSendVerificationCodeSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
              }`}
            >
              {isSendVerificationCodeSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <MailWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                {isSendVerificationCodeSuccess ? (
                  <>
                    <p className="font-semibold text-emerald-800">Письмо отправлено</p>
                    <p className="text-emerald-700 mt-0.5">Проверьте почту и перейдите по ссылке для подтверждения email.</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-amber-800">Email не подтверждён</p>
                    <p className="text-amber-700 mt-0.5">
                      Для покупки тарифа необходимо подтвердить email.{' '}
                      <button
                        onClick={send}
                        className="underline font-medium hover:text-amber-900 transition-colors"
                      >
                        Отправить повторно
                      </button>
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Сверки</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">Свайпните, чтобы выбрать количество — оплата разовая, без подписки.</p>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
              {creditPacks.map((pack) => {
                const active = selectedCredit === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedCredit(pack.id)}
                    className={`snap-center flex-shrink-0 w-36 rounded-2xl border-2 p-4 text-left outline-none focus:outline-none transition-all ${
                      active
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-base font-bold text-slate-900">{pack.credits}</span>
                      <span className="text-sm text-slate-500">сверок</span>
                    </div>
                    <p className="text-xs text-slate-400">≈ {Math.round(pack.price / pack.credits)} ₽ / сверка</p>
                  </button>
                );
              })}
            </div>

            {(() => {
              const pack = creditPacks.find((p) => p.id === selectedCredit) || creditPacks[0];
              return (
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">{pack.price.toLocaleString('ru-RU')} ₽</span>
                    <span className="text-sm text-slate-400 ml-2">за {pack.credits} сверок</span>
                  </div>
                  <Button
                    disabled={isLoading || isSendVerificationCodeLoading || user?.emailVerified == false}
                    className="bg-slate-900 hover:bg-slate-800 rounded-xl text-sm h-10 px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => handleCreatePayment(pack.id)}
                  >
                    Купить
                  </Button>
                </div>
              );
            })()}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const isMonthly = plan.id === 'subscribe_1_month';

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
                    disabled={isLoading || isSendVerificationCodeLoading || user?.emailVerified == false}
                  >
                    {plan.unlimited ? 'Оформить подписку' : 'Купить тариф'}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
    )
}