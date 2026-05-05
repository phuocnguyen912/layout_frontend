import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import StatusPill from '../components/ui/StatusPill';
import DataTable from '../components/ui/DataTable';
import { formatDateTime, getInitials, formatCurrency } from '../utils/format';

export default function Overview({ isPublisher, publisherData, nodeData, session, filteredCompanyEmployees, branchChartData, payrollChartData }) {
  return (
    <>
      <SectionHeader
        eyebrow="Tổng quan"
        title="Tổng quan hệ thống HRM"
        description="Bộ KPI, biểu đồ và danh sách chính được tạo từ dữ liệu backend thay vì mock data."
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Phân bổ nhân sự theo chi nhánh" subtitle="Lấy từ `/publisher/reports/summary` nếu đang ở Publisher.">
          {branchChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchChartData}>
                  <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                  <XAxis dataKey="name" stroke="#8a7768" />
                  <YAxis stroke="#8a7768" />
                  <Tooltip />
                  <Bar dataKey="employees" radius={[10, 10, 0, 0]}>
                    {branchChartData.map((item, index) => (
                      <Cell key={item.name} fill={index % 2 === 0 ? '#b55233' : '#7f8a63'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--hr-muted)]">Môi trường hiện tại không có dữ liệu tổng hợp theo chi nhánh. Chuyển sang Publisher để xem biểu đồ này.</p>
          )}
        </Panel>

        <Panel title="Trạng thái sync / health" subtitle="Tổng hợp monitor đồng bộ và health endpoint.">
          <div className="space-y-4">
            {(isPublisher ? publisherData.sync : []).length > 0 ? (
              publisherData.sync.map((item) => (
                <div key={`${item.Node}-${item.LastSyncTime}`} className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--hr-ink)]">{item.Node}</p>
                      <p className="mt-1 text-sm text-[var(--hr-muted)]">Lần cuối: {formatDateTime(item.LastSyncTime)}</p>
                    </div>
                    <StatusPill status={item.TrangThai} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                <p className="font-semibold text-[var(--hr-ink)]">Thông tin health</p>
                <p className="mt-2 text-sm text-[var(--hr-muted)]">Chế độ: {nodeData.health?.mode || session.profile.mode}</p>
                <p className="mt-1 text-sm text-[var(--hr-muted)]">Thời gian: {formatDateTime(nodeData.health?.timestamp)}</p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Panel title="Danh sách nhân sự / tìm kiếm" subtitle="Publisher dùng `company-search`, Node dùng `reports/local`.">
        <DataTable
          columns={[
            {
              key: 'identity',
              label: 'Nhân viên',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecd7cb] font-semibold text-[#8a3828]">
                    {getInitials(row.HoTen)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--hr-ink)]">{row.HoTen}</p>
                    <p className="text-xs text-[var(--hr-muted)]">{row.MaNhanVien}</p>
                  </div>
                </div>
              ),
            },
            { key: 'Email', label: 'Email' },
            { key: 'SDT', label: 'SDT' },
            {
              key: 'branch',
              label: 'Chi nhánh / phòng ban',
              render: (row) => row.TenChiNhanh || row.TenPhongBan || 'Nội bộ node',
            },
          ]}
          rows={filteredCompanyEmployees}
        />
      </Panel>

      {payrollChartData.length > 0 ? (
        <Panel title="Top payroll theo kỳ lọc" subtitle="Lấy từ `/node/reports/local` của node hiện tại.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollChartData}>
                <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#8a7768" />
                <YAxis stroke="#8a7768" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="salary" stroke="#7a3420" strokeWidth={3} dot={{ r: 4, fill: '#b55233' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      ) : null}
    </>
  );
}
