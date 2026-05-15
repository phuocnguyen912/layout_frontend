import React from 'react';
import { RefreshCw } from 'lucide-react';
import Panel from '../Panel';
import Field from '../Field';
import Input from '../Input';
import Button from '../Button';

export default function LocalReportFilters({ filters, setFilters, onRefresh, submitting }) {
  return (
    <Panel
      title="Bộ lọc báo cáo local"
      subtitle="GET `/node/reports/local`"
      action={
        <Button
          variant="secondary"
          loading={submitting}
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Nạp báo cáo
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Từ khóa">
          <Input
            value={filters.keyword}
            onChange={(event) => setFilters({ ...filters, keyword: event.target.value })}
            placeholder="Mã hoặc tên NV..."
          />
        </Field>
        <Field label="Tháng">
          <Input
            type="number"
            value={filters.thang}
            onChange={(event) => setFilters({ ...filters, thang: Number(event.target.value) })}
          />
        </Field>
        <Field label="Năm">
          <Input
            type="number"
            value={filters.nam}
            onChange={(event) => setFilters({ ...filters, nam: Number(event.target.value) })}
          />
        </Field>
      </div>
    </Panel>
  );
}
