import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../../shared/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/ui/table';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { FileSpreadsheet, Eye, ChevronRight, AlertTriangle, CheckCircle2, Clock, type LucideProps } from 'lucide-react';
import { useGetQuery } from '../../../features/collations/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../app/auth.slice';

const mockData = [
  { id: '1', fileName: 'Акт_сверки_Q4_2025.xlsx', uploadDate: '07 фев 2026, 14:32', rows: 1240, discrepancies: 0, status: 'success', counterparty: 'ООО "Ромашка"' },
  { id: '2', fileName: 'Сверка_ООО_Лютик.xlsx', uploadDate: '05 фев 2026, 10:15', rows: 856, discrepancies: 3, status: 'warning', counterparty: 'ООО "Лютик"' },
  { id: '3', fileName: 'Баланс_январь_2026.xlsx', uploadDate: '01 фев 2026, 09:44', rows: 2100, discrepancies: 12, status: 'error', counterparty: 'АО "Василёк"' },
  { id: '4', fileName: 'Акт_декабрь_2025.xlsx', uploadDate: '28 янв 2026, 16:20', rows: 480, discrepancies: 1, status: 'warning', counterparty: 'ИП Иванов А.А.' },
  { id: '5', fileName: 'Сверка_поставщик_Q3.xlsx', uploadDate: '25 янв 2026, 11:08', rows: 3200, discrepancies: 0, status: 'success', counterparty: 'ООО "Подсолнух"' },
  { id: '6', fileName: 'Акт_ноябрь_2025.xlsx', uploadDate: '20 янв 2026, 08:55', rows: 670, discrepancies: 5, status: 'error', counterparty: 'ООО "Колокольчик"' },
];

type statusConfigType = {
    label: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    classes: string
}

const statusConfig: Record<string, statusConfigType> = {
  success: { label: 'Ок', icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  warning: { label: 'Есть расхождения', icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  error: { label: 'Критично', icon: AlertTriangle, classes: 'bg-red-50 text-red-700 border-red-200' },
};

export default function HistoryTable() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    actName: "",
    orderBy: "",
    orderByDesc: false
  });

  const { data: actsData, isLoading, error } = useGetQuery(queryParams, {skip: !user});

  useEffect(() => {
      if (!user) {
        navigate("/login")
        return;
      }
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4 pl-6">Документ</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4">Контрагент</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4 text-center">Строк</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4 text-center">Расхождения</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4">Статус</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4">Дата загрузки</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actsData?.result?.items.map((row, i) => {
              const st = statusConfig.success;
              const StatusIcon = st.icon;
              return (
                <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{row.act1Name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4"><span className="text-sm text-slate-600">{row.act2Name}</span></TableCell>
                  
                  <TableCell className="py-4 text-center"><span className="text-sm text-slate-600 font-medium">{300}</span></TableCell>
                  <TableCell className="py-4 text-center">
                    <span className={`text-sm font-bold ${row.discrepancies.length === 0 ? 'text-emerald-600' : row.discrepancies.length <= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                      {row.discrepancies.length}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`${st.classes} border font-medium text-xs gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {"20 янв 2026, 08:55"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    <Link to={createPageUrl('collationDetails') + `?id=${row.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                        <Eye className="w-4 h-4 mr-1" />
                        Детали
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}