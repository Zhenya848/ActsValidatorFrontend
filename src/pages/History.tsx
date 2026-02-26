import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select';
import { Search, Filter, Clock } from 'lucide-react';
import HistoryStats from '../widgets/components/history/HistoryStats';
import HistoryTable from '../widgets/components/history/HistoryTable';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Журнал</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              История сверок
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              Просматривайте все загруженные документы и результаты анализа
            </p>
          </div>

          <div className="mb-8">
            <HistoryStats />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Поиск по названию файла или контрагенту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 h-11"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 rounded-xl border-slate-200 h-11">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Статус" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="success">Без расхождений</SelectItem>
                <SelectItem value="warning">Есть расхождения</SelectItem>
                <SelectItem value="error">Критично</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <HistoryTable />
        </motion.div>
      </div>
    </div>
  );
}