import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../shared/utils';
import { Button } from '../shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs';
import { ArrowLeft, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DocumentSummary from '../widgets/components/details/DocumentSummary';
import DiscrepancyList from '../widgets/components/details/DiscrepancyList';

export default function CollationDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <Link to={createPageUrl('history')}>
              <Button variant="ghost" className="mb-4 -ml-3 text-slate-500 hover:text-slate-700 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к истории
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Детали сверки</h1>
                <p className="mt-2 text-slate-500">Результаты анализа документа и найденные расхождения</p>
              </div>
              <Button variant="outline" className="rounded-xl border-slate-200 gap-2 w-fit">
                <Download className="w-4 h-4" />
                Скачать отчёт
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <DocumentSummary />
          </div>

          <Tabs defaultValue="discrepancies">
            <TabsList className="bg-slate-100 rounded-xl p-1 mb-6">
              <TabsTrigger value="discrepancies" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <AlertTriangle className="w-4 h-4" />
                Расхождения
                <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">3</span>
              </TabsTrigger>
              <TabsTrigger value="matched" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Совпадения
                <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">853</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discrepancies">
              <DiscrepancyList />
            </TabsContent>

            <TabsContent value="matched">
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">853 строки совпали</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Все данные в этих строках полностью идентичны между вашим актом и данными контрагента.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}