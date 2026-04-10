import { useEffect, useState } from "react";
import type { Collation } from "../../../entities/collations/Collation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../../../shared/utils";
import { Button } from "../../../shared/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import DiscrepancyCard from "./DiscrepancyCard";
import AIStatusBanner from "./AIStatusBanner";
import * as signalR from "@microsoft/signalr";
import { useAppSelector } from "../../../app/store";
import { selectAccessToken } from "../../../app/auth.slice";
import type { Discrepancy } from "../../../entities/collations/Discrepancy";

const SOURCE_FILTERS = [
  { key: 'all', label: 'Все расхождения' },
  { key: 'both', label: 'Алгоритм + ИИ' },
  { key: 'algorithm', label: 'Только алгоритм' },
  { key: 'ai', label: 'Только ИИ' },
];

const FIELD_FILTERS = [
  { key: 'all', label: 'Все поля' },
  { key: 'amount', label: 'По сумме' },
  { key: 'date', label: 'По дате' },
  { key: 'none', label: 'Отсутствующие' },
  { key: 'docNumber', label: 'По номеру документа' },
];

const FIELD_MAP: Record<string, string[]> = {
  amount: ['сумма', 'дебет', 'кредит'],
  date: ['дата'],
  docNumber: ['документ'],
  none: ['отсутствует']
};

const getSource = (c: Discrepancy) => {
  const hasAlgo = c.detectedBy.includes('algorithm');
  const hasAI = c.detectedBy.includes('ai');

  if (hasAlgo && hasAI) 
    return 'both';

  if (hasAlgo) 
    return 'algorithm';

  return 'ai';
};

export default function DiscrepanciesLabel() {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');

  const location = useLocation();
  const collation: Collation = location.state?.collationData;
  const accessToken = useAppSelector(selectAccessToken);
  const [collationErrors, setCollationErrors] = useState<Discrepancy[]>(collation.collationErrors);
  const [aiReady, setAiReady] = useState(!collation ? false : collation.aiRequestStatus == "Completed");

  useEffect(() => {
    if (!collation) {
      navigate("/history");

      return;
    }

    if (!accessToken) {
      navigate("/history");

      return;
    }

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5288/analysis-hub", {
            accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            connection.on("ReceiveAiAnalysis", (data) => {
                setCollationErrors(data.discrepancies);
                setAiReady(true);
            });
        });
  }, [accessToken, collation, navigate]);

  if (!collation)
    return;

  const itemsFilteredBySource = collationErrors.filter((d) => {
    if (!aiReady && !d.detectedBy.includes('algorithm')) 
        return false;

    return sourceFilter === 'all' || getSource(d) === sourceFilter;
  });

  const visibleItems = itemsFilteredBySource.filter((d) => {
    if (!aiReady && !d.detectedBy.includes('algorithm')) 
        return false;

    return fieldFilter === 'all' || FIELD_MAP[fieldFilter]?.includes(d.field.toLowerCase());
  });

  const aiOnlyCount = collationErrors.filter(
    (d) => !d.detectedBy.includes('algorithm')
  ).length;

  const visibleDiscrepancyCount = aiReady
    ? collationErrors.length
    : collationErrors.filter((d) => d.detectedBy.includes('algorithm')).length;

  return (
    <div>
      <div className="mb-8">
        <Link to={createPageUrl('History')}>
          <Button variant="ghost" className="mb-4 -ml-3 text-slate-500 hover:text-slate-700 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к истории
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Детали сверки</h1>
            <p className="mt-1 text-slate-500 text-sm">{collation.act1Name} · {collation.act2Name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Строк проверено', value: collation.rowsProcessed, color: 'text-slate-800' },
          { label: 'Совпадений', value: collation.coincidencesCount, color: 'text-emerald-600' },
          { label: 'Расхождений', value: visibleDiscrepancyCount, color: 'text-rose-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <AIStatusBanner aiReady={aiReady} aiOnlyCount={aiOnlyCount} />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {SOURCE_FILTERS.map((f) => {
          if (!aiReady && (f.key === 'both' || f.key === 'ai')) return null;
          const count = f.key === 'all'
            ? collationErrors.length
            : collationErrors.filter(
                (d) => (aiReady || d.detectedBy.includes('algorithm')) && getSource(d) === f.key
              ).length;
          return (
            <button
              key={f.key}
              onClick={() => setSourceFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                sourceFilter === f.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FIELD_FILTERS.map((f) => {
          const count = f.key === 'all'
            ? itemsFilteredBySource.length
            : itemsFilteredBySource.filter((d) =>
                (aiReady || d.detectedBy.includes('algorithm')) &&
                FIELD_MAP[f.key]?.includes(d.field)
              ).length;
          return (
            <button
              key={f.key}
              onClick={() => setFieldFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                fieldFilter === f.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visibleItems.map((item, i) => (
          <DiscrepancyCard key={i} item={item} index={i} aiReady={aiReady} />
        ))}
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="font-semibold text-slate-800">{collation.coincidencesCount} строк полностью совпали</p>
        <p className="text-sm text-slate-400 mt-1">Данные идентичны в обоих документах</p>
      </div>
    </div>
  );
}