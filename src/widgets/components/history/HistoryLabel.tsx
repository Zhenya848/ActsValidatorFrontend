import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileCheck, FileSpreadsheet, Filter, Search, TrendingUp, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../../shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/table";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { useGetQuery } from "../../../features/collations/api";
import { useNavigate } from "react-router-dom";
import { GetCookies } from "../../../features/accounts/GetCookies";
import { formatDate } from "../../../shared/helpers/formatDate";

export default function HistoryLabel() {
    const refreshToken = GetCookies("refreshToken");
    const navigate = useNavigate();

    useEffect(() => {
      if (!refreshToken) {
        navigate("/login");
        return;
      }
    }, [refreshToken])

    const PAGE_SIZE = 10;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: collationsData } = useGetQuery({ page: currentPage, pageSize: PAGE_SIZE, actName: searchQuery, statusFilter: statusFilter }, {
        skip: !refreshToken
    });

    const collationPageList = collationsData?.result;
    const totalCount = collationPageList?.totalCount ?? 0;
    const successfulCount = collationPageList?.successfulCollations ?? 0;
    const failCount = totalCount - successfulCount;
    const averrageAccuracy = collationPageList?.averageAccuracy ?? 0;

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    type StatusConfig = {
      label: string;
      icon: LucideIcon;
      classes: string;
    };

    type Status = 'success' | 'warning' | 'error';

    const statusConfig: Record<Status, StatusConfig> = {
      success: { label: 'Ок', icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      warning: { label: 'Есть расхождения', icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
      error: { label: 'Критично', icon: AlertTriangle, classes: 'bg-red-50 text-red-700 border-red-200' },
    };

    type StatItem = {
      label: string;
      value: number | string;
      change: string;
      icon: LucideIcon;
      color: string;
    };

    const stats: StatItem[] = [
      { label: 'Всего загрузок', value: totalCount, change: '', icon: FileSpreadsheet, color: 'bg-indigo-50 text-indigo-600' },
      { label: 'Успешных сверок', value: successfulCount, change: `${Math.floor(successfulCount / totalCount * 100)}% от общего`, icon: FileCheck, color: 'bg-emerald-50 text-emerald-600' },
      { label: 'С расхождениями', value: failCount, change: `${Math.floor(failCount / totalCount * 100)}% от общего`, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
      { label: 'Средняя точность', value: `${averrageAccuracy}%`, change: '', icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
    ];

    return (
        <div>
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:shadow-slate-100 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-2">{stat.change}</p>
                        </motion.div>
                    ))}
                </div>
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
                    {collationsData?.result?.items?.map((row, i) => {
                      const st = statusConfig[row.status.toLowerCase() as Status] ?? statusConfig["success"];
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
                          
                          <TableCell className="py-4 text-center"><span className="text-sm text-slate-600 font-medium">{row.rowsProcessed}</span></TableCell>
                          <TableCell className="py-4 text-center">
                            <span className={`text-sm font-bold ${row.collationErrors.length === 0 ? 'text-emerald-600' : row.collationErrors.length <= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                              {row.collationErrors.length}
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
                              {formatDate(row.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 pr-6">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              onClick={() => navigate("details", { state: { collationData: collationsData.result?.items[i] } })}>
                              <Eye className="w-4 h-4 mr-1" />
                                Детали
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {(collationPageList?.totalCount ?? 0) > 0 && (
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-slate-400">
                  Показано {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} из {totalCount}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200"
                    disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <Button key={p} variant={p === currentPage ? 'default' : 'outline'} size="icon"
                      className={`h-9 w-9 rounded-xl ${p === currentPage ? 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600' : 'border-slate-200'}`}
                      onClick={() => setCurrentPage(p)}>
                      {p}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200"
                    disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
        </div>
    );
}